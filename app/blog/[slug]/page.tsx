import { notFound } from 'next/navigation'
import { getPostData, getAllPostIds } from '@/lib/posts'
import { format } from 'date-fns'
import Link from 'next/link'
import TableOfContents from '@/app/components/TableOfContents'

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({
    slug: path.params.slug,
  }))
}

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getPostData(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Tech Blog`,
    description: post.excerpt || `${post.title} - Tech Blog`,
  }
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPostData(params.slug)

  if (!post) {
    notFound()
  }

  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy')

  return (
    <div className="max-w-4xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 max-w-4xl xl:max-w-4xl w-full">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <Link href="/" className="text-blog-accent dark:text-blog-accent-dark hover:underline">
              Home
            </Link>
            <span className="mx-2 text-blog-text-muted-light dark:text-blog-text-muted-dark">/</span>
            <Link href="/blog" className="text-blog-accent dark:text-blog-accent-dark hover:underline">
              Blog
            </Link>
            <span className="mx-2 text-blog-text-muted-light dark:text-blog-text-muted-dark">/</span>
            <span className="text-blog-text-muted-light dark:text-blog-text-muted-dark">{post.title}</span>
          </nav>

          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-blog-text-light dark:text-blog-text-dark mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-blog-text-muted-light dark:text-blog-text-muted-dark mb-6 text-sm">
              <time dateTime={post.date} className="font-medium">{formattedDate}</time>
              {post.category && (
                <>
                  <span>•</span>
                  <Link 
                    href={`/categories#${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-blog-accent dark:text-blog-accent-dark hover:underline font-medium"
                  >
                    {post.category}
                  </Link>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags#${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {post.image && (
              <div className="mb-8">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* 글 요약 */}
            {post.excerpt && (
              <div className="bg-gray-50 dark:bg-gray-900 border-l-4 border-blog-accent dark:border-blog-accent-dark p-4 rounded-r-lg mb-8">
                <p className="text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark leading-relaxed italic">
                  {post.excerpt}
                </p>
              </div>
            )}
          </header>

          {/* Post Content */}
          <article className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          </article>

          {/* Post Footer */}
          <footer className="mt-16 pt-8 border-t border-blog-border-light dark:border-blog-border-dark">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Link
                href="/"
                className="text-blog-accent dark:text-blog-accent-dark hover:underline flex items-center gap-2 font-medium"
              >
                <span>←</span> 목록으로 돌아가기
              </Link>
              
              <div className="text-right text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark">
                <p className="font-medium">이 포스트가 도움이 되셨나요?</p>
                <p className="mt-1">공유해주세요! 🙂</p>
              </div>
            </div>
          </footer>
        </div>

        {/* 목차 사이드바 */}
        {post.tableOfContents && post.tableOfContents.length > 0 && (
          <TableOfContents toc={post.tableOfContents} />
        )}
      </div>
    </div>
  )
}
