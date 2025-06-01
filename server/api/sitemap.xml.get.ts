// Add interface for Storyblok story structure
interface StoryblokStory {
  full_slug: string
  is_folder: boolean
  published_at?: string
  created_at?: string
}

interface StoryblokResponse {
  stories: StoryblokStory[]
}

export default defineEventHandler(async (event): Promise<string> => {
  const config = useRuntimeConfig()

  try {
    // Use the same token as the main app
    const token: string = config.storyblokToken || process.env.STORYBLOK_TOKEN || ''
    const baseUrl: string = config.public.siteUrl

    // Fetch stories from Storyblok
    const response: StoryblokResponse = await $fetch<StoryblokResponse>(`https://api.storyblok.com/v1/cdn/stories`, {
      query: {
        token,
        version: 'published',
        per_page: 100,
      },
    })

    const stories: StoryblokStory[] = response.stories || []

    // Generate sitemap XML
    const sitemap: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${stories
  .filter((story: StoryblokStory) => story.full_slug !== 'home' && !story.is_folder)
  .map((story: StoryblokStory) => {
    const url = story.full_slug === '' ? baseUrl : `${baseUrl}/${story.full_slug}`
    const lastmod = story.published_at || story.created_at || new Date().toISOString()

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })
  .join('\n')}
</urlset>`

    // Set response headers
    setHeader(event, 'Content-Type', 'application/xml')
    setHeader(event, 'Cache-Control', 'max-age=3600') // Cache for 1 hour

    return sitemap
  }
  catch (error) {
    console.error('Error generating sitemap:', error)

    // Return minimal sitemap if there's an error
    const baseUrl: string = config.public.siteUrl
    const fallbackSitemap: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    setHeader(event, 'Content-Type', 'application/xml')
    return fallbackSitemap
  }
})
