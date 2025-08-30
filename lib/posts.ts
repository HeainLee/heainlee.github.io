import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked, Renderer } from 'marked'
import hljs from 'highlight.js'

const postsDirectory = path.join(process.cwd(), 'content')

export interface PostData {
  id: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  category?: string
  image?: string
  content?: string
}

export function getSortedPostsData(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        id,
        title: matterResult.data.title || 'Untitled',
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || '',
        tags: matterResult.data.tags || [],
        category: matterResult.data.category || 'General',
        image: matterResult.data.image || '',
        ...matterResult.data,
      } as PostData
    })

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      }
    })
}

// marked 설정
const renderer = new Renderer()

// 코드 블록을 위한 커스텀 렌더러
renderer.code = function({ text, lang }) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value
      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`
    } catch (err) {
      console.error('Highlight.js error:', err)
    }
  }
  try {
    const highlighted = hljs.highlightAuto(text).value
    return `<pre><code class="hljs">${highlighted}</code></pre>`
  } catch (err) {
    console.error('Highlight.js auto error:', err)
    return `<pre><code>${text}</code></pre>`
  }
}

marked.setOptions({
  renderer: renderer,
  breaks: true,
  gfm: true
})

export async function getPostData(id: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  // marked를 사용하여 마크다운을 HTML로 변환 (syntax highlighting 포함)
  const contentHtml = await marked(matterResult.content)

  return {
    id,
    content: contentHtml,
    title: matterResult.data.title || 'Untitled',
    date: matterResult.data.date || new Date().toISOString(),
    excerpt: matterResult.data.excerpt || '',
    tags: matterResult.data.tags || [],
    category: matterResult.data.category || 'General',
    image: matterResult.data.image || '',
    ...matterResult.data,
  } as PostData
}

export function getAllTags(): string[] {
  const posts = getSortedPostsData()
  const allTags = posts.flatMap(post => post.tags || [])
  return [...new Set(allTags)].sort()
}

export function getAllCategories(): string[] {
  const posts = getSortedPostsData()
  const allCategories = posts.map(post => post.category || 'General')
  return [...new Set(allCategories)].sort()
}

export function getPostsByTag(tag: string): PostData[] {
  const posts = getSortedPostsData()
  return posts.filter(post => post.tags?.includes(tag))
}

export function getPostsByCategory(category: string): PostData[] {
  const posts = getSortedPostsData()
  return posts.filter(post => post.category === category)
}

export function getPostsByYear(): { [year: string]: PostData[] } {
  const posts = getSortedPostsData()
  const postsByYear: { [year: string]: PostData[] } = {}
  
  posts.forEach(post => {
    const year = new Date(post.date).getFullYear().toString()
    if (!postsByYear[year]) {
      postsByYear[year] = []
    }
    postsByYear[year].push(post)
  })
  
  return postsByYear
}

export function getCategoriesWithCount(): { category: string; count: number }[] {
  const posts = getSortedPostsData()
  const categoryCount: { [category: string]: number } = {}
  
  posts.forEach(post => {
    const category = post.category || 'General'
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })
  
  return Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export function getTagsWithCount(): { tag: string; count: number }[] {
  const posts = getSortedPostsData()
  const tagCount: { [tag: string]: number } = {}
  
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}
