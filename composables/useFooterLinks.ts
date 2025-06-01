/**
 * Footer links composable to fetch footer navigation items from Storyblok
 * @returns {Promise<FooterLinks>} Footer navigation data
 */
import { useStoryblokApi } from '@storyblok/vue'
import type { ISbLink } from 'storyblok-js-client'
import { useRuntimeConfig } from '#app'

interface FooterLink {
  id: string | number
  name: string
  slug: string
  position: number
}

interface FooterLinks {
  links: FooterLink[]
}

const defaultFooterLinks: FooterLinks = {
  links: [],
}

export const useFooterLinks = async (): Promise<FooterLinks> => {
  const storyblokApi = useStoryblokApi()
  const config = useRuntimeConfig()
  const isPreview = config.public.previewMode

  try {
    const { data } = await storyblokApi.get('cdn/links', {
      version: isPreview ? 'draft' : 'published',
      starts_with: '_footer',
    })

    if (!data.links) {
      return defaultFooterLinks
    }

    // Convert links object to array and sort by position
    const footerLinks = Object.values(data.links)
      .filter((link: ISbLink) => !link.is_folder)
      .map((link: ISbLink) => ({
        id: link.id || '',
        name: link.name || '',
        slug: link.real_path || link.slug || '',
        position: link.position || 0,
      }))
      .sort((a, b) => a.position - b.position)

    return {
      links: footerLinks,
    }
  }
  catch (error) {
    console.error('Error fetching footer links from Storyblok:', error)
    return defaultFooterLinks
  }
}
