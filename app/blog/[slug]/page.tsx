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
    <div className="max-w-4xl mx-auto">
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
        <h1 className="text-4xl font-bold text-blog-text-light dark:text-blog-text-dark mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center space-x-4 text-blog-text-muted-light dark:text-blog-text-muted-dark mb-6">
          <time dateTime={post.date}>{formattedDate}</time>
          {post.category && (
            <>
              <span>•</span>
              <Link 
                href={`/categories/${post.category}`}
                className="text-blog-accent dark:text-blog-accent-dark hover:underline"
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
                href={`/tags/${tag}`}
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
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </header>

      {/* Post Content */}
      <article className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      </article>

      {/* Post Footer */}
      <footer className="mt-12 pt-8 border-t border-blog-border-light dark:border-blog-border-dark">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-blog-accent dark:text-blog-accent-dark hover:underline"
          >
            ← 목록으로 돌아가기
          </Link>
          
          <div className="text-right text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark">
            <p>이 포스트가 도움이 되셨나요?</p>
            <p>공유해주세요! 🙂</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
