import { getPostsByYear, getSortedPostsData } from '@/lib/posts'
import Link from 'next/link'
import { format } from 'date-fns'

export const metadata = {
  title: 'Archives | blog with AI',
  description: '연도별로 정리된 블로그 포스트 아카이브를 확인하세요.'
}

export default function ArchivesPage() {
  const postsByYear = getPostsByYear()
  const allPosts = getSortedPostsData()
  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blog-text-light dark:text-blog-text-dark mb-4">
          Archives
        </h1>
        <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark">
          연도별로 정리된 블로그 포스트 아카이브입니다. 총 <strong>{allPosts.length}개</strong>의 포스트가 있습니다.
        </p>
      </div>

      {/* Year Navigation */}
      <div className="mb-8 p-6 bg-blog-surface-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg">
        <h2 className="text-lg font-semibold text-blog-text-light dark:text-blog-text-dark mb-4">
          연도별 바로가기
        </h2>
        <div className="flex flex-wrap gap-2">
          {years.map(year => (
            <Link
              key={year}
              href={`#year-${year}`}
              className="inline-flex items-center gap-2 bg-blog-bg-light dark:bg-blog-bg-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg px-4 py-2 hover:bg-blog-accent hover:text-white dark:hover:bg-blog-accent-dark transition-colors"
            >
              <span>{year}</span>
              <span className="text-sm opacity-70">({postsByYear[year].length})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Posts by Year */}
      <div className="space-y-12">
        {years.map(year => {
          const posts = postsByYear[year]
          
          return (
            <section 
              key={year}
              id={`year-${year}`}
              className="scroll-mt-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-blog-text-light dark:text-blog-text-dark flex items-center">
                  <span className="w-2 h-10 bg-blog-accent dark:bg-blog-accent-dark mr-4 rounded"></span>
                  {year}
                </h2>
                <span className="text-lg text-blog-text-muted-light dark:text-blog-text-muted-dark">
                  {posts.length}개의 포스트
                </span>
              </div>
              
              <div className="space-y-4">
                {posts.map((post, index) => {
                  const postDate = new Date(post.date)
                  const formattedDate = format(postDate, 'MMM dd')
                  
                  return (
                    <article 
                      key={post.id}
                      className="flex items-start gap-6 p-4 bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg hover:shadow-md dark:hover:shadow-lg transition-shadow"
                    >
                      {/* Date */}
                      <div className="flex-shrink-0 text-center">
                        <div className="w-16 h-16 bg-blog-accent dark:bg-blog-accent-dark text-white rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs font-medium">
                            {formattedDate.split(' ')[0]}
                          </span>
                          <span className="text-lg font-bold">
                            {formattedDate.split(' ')[1]}
                          </span>
                        </div>
                      </div>
                      
                      {/* Post Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-semibold text-blog-text-light dark:text-blog-text-dark mb-2 hover:text-blog-accent dark:hover:text-blog-accent-dark transition-colors">
                          <Link href={`/blog/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        {post.excerpt && (
                          <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark text-sm mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          {post.category && (
                            <span className="text-blog-accent dark:text-blog-accent-dark font-medium">
                              {post.category}
                            </span>
                          )}
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-1">
                              {post.tags.slice(0, 3).map(tag => (
                                <span 
                                  key={tag}
                                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-blog-text-muted-light dark:text-blog-text-muted-dark text-xs">
                                  +{post.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Empty State */}
      {years.length === 0 && (
        <div className="text-center py-12">
          <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark text-lg">
            아직 포스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
