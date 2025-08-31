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
        <h2 className="text-xl font-bold text-blog-text-light dark:text-blog-text-dark hover:text-blog-accent dark:hover:text-blog-accent-dark transition-colors">
          <Link 
            href={`/blog/${post.id}`}
            className="block p-1 -m-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
          >
            {post.title}
          </Link>
        </h2>
        
        {post.excerpt && (
          <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark leading-relaxed">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-3">
          <div className="flex items-center space-x-4">
            <span className="text-blog-text-muted-light dark:text-blog-text-muted-dark">{formattedDate}</span>
            {post.category && (
              <span className="text-blog-accent dark:text-blog-accent-dark">{post.category}</span>
            )}
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
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
        </div>
      </div>
    </article>
  )
}
