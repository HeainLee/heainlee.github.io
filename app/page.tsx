import { getSortedPostsData } from '@/lib/posts'
import PostCard from './components/PostCard'
import Sidebar from './components/Sidebar'

export default function Home() {
  const allPostsData = getSortedPostsData()
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blog-text-light dark:text-blog-text-dark mb-2">blog with AI</h1>
          <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark">AI와 함께 성장하는 개발자를 위한 기술 블로그입니다.</p>
        </div>
        
        {allPostsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark text-lg mb-4">아직 작성된 포스트가 없습니다.</p>
            <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark">첫 번째 포스트를 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {allPostsData.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {allPostsData.length > 5 && (
          <div className="flex justify-center mt-12">
            <nav className="flex space-x-2">
              <button className="px-3 py-2 bg-blog-accent text-white rounded">1</button>
              <button className="px-3 py-2 text-blog-muted hover:text-blog-accent">2</button>
              <button className="px-3 py-2 text-blog-muted hover:text-blog-accent">3</button>
              <span className="px-3 py-2 text-blog-muted">...</span>
              <button className="px-3 py-2 text-blog-muted hover:text-blog-accent">25</button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Sidebar />
      </div>
    </div>
  )
}
