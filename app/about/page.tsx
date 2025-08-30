import Image from 'next/image'

export const metadata = {
  title: 'About | blog with AI',
  description: 'blog with AI 블로그와 개발자에 대한 소개입니다.'
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blog-text-light dark:text-blog-text-dark mb-6">
          About
        </h1>
        
        {/* Profile Image */}
        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blog-accent dark:border-blog-accent-dark">
          <div className="w-full h-full bg-gradient-to-br from-blog-accent to-blog-accent-dark flex items-center justify-center">
            <span className="text-white text-4xl font-bold">AI</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-blog-text-light dark:text-blog-text-dark mb-4">
          blog with AI
        </h2>
        <p className="text-lg text-blog-text-muted-light dark:text-blog-text-muted-dark max-w-2xl mx-auto">
          AI와 함께 성장하는 개발자를 위한 기술 블로그입니다.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {/* About Blog */}
        <section className="bg-blog-surface-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-8">
          <h3 className="text-2xl font-bold text-blog-text-light dark:text-blog-text-dark mb-6 flex items-center">
            <span className="w-1 h-8 bg-blog-accent dark:bg-blog-accent-dark mr-3 rounded"></span>
            블로그 소개
          </h3>
          <div className="prose prose-lg max-w-none text-blog-text-light dark:text-blog-text-dark">
            <p className="mb-4">
              <strong>blog with AI</strong>는 인공지능과 함께 성장하는 개발자들을 위한 공간입니다. 
              빠르게 변화하는 AI 기술 트렌드부터 실무에서 바로 적용할 수 있는 개발 팁까지, 
              다양한 기술 콘텐츠를 제공합니다.
            </p>
            <p className="mb-4">
              이 블로그에서는 다음과 같은 주제들을 다룹니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-blog-text-muted-light dark:text-blog-text-muted-dark">
              <li>AI/Machine Learning 기술 동향과 실습</li>
              <li>웹 개발 및 프로그래밍 튜토리얼</li>
              <li>개발 도구와 프레임워크 활용법</li>
              <li>개발자 성장과 커리어 이야기</li>
              <li>기술 트렌드 분석과 인사이트</li>
            </ul>
          </div>
        </section>

        {/* Skills & Interests */}
        <section className="bg-blog-surface-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-8">
          <h3 className="text-2xl font-bold text-blog-text-light dark:text-blog-text-dark mb-6 flex items-center">
            <span className="w-1 h-8 bg-blog-accent dark:bg-blog-accent-dark mr-3 rounded"></span>
            관심 기술
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-blog-text-light dark:text-blog-text-dark mb-4">
                AI & Machine Learning
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI API', 'Hugging Face'].map(tech => (
                  <span 
                    key={tech}
                    className="bg-blog-accent/10 dark:bg-blog-accent-dark/10 text-blog-accent dark:text-blog-accent-dark px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-blog-text-light dark:text-blog-text-dark mb-4">
                Web Development
              </h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL'].map(tech => (
                  <span 
                    key={tech}
                    className="bg-blog-accent/10 dark:bg-blog-accent-dark/10 text-blog-accent dark:text-blog-accent-dark px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Links */}
        <section className="bg-blog-surface-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-8">
          <h3 className="text-2xl font-bold text-blog-text-light dark:text-blog-text-dark mb-6 flex items-center">
            <span className="w-1 h-8 bg-blog-accent dark:bg-blog-accent-dark mr-3 rounded"></span>
            연락처 및 링크
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="mailto:contact@blogwithai.com" 
              className="flex items-center gap-3 p-4 border border-blog-border-light dark:border-blog-border-dark rounded-lg hover:bg-blog-bg-light dark:hover:bg-blog-bg-dark transition-colors"
            >
              <div className="w-10 h-10 bg-blog-accent dark:bg-blog-accent-dark rounded-lg flex items-center justify-center text-white">
                📧
              </div>
              <div>
                <div className="font-medium text-blog-text-light dark:text-blog-text-dark">Email</div>
                <div className="text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark">contact@blogwithai.com</div>
              </div>
            </a>
            
            <a 
              href="https://github.com/blogwithai" 
              className="flex items-center gap-3 p-4 border border-blog-border-light dark:border-blog-border-dark rounded-lg hover:bg-blog-bg-light dark:hover:bg-blog-bg-dark transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 bg-blog-accent dark:bg-blog-accent-dark rounded-lg flex items-center justify-center text-white">
                🐱
              </div>
              <div>
                <div className="font-medium text-blog-text-light dark:text-blog-text-dark">GitHub</div>
                <div className="text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark">@blogwithai</div>
              </div>
            </a>
            
            <a 
              href="https://twitter.com/blogwithai" 
              className="flex items-center gap-3 p-4 border border-blog-border-light dark:border-blog-border-dark rounded-lg hover:bg-blog-bg-light dark:hover:bg-blog-bg-dark transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 bg-blog-accent dark:bg-blog-accent-dark rounded-lg flex items-center justify-center text-white">
                🐦
              </div>
              <div>
                <div className="font-medium text-blog-text-light dark:text-blog-text-dark">Twitter</div>
                <div className="text-sm text-blog-text-muted-light dark:text-blog-text-muted-dark">@blogwithai</div>
              </div>
            </a>
          </div>
        </section>

        {/* Thank You Message */}
        <section className="text-center py-12 border-t border-blog-border-light dark:border-blog-border-dark">
          <h3 className="text-xl font-semibold text-blog-text-light dark:text-blog-text-dark mb-4">
            감사합니다! 🙏
          </h3>
          <p className="text-blog-text-muted-light dark:text-blog-text-muted-dark max-w-2xl mx-auto">
            블로그를 방문해주셔서 감사합니다. 궁금한 점이나 제안사항이 있으시면 언제든지 연락해주세요. 
            함께 성장하는 개발자 커뮤니티를 만들어가요!
          </p>
        </section>
      </div>
    </div>
  )
}
