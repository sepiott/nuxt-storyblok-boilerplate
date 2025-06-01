import type { ReactiveHead } from '@unhead/vue'

export interface SEOData {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  siteName?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
}

interface RichTextNode {
  type?: string
  text?: string
  attrs?: {
    src?: string
    [key: string]: unknown
  }
  content?: RichTextNode[]
}

interface StoryblokImage {
  filename?: string
}

export interface StoryblokComponent {
  component?: string
  image?: StoryblokImage
  body?: StoryblokComponent[]
  columns?: StoryblokComponent[]
  components?: StoryblokComponent[]
  text?: {
    content?: RichTextNode[]
  }
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: unknown
}

export const useSEO = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  const generateMeta = (seoData: SEOData): ReactiveHead => {
    const {
      title,
      description,
      image,
      url,
      type = 'website',
      siteName = 'Nuxt + Storyblok Boilerplate',
      author,
      publishedTime,
      modifiedTime,
      tags,
      noindex = false,
      nofollow = false,
    } = seoData

    const currentUrl = url || `${config.public.siteUrl}${route.path}`
    const imageUrl = image ? (image.startsWith('http') ? image : `${config.public.siteUrl}${image}`) : `${config.public.siteUrl}/images/og-default.png`

    const robots: string[] = []
    if (noindex) robots.push('noindex')
    if (nofollow) robots.push('nofollow')
    if (robots.length === 0) robots.push('index', 'follow')

    const meta = [
      // Basic meta tags
      { name: 'description', content: description || '' },
      { name: 'robots', content: robots.join(', ') },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      // Open Graph
      { property: 'og:title', content: title || siteName },
      { property: 'og:description', content: description || '' },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },

      // Twitter Cards
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title || siteName },
      { name: 'twitter:description', content: description || '' },
      { name: 'twitter:image', content: imageUrl },
    ]

    // Add article-specific meta tags
    if (type === 'article') {
      if (author) meta.push({ name: 'author', content: author })
      if (publishedTime) meta.push({ property: 'article:published_time', content: publishedTime })
      if (modifiedTime) meta.push({ property: 'article:modified_time', content: modifiedTime })
      if (tags) {
        tags.forEach((tag) => {
          meta.push({ property: 'article:tag', content: tag })
        })
      }
    }

    const link = [
      { rel: 'canonical', href: currentUrl },
    ]

    return {
      title: title || siteName,
      meta,
      link,
      script: [],
    }
  }

  const generateStructuredData = (type: string, data: Record<string, unknown>): StructuredData => {
    const base = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    }

    return base
  }

  const setPageSEO = (seoData: SEOData, structuredData?: StructuredData[]) => {
    const headData = generateMeta(seoData)

    if (structuredData && structuredData.length > 0) {
      headData.script = structuredData.map(data => ({
        type: 'application/ld+json',
        children: JSON.stringify(data),
      }))
    }

    useHead(headData)
  }

  const getImageFromStoryblok = (image: StoryblokImage | string | null): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    if (image.filename) return image.filename
    return null
  }

  const getFirstImageFromContent = (content: StoryblokComponent | StoryblokComponent[] | null): string | null => {
    if (!content) return null

    // If content has a body array, search through it
    if ('body' in content && Array.isArray(content.body)) {
      return searchForImageInComponents(content.body)
    }

    // If content itself is an array, search through it
    if (Array.isArray(content)) {
      return searchForImageInComponents(content)
    }

    return null
  }

  const searchForImageInComponents = (components: StoryblokComponent[]): string | null => {
    for (const component of components) {
      // Direct image component
      if (component.component === 'image' && component.image?.filename) {
        return component.image.filename
      }

      // Hero component with image
      if (component.component === 'hero' && component.image?.filename) {
        return component.image.filename
      }

      // Grid component with columns
      if (component.component === 'grid' && Array.isArray(component.columns)) {
        for (const column of component.columns) {
          if (column.component === 'image' && column.image?.filename) {
            return column.image.filename
          }
          // Recursively search in nested components
          if (column.body && Array.isArray(column.body)) {
            const nestedImage = searchForImageInComponents(column.body)
            if (nestedImage) return nestedImage
          }
        }
      }

      // Card component with image
      if (component.component === 'card' && component.image?.filename) {
        return component.image.filename
      }

      // Feature component with image
      if (component.component === 'feature' && component.image?.filename) {
        return component.image.filename
      }

      // Text component with embedded images (rich text)
      if (component.component === 'text' && component.text) {
        const imageFromRichText = extractImageFromRichText(component.text)
        if (imageFromRichText) return imageFromRichText
      }

      // Recursively search in any nested body content
      if (component.body && Array.isArray(component.body)) {
        const nestedImage = searchForImageInComponents(component.body)
        if (nestedImage) return nestedImage
      }

      // Search in nested components array if it exists
      if (component.components && Array.isArray(component.components)) {
        const nestedImage = searchForImageInComponents(component.components)
        if (nestedImage) return nestedImage
      }
    }

    return null
  }

  const extractImageFromRichText = (richText: { content?: RichTextNode[] } | null): string | null => {
    if (!richText) return null

    // Handle Storyblok rich text format
    if (richText.content && Array.isArray(richText.content)) {
      for (const node of richText.content) {
        if (node.type === 'image' && node.attrs?.src) {
          return node.attrs.src
        }
        // Recursively search in nested content
        if (node.content && Array.isArray(node.content)) {
          const nestedImage = extractImageFromRichText({ content: node.content })
          if (nestedImage) return nestedImage
        }
      }
    }

    return null
  }

  const extractTextFromRichText = (richText: { content?: RichTextNode[] } | string | null): string => {
    if (!richText) return ''
    if (typeof richText === 'string') return richText.replace(/<[^>]*>/g, ' ').trim()

    // Handle Storyblok rich text format
    if (richText.content && Array.isArray(richText.content)) {
      let text = ''
      const extractFromNode = (node: RichTextNode) => {
        if (node.text) {
          text += node.text + ' '
        }
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach(extractFromNode)
        }
      }
      richText.content.forEach(extractFromNode)
      return text.trim()
    }

    return ''
  }

  return {
    generateMeta,
    generateStructuredData,
    setPageSEO,
    getImageFromStoryblok,
    getFirstImageFromContent,
    extractTextFromRichText,
  }
}
