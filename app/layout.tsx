import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Architect Blog | Application & AI Architecture',
  description: 'Blog for Application & AI Architects - 애플리케이션 및 AI 아키텍트를 위한 기술 블로그',
  authors: [{ name: 'Architect' }],
  keywords: ['Application Architecture', 'AI Architecture', 'System Design', 'Software Architecture', 'Technology Leadership'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto">
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
