import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { LoadingPage } from '@/components/ui/LoadingSpinner'

export const metadata = { title: 'Sign In - MaygunAI' }

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-purple-50 dark:bg-gray-950">
      <Suspense fallback={<LoadingPage />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
