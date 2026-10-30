'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import Icon from '@/components/Icon';
import { AuthError, getCurrentSession, signup } from '@/lib/auth';

const STRENGTH_COLORS = ['#E2556F', '#E2556F', '#D38A0F', '#8970E8', '#2BA670'];
const STRENGTH_LABELS = ['', 'Keep going', 'Getting there', 'Strong', 'Excellent'];

function passwordScore(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const score = passwordScore(password);

  useEffect(() => {
    if (getCurrentSession()) router.replace('/dashboard');
  }, [router]);

  function clearError(field) {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const issues = {};
    if (name.trim().length < 2) issues.name = 'Use at least 2 characters for your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      issues.email = 'Enter a valid email address.';
    }
    if (password.length < 8) issues.password = 'Use at least 8 characters.';
    if (confirm !== password) issues.confirm = 'Passwords do not match.';

    if (Object.keys(issues).length) {
      setErrors(issues);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await signup({ name, email, password });
      router.replace('/dashboard');
    } catch (error) {
      if (error instanceof AuthError) {
        setErrors({ [error.field]: error.message });
      } else {
        setErrors({ form: 'Something went wrong. Try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {errors.form ? (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose/20 bg-rose/[0.07] px-3 py-2.5 text-[11.5px] leading-4 text-rose"
        >
          <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
          {errors.form}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          label="Name"
          value={name}
          onChange={(value) => {
            setName(value);
            clearError('name');
          }}
          placeholder="What should Nova call you?"
          autoComplete="name"
          maxLength={40}
          icon="user"
          autoFocus
          error={errors.name}
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            clearError('email');
          }}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          icon="mail"
          error={errors.email}
        />

        <div>
          <PasswordField
            label="Password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              clearError('password');
              if (confirm && confirm !== value) {
                setErrors((current) => ({ ...current, confirm: 'Passwords do not match.' }));
              }
            }}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password}
          />

          {password ? (
            <div className="mt-2.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <span
                    key={step}
                    className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        score >= step ? STRENGTH_COLORS[score] : 'rgb(var(--ink) / 0.08)',
                    }}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[10px] text-ink-3">
                {STRENGTH_LABELS[score]}
                <span className="text-ink-3/50"> · mix cases, numbers and a symbol</span>
              </p>
            </div>
          ) : null}
        </div>

        <PasswordField
          label="Confirm password"
          value={confirm}
          onChange={(value) => {
            setConfirm(value);
            clearError('confirm');
          }}
          placeholder="One more time"
          autoComplete="new-password"
          error={errors.confirm}
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-1 h-12 w-full text-[13px] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Icon name="loader" size={16} className="animate-spin" />
              Creating your space…
            </>
          ) : (
            <>
              Create account
              <Icon name="arrowRight" size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-[11.5px] text-ink-3">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-violet transition-colors hover:text-violet-dim"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
