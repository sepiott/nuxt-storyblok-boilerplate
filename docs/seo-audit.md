# SEO Audit Script

A comprehensive Node.js script that performs automated SEO auditing for your Nuxt application. This script checks essential SEO files, configuration, and implementation status to ensure optimal search engine optimization.

## Features

- **File System Checks**: Validates presence of essential SEO files
- **Configuration Auditing**: Checks Nuxt configuration for SEO settings
- **Implementation Status**: Reports on SEO feature implementation
- **Performance Analysis**: Reviews optimization settings
- **Actionable Recommendations**: Provides next steps for improvement

## How It Works

The script performs comprehensive checks across multiple areas:

1. **Essential Files**: Verifies presence of robots.txt, sitemap, manifests, etc.
2. **Favicon Suite**: Checks for complete favicon implementation
3. **Configuration**: Analyzes nuxt.config.ts for SEO settings
4. **Implementation**: Reports on SEO composable and meta tag usage
5. **Performance**: Reviews optimization and security settings

## Usage

### Command Line

```bash
# Run SEO audit
npm run seo:audit

# Or direct execution
node scripts/seo-audit.js

# With verbose output
node scripts/seo-audit.js --verbose
```

### Package.json Integration

```json
{
  "scripts": {
    "seo:audit": "node scripts/seo-audit.js",
    "build:audit": "npm run seo:audit && npm run build",
    "deploy:check": "npm run seo:audit && npm run lint && npm run test"
  }
}
```

## Audit Categories

### 📁 Essential SEO Files

The script checks for these critical files:

```bash
✅ robots.txt exists
✅ Dynamic sitemap generator exists  
✅ Web app manifest exists
✅ SEO composable exists
❌ Default Open Graph image exists (placeholder)
```

**Files Checked:**
- `public/robots.txt` - Search engine crawling rules
- `server/api/sitemap.xml.get.ts` - Dynamic sitemap generation
- `public/site.webmanifest` - Web app manifest
- `composables/useSEO.ts` - SEO composable
- `public/images/og-default.png` - Default social media image

### 📄 Favicon Files

Complete favicon implementation check:

```bash
✅ favicon.ico exists
✅ 16x16 favicon exists
✅ 32x32 favicon exists  
✅ Apple touch icon exists
```

**Files Checked:**
- `public/favicons/favicon.ico` - Standard favicon
- `public/favicons/favicon-16x16.png` - Small favicon
- `public/favicons/favicon-32x32.png` - Standard favicon
- `public/favicons/apple-touch-icon.png` - Apple device icon

### ⚙️ Configuration Checks

Analyzes `nuxt.config.ts` for SEO configuration:

```bash
✅ HTML charset meta tag configured
✅ Viewport meta tag configured
✅ Site URL configured in runtime config
✅ Security headers configured
✅ Asset compression enabled
```

**Configuration Areas:**
- HTML meta tags (charset, viewport)
- Runtime config (siteUrl, siteName)
- Security headers (X-Frame-Options, CSP)
- Performance optimization (compression)

## Output Format

### Success Indicators
- **✅ Green Checkmarks**: Feature properly implemented
- **File Paths**: Shows exactly what was checked
- **Configuration Keys**: Indicates which settings were found

### Failure Indicators  
- **❌ Red X Marks**: Missing or misconfigured features
- **File Locations**: Shows where files should be located
- **Missing Settings**: Indicates what configuration is needed

### Example Output

```bash
🔍 SEO Audit Report

📁 Essential SEO Files:
✅ robots.txt exists
✅ Dynamic sitemap generator exists
✅ Web app manifest exists
✅ SEO composable exists
❌ Default Open Graph image exists (placeholder)

📄 Favicon Files:
✅ favicon.ico exists
✅ 16x16 favicon exists
✅ 32x32 favicon exists
✅ Apple touch icon exists

⚙️ Configuration Checks:
✅ HTML charset meta tag configured
✅ Viewport meta tag configured
✅ Site URL configured in runtime config
✅ Security headers configured
✅ Asset compression enabled

🎯 SEO Implementation Status:
✅ Open Graph meta tags implemented
✅ Twitter Cards implemented
✅ JSON-LD structured data implemented
✅ Canonical URLs implemented
✅ Article-specific meta tags for blog posts
✅ Image optimization with WebP support
✅ ISR caching for performance

🚀 Performance Optimizations:
✅ Image compression and modern formats (WebP)
✅ Asset compression enabled
✅ Incremental Static Regeneration (ISR)
✅ Security headers configured

📝 Next Steps to Complete SEO Setup:
1. Update site URL in environment variables (NUXT_PUBLIC_SITE_URL)
2. Update social media links in organizationSchema
3. Test with Google Search Console and PageSpeed Insights
4. Add hreflang tags if supporting multiple languages
5. Consider adding JSON-LD for breadcrumbs navigation

✨ SEO audit completed! Your site now has comprehensive SEO optimization.
```

## File Structure Validation

### Required Files
```
project-root/
├── public/
│   ├── robots.txt
│   ├── site.webmanifest
│   ├── favicons/
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   └── apple-touch-icon.png
│   └── images/
│       └── og-default.png
├── server/api/
│   └── sitemap.xml.get.ts
├── composables/
│   └── useSEO.ts
└── nuxt.config.ts
```

### Optional Enhancements
```
public/
├── favicons/
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   └── safari-pinned-tab.svg
└── images/
    ├── og-home.png
    ├── og-blog.png
    └── og-default.webp
```

## Configuration Analysis

### Nuxt Config Checks

The script analyzes these configuration areas:

```typescript
// nuxt.config.ts elements checked
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',           // ✅ Charset check
      viewport: 'width=device-width, initial-scale=1' // ✅ Viewport check
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://yoursite.com',  // ✅ Site URL check
      siteName: 'Your Site Name'        // Configuration validation
    }
  },
  nitro: {
    routeRules: {
      '/**': { 
        headers: { 
          'X-Frame-Options': 'DENY'     // ✅ Security headers check
        }
      }
    },
    compressPublicAssets: true          // ✅ Compression check
  }
})
```

## Integration with CI/CD

### GitHub Actions

```yaml
name: SEO Audit
on: [push, pull_request]

jobs:
  seo-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm install
      - name: Run SEO audit
        run: npm run seo:audit
      - name: Fail on missing SEO files
        run: |
          if grep -q "❌" seo-audit.log; then
            echo "SEO audit failed - missing required files"
            exit 1
          fi
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run seo:audit && npm run lint-staged"
    }
  }
}
```

## Customization

### Adding Custom Checks

```javascript
// Add custom file checks
const customChecks = [
  { file: 'public/ads.txt', description: 'Google Ads verification file' },
  { file: 'public/.well-known/security.txt', description: 'Security policy file' }
]

customChecks.forEach(check => {
  checkFile(check.file, check.description)
})
```

### Environment-Specific Audits

```javascript
const environment = process.env.NODE_ENV

if (environment === 'production') {
  // Production-specific checks
  checkFile('public/googleXXXX.html', 'Google Search Console verification')
  checkFile('public/BingSiteAuth.xml', 'Bing Webmaster verification')
}
```

## Best Practices

### Development Workflow
- Run audit before every deployment
- Include in pull request checks
- Monitor audit results in CI/CD
- Fix issues immediately when detected

### File Management
- Keep favicons in dedicated folder
- Use consistent naming conventions
- Optimize images for web delivery
- Maintain favicon generator consistency

### Configuration
- Set up environment-specific configs
- Use runtime config for dynamic values
- Implement proper security headers
- Enable compression and optimization

### Monitoring
- Schedule regular audits
- Track improvements over time
- Set up alerts for missing files
- Monitor configuration drift

## Troubleshooting

### Common Issues

```bash
# File not found errors
❌ robots.txt exists
# Solution: Create public/robots.txt

# Configuration missing
❌ Site URL configured in runtime config  
# Solution: Add siteUrl to runtimeConfig.public

# Security headers missing
❌ Security headers configured
# Solution: Add headers to nitro.routeRules
```

### Debugging

```javascript
// Add debug mode
const debug = process.argv.includes('--debug')

if (debug) {
  console.log('Checking file:', fullPath)
  console.log('File exists:', exists)
  console.log('Config content:', configContent.slice(0, 200))
}
```

This script ensures your Nuxt application maintains optimal SEO configuration and helps identify areas for improvement before deployment. 