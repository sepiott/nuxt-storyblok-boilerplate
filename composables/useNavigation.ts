/**
 * Navigation composable to fetch and organize navigation items from Storyblok
 * @returns {Promise<NavData>} Navigation data with organized items
 */
import { useStoryblokApi } from '@storyblok/vue'
import type { ISbLink, ISbStoryData } from 'storyblok-js-client'

interface NavItem {
  id: string | number
  name: string
  description: string
  icon: string
  slug: string
  category: string
  isFolder: boolean
  categoryName: string
  position: number
  isRootLevel: boolean
}

interface NavData {
  navItems: NavItem[]
  groupedNavItems: Record<string, NavItem[]>
  rootItems: NavItem[]
}

// Default navigation data to use in case of API failure
const defaultNavData: NavData = {
  navItems: [],
  groupedNavItems: {},
  rootItems: [],
}

/**
 * Fetches and organizes navigation items from Storyblok Links API
 * @returns {Promise<NavData>} Navigation data with all items and grouped items
 */
export const useNavigation = async (): Promise<NavData> => {
  const storyblokApi = useStoryblokApi()
  const config = useRuntimeConfig()
  const isPreview = config.public.previewMode

  try {
    const { data } = await storyblokApi.get('cdn/links', {
      version: isPreview ? 'draft' : 'published',
    })

    if (!data.links) {
      return defaultNavData
    }

    // Convert links object to array and filter out home
    const allLinks = Object.values(data.links)
      .filter((link: ISbLink) => {
        // Filter out home page and any items starting with underscore
        if (link.slug === 'home' || link.name?.startsWith('_') || link.slug?.startsWith('_')) {
          return false
        }
        return true
      })
      .sort((a: ISbLink, b: ISbLink) => (a.position || 0) - (b.position || 0))

    // Find top-level folders (parent_id is 0, null, or undefined)
    const topLevelFolders = allLinks.filter((link: ISbLink) =>
      link.is_folder && (link.parent_id === 0 || link.parent_id === null || link.parent_id === undefined),
    )

    // Get IDs of nested folders (folders that have a parent folder)
    const nestedFolderIds = new Set(
      allLinks
        .filter((link: ISbLink) => link.is_folder && link.parent_id && link.parent_id !== 0)
        .map((link: ISbLink) => link.id),
    )

    // Filter out nested folders and their contents, then re-sort to maintain position order
    const linksArray = allLinks
      .filter((link: ISbLink) => {
        // Exclude nested folders themselves
        if (link.is_folder && nestedFolderIds.has(link.id)) {
          return false
        }

        // Exclude content that belongs to nested folders
        if (!link.is_folder && link.parent_id && nestedFolderIds.has(link.parent_id)) {
          return false
        }

        return true
      })
      .sort((a: ISbLink, b: ISbLink) => (a.position || 0) - (b.position || 0)) // Re-sort after filtering

    // Create a lookup map for finding parent folders (only top-level ones)
    const linkMap = new Map<number, ISbLink>()
    topLevelFolders.forEach((link: ISbLink) => {
      if (link.id) {
        linkMap.set(link.id, link)
      }
    })

    const navItems = linksArray.map((link: ISbLink) => {
      // Check if the link is a folder or under a folder
      let category = 'root'
      let categoryName = 'Root'
      let isRootLevel = false

      if (link.is_folder) {
        category = (link.name || '').toLowerCase().replace(/\s+/g, '-')
        categoryName = link.name || ''
      }
      else if (link.parent_id && linkMap.has(link.parent_id)) {
        // If it's a nested item, get its parent folder (only top-level folders)
        const parentFolder = linkMap.get(link.parent_id)
        if (parentFolder && parentFolder.is_folder) {
          category = (parentFolder.name || '').toLowerCase().replace(/\s+/g, '-')
          categoryName = parentFolder.name || ''
        }
      }
      else {
        // This is a root-level page (not a folder, no parent)
        isRootLevel = true
        category = 'root'
        categoryName = 'Root'
      }

      // Normalize slug for Nuxt routing
      const slug = (link.slug || '').endsWith('/') ? (link.slug || '').slice(0, -1) : (link.slug || '')

      return {
        name: link.name || '',
        description: '', // Will be enriched from story content
        icon: '', // Will be enriched from story content
        slug,
        id: link.id || '',
        category,
        categoryName,
        isFolder: link.is_folder || false,
        position: link.position || 0,
        isRootLevel,
      }
    })

    // Enrich navigation items with story content (icon and description) for non-folder items
    const nonFolderItems = navItems.filter(item => !item.isFolder)

    if (nonFolderItems.length > 0) {
      try {
        // Get all slugs for non-folder items
        const slugs = nonFolderItems.map(item => item.slug).join(',')

        // Fetch stories by slugs to get icon and description
        const { data: storiesData } = await storyblokApi.get('cdn/stories', {
          version: isPreview ? 'draft' : 'published',
          by_slugs: slugs,
        })

        // Create a map of slug to story content for quick lookup
        const storyContentMap = new Map()
        if (storiesData.stories) {
          storiesData.stories.forEach((story: ISbStoryData) => {
            const storySlug = story.full_slug.endsWith('/')
              ? story.full_slug.slice(0, -1)
              : story.full_slug
            storyContentMap.set(storySlug, story.content)
          })
        }

        // Enrich navItems with icon and description from story content
        navItems.forEach((item) => {
          if (!item.isFolder && storyContentMap.has(item.slug)) {
            const content = storyContentMap.get(item.slug)
            item.description = content?.description || ''
            item.icon = content?.icon || ''
          }
        })
      }
      catch (enrichError) {
        console.warn('Failed to enrich navigation with story content:', enrichError)
        // Continue without enrichment - navigation will still work with empty icons/descriptions
      }
    }

    // Group nav items by their category, maintaining position-based order within each group
    const groupedNavItems = navItems.reduce((acc: Record<string, NavItem[]>, item: NavItem) => {
      // Skip folders themselves and root-level items from appearing in grouped lists
      if (item.isFolder || item.isRootLevel) return acc

      if (!acc[item.category]) {
        acc[item.category] = []
      }

      acc[item.category].push(item)
      return acc
    }, {})

    // Sort items within each category by position to ensure consistent ordering
    Object.keys(groupedNavItems).forEach((category) => {
      groupedNavItems[category].sort((a: NavItem, b: NavItem) => (a.position || 0) - (b.position || 0))
    })

    // Create an ordered object where categories are sorted by their parent folder position
    const orderedGroupedNavItems: Record<string, NavItem[]> = {}

    // Get category order based on parent folder positions
    const categoryOrder = topLevelFolders
      .sort((a: ISbLink, b: ISbLink) => (a.position || 0) - (b.position || 0))
      .map((folder: ISbLink) => (folder.name || '').toLowerCase().replace(/\s+/g, '-'))

    // Add categories in the correct order (folders first)
    categoryOrder.forEach((category) => {
      if (groupedNavItems[category]) {
        orderedGroupedNavItems[category] = groupedNavItems[category]
      }
    })

    // Extract root-level items (pages not in folders, excluding folders themselves)
    const rootItems = navItems
      .filter(item => item.isRootLevel && !item.isFolder)
      .sort((a: NavItem, b: NavItem) => (a.position || 0) - (b.position || 0))

    return {
      navItems,
      groupedNavItems: orderedGroupedNavItems,
      rootItems,
    }
  }
  catch (error) {
    console.error('Error fetching navigation data from Storyblok:', error)
    // Return default navigation data so UI doesn't break
    return defaultNavData
  }
}
