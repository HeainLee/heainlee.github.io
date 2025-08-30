import { getCategoriesWithCount, getPostsByCategory } from '@/lib/posts'
import Link from 'next/link'
import PostCard from '../components/PostCard'

export const metadata = {
  title: 'Categories | blog with AI',
  description: '카테고리별로 분류된 블로그 포스트를 확인하세요.'
}

export default function CategoriesPage() {
  const categoriesWithCount = getCategoriesWithCount()
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blog-text-light dark:text-blog-text-dark mb-4">
          Categories
        </h1>
        <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark">
          카테고리별로 정리된 블로그 포스트를 확인하세요.
        </p>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {categoriesWithCount.map(({ category, count }) => (
          <Link
            key={category}
            href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow text-center"
          >
            <h3 className="font-semibold text-blog-text-light dark:text-blog-text-dark mb-1">
              {category}
            </h3>
            <p className="text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark">
              {count}개의 포스트
            </p>
          </Link>
        ))}
      </div>

      {/* Posts by Category */}
      <div className="space-y-12">
        {categoriesWithCount.map(({ category, count }) => {
          const posts = getPostsByCategory(category)
          
          return (
            <section 
              key={category}
              id={category.toLowerCase().replace(/\s+/g, '-')}
              className="scroll-mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blog-text-light dark:text-blog-text-dark flex items-center">
                  <span className="w-1 h-8 bg-blog-accent dark:bg-blog-accent-dark mr-3 rounded"></span>
                  {category}
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
      {categoriesWithCount.length === 0 && (
        <div className="text-center py-12">
          <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark text-lg">
            아직 카테고리가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
