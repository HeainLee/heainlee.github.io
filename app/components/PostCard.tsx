import Link from 'next/link'
import { PostData } from '@/lib/posts'
import { format } from 'date-fns'

interface PostCardProps {
  post: PostData
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = format(new Date(post.date), 'MMM dd, yyyy')
  
  return (
    <article className="post-card mb-8">
      {post.image && (
        <div className="mb-4">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-blog-text hover:text-blog-accent transition-colors">
          <Link href={`/blog/${post.id}`}>
            {post.title}
          </Link>
        </h2>
        
        {post.excerpt && (
          <p className="text-blog-muted leading-relaxed">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-blog-muted">{formattedDate}</span>
            {post.category && (
              <span className="text-blog-accent">{post.category}</span>
            )}
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex space-x-2">
              {post.tags.slice(0, 3).map((tag) => (
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
        </div>
      </div>
    </article>
  )
}
