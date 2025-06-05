import type { IStaticMethods } from 'preline/dist'

declare global {
  interface Window {
    // Preline UI
    HSStaticMethods: IStaticMethods
    // Storyblok Bridge
    StoryblokBridge: unknown
  }
}

// Extend the runtime config for Storyblok
declare module 'nuxt/schema' {
  interface RuntimeConfig {
    public: {
      storyblokVersion: string
      previewMode: boolean
    }
  }
}

// Re-export Storyblok types globally
export * from './storyblok'

export {}
