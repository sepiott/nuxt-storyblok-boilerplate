<script setup lang="ts">
import { useHead, useRuntimeConfig } from 'nuxt/app'

interface NuxtError {
  statusCode?: number
  statusMessage?: string
  message?: string
  stack?: string
  data?: unknown
}
const props = defineProps<{ error: NuxtError }>()
useRuntimeConfig()

const getErrorTitle = (statusCode) => {
  switch (statusCode) {
    case 404: return 'Page not found'
    case 500: return 'Internal server error'
    default: return 'An error occurred'
  }
}

const getErrorMessage = (statusCode) => {
  switch (statusCode) {
    case 404: return 'The page you\'re looking for doesn\'t exist.'
    case 500: return 'Something went wrong on our end.'
    default: return 'Please try again later.'
  }
}

// SEO for error pages
useHead({
  title: `${getErrorTitle(props.error.statusCode)} (${props.error.statusCode})`,
  meta: [
    { name: 'description', content: getErrorMessage(props.error.statusCode) },
    { name: 'robots', content: 'noindex,nofollow' },
  ],
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-6xl font-bold text-gray-900">
          {{ error.statusCode }}
        </h1>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ getErrorTitle(error.statusCode) }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ error.statusMessage || error.message || getErrorMessage(error.statusCode) }}
        </p>
      </div>
      <div class="mt-8">
        <NuxtLink
          to="/"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Go back home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
