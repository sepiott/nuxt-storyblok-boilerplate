# useSEO Composable

A comprehensive Nuxt 3 composable for managing SEO meta tags, structured data, and Open Graph properties. This composable provides a complete SEO solution with automatic content extraction and social media optimization.

## Features

- **Complete Meta Management**: Handles title, description, Open Graph, and Twitter Cards
- **Structured Data**: Generates JSON-LD structured data for better search results
- **Content Extraction**: Automatically extracts images and text from Storyblok content
- **Social Media Optimization**: Full Open Graph and Twitter Card support
- **Type Safety**: TypeScript interfaces for all SEO data structures
- **Flexible Configuration**: Supports various content types and schemas

## Usage

### Basic SEO Setup

```vue
<script setup>
const { setPageSEO } = useSEO()

// Set basic page SEO
setPageSEO({
  title: 'Page Title',
  description: 'Page description for search engines',
  image: 'https://example.com/image.jpg',
  type: 'article'
})
</script>
```

### With Structured Data

```vue
<script setup>
const { setPageSEO, generateStructuredData } = useSEO()

// Create structured data
const articleSchema = generateStructuredData('Article', {
  headline: 'Article Title',
  description: 'Article description',
  author: {
    '@type': 'Person',
    name: 'Author Name'
  },
  datePublished: '2024-01-15',
  dateModified: '2024-01-16'
})

// Set SEO with structured data
setPageSEO({
  title: 'Article Title',
  description: 'Article description',
  type: 'article',
  author: 'Author Name',
  publishedTime: '2024-01-15',
  modifiedTime: '2024-01-16'
}, [articleSchema])
</script>
```

### Extract Content from Storyblok

```vue
<script setup>
const { setPageSEO, getFirstImageFromContent, extractTextFromRichText } = useSEO()

// Assuming you have Storyblok story content
const story = { /* your story data */ }

const extractedImage = getFirstImageFromContent(story.content)
const extractedText = extractTextFromRichText(story.content.body)

setPageSEO({
  title: story.name,
  description: extractedText.substring(0, 160),
  image: extractedImage,
  type: 'article'
})
</script>
```

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `setPageSEO()` | `function` | Sets comprehensive page SEO with meta tags and structured data |
| `generateStructuredData()` | `function` | Creates JSON-LD structured data objects |
| `getImageFromStoryblok()` | `function` | Extracts image URLs from Storyblok image objects |
| `getFirstImageFromContent()` | `function` | Finds first image in Storyblok content body |
| `extractTextFromRichText()` | `function` | Extracts plain text from Storyblok rich text content |

## Functions

### setPageSEO(seoData, structuredData?)

Sets comprehensive SEO for the current page including:
- Page title and meta description
- Open Graph properties (og:title, og:description, og:image, etc.)
- Twitter Card meta tags
- Article-specific meta (author, published time, tags)
- Canonical URL
- Robots directives
- JSON-LD structured data scripts

```typescript
interface SEOData {
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
```

### generateStructuredData(type, data)

Creates structured data objects following Schema.org standards:

```typescript
const organizationSchema = generateStructuredData('Organization', {
  name: 'Company Name',
  description: 'Company description',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  sameAs: [
    'https://twitter.com/company',
    'https://linkedin.com/company/company'
  ]
})
```

Common schema types:
- **Article**: Blog posts, news articles
- **WebPage**: Standard web pages
- **WebSite**: Home page and site-wide data
- **Organization**: Company/brand information
- **Person**: Author and individual profiles
- **Product**: E-commerce products
- **FAQ**: Frequently asked questions

### getImageFromStoryblok(image)

Safely extracts image URLs from various Storyblok image formats:
- Direct image objects with `filename` property
- String URLs
- Handles null/undefined values gracefully

### getFirstImageFromContent(content)

Recursively searches Storyblok content for the first image:
- Searches through body arrays
- Handles nested components (grid, columns, etc.)
- Supports various component types:
  - Image components
  - Hero components with images
  - Card components with images
  - Feature components with images
  - Rich text with embedded images

### extractTextFromRichText(richText)

Extracts plain text from Storyblok rich text content:
- Handles Storyblok rich text format
- Strips HTML tags from string content
- Recursively processes nested content nodes
- Perfect for generating meta descriptions

## Content Type Detection

The composable automatically handles different content types:

### Website Type
- Home pages and landing pages
- Generates WebSite and Organization structured data
- Includes search action markup
- Uses site-level fallbacks

### Article Type  
- Blog posts and content with publication dates
- Includes article-specific meta tags
- Generates Article structured data
- Supports author, published/modified dates, and tags

### Product Type
- E-commerce and product pages
- Product-specific structured data
- Pricing and availability information

## Automatic Meta Generation

The composable generates comprehensive meta tags:

### Basic Meta Tags
```html
<meta name="description" content="...">
<meta name="robots" content="index, follow">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Open Graph Tags
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
<meta property="og:type" content="...">
<meta property="og:site_name" content="...">
```

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### Article Meta (when applicable)
```html
<meta name="author" content="...">
<meta property="article:published_time" content="...">
<meta property="article:modified_time" content="...">
<meta property="article:tag" content="...">
```

## Default Behavior

### Image Fallbacks
1. Explicit image parameter
2. Storyblok content SEO image
3. Storyblok content main image
4. First image found in content
5. Default site image (`/images/og-default.png`)

### URL Generation
- Canonical URLs automatically generated
- Absolute URLs for Open Graph tags
- Uses runtime config for site URL

### Site Configuration
Requires these runtime config values:
```typescript
{
  public: {
    siteUrl: 'https://yoursite.com',
    siteName: 'Your Site Name',
    siteDescription: 'Default site description'
  }
}
```

## Best Practices

### SEO Optimization
- Keep titles under 60 characters
- Keep descriptions between 120-160 characters
- Use high-quality, relevant images (1200x630px for social)
- Include structured data for rich search results
- Use descriptive, keyword-rich content

### Performance
- Images are not processed, only URLs extracted
- Minimal runtime overhead
- Structured data generated efficiently
- No external API calls

### Content Strategy
- Extract meaningful descriptions from content
- Use first paragraphs for meta descriptions
- Include relevant images in content
- Structure content with proper headings
- Add publication dates for articles

### Accessibility
- Provide alt text for images in content
- Use semantic HTML structure
- Include proper heading hierarchy
- Ensure content is readable without images

## Example: Complete Article SEO

```vue
<script setup>
const { setPageSEO, generateStructuredData, getFirstImageFromContent, extractTextFromRichText } = useSEO()

// Story data from Storyblok
const story = {
  name: 'How to Build Amazing Web Apps',
  content: {
    seo: {
      title: 'Build Amazing Web Apps | Developer Guide',
      description: 'Learn modern web development techniques...'
    },
    body: [/* rich text content */],
    author: 'Jane Developer',
    published_at: '2024-01-15T10:00:00.000Z'
  }
}

// Extract content
const seoImage = getFirstImageFromContent(story.content)
const description = story.content.seo?.description || 
  extractTextFromRichText(story.content.body).substring(0, 160)

// Generate structured data
const articleSchema = generateStructuredData('Article', {
  headline: story.content.seo?.title || story.name,
  description: description,
  image: seoImage,
  author: {
    '@type': 'Person',
    name: story.content.author
  },
  datePublished: story.published_at,
  dateModified: story.published_at,
  publisher: {
    '@type': 'Organization',
    name: 'Your Site Name',
    logo: {
      '@type': 'ImageObject',
      url: 'https://yoursite.com/logo.png'
    }
  }
})

// Set comprehensive SEO
setPageSEO({
  title: story.content.seo?.title || story.name,
  description: description,
  image: seoImage,
  type: 'article',
  author: story.content.author,
  publishedTime: story.published_at,
  modifiedTime: story.published_at
}, [articleSchema])
</script>
``` 