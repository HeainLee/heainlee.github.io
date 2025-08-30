'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/posts'

interface TableOfContentsProps {
  toc: TocItem[]
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    console.log('📚 TableOfContents mounted with toc:', toc)
    
    if (!toc || toc.length === 0) {
      console.log('❌ No TOC data available')
      return
    }

    // 스크롤 위치에 따른 활성 섹션 감지 (개선된 설정)
    const observerOptions = {
      rootMargin: '-10% 0px -70% 0px', // 상단 10%, 하단 70% 마진
      threshold: [0, 0.1, 0.5, 1.0], // 여러 threshold 사용
    }

    const headingElements: { [key: string]: Element } = {}
    
    // DOM 요소 찾기 및 디버깅
    console.log('🔍 Searching for heading elements...')
    toc.forEach((item) => {
      const element = document.getElementById(item.anchor)
      console.log(`🎯 Looking for heading with id "${item.anchor}":`, element ? '✅ Found' : '❌ Not found')
      if (element) {
        headingElements[item.anchor] = element
        console.log(`📍 Element position:`, {
          offsetTop: element.offsetTop,
          textContent: element.textContent?.substring(0, 50)
        })
      }
    })
    
    console.log(`📊 Found ${Object.keys(headingElements).length} out of ${toc.length} heading elements`)

    // 활성 섹션을 결정하는 개선된 로직
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      
      if (visibleEntries.length > 0) {
        // 가장 위에 있는 visible 요소를 선택
        const topEntry = visibleEntries.reduce((prev, current) => {
          return prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
        })
        
        console.log('🎯 Setting active ID to:', topEntry.target.id)
        setActiveId(topEntry.target.id)
      }
    }, observerOptions)

    // 헤딩 요소들을 관찰 시작
    Object.values(headingElements).forEach(element => {
      observer.observe(element)
    })

    // Fallback: 스크롤 이벤트로도 감지
    const handleScroll = () => {
      const scrollY = window.scrollY + 120 // 헤더 오프셋 고려 (더 넉넉하게)
      
      let activeElement = ''
      for (const item of toc) {
        const element = document.getElementById(item.anchor)
        if (element && element.offsetTop <= scrollY) {
          activeElement = item.anchor
        }
      }
      
      if (activeElement && activeElement !== activeId) {
        setActiveId(activeElement)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [toc, activeId])

  const handleClick = (anchor: string) => {
    console.log('🖱️ Clicking on anchor:', anchor)
    const element = document.getElementById(anchor)
    
    if (element) {
      console.log('✅ Found element, scrolling to:', {
        id: element.id,
        tagName: element.tagName,
        offsetTop: element.offsetTop,
        textContent: element.textContent?.substring(0, 50)
      })
      
      // 수동으로 스크롤 위치 계산 (더 정확한 제어)
      const elementTop = element.offsetTop - 120 // 헤더/여백 고려 (더 넉넉하게)
      
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      })
      
      // 즉시 활성 상태 업데이트
      setActiveId(anchor)
    } else {
      console.error('Element not found for anchor:', anchor)
    }
  }

  if (!toc || toc.length === 0) {
    return null
  }

  return (
    <div className="hidden xl:block sticky top-24 w-64 h-fit">
      <div className="bg-blog-bg-light dark:bg-blog-surface-dark border border-blog-border-light dark:border-blog-border-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blog-text-light dark:text-blog-text-dark mb-4">
          목차
        </h3>
        <nav className="space-y-1">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.anchor)}
              className={`
                block w-full text-left text-sm py-1 px-2 rounded transition-colors duration-200
                ${item.level === 1 ? 'pl-2' : ''}
                ${item.level === 2 ? 'pl-4' : ''}
                ${item.level === 3 ? 'pl-6' : ''}
                ${item.level === 4 ? 'pl-8' : ''}
                ${item.level === 5 ? 'pl-10' : ''}
                ${item.level === 6 ? 'pl-12' : ''}
                ${
                  activeId === item.anchor
                    ? 'text-blog-accent dark:text-blog-accent-dark bg-blue-50 dark:bg-blue-900 font-medium'
                    : 'text-blog-text-muted-light dark:text-blog-text-muted-dark hover:text-blog-text-light dark:hover:text-blog-text-dark hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
