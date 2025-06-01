import { ref, computed, watchEffect, type Ref } from 'vue'
import { useStoryblokBridge } from '@storyblok/vue'
import { useRoute } from 'vue-router'
import type { ISbStoryData } from '@storyblok/vue'
import type { StructuredData, StoryblokComponent } from './useSEO'

interface UseStoryblokPageOptions {
  slug?: string
  isHomePage?: boolean
  enableValidation?: boolean
}

interface StoryblokSEO {
  title?: string
  description?: string
  image?: {
    filename?: string
    alt?: string
  }
}

interface StoryblokContent {
  component?: string
  seo?: StoryblokSEO
  image?: {
    filename?: string
    alt?: string
  }
  body?: unknown
  author?: string
  [key: string]: unknown
}

interface StoryblokApiResponse {
  data: {
    story: ISbStoryData<StoryblokContent> | null
  }
}

interface StoryblokPageReturn {
  storyContent: Ref<ISbStoryData<StoryblokContent> | null>
  isLoading: Ref<boolean>
}

export const useStoryblokPage = async (options: UseStoryblokPageOptions = {}): Promise<StoryblokPageReturn> => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const { setPageSEO, generateStructuredData, getImageFromStoryblok, getFirstImageFromContent, extractTextFromRichText } = useSEO()

  // Determine the correct slug to use
  const getSlug = (): string => {
    if (options.isHomePage) {
      return 'home'
    }

    if (options.slug) {
      return options.slug
    }

    // Handle dynamic route params
    if (!route.params.slug || route.params.slug.length === 0) {
      return 'home'
    }

    if (Array.isArray(route.params.slug)) {
      return route.params.slug.join('/')
    }

    return route.params.slug as string
  }

  // Validate slug if validation is enabled
  const isValidContentSlug = (slug: string): boolean => {
    if (!options.enableValidation) return true

    const excludePatterns = [
      /^\.well-known\//,
      /^_nuxt\//,
      /\.json$/,
      /^\.(git|github)\//,
      /^(assets|images)\//,
      // Favicon and static asset patterns
      /^favicon\.ico$/,
      /^favicon-\d+x\d+\.png$/,
      /^apple-touch-icon\.png$/,
      /^android-chrome-\d+x\d+\.png$/,
      /^site\.webmanifest$/,
      /^robots\.txt$/,
      /^sitemap\.xml$/,
      /\.(png|jpg|jpeg|gif|svg|ico|webp)$/,
    ]

    return !excludePatterns.some(pattern => pattern.test(slug))
  }

  const slug = computed(() => getSlug())
  const storyContent = ref<ISbStoryData<StoryblokContent> | null>(null)
  const isLoading = ref(true)

  // Validate slug before fetching
  if (options.enableValidation && !isValidContentSlug(slug.value)) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid content path' })
  }

  // Load story from Storyblok
  const { data: initialStory, error } = await useAsyncData(`story-${slug.value}`, () => {
    const version = config.public.previewMode ? 'draft' : config.public.storyblokVersion

    return useStoryblokApi()
      .get(`cdn/stories/${slug.value}`, {
        version: version as 'published' | 'draft',
      })
      .catch((e: Error) => {
        console.error(`Failed to load story for slug: ${slug.value}`, e)
        return { data: { story: null } } as StoryblokApiResponse
      })
  })

  // Handle loading errors
  if (error.value || !initialStory.value?.data?.story) {
    const errorMessage = options.isHomePage ? 'Home page not found' : 'Page not found'
    throw createError({ statusCode: 404, statusMessage: errorMessage })
  }

  storyContent.value = initialStory.value.data.story
  isLoading.value = false

  // Initialize Storyblok Bridge for real-time editing
  if (config.public.previewMode && import.meta.client && storyContent.value) {
    useStoryblokBridge(
      storyContent.value.id,
      (updatedStory: ISbStoryData<StoryblokContent>) => {
        storyContent.value = updatedStory
      },
      {
        resolveRelations: [],
      },
    )
  }

  // Setup SEO
  const setupSEO = () => {
    if (!storyContent.value) return

    const seoTitle = storyContent.value?.content?.seo?.title
      || storyContent.value?.name
      || (options.isHomePage ? config.public.siteName : '')

    const seoDescription = storyContent.value?.content?.seo?.description
      || (options.isHomePage ? config.public.siteDescription : '')
      || (storyContent.value?.content?.body ? extractTextFromRichText(storyContent.value.content.body).substring(0, 160) : '')

    const seoImage = getImageFromStoryblok(storyContent.value?.content?.seo?.image?.filename || null)
      || getImageFromStoryblok(storyContent.value?.content?.image?.filename || null)
      || getFirstImageFromContent(storyContent.value?.content as StoryblokComponent | StoryblokComponent[] | null)

    // Generate structured data based on page type
    const structuredDataArray: StructuredData[] = []

    if (options.isHomePage) {
      // Home page specific structured data
      const websiteSchema = generateStructuredData('WebSite', {
        name: config.public.siteName,
        description: config.public.siteDescription,
        url: config.public.siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${config.public.siteUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      })

      const organizationSchema = generateStructuredData('Organization', {
        name: config.public.siteName,
        description: config.public.siteDescription,
        url: config.public.siteUrl,
        logo: `${config.public.siteUrl}/apple-touch-icon.png`,
        sameAs: [
          'https://github.com/your-org',
          'https://linkedin.com/company/your-org',
        ],
      })

      structuredDataArray.push(websiteSchema, organizationSchema)
    }
    else {
      // Regular page structured data
      const isArticle = storyContent.value?.content?.component === 'page' && storyContent.value?.content?.body

      if (isArticle) {
        const articleSchema = generateStructuredData('Article', {
          headline: seoTitle,
          description: seoDescription,
          image: seoImage,
          url: `${config.public.siteUrl}${route.path}`,
          datePublished: storyContent.value?.published_at || storyContent.value?.created_at,
          dateModified: storyContent.value?.published_at || storyContent.value?.created_at,
          author: {
            '@type': 'Organization',
            'name': config.public.siteName,
          },
          publisher: {
            '@type': 'Organization',
            'name': config.public.siteName,
            'logo': {
              '@type': 'ImageObject',
              'url': `${config.public.siteUrl}/apple-touch-icon.png`,
            },
          },
        })
        structuredDataArray.push(articleSchema)
      }
      else {
        const webPageSchema = generateStructuredData('WebPage', {
          name: seoTitle,
          description: seoDescription,
          url: `${config.public.siteUrl}${route.path}`,
          isPartOf: {
            '@type': 'WebSite',
            'name': config.public.siteName,
            'url': config.public.siteUrl,
          },
        })
        structuredDataArray.push(webPageSchema)
      }
    }

    // Set comprehensive SEO
    setPageSEO({
      title: seoTitle,
      description: seoDescription,
      image: seoImage || undefined,
      type: options.isHomePage ? 'website' : (storyContent.value?.content?.component === 'page' && storyContent.value?.content?.body ? 'article' : 'website'),
      publishedTime: storyContent.value?.published_at || undefined,
      modifiedTime: storyContent.value?.published_at || undefined,
      author: storyContent.value?.content?.author,
    }, structuredDataArray)
  }

  // Setup SEO after content is loaded
  watchEffect(() => {
    if (storyContent.value) {
      setupSEO()
    }
  })

  return {
    storyContent,
    isLoading,
  }
}
