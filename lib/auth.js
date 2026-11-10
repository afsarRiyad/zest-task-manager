// Backend Auth Integration
// Replace these with your actual backend API calls

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export class AuthError extends Error {
  constructor(message, field = 'form') {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

// TODO: Implement these with your backend API
export async function signup({ name, email, password, confirmPassword, terms }) {
  const response = await fetch(`${baseUrl}/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, confirmPassword, terms })
  });

  const data = await response.json();

  if (!response.ok) {
    const field = data.errors?.[0]?.field || 'form';
    const message = data.errors?.[0]?.message || 'Signup failed';
    throw new AuthError(message, field);
  }

  return data.user;
}

export async function login({ email, password, remember = true }) {
  const response = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember })
  });

  const data = await response.json();

  if (!response.ok) {
    const field = data.errors?.[0]?.field || 'form';
    const message = data.errors?.[0]?.message || 'Login failed';
    throw new AuthError(message, field);
  }

  return data.user;
}

export async function getCurrentUser() {
  const response = await fetch(`${baseUrl}/me`, {
    credentials: 'include'
  });

  if (response.status === 401) return null;

  const data = await response.json();
  return data.user;
}

export async function logout() {
  await fetch(`${baseUrl}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}

export function getCurrentSession() {
  // TODO: Replace with backend session check
  return getCurrentUser().then(user => user ? { user, remember: true } : null);
}

// Optional: Profile and password reset functions
export async function updateProfile(userId, { name }) {
  const response = await fetch(`${baseUrl}/profile`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  const data = await response.json();
  if (!response.ok) throw new AuthError('Failed to update profile');
  return data.user;
}

export async function changePassword(userId, currentPassword, nextPassword) {
  const response = await fetch(`${baseUrl}/change-password`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, nextPassword })
  });

  if (!response.ok) throw new AuthError('Failed to change password');
  return data;
}

export async function requestPasswordReset(email) {
  const response = await fetch(`${baseUrl}/forgot-password`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await response.json();
  return data;
}

export async function resetPassword({ email, code, password }) {
  const response = await fetch(`${baseUrl}/reset-password`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password })
  });

  if (!response.ok) throw new AuthError('Failed to reset password');
  return data;
}
