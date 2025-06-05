// Generic Storyblok component types for boilerplate
// These provide type safety without requiring generated types from a specific CMS space

import type { SbBlokData } from '@storyblok/vue'

export interface StoryblokAsset {
  filename?: string
  alt?: string
  title?: string
  name?: string
  focus?: string
  source?: string
  copyright?: string
}

export interface StoryblokLink {
  url?: string
  target?: '_blank' | '_self'
  linktype?: 'url' | 'story' | 'asset' | 'email'
  cached_url?: string
  story?: {
    url?: string
    name?: string
  }
}

export interface StoryblokRichText {
  type?: string
  content?: StoryblokRichText[]
  marks?: Array<{
    type: string
    attrs?: Record<string, unknown>
  }>
  attrs?: Record<string, unknown>
  text?: string
}

// Base interface for all Storyblok components
export interface StoryblokBlok extends SbBlokData {
  _uid: string
  component: string
  _editable?: string
}

// Generic component props interface
export interface StoryblokComponentProps<T = Record<string, unknown>> {
  blok: StoryblokBlok & T
}

// Content component interfaces
export interface HeroBlok extends StoryblokBlok {
  component: 'hero'
  title?: string
  subline?: string
  image?: StoryblokAsset
}

export interface HeroSimpleBlok extends StoryblokBlok {
  component: 'hero_simple'
  title?: string
  subline?: string
}

export interface TextBlok extends StoryblokBlok {
  component: 'text'
  title?: string
  text?: string
}

export interface QuoteBlok extends StoryblokBlok {
  component: 'quote'
  quote?: string
  author?: string
  author_title?: string
}

export interface ImageBlok extends StoryblokBlok {
  component: 'image'
  title?: string
  image?: StoryblokAsset
}

// Container component interfaces
export interface AccordionRowBlok extends StoryblokBlok {
  title?: string
  first_active?: boolean
  body?: StoryblokBlok[]
}

export interface AccordionBlok extends StoryblokBlok {
  component: 'accordion'
  title?: string
  rows?: AccordionRowBlok[]
}

export interface GridBlok extends StoryblokBlok {
  component: 'grid'
  columns?: StoryblokBlok[]
}

// Section component interfaces
export interface TeaserSectionBlok extends StoryblokBlok {
  component: 'teaser_section'
  title?: string
  description?: string
  path?: string
}

// Page type interfaces
export interface PageBlok extends StoryblokBlok {
  component: 'page'
  body?: StoryblokBlok[]
}

// Union type for all component bloks
export type AnyStoryblokBlok =
  | HeroBlok
  | HeroSimpleBlok
  | TextBlok
  | QuoteBlok
  | ImageBlok
  | AccordionBlok
  | GridBlok
  | TeaserSectionBlok
  | PageBlok

// Generic component props with specific blok types
export type StoryblokProps<T extends StoryblokBlok = StoryblokBlok> = {
  blok: T
}

// Additional props that some components might receive
export interface ExtendedStoryblokProps<T extends StoryblokBlok = StoryblokBlok> extends StoryblokProps<T> {
  pageType?: string
  isFirstOfType?: boolean
}

// Storyblok API response types
export interface StoryblokStory {
  id: number
  name: string
  slug: string
  full_slug: string
  uuid: string
  created_at: string
  published_at: string
  first_published_at: string
  content: StoryblokBlok
  is_startpage: boolean
  parent_id?: number
  group_id?: string
  alternates?: Array<{
    id: number
    name: string
    slug: string
    published: boolean
    is_folder: boolean
    parent_id: number
    group_id: string
    position: number
  }>
  translated_slugs?: Array<{
    path: string
    name: string
    lang: string
  }>
}

export interface StoryblokApiResponse<T = StoryblokBlok> {
  story: StoryblokStory & {
    content: T
  }
  cv: number
  rels: unknown[]
  links: unknown[]
}

export interface StoryblokStoriesResponse {
  stories: StoryblokStory[]
  cv: number
  rels: unknown[]
  links: unknown[]
}
