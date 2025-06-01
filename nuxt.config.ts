// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProduction = process.env.NODE_ENV === 'production'
const isStoryblokPreviewEnv = process.env.STORYBLOK_PREVIEW === 'true'

// Function to load routes
async function loadRoutes() {
  const routesPath = path.resolve(__dirname, '.routes.js')
  if (fs.existsSync(routesPath)) {
    try {
      const routesModule = await import(routesPath)
      return routesModule.default
    }
    catch (error) {
      console.warn('Could not import Storyblok routes:', error)
      return []
    }
  }
  return []
}

// Add declaration to extend NuxtConfig type with image property
declare module 'nuxt/schema' {
  interface NuxtConfig {
    image?: {
      storyblok?: {
        baseURL: string
      }
      quality?: number
      format?: string[]
      screens?: {
        [key: string]: number
      }
    }
    generate?: {
      routes?: string[]
    }
  }
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.STORYBLOK_TOKEN,
        componentsDir: '~/storyblok',
        apiOptions: {
          region: '', // Set 'US" if your space is created in US region (EU default)
          cache: {
            type: 'memory',
          },
        },
        useApiClient: true,
        bridge: true, // Enable the Storyblok bridge for real-time preview
        devtools: true, // Enable Storyblok devtools for better debugging
      },
    ],
  ],
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/storyblok', pathPrefix: false, global: true },
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
  css: [
    '@/assets/css/fonts.css',
    '@/assets/css/tailwind.css',
    '@/assets/css/richtext.css',
    '@/assets/css/utilities.css',
  ],
  runtimeConfig: {
    storyblokToken: process.env.STORYBLOK_TOKEN,
    public: {
      storyblokVersion: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
      previewMode: process.env.STORYBLOK_PREVIEW === 'true',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      siteName: 'Nuxt + Storyblok Boilerplate',
      siteDescription: 'A comprehensive boilerplate for Nuxt and Storyblok.',
    },
  },
  compatibilityDate: '2025-05-15',
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/api/**': { cors: true },
      '/robots.txt': { headers: { 'Content-Type': 'text/plain' } },
      '/sitemap.xml': { headers: { 'Content-Type': 'application/xml' } },
      '/**': {
        ...(isProduction
          ? { // Production settings
              isr: 60 * 60,
              headers: {
                'X-Frame-Options': 'DENY',
                'X-Content-Type-Options': 'nosniff',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
              },
            }
          : { // Non-production settings (dev, preview)
              // No ISR for non-production
              headers: {
                'X-Frame-Options': isStoryblokPreviewEnv ? 'ALLOW-FROM https://app.storyblok.com' : 'SAMEORIGIN',
                'X-Content-Type-Options': 'nosniff', // Kept for non-production
                'Referrer-Policy': 'strict-origin-when-cross-origin', // Kept for non-production
              },
            }
        ),
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['vue', '@storyblok/vue'],
    },
    build: {
      sourcemap: true,
    },
    css: {
      devSourcemap: true,
    },
  },
  hooks: {
    'nitro:config': async (nitroConfig) => {
      const routes = await loadRoutes()
      if (nitroConfig.prerender) {
        nitroConfig.prerender.routes = routes
      }
      else {
        nitroConfig.prerender = { routes }
      }
    },
  },
  image: {
    storyblok: {
      baseURL: 'https://a.storyblok.com',
    },
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
})
