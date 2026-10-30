'use client';

import { useEffect, useState } from 'react';
import Sheet from '@/components/ui/Sheet';
import PasswordField from '@/components/ui/PasswordField';
import Avatar from '@/components/Avatar';
import Icon from '@/components/Icon';
import { useToast } from '@/components/Toast';
import { useTheme } from '@/components/ThemeProvider';
import { AuthError, changePassword, updateProfile } from '@/lib/auth';

export default function SettingsSheet({ open, user, onClose, onUserUpdated, onSignOut }) {
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setName(user.name);
    setNameError('');
    setCurrentPassword('');
    setNextPassword('');
    setConfirmPassword('');
    setPasswordErrors({});
  }, [open, user]);

  if (!user) return null;

  function handleNameSubmit(event) {
    event.preventDefault();
    const clean = name.trim();
    if (!clean) {
      setNameError('Your name cannot be empty.');
      return;
    }

    setSavingName(true);
    setNameError('');
    try {
      const updated = updateProfile(user.id, { name: clean });
      onUserUpdated(updated);
      toast('Profile updated', { tone: 'success' });
    } catch (error) {
      setNameError(error instanceof AuthError ? error.message : 'Could not update your profile.');
    } finally {
      setSavingName(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    const issues = {};

    if (!currentPassword) issues.currentPassword = 'Enter your current password.';
    if (nextPassword.length < 8) issues.nextPassword = 'Use at least 8 characters.';
    if (nextPassword && nextPassword === currentPassword) {
      issues.nextPassword = 'Choose a different password.';
    }
    if (confirmPassword !== nextPassword) issues.confirmPassword = 'Passwords do not match.';

    if (Object.keys(issues).length) {
      setPasswordErrors(issues);
      return;
    }

    setSavingPassword(true);
    setPasswordErrors({});

    try {
      await changePassword(user.id, currentPassword, nextPassword);
      setCurrentPassword('');
      setNextPassword('');
      setConfirmPassword('');
      toast('Password updated', { tone: 'success' });
    } catch (error) {
      if (error instanceof AuthError) {
        setPasswordErrors({ [error.field]: error.message });
      } else {
        setPasswordErrors({ form: 'Could not update your password.' });
      }
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Settings"
      eyebrow="Your account"
      description="The quiet details behind your space."
      width="lg"
    >
      <div className="space-y-7 pb-4">
        <section>
          <div className="flex items-center gap-3">
            <Avatar name={user.name} size={46} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-ink">{user.name}</p>
              <p className="mt-0.5 truncate text-[11.5px] text-ink-3">{user.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="label-caps">Appearance</p>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-line bg-ink/[0.02] p-1">
              {[
                { id: 'light', label: 'Light', icon: 'sun' },
                { id: 'dark', label: 'Dark', icon: 'moon' },
                { id: 'system', label: 'System', icon: 'settings' },
              ].map((option) => {
                const active = theme === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTheme(option.id)}
                    aria-pressed={active}
                    className={`flex h-9 items-center justify-center gap-1.5 rounded-lg text-[11.5px] font-medium transition-colors ${
                      active
                        ? 'border border-line bg-card text-ink shadow-panel'
                        : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    <Icon name={option.icon} size={14} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleNameSubmit} className="mt-5">
            <label htmlFor="settings-name" className="label-caps">
              Display name
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="settings-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (nameError) setNameError('');
                }}
                maxLength={40}
                autoComplete="name"
                aria-invalid={Boolean(nameError)}
                className={`field ${nameError ? 'border-rose/50' : ''}`}
              />
              <button
                type="submit"
                disabled={savingName || !name.trim() || name.trim() === user.name}
                className="btn-secondary h-12 shrink-0 px-4 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {savingName ? 'Saving…' : 'Save name'}
              </button>
            </div>
            {nameError ? (
              <p role="alert" className="mt-1.5 text-[11.5px] font-medium text-rose">
                {nameError}
              </p>
            ) : null}
          </form>
        </section>

        <section className="border-t border-line pt-6">
          <div className="flex items-center gap-2">
            <Icon name="lock" size={15} className="text-ink-3" />
            <h3 className="text-[13px] font-semibold text-ink">Password</h3>
          </div>
          <p className="mt-1 text-[11.5px] leading-4 text-ink-3">
            Passwords are hashed locally with PBKDF2 before being stored in this browser.
          </p>

          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
              error={passwordErrors.currentPassword}
            />
            <PasswordField
              label="New password"
              value={nextPassword}
              onChange={setNextPassword}
              autoComplete="new-password"
              hint="8+ characters"
              error={passwordErrors.nextPassword}
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              error={passwordErrors.confirmPassword}
            />

            {passwordErrors.form ? (
              <p role="alert" className="text-[11.5px] font-medium text-rose">
                {passwordErrors.form}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={savingPassword}
              className="btn-secondary h-10 px-4 text-[12px] disabled:opacity-50"
            >
              {savingPassword ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>

        <section className="border-t border-line pt-6">
          <button
            type="button"
            onClick={onSignOut}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose/20 text-[12px] font-medium text-rose transition-colors hover:bg-rose/10"
          >
            <Icon name="logout" size={15} />
            Sign out of this browser
          </button>
        </section>
      </div>
    </Sheet>
  );
}
