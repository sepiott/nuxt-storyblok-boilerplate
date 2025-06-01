# useFooterLinks Composable

A Nuxt 3 composable for fetching footer navigation links from Storyblok. This composable handles footer link data retrieval, filtering, and organization for footer navigation menus.

## Features

- **Storyblok Integration**: Fetches footer links from Storyblok Links API
- **Automatic Filtering**: Filters footer-specific content using `_footer` prefix
- **Sorting**: Sorts links by position for consistent ordering
- **Error Handling**: Graceful fallback to empty state on API errors
- **TypeScript Support**: Fully typed interfaces for better development experience

## Usage

### Basic Implementation

```vue
<template>
  <footer>
    <nav>
      <ul>
        <li v-for="link in footerLinks.links" :key="link.id">
          <NuxtLink :to="link.slug">
            {{ link.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup>
const footerLinks = await useFooterLinks()
</script>
```

### With Error Handling

```vue
<script setup>
try {
  const footerLinks = await useFooterLinks()
  
  // Use footerLinks.links array
  if (footerLinks.links.length === 0) {
    console.log('No footer links available')
  }
} catch (error) {
  console.error('Failed to load footer links:', error)
}
</script>
```

## Return Value

The composable returns a `FooterLinks` object:

```typescript
interface FooterLinks {
  links: FooterLink[]
}

interface FooterLink {
  id: string | number
  name: string
  slug: string
  position: number
}
```

## Content Structure in Storyblok

Footer links should be organized in Storyblok with the following structure:

- Stories/folders starting with `_footer` prefix
- Each footer link should have:
  - **Name**: Display text for the link
  - **Slug**: URL path for the link  
  - **Position**: Numeric value for ordering

## How It Works

1. **API Call**: Fetches all links from Storyblok Links API
2. **Filtering**: Includes only stories/folders starting with `_footer`
3. **Folder Exclusion**: Removes folder items, keeping only content pages
4. **Data Mapping**: Transforms Storyblok link data to simplified structure
5. **Sorting**: Orders links by position value for consistent display
6. **Error Handling**: Returns empty array on API failures

## Preview Mode Support

The composable automatically respects Storyblok preview mode:
- **Draft Mode**: When `previewMode` is enabled, fetches draft content
- **Published Mode**: Otherwise, fetches only published content

## Error Handling

The composable provides robust error handling:
- **Network Failures**: Returns default empty state
- **Missing Data**: Handles missing links gracefully  
- **Invalid Response**: Safely processes malformed API responses
- **Console Logging**: Logs errors for debugging while maintaining functionality

## Default Fallback

When the API fails or returns no data, the composable returns:

```typescript
{
  links: []
}
```

This ensures your footer component never breaks due to API issues.

## Best Practices

- **Async/Await**: Use `await` when calling the composable to ensure data is loaded
- **Error Boundaries**: Wrap in try/catch for custom error handling
- **Loading States**: Consider showing loading indicators while data fetches
- **Fallback Content**: Provide fallback footer content when no links are available
- **Position Values**: Use consistent position numbering in Storyblok for predictable ordering

## Example Storyblok Setup

Create stories in Storyblok with these naming patterns:
- `_footer/privacy-policy`
- `_footer/terms-of-service` 
- `_footer/contact`
- `_footer/about`

Each with appropriate position values (1, 2, 3, 4) for ordering. 