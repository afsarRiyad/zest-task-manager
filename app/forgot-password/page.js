import AuthLayout from '@/components/auth/AuthLayout';

export const metadata = {
  title: 'Reset password',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Find your way back."
      subtitle="A one-time code gets you into your list again, without the usual email runaround."
    >
      <p className="text-center text-[11.5px] text-ink-3">
        Password recovery - configure your backend for reset functionality.
      </p>
    </AuthLayout>
  );
}