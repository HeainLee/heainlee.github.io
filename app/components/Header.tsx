import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blog-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blog-text">Architect Blog</h1>
              <p className="text-sm text-blog-muted">Blog for Application & AI Architects</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-blog-text hover:text-blog-accent transition-colors">
              HOME
            </Link>
            <Link href="/categories" className="text-blog-text hover:text-blog-accent transition-colors">
              CATEGORIES
            </Link>
            <Link href="/tags" className="text-blog-text hover:text-blog-accent transition-colors">
              TAGS
            </Link>
            <Link href="/archives" className="text-blog-text hover:text-blog-accent transition-colors">
              ARCHIVES
            </Link>
            <Link href="/about" className="text-blog-text hover:text-blog-accent transition-colors">
              ABOUT
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
