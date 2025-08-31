import Link from 'next/link'
import { getAllTags, getAllCategories, getRecentPosts } from '@/lib/posts'

export default function Sidebar() {
  const tags = getAllTags()
  const categories = getAllCategories()
  const recentPosts = getRecentPosts(3) // 최근 3개 포스트만 표시
  
  return (
    <aside className="space-y-8">
      {/* Recently Updated */}
      <div className="bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-6">
        <h3 className="font-bold text-lg text-blog-text-light dark:text-blog-text-dark mb-4">Recently Updated</h3>
        <ul className="space-y-2 text-sm">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link 
                href={`/blog/${post.slug}`} 
                className="text-blog-text-muted-light dark:text-blog-text-muted-dark hover:text-blog-accent dark:hover:text-blog-accent-dark line-clamp-2"
                title={post.title}
              >
                {post.title}
              </Link>
              <div className="text-xs text-blog-text-muted-light dark:text-blog-text-muted-dark mt-1">
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Trending Tags */}
      <div className="bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-6">
        <h3 className="font-bold text-lg text-blog-text-light dark:text-blog-text-dark mb-4">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {['Kubernetes', 'CKA', 'Application Architecture', 'Software Architecture', 'System Design'].map((tag) => (
            <Link
              key={tag}
              href={`/tags#${tag.toLowerCase().replace(/\s+/g, '-')}`}
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
                  href={`/categories#${category.toLowerCase().replace(/\s+/g, '-')}`}
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
                href={`/tags#${tag.toLowerCase().replace(/\s+/g, '-')}`}
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
