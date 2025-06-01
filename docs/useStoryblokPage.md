# useStoryblokPage Composable

A reusable Nuxt 3 composable that handles Storyblok page loading, SEO setup, and real-time editing for both home and dynamic pages.

## Features

- **Unified Page Loading**: Handles both home page and dynamic slug-based pages
- **Automatic SEO Setup**: Configures meta tags, structured data, and Open Graph
- **Real-time Editing**: Integrates Storyblok Bridge for preview mode
- **Slug Validation**: Optional validation for content paths (excludes system paths)
- **Error Handling**: Proper 404 handling for missing pages
- **Story Provision**: Automatically provides story data to child components

## Usage

### Home Page

```vue
<script setup>
const { storyContent } = await useStoryblokPage({ 
  isHomePage: true 
})
</script>

<template>
  <StoryblokComponent
    v-if="storyContent"
    :blok="storyContent.content"
  />
</template>
```

### Dynamic Pages (with validation)

```vue
<script setup>
const { storyContent } = await useStoryblokPage({ 
  enableValidation: true 
})
</script>

<template>
  <StoryblokComponent
    v-if="storyContent && storyContent.content"
    :blok="storyContent.content"
  />
</template>
```

### Custom Slug

```vue
<script setup>
const { storyContent } = await useStoryblokPage({ 
  slug: 'custom/path/to/content'
})
</script>
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `isHomePage` | `boolean` | `false` | Forces loading of the 'home' story |
| `enableValidation` | `boolean` | `false` | Validates slug against excluded patterns |
| `slug` | `string` | `undefined` | Custom slug to load (overrides route params) |

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `storyContent` | `Ref<any>` | Reactive reference to the loaded Storyblok story |
| `isLoading` | `Ref<boolean>` | Loading state indicator |

## SEO Features

The composable automatically handles:

- **Meta Tags**: Title, description, and Open Graph tags
- **Structured Data**: Website, Organization, Article, or WebPage schemas
- **Images**: Extracts and optimizes featured images from content
- **Social Sharing**: Proper Open Graph and Twitter Card setup

### Home Page SEO
- Generates Website and Organization structured data
- Uses site-level fallbacks for meta information
- Includes search action for enhanced search results

### Regular Pages SEO
- Detects content type (Article vs WebPage)
- Extracts meta information from content
- Includes publication and modification dates

## Slug Validation

When `enableValidation: true`, the following patterns are excluded:

- `.well-known/*` - Browser well-known paths
- `_nuxt/*` - Nuxt internal paths
- `*.json` - JSON configuration files
- `.git/*`, `.github/*` - Git-related paths
- `assets/*`, `images/*` - Static resource paths

## Error Handling

- Returns 404 for missing stories
- Provides context-specific error messages
- Handles Storyblok API failures gracefully

## Dependencies

- `@storyblok/vue` - Storyblok Bridge integration
- `useSEO` - Custom SEO composable
- Standard Nuxt composables (auto-imported)

## Example: Before and After

### Before (93 lines)
```vue
<script setup>
import { useStoryblokBridge } from '@storyblok/vue'

const config = useRuntimeConfig()
const { setPageSEO, generateStructuredData, getImageFromStoryblok, getFirstImageFromContent } = useSEO()
const storyContent = ref(null)

// Load the home page story from Storyblok
const { data: initialStory, error } = await useAsyncData('home', () => {
  const version = config.public.previewMode ? 'draft' : config.public.storyblokVersion
  return useStoryblokApi().get('cdn/stories/home', { version })
    .catch((e) => {
      console.error(`Failed to load home page: ${e.message}`)
      return { data: { story: null } }
    })
})

// ... 70+ more lines of setup code
</script>
```

### After (10 lines)
```vue
<script setup>
const { storyContent } = await useStoryblokPage({ 
  isHomePage: true 
})
</script>

<template>
  <StoryblokComponent
    v-if="storyContent"
    :blok="storyContent.content"
  />
</template>
```

## Benefits

- **DRY Principle**: Eliminates code duplication between pages
- **Maintainability**: Centralized logic for all Storyblok pages
- **Type Safety**: TypeScript interfaces for better development experience
- **Performance**: Optimized loading and caching strategies
- **Consistency**: Uniform SEO and error handling across all pages 