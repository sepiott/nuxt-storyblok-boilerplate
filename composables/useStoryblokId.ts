import type { Ref, ComputedRef } from 'vue'
import type { StoryblokBlok } from '~/types/storyblok'

/**
 * Generates a consistent ID for Storyblok components
 * Uses title as slug if available, otherwise falls back to component-uid format
 *
 * @param blok - The Storyblok component data
 * @returns A string ID suitable for HTML elements
 */
export const useStoryblokId = (blok: StoryblokBlok): string => {
  if (blok.title && typeof blok.title === 'string') {
    // Convert title to slug format (lowercase, replace spaces with hyphens, remove special chars)
    return blok.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return `${blok.component}-${blok._uid}`
}

/**
 * Reactive composable version that returns a computed ref
 * Useful when the blok might change reactively
 *
 * @param blok - Reactive reference to Storyblok component data
 * @returns A computed ref containing the generated ID
 */
export const useReactiveStoryblokId = (blok: Ref<StoryblokBlok> | ComputedRef<StoryblokBlok>) => {
  return computed(() => useStoryblokId(unref(blok)))
}
