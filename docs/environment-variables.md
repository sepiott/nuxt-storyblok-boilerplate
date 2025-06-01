# Environment Variables

This document describes the environment variables used in the project.

## Configuration

Create a `.env` file in the root of the project with the following variables:

```
# Storyblok API token
STORYBLOK_TOKEN=your_storyblok_token_here

# Storyblok preview mode - set to 'true' to view draft content
STORYBLOK_PREVIEW=false
```

## Variable Details

### `STORYBLOK_TOKEN`

**Required:** Yes  
**Default:** None  
**Description:** API token for accessing Storyblok content. You can find this in your Storyblok space settings.

### `STORYBLOK_PREVIEW`

**Required:** No  
**Default:** `false`  
**Values:** `true` or `false`  
**Description:** When set to `true`, the application will fetch draft content from Storyblok, allowing you to preview unpublished changes. When set to `false`, only published content will be displayed.

## Usage in Development

For local development, you can set these variables in a `.env` file in the root of your project.

## Usage in Production

For production environments, configure these variables in your hosting platform's environment settings. 