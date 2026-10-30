import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

export const metadata = {
  title: 'Create account',
};

export default function SignupPage() {
  return (
    <AuthLayout
      eyebrow="Start here"
      title="Start with a clear page."
      subtitle="One account, one quiet place for the list. Nova will meet you inside."
    >
      <SignupForm />
    </AuthLayout>
  );
}
