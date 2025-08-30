export default function Footer() {
  return (
    <footer className="bg-blog-surface-light dark:bg-blog-surface-dark border-t border-blog-border-light dark:border-blog-border-dark mt-16 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-blog-text-muted-light dark:text-blog-text-muted-dark">
          <p className="mb-2">© 2025 blog with AI. Some rights reserved.</p>
          <p className="text-sm">
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
