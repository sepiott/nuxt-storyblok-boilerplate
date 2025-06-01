<template>
  <NuxtLayout />
</template>

<script setup>
const config = useRuntimeConfig()

// Global SEO defaults
useHead({
  titleTemplate: (title) => {
    return title && title !== config.public.siteName
      ? `${title} | ${config.public.siteName}`
      : config.public.siteName
  },
  meta: [
    { name: 'generator', content: 'Nuxt 3' },
  ],
})

// Preline UI JS
if (import.meta.client) {
  // Wait for component to be mounted
  onMounted(() => {
    import('preline/dist/preline.js').then(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit()
      }
    })
  })
}
</script>
