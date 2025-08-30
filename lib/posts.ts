import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

export async function getPostData(id: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  // 간단한 마크다운을 HTML로 변환 (기본적인 변환만)
  const contentHtml = matterResult.content
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p><pre>/g, '<pre>')
    .replace(/<\/pre><\/p>/g, '</pre>')

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
