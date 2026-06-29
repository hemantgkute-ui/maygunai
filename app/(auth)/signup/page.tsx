import SignupForm from '@/components/auth/SignupForm'

export const metadata = { title: 'Create Account - MaygunAI' }

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-purple-50 dark:bg-gray-950">
      <SignupForm />
    </div>
  )
}
