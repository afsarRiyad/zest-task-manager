'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import Icon from '@/components/Icon';
import { AuthError, requestPasswordReset, resetPassword } from '@/lib/auth';

export default function ForgotForm() {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [resetErrors, setResetErrors] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const emailParam = new URLSearchParams(window.location.search).get('email');
    if (emailParam) setEmail(emailParam);
  }, []);

  async function handleRequest(event) {
    event.preventDefault();
    if (submitting) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter the email connected to your account.');
      return;
    }

    setSubmitting(true);
    setEmailError('');
    setFormError('');

    try {
      const result = await requestPasswordReset(email);
      if (!result.found) {
        setEmailError('No local account uses that email.');
        return;
      }

      setResetInfo(result);
      setCode(result.code);
      setStep('reset');
    } catch (error) {
      if (error instanceof AuthError) setEmailError(error.message);
      else setFormError('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(event) {
    event.preventDefault();
    if (submitting) return;

    const issues = {};
    if (!code.trim() || code.trim().length !== 6) issues.code = 'Enter the 6-digit code.';
    if (password.length < 8) issues.password = 'Use at least 8 characters.';
    if (confirm !== password) issues.confirm = 'Passwords do not match.';

    if (Object.keys(issues).length) {
      setResetErrors(issues);
      return;
    }

    setSubmitting(true);
    setResetErrors({});
    setFormError('');

    try {
      await resetPassword({ email, code, password });
      setStep('done');
    } catch (error) {
      if (error instanceof AuthError) {
        setResetErrors({ [error.field]: error.message });
      } else {
        setFormError('Something went wrong. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function copyCode() {
    if (!resetInfo?.code) return;
    try {
      await navigator.clipboard.writeText(resetInfo.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function backToEmail() {
    setStep('request');
    setResetInfo(null);
    setCode('');
    setPassword('');
    setConfirm('');
    setResetErrors({});
    setFormError('');
  }

  if (step === 'done') {
    return (
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-mint/20 bg-mint/10 text-mint">
          <Icon name="checkCircle" size={25} strokeWidth={1.8} />
        </div>
        <h2 className="mt-4 font-display text-[22px] font-semibold tracking-[-0.03em] text-ink">
          Password updated
        </h2>
        <p className="mx-auto mt-2 max-w-[34ch] text-[12.5px] leading-5 text-ink-2">
          You can sign in with your new password now. Your list is waiting exactly where you left
          it.
        </p>
        <Link
          href={`/login?email=${encodeURIComponent(email)}`}
          className="btn-primary mt-6 h-11 w-full text-[12.5px]"
        >
          Back to sign in
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <div>
        {formError ? (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-xl border border-rose/20 bg-rose/[0.07] px-3 py-2.5 text-[11.5px] leading-4 text-rose"
          >
            <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
            {formError}
          </div>
        ) : null}

        <div className="rounded-2xl border border-violet/20 bg-violet/[0.07] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet/80">
                One-time code
              </p>
              <p className="mt-1 font-mono text-[24px] font-semibold tracking-[0.22em] text-ink">
                {resetInfo?.code}
              </p>
            </div>
            <button
              type="button"
              onClick={copyCode}
              className="rounded-full border border-violet/20 bg-violet/10 px-3 py-1.5 text-[10.5px] font-medium text-violet transition-colors hover:bg-violet/20"
            >
              {copied ? 'Copied' : 'Copy code'}
            </button>
          </div>
          <p className="mt-2 text-[10.5px] leading-4 text-ink-3">
            This preview has no email server, so the code appears here. It expires in 15 minutes.
          </p>
        </div>

        <form onSubmit={handleReset} className="mt-5 space-y-4" noValidate>
          <div>
            <label htmlFor="recovery-code" className="text-[12px] font-medium text-ink-2">
              Code
            </label>
            <input
              id="recovery-code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, '').slice(0, 6));
                setResetErrors((current) => ({ ...current, code: undefined }));
              }}
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              aria-invalid={Boolean(resetErrors.code)}
              className={`field mt-2 text-center font-mono text-[17px] tracking-[0.3em] ${
                resetErrors.code ? 'border-rose/50' : ''
              }`}
            />
            {resetErrors.code ? (
              <p role="alert" className="mt-1.5 text-[11.5px] font-medium text-rose">
                {resetErrors.code}
              </p>
            ) : null}
          </div>

          <PasswordField
            label="New password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setResetErrors((current) => ({ ...current, password: undefined }));
            }}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={resetErrors.password}
          />

          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChange={(value) => {
              setConfirm(value);
              setResetErrors((current) => ({ ...current, confirm: undefined }));
            }}
            placeholder="One more time"
            autoComplete="new-password"
            error={resetErrors.confirm}
          />

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary h-12 w-full text-[13px] disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Icon name="loader" size={16} className="animate-spin" />
                Updating password…
              </>
            ) : (
              'Set new password'
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={backToEmail}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-ink-3 transition-colors hover:text-ink"
          >
            <Icon name="arrowLeft" size={13} />
            Use a different email
          </button>
          <Link
            href="/login"
            className="text-[11.5px] font-medium text-ink-3 transition-colors hover:text-ink"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {formError ? (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose/20 bg-rose/[0.07] px-3 py-2.5 text-[11.5px] leading-4 text-rose"
        >
          <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
          {formError}
        </div>
      ) : null}

      <form onSubmit={handleRequest} className="space-y-4" noValidate>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setEmailError('');
          }}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          icon="mail"
          autoFocus
          error={emailError}
        />

        <div className="flex items-start gap-2 rounded-xl border border-line bg-ink/[0.02] px-3 py-2.5">
          <Icon name="info" size={14} className="mt-0.5 shrink-0 text-cyan/80" />
          <p className="text-[10.5px] leading-4 text-ink-3">
            This frontend preview has no email delivery. Instead of a message, you will get a
            one-time code on the next screen.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary h-12 w-full text-[13px] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Icon name="loader" size={16} className="animate-spin" />
              Looking for your account…
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[11.5px] text-ink-3">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-violet transition-colors hover:text-violet-dim">
          Sign in
        </Link>
      </p>
    </div>
  );
}
