import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="bg-blog-bg-light dark:bg-blog-surface-dark border-b border-blog-border-light dark:border-blog-border-dark sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Profile */}
          <Link href="/" className="flex items-center space-x-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blog-accent dark:border-blog-accent-dark">
              <Image
                src="/images/avatar.png"
                alt="Profile"
                width={48}
                height={48}
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blog-text-light dark:text-blog-text-dark">blog with AI</h1>
              <p className="text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark">AI와 함께하는 기술 블로그</p>
            </div>
          </Link>

          {/* Navigation and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-blog-text-light dark:text-blog-text-dark hover:text-blog-accent dark:hover:text-blog-accent-dark transition-colors">
                HOME
              </Link>
              <Link href="/categories" className="text-blog-text-light dark:text-blog-text-dark hover:text-blog-accent dark:hover:text-blog-accent-dark transition-colors">
                CATEGORIES
              </Link>
              <Link href="/tags" className="text-blog-text-light dark:text-blog-text-dark hover:text-blog-accent dark:hover:text-blog-accent-dark transition-colors">
                TAGS
              </Link>
              <Link href="/archives" className="text-blog-text-light dark:text-blog-text-dark hover:text-blog-accent dark:hover:text-blog-accent-dark transition-colors">
                ARCHIVES
              </Link>
              <Link href="/about" className="text-blog-text-light dark:text-blog-text-dark hover:text-blog-accent dark:hover:text-blog-accent-dark transition-colors">
                ABOUT
              </Link>
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-blog-text-light dark:text-blog-text-dark">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
