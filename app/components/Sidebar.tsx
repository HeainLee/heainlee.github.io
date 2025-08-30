import Link from 'next/link'
import { getAllTags, getAllCategories } from '@/lib/posts'

export default function Sidebar() {
  const tags = getAllTags()
  const categories = getAllCategories()
  
  return (
    <aside className="space-y-8">
      {/* Recently Updated */}
      <div className="bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-6">
        <h3 className="font-bold text-lg text-blog-text-light dark:text-blog-text-dark mb-4">Recently Updated</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/blog/what-is-ai-architect" className="text-blog-text-muted-light dark:text-blog-text-muted-dark hover:text-blog-accent dark:hover:text-blog-accent-dark">
              AI 아키텍트: 인공지능 시대의 새로운 기술 리더십
            </Link>
          </li>
          <li>
            <Link href="/blog/what-is-application-architect" className="text-blog-text-muted-light dark:text-blog-text-muted-dark hover:text-blog-accent dark:hover:text-blog-accent-dark">
              애플리케이션 아키텍트란 무엇인가
            </Link>
          </li>
        </ul>
      </div>

      {/* Trending Tags */}
      <div className="bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-6">
        <h3 className="font-bold text-lg text-blog-text-light dark:text-blog-text-dark mb-4">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {['ai', 'machine-learning', 'python', 'development', 'programming', 'tutorial', 'tech', 'coding'].map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="tag"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-6">
          <h3 className="font-bold text-lg text-blog-text-light dark:text-blog-text-dark mb-4">Categories</h3>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${category}`}
                  className="sidebar-link"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All Tags */}
      {tags.length > 0 && (
        <div className="bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-6">
          <h3 className="font-bold text-lg text-blog-text-light dark:text-blog-text-dark mb-4">All Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="tag text-xs"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
