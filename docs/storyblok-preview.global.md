# Storyblok Preview Middleware

A global Nuxt 3 middleware that handles Storyblok preview mode activation and URL cleanup. This middleware automatically detects Storyblok preview parameters and enables preview mode for content editors.

## Features

- **Automatic Preview Detection**: Detects `_storyblok` query parameters
- **Global Activation**: Sets preview mode for the entire session
- **URL Cleanup**: Removes preview parameters from URLs for clean navigation
- **Session Persistence**: Maintains preview state across page navigations
- **Client-Side Only**: URL cleanup only happens on the client to prevent SSR issues

## How It Works

The middleware runs on every route change and:

1. **Checks for Preview Parameters**: Looks for `_storyblok` in the URL query string
2. **Activates Preview Mode**: Sets `config.public.previewMode = true` when detected
3. **Cleans URLs**: Removes `_storyblok` and `_storyblok_tk` parameters from the URL
4. **Prevents Duplicate Navigation**: Avoids unnecessary redirects when no query parameters remain

## Implementation

The middleware is automatically loaded as `middleware/storyblok-preview.global.ts`:

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()

  // Check if the preview parameter is present in the URL
  const isPreviewMode = to.query._storyblok !== undefined

  // If preview query parameter exists, set preview mode
  if (isPreviewMode && !config.public.previewMode) {
    // Save the preview state for the session
    config.public.previewMode = true

    // Remove the preview query parameters to clean the URL
    if (import.meta.client) {
      const newQuery = { ...to.query }
      delete newQuery._storyblok
      delete newQuery._storyblok_tk

      // Navigate to the same path without the preview parameters
      return navigateTo({
        path: to.path,
        query: Object.keys(newQuery).length ? newQuery : undefined,
      })
    }
  }
})
```

## Usage

### Storyblok Editor Integration

When content editors click "Open in new tab" or preview links in Storyblok, URLs contain preview parameters:

```
https://yoursite.com/some-page?_storyblok=123456789
```

The middleware automatically:
1. Detects the `_storyblok` parameter
2. Enables preview mode for the session
3. Redirects to clean URL: `https://yoursite.com/some-page`

### Preview Mode Effects

When preview mode is active:
- **Draft Content**: Composables fetch draft content from Storyblok
- **Real-time Updates**: Storyblok Bridge enables live editing
- **Visual Editor**: Content can be edited directly in the browser

### Manual Preview Activation

You can also manually activate preview mode by adding the parameter:

```
https://yoursite.com/?_storyblok=1
```

## Configuration

### Runtime Config

The middleware uses Nuxt's runtime configuration:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      previewMode: false, // Default state
      // ... other config
    }
  }
})
```

### Environment Variables

Configure preview behavior through environment variables:

```bash
# .env
STORYBLOK_PREVIEW=true  # Enable preview by default (optional)
STORYBLOK_TOKEN=your_preview_token
```

## Integration with Composables

The middleware works seamlessly with Storyblok composables:

### useStoryblokPage
```typescript
const { storyContent } = await useStoryblokPage({
  // Automatically uses preview mode when active
})
```

### Direct API Calls
```typescript
const config = useRuntimeConfig()
const version = config.public.previewMode ? 'draft' : 'published'

const { data } = await useStoryblokApi().get('cdn/stories/home', {
  version
})
```

## URL Parameter Details

### _storyblok
- **Purpose**: Activates preview mode
- **Value**: Usually a timestamp or story ID
- **Behavior**: Removed after processing

### _storyblok_tk  
- **Purpose**: Preview token for authentication
- **Value**: Storyblok-generated token
- **Behavior**: Removed after processing

## Client-Side Only

URL cleanup only happens on the client side to:
- Prevent SSR/hydration mismatches
- Avoid server-side redirects
- Ensure smooth preview experience

## Best Practices

### For Developers
- **Testing**: Use `?_storyblok=1` to test preview mode locally
- **Debugging**: Check `config.public.previewMode` to verify state
- **Components**: Always respect preview mode in custom API calls

### For Content Editors
- **Preview Links**: Use Storyblok's built-in preview functionality
- **Live Editing**: Edit content directly in the visual editor
- **URL Sharing**: Share clean URLs - preview state persists in session

### For Production
- **Security**: Ensure preview tokens are not exposed in production builds
- **Performance**: Preview mode may be slower due to draft content
- **Caching**: Consider different caching strategies for preview vs. published content

## Troubleshooting

### Preview Mode Not Activating
```typescript
// Check if middleware is running
console.log('Preview mode:', useRuntimeConfig().public.previewMode)
```

### URL Parameters Not Removed
- Ensure JavaScript is enabled in the browser
- Check for client-side navigation errors
- Verify middleware is loaded as `.global.ts`

### Draft Content Not Loading
- Verify `STORYBLOK_TOKEN` has preview permissions
- Check composable implementations use preview mode
- Ensure Storyblok Bridge is properly initialized

## Security Considerations

- **Token Security**: Preview tokens should not be exposed to unauthorized users
- **Production Safety**: Preview mode should be disabled in production unless explicitly needed
- **Access Control**: Consider implementing additional access controls for preview mode

This middleware provides a seamless preview experience for Storyblok content editors while maintaining clean URLs for end users. 