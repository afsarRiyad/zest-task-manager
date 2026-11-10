'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, getCurrentSession } from '@/lib/auth';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import Icon from '@/components/Icon';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState('/dashboard');

  useEffect(() => {
    async function checkSession() {
      if (typeof window === 'undefined') return;

      const session = await getCurrentSession();
      if (session) {
        // User is already logged in, redirect to dashboard
        const target = nextPath || '/dashboard';
        setNextPath(target);
        router.replace(target);
      }
    }

    checkSession();
  }, [router]);

  function clearError(field) {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const issues = {};
    if (!email.trim()) issues.email = 'Enter your email.';
    if (!password) issues.password = 'Enter your password.';

    if (Object.keys(issues).length) {
      setErrors(issues);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await login({ email, password, remember });
      // Login successful - redirect to dashboard or next path
      const target = nextPath || '/dashboard';
      router.replace(target);
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

      {errors.email ? (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose/20 bg-rose/[0.07] px-3 py-2.5 text-[11.5px] leading-4 text-rose"
        >
          <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
          {errors.email}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          autoFocus
          error={errors.email}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            clearError('password');
          }}
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password}
        />

        <div className="flex items-center justify-between gap-4 pt-0.5">
          <label className="flex cursor-pointer items-center gap-2 text-[11.5px] font-medium text-ink-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-line bg-ink/[0.04] accent-accent"
            />
            Remember me
          </label>

          <Link
            href={email ? `/forgot-password?email=${encodeURIComponent(email)}` : '/forgot-password'}
            className="text-[11.5px] font-medium text-ink-3 transition-colors hover:text-ink"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-1 h-12 w-full text-[13px] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Icon name="loader" size={16} className="animate-spin" />Signing in…
            </>
          ) : (
            <>
              Sign in
              <Icon name="arrowRight" size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[11.5px] text-ink-3">
        New to Zest?{' '}
        <Link
          href="/signup"
          className="font-semibold text-violet transition-colors hover:text-violet-dim"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}