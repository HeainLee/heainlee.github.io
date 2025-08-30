import { notFound } from 'next/navigation'
import { getPostData, getAllPostIds } from '@/lib/posts'
import { format } from 'date-fns'
import Link from 'next/link'

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
    <div className="max-w-4xl mx-auto px-6 sm:px-8">
      {/* Post Header - 참조 블로그와 동일한 스타일 */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#24292f' }}>
          {post.title}
        </h1>
        
        {/* Posted 날짜와 카테고리 */}
        <div className="flex items-center space-x-4 mb-6 text-sm" style={{ color: '#656d76' }}>
          <span>Posted</span>
          <time dateTime={post.date}>{formattedDate}</time>
          {post.category && (
            <>
              <span>•</span>
              <Link 
                href={`/categories/${post.category}`}
                className="hover:underline"
                style={{ color: '#0969da' }}
              >
                {post.category}
              </Link>
            </>
          )}
        </div>

        {/* 이미지가 있는 경우 */}
        {post.image && (
          <div className="mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full rounded-lg"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
            <p className="text-xs mt-2 text-center" style={{ color: '#656d76' }}>
              Image from Unsplash
            </p>
          </div>
        )}

        {/* 저자 정보 - 참조 블로그 스타일 */}
        <div className="flex items-center space-x-4 mb-6 text-sm" style={{ color: '#656d76' }}>
          <span>By <em>Tech Blog</em></span>
          <span>•</span>
          <span>views</span>
          <span><em>7 min</em> read</span>
        </div>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-block px-3 py-1 text-xs rounded-full hover:opacity-80"
                style={{ 
                  backgroundColor: '#f6f8fa', 
                  color: '#24292f',
                  border: '1px solid #d8dee4'
                }}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* 글 요약 - 참조 블로그 스타일 */}
        {post.excerpt && (
          <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#f6f8fa', borderLeft: '4px solid #0969da' }}>
            <p className="text-sm italic" style={{ color: '#656d76' }}>
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Contents 제목 - 참조 블로그와 동일 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#24292f' }}>
            Contents
          </h2>
          <p className="text-base" style={{ color: '#24292f' }}>
            {post.title}
          </p>
        </div>
      </header>

      {/* Post Content - 참조 블로그와 동일한 prose 적용 */}
      <article className="prose max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      </article>

      {/* Post Footer - 참조 블로그 스타일 */}
      <footer className="mt-12 pt-8 border-t" style={{ borderColor: '#d8dee4' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href="/"
            className="hover:underline flex items-center gap-2"
            style={{ color: '#0969da' }}
          >
            <span>←</span> 목록으로 돌아가기
          </Link>
          
          <div className="text-right text-sm" style={{ color: '#656d76' }}>
            <p>This post is licensed under CC BY 4.0 by the author.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
