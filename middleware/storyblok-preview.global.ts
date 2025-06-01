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

      // Prevent duplicate navigations if there are no query parameters left
      if (Object.keys(newQuery).length === 0) {
        return
      }

      // Navigate to the same path without the preview parameters
      return navigateTo({
        path: to.path,
        query: Object.keys(newQuery).length ? newQuery : undefined,
      })
    }
  }
})
