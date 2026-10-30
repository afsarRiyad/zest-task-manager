import AuthLayout from '@/components/auth/AuthLayout';
import ForgotForm from '@/components/auth/ForgotForm';

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
      <ForgotForm />
    </AuthLayout>
  );
}
