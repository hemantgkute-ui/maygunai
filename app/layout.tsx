import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/context'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MaygunAI – Smart Shopping Assistant by TechMayGun',
  description: 'MaygunAI by TechMayGun helps you find the best products at the best prices. Get personalized recommendations for laptops, smartphones, and more.',
  keywords: 'MaygunAI, TechMayGun, AI shopping assistant, product recommendations, best products India, laptop recommendations, smartphone recommendations',
  openGraph: {
    title: 'MaygunAI – Smart Shopping Assistant',
    description: 'Discover the best products with MaygunAI, the intelligent shopping assistant by TechMayGun.',
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
