import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { ThemeProvider } from './components/ThemeProvider'

export const metadata: Metadata = {
  title: 'blog with AI | AI와 함께하는 기술 블로그',
  description: 'blog with AI - AI와 함께 성장하는 개발자를 위한 기술 블로그',
  authors: [{ name: 'AI Developer' }],
  keywords: ['AI', 'Machine Learning', 'Development', 'Programming', 'Technology', 'Blog'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-blog-bg-light dark:bg-blog-bg-dark transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="max-w-6xl mx-auto">
            <Header />
            <main className="container mx-auto px-4 py-8 w-full min-w-0">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
