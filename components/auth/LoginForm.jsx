'use client';

import {  useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import Icon from '@/components/Icon';
import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default function LoginForm() {
  const router = useRouter();
  const initialFormData = {
                            email: '',
                            password: '',
                          }
  const [formData, setFormData] = useState(initialFormData);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const hasErrorsInField = errors.email && errors.password

  
  const clearError = (field) => {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  const handleChange = (e) =>{
       const { value, name} = e.target
       setFormData((prev)=>({...formData, [name]: value}))
       clearError(name)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;


    setSubmitting(true);
    setErrors({});

    try {
     const data = await axios.post(`${baseUrl}/login`, formData);

      if(data?.data?.status === 'true'){
        router.push('/dashboard');
      }
    } catch (error) {
        const err = error.response?.data?.errors
  
     if (err) {
      err?.map(errors =>(
        setErrors((current)=>({...current, [errors.field]: errors.message }))
      ))

    } else {
      const err = error.response?.data
      setErrors({ form: err.message });
    }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {(errors.form && !hasErrorsInField) ? (
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
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          icon="mail"
          autoFocus
          error={errors.email}
        />

        <PasswordField
          label="Password"
          value={formData.password}
          name="password"
          onChange={handleChange}
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

          <Link href={'#'}>
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