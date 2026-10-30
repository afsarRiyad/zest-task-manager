import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="A calmer way back in."
      subtitle="Your list, your companion and the next clear step are waiting exactly where you left them."
    >
      <LoginForm />
    </AuthLayout>
  );
}
