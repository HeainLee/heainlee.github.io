import { getTagsWithCount, getPostsByTag } from '@/lib/posts'
import Link from 'next/link'
import PostCard from '../components/PostCard'

export const metadata = {
  title: 'Tags | blog with AI',
  description: '태그별로 분류된 블로그 포스트를 확인하세요.'
}

export default function TagsPage() {
  const tagsWithCount = getTagsWithCount()
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blog-text-light dark:text-blog-text-dark mb-4">
          Tags
        </h1>
        <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark">
          태그별로 정리된 블로그 포스트를 확인하세요.
        </p>
      </div>

      {/* Tags Cloud */}
      <div className="mb-12 p-6 bg-blog-surface-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg">
        <h2 className="text-xl font-semibold text-blog-text-light dark:text-blog-text-dark mb-6">
          태그 클라우드
        </h2>
        <div className="flex flex-wrap gap-3">
          {tagsWithCount.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`#${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-2 bg-blog-bg-light dark:bg-blog-bg-dark border border-blog-border-light dark:border-blog-border-dark rounded-full px-4 py-2 hover:bg-blog-accent hover:text-white dark:hover:bg-blog-accent-dark transition-colors"
              style={{
                fontSize: `${Math.min(1.2, 0.8 + (count * 0.1))}rem`
              }}
            >
              <span>#{tag}</span>
              <span className="text-xs opacity-70">({count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Posts by Tag */}
      <div className="space-y-12">
        {tagsWithCount.map(({ tag, count }) => {
          const posts = getPostsByTag(tag)
          
          return (
            <section 
              key={tag}
              id={tag.toLowerCase().replace(/\s+/g, '-')}
              className="scroll-mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blog-text-light dark:text-blog-text-dark flex items-center">
                  <span className="text-blog-accent dark:text-blog-accent-dark mr-2">#</span>
                  {tag}
                </h2>
                <span className="text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark bg-blog-surface-light dark:bg-blog-surface-dark px-3 py-1 rounded-full">
                  {count}개
                </span>
              </div>
              
              <div className="grid gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Empty State */}
      {tagsWithCount.length === 0 && (
        <div className="text-center py-12">
          <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark text-lg">
            아직 태그가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
