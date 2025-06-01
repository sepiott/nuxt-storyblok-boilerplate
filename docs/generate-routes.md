# Generate Routes Script

A Node.js script that automatically generates route definitions from Storyblok content for static site generation and prerendering. This script fetches all published stories from Storyblok and creates a routes file for Nuxt's build process.

## Features

- **Storyblok Integration**: Fetches routes directly from Storyblok Stories API
- **Folder Detection**: Identifies and excludes folder paths from route generation
- **Pagination Support**: Handles large numbers of stories across multiple API pages
- **Cache Optimization**: Uses Storyblok's cache versioning for optimal performance
- **Error Handling**: Robust error handling with detailed logging
- **Static Generation**: Creates routes file for SSG and ISR

## How It Works

The script performs these operations:

1. **Environment Setup**: Loads environment variables and validates Storyblok token
2. **Cache Version**: Fetches current cache version from Storyblok space
3. **Folder Identification**: Uses Links API to identify folder structures
4. **Story Fetching**: Retrieves all published stories with pagination
5. **Route Filtering**: Excludes folders and includes only content pages
6. **File Generation**: Creates `.routes.js` file with route array

## Usage

### Command Line

```bash
# Generate routes using environment token
npm run generate:routes

# Or with explicit token
STORYBLOK_TOKEN="your_token" npm run generate:routes

# Direct execution
node scripts/generate-routes.js
```

### Package.json Integration

```json
{
  "scripts": {
    "generate:routes": "node scripts/generate-routes.js",
    "build:static": "npm run generate:routes && nuxt generate",
    "build:prerender": "npm run generate:routes && nuxt build --prerender"
  }
}
```

### Build Process Integration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  hooks: {
    'build:before': async () => {
      // Run route generation before build
      await $fetch('/api/generate-routes')
    }
  }
})
```

## Configuration

### Environment Variables

```bash
# .env
STORYBLOK_TOKEN=your_preview_or_public_token
```

### Script Parameters

The script uses these configurable values:

```javascript
const token = process.env.STORYBLOK_TOKEN
const version = 'published'  // Can be 'draft' for preview
const perPage = 100          // Stories per API request
```

## Output

### Generated File Structure

The script creates `.routes.js` in the project root:

```javascript
// .routes.js
export default [
  "/",
  "/about",
  "/blog/first-post",
  "/blog/second-post", 
  "/services/web-development",
  "/contact"
]
```

### Route Filtering Logic

```javascript
// Homepage handling
if (story.full_slug === 'home' || story.full_slug === '') {
  routes.push('/')
}

// Content pages (excluding folders)
if (
  story.full_slug !== 'home' &&
  story.full_slug !== '' &&
  !folderPaths.has(story.full_slug)
) {
  routes.push('/' + story.full_slug)
}
```

## Integration with Nuxt

### Static Generation

```typescript
// nuxt.config.ts
import routes from './.routes.js'

export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes
    }
  }
})
```

### ISR Configuration

```typescript
// nuxt.config.ts  
import routes from './.routes.js'

export default defineNuxtConfig({
  nitro: {
    experimental: {
      wasm: true
    }
  },
  routeRules: {
    // Generate static routes from Storyblok
    ...routes.reduce((acc, route) => {
      acc[route] = { isr: 60 } // ISR with 60 second cache
      return acc
    }, {})
  }
})
```

## Pagination Handling

### Large Content Volumes

The script handles pagination automatically:

```javascript
const total = storiesResponse.headers.total
const perPage = 100
const pages = Math.ceil(total / perPage)

// Fetch additional pages if needed
if (pages > 1) {
  for (let page = 2; page <= pages; page++) {
    const pageResponse = await axios.get(/* paginated request */)
    // Process additional stories
  }
}
```

### Performance Optimization

- **Concurrent Requests**: Could be enhanced with concurrent page fetching
- **Cache Headers**: Respects Storyblok's cache versioning
- **Error Recovery**: Individual page failures don't stop the entire process

## Content Structure Support

### Folder Organization

The script properly handles Storyblok folder structures:

```
Storyblok Structure:
├── home (story)
├── about (story)
├── blog/ (folder)
│   ├── post-1 (story)
│   └── post-2 (story)
└── services/ (folder)
    └── web-dev (story)

Generated Routes:
["/", "/about", "/blog/post-1", "/blog/post-2", "/services/web-dev"]
```

### Content Types

Works with any Storyblok content type:
- **Pages**: Standard website pages
- **Blog Posts**: Article content
- **Products**: E-commerce items
- **Custom Types**: Any custom content structure

## Error Handling

### Token Validation

```javascript
if (!token) {
  console.error('🔴 Error: STORYBLOK_TOKEN environment variable is not set.')
  process.exit(1)
}
```

### API Error Recovery

```javascript
try {
  const pageResponse = await axios.get(/* API request */)
  // Process response
} catch (pageError) {
  console.warn(`Error fetching page ${page}: ${pageError.message}`)
  // Continue with other pages
}
```

### Network Resilience

- **Graceful Degradation**: Continues processing if individual requests fail
- **Detailed Logging**: Provides clear error messages and debugging info
- **Exit Codes**: Proper exit codes for CI/CD integration

## Logging and Debugging

### Verbose Output

```bash
Fetching routes from Storyblok...
Fetching links to identify folders...
Identified 3 folder paths: blog, services, navigation
Fetching stories with actual content...
Found 25 stories in Storyblok
Adding route: / (homepage)
Adding route: /about (page)
Adding route: /blog/hello-world (page)
Skipping folder path: /blog
✅ Generated 23 routes from Storyblok
Routes written to: /project/.routes.js
```

### Debug Information

- **Folder Detection**: Lists identified folder paths
- **Route Processing**: Shows each route being added or skipped
- **Final Count**: Confirms total routes generated
- **File Location**: Shows where routes file was written

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Deploy
jobs:
  build:
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm install
      - name: Generate routes
        run: npm run generate:routes
        env:
          STORYBLOK_TOKEN: ${{ secrets.STORYBLOK_TOKEN }}
      - name: Build
        run: npm run build
```

### Netlify/Vercel

```bash
# Build command
npm run generate:routes && npm run build

# Environment variables
STORYBLOK_TOKEN=your_token
```

## Best Practices

### Performance
- Run route generation before builds, not during
- Cache the generated routes file when possible
- Use ISR instead of full static generation for large sites

### Content Management
- Use consistent slug patterns in Storyblok
- Avoid deep folder nesting (3+ levels)
- Keep folder/content distinction clear

### Development
- Test with both preview and published content
- Validate routes after content structure changes
- Monitor API rate limits for large content volumes

### Production
- Use preview tokens for draft content generation
- Implement route validation in build process
- Set up monitoring for route generation failures

This script provides the foundation for efficient static site generation from Storyblok content, ensuring all published content is properly included in your build process. 