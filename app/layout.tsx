import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/context'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MaygunAI - AI-Powered Shopping Assistant',
  description: 'Find the best products at best prices powered by AI. Get personalized recommendations for laptops, smartphones, and more.',
  keywords: 'AI shopping, product recommendations, best products India, laptop recommendations, smartphone recommendations',
  openGraph: {
    title: 'MaygunAI - AI Shopping Assistant',
    description: 'Find the best products powered by AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
