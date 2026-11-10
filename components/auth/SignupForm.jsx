'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextField from '@/components/ui/TextField';
import PasswordField from '@/components/ui/PasswordField';
import Icon from '@/components/Icon';
import axios from 'axios'
import { AuthError, getCurrentSession, signup } from '@/lib/auth';

const STRENGTH_COLORS = ['#E2556F', '#E2556F', '#D38A0F', '#8970E8', '#2BA670'];
const STRENGTH_LABELS = ['', 'Keep going', 'Getting there', 'Strong', 'Excellent'];

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const initialFormData = {
                            name: '',
                            email:'',
                            password:'',
                            confirmPassword:'',
                            terms:false
                        }
  const [formData, setFormData] = useState(initialFormData)
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function clearError(field) {
    setErrors((current) => ({ ...current, [field]: undefined, message: undefined }));
  }

const handleChange = (e) => {
  if (!e?.target) {
   console.error('Expected an input event, received:', e);
   return;
 }
  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
  clearError(name);
};

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (submitting) return;
    try {
  setSubmitting(true);
      const user = await axios.post(`${baseUrl}/signup`, formData)

      router.push('/dashboard');
   } catch (error) {
   const err = error.response?.data?.errors
    
    if (error) {
      err?.map(errors =>(
        setErrors((current)=>({...current, [errors.field]: errors.message }))
      ))
    } else {
      setErrors({ form: 'Something went wrong. Please try again.' });
    }
   } finally {
    setSubmitting(false);
   }
  }

  return (
    <div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          label="Name"
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder="What should Nova call you?"
          autoComplete="name"
          maxLength={40}
          icon="user"
          autoFocus
          error={errors.name}
        />

        <TextField
          label="Email"
          name='email'
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          icon="mail"
          error={errors.email}
        />

        <div>
          <PasswordField
            label="Password"
            name='password'
            value={formData.password}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            onChange={handleChange}
            error={errors.password}
          />
        </div>

        <PasswordField
          label="Confirm password"
          value={formData.confirmPassword}
          name='confirmPassword'
          onChange={handleChange}
          placeholder="One more time"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms }
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 cursor-pointer accent-orange-500"
                />

                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" className="font-medium text-orange-500 hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="font-medium text-orange-500 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {errors.terms && (
                <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
              )}

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
