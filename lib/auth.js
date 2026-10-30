const ACCOUNTS_KEY = 'zest:accounts:v1';
const SESSION_KEY = 'zest:session:v1';
const PBKDF2_ITERATIONS = 120000;
const DAY = 24 * 60 * 60 * 1000;
const REMEMBER_DAYS = 30;
const TAB_DAYS = 1;
const RESET_TTL = 15 * 60 * 1000;

export class AuthError extends Error {
  constructor(message, field = 'form') {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

function hasWindow() {
  return typeof window !== 'undefined';
}

function readAccounts() {
  if (!hasWindow()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((account) => account && account.id) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    throw new AuthError('This browser could not save the account. Check private-mode storage settings.', 'form');
  }
}

function normaliseEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normaliseName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex) {
  const clean = String(hex || '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(clean.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function randomHex(byteLength = 16) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new AuthError('This browser does not support secure local accounts.', 'form');
  }
  return bytesToHex(globalThis.crypto.getRandomValues(new Uint8Array(byteLength)));
}

function safeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) {
    return false;
  }
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function derivePassword(password, saltHex, iterations) {
  if (!globalThis.crypto?.subtle) {
    throw new AuthError('This browser does not support secure local accounts.', 'form');
  }

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBytes(saltHex),
      iterations,
      hash: 'SHA-256',
    },
    key,
    256
  );

  return bytesToHex(new Uint8Array(bits));
}

async function sha256(value) {
  if (!globalThis.crypto?.subtle) {
    throw new AuthError('This browser does not support secure local accounts.', 'form');
  }
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

function validateName(name) {
  if (name.length < 2) throw new AuthError('Use at least 2 characters for your name.', 'name');
  if (name.length > 40) throw new AuthError('Keep your name under 40 characters.', 'name');
}

function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthError('Enter a valid email address.', 'email');
  }
}

function validatePassword(password) {
  if (String(password || '').length < 8) {
    throw new AuthError('Use at least 8 characters for your password.', 'password');
  }
  if (String(password).length > 128) {
    throw new AuthError('Keep your password under 128 characters.', 'password');
  }
}

function publicUser(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
  };
}

function findAccount(accounts, email) {
  return accounts.find((account) => account.email === email);
}

function storeSession(userId, remember) {
  const selected = remember ? window.localStorage : window.sessionStorage;
  const expiresAt = Date.now() + (remember ? REMEMBER_DAYS : TAB_DAYS) * DAY;

  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
    selected.setItem(SESSION_KEY, JSON.stringify({ userId, expiresAt, remember }));
  } catch {
    throw new AuthError('This browser could not start a session. Check private-mode storage settings.', 'form');
  }
}

function readSession(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(SESSION_KEY) || 'null');
    if (!parsed || !parsed.userId || !parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getCurrentSession() {
  if (!hasWindow()) return null;

  const candidates = [
    { storage: window.localStorage, remember: true },
    { storage: window.sessionStorage, remember: false },
  ];

  for (const candidate of candidates) {
    const session = readSession(candidate.storage);
    if (!session) continue;

    if (session.expiresAt <= Date.now()) {
      candidate.storage.removeItem(SESSION_KEY);
      continue;
    }

    const account = readAccounts().find((item) => item.id === session.userId);
    if (!account) {
      candidate.storage.removeItem(SESSION_KEY);
      continue;
    }

    return { user: publicUser(account), remember: candidate.remember };
  }

  return null;
}

export function getCurrentUser() {
  return getCurrentSession()?.user || null;
}

export async function signup({ name, email, password }) {
  const cleanName = normaliseName(name);
  const cleanEmail = normaliseEmail(email);

  validateName(cleanName);
  validateEmail(cleanEmail);
  validatePassword(password);

  const accounts = readAccounts();
  if (findAccount(accounts, cleanEmail)) {
    throw new AuthError('An account with this email already exists.', 'email');
  }

  const salt = randomHex(16);
  const passwordHash = await derivePassword(password, salt, PBKDF2_ITERATIONS);
  const account = {
    id: `user_${randomHex(8)}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    passwordSalt: salt,
    passwordIterations: PBKDF2_ITERATIONS,
    createdAt: new Date().toISOString(),
  };

  accounts.push(account);
  writeAccounts(accounts);
  storeSession(account.id, true);

  return publicUser(account);
}

export async function login({ email, password, remember = true }) {
  const cleanEmail = normaliseEmail(email);
  validateEmail(cleanEmail);
  if (!password) throw new AuthError('Enter your password.', 'password');

  const accounts = readAccounts();
  const account = findAccount(accounts, cleanEmail);
  const fallbackSalt = '9e3779b97f4a7c15f39cc0605cedc835';

  const hash = await derivePassword(
    password,
    account?.passwordSalt || fallbackSalt,
    account?.passwordIterations || PBKDF2_ITERATIONS
  );

  if (!account || !safeEqual(hash, account.passwordHash)) {
    throw new AuthError('Email or password is incorrect.', 'form');
  }

  storeSession(account.id, remember);
  return publicUser(account);
}

export function logout() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function updateProfile(userId, { name }) {
  const cleanName = normaliseName(name);
  validateName(cleanName);

  const accounts = readAccounts();
  const account = accounts.find((item) => item.id === userId);
  if (!account) throw new AuthError('Your account could not be found. Sign in again.', 'form');

  account.name = cleanName;
  writeAccounts(accounts);
  return publicUser(account);
}

export async function changePassword(userId, currentPassword, nextPassword) {
  validatePassword(nextPassword);

  const accounts = readAccounts();
  const account = accounts.find((item) => item.id === userId);
  if (!account) throw new AuthError('Your account could not be found. Sign in again.', 'form');

  const currentHash = await derivePassword(
    currentPassword,
    account.passwordSalt,
    account.passwordIterations
  );

  if (!safeEqual(currentHash, account.passwordHash)) {
    throw new AuthError('Your current password is incorrect.', 'currentPassword');
  }

  const salt = randomHex(16);
  account.passwordSalt = salt;
  account.passwordHash = await derivePassword(nextPassword, salt, PBKDF2_ITERATIONS);
  account.passwordIterations = PBKDF2_ITERATIONS;
  writeAccounts(accounts);
}

export async function requestPasswordReset(email) {
  const cleanEmail = normaliseEmail(email);
  validateEmail(cleanEmail);

  const accounts = readAccounts();
  const account = findAccount(accounts, cleanEmail);
  if (!account) {
    return { found: false, code: null, expiresAt: null };
  }

  const random = globalThis.crypto.getRandomValues(new Uint32Array(1))[0] % 900000;
  const code = String(100000 + random);
  const expiresAt = Date.now() + RESET_TTL;

  account.resetCodeHash = await sha256(`${account.id}:${code}`);
  account.resetExpiresAt = expiresAt;
  writeAccounts(accounts);

  return { found: true, code, expiresAt };
}

export async function resetPassword({ email, code, password }) {
  const cleanEmail = normaliseEmail(email);
  validateEmail(cleanEmail);
  validatePassword(password);

  const accounts = readAccounts();
  const account = findAccount(accounts, cleanEmail);
  if (!account || !account.resetCodeHash || !account.resetExpiresAt) {
    throw new AuthError('That recovery code is not valid. Request a new one.', 'code');
  }

  if (account.resetExpiresAt <= Date.now()) {
    throw new AuthError('That recovery code has expired. Request a new one.', 'code');
  }

  const codeHash = await sha256(`${account.id}:${String(code).trim()}`);
  if (!safeEqual(codeHash, account.resetCodeHash)) {
    throw new AuthError('That recovery code is not valid.', 'code');
  }

  const salt = randomHex(16);
  account.passwordSalt = salt;
  account.passwordHash = await derivePassword(password, salt, PBKDF2_ITERATIONS);
  account.passwordIterations = PBKDF2_ITERATIONS;
  delete account.resetCodeHash;
  delete account.resetExpiresAt;
  writeAccounts(accounts);

  return { email: cleanEmail };
}
