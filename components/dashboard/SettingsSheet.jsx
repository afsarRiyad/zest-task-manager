'use client';

import { useEffect, useState } from 'react';
import Sheet from '@/components/ui/Sheet';
import Icon from '@/components/Icon';
import Avatar from '@/components/Avatar';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/components/Toast';
import { mascotReact } from '@/features/mascot/mascotSlice';
import { useDispatch } from 'react-redux';

export default function SettingsSheet({ open, user, onClose, onUserUpdated, onSignOut }) {
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();

  const [name, setName] = useState(user ? user.name : '');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (!open || !user) return;
    setName(user.name);
    setNameError('');
  }, [open, user]);

  if (!user) return null;

  function handleNameSubmit(event) {
    event.preventDefault();
    const clean = name.trim();
    if (!clean) {
      setNameError('Your name cannot be empty.');
      return;
    }

    setNameError('');
    // Profile update removed - user integrates their own backend
    toast('Profile update - configure your backend', { tone: 'info' });
    onUserUpdated?.(user);
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
                disabled={!name.trim() || name.trim() === user.name}
                className="btn-secondary h-12 shrink-0 px-4 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {name.trim() ? 'Save name' : 'Save name'}
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
            <h3 className="text-[13px] font-semibold text-ink">
              Password
            </h3>
          </div>
          <p className="mt-1 text-[11.5px] leading-4 text-ink-3">
            Password management - configure your backend for password changes.
          </p>
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