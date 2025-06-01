<template>
  <!-- Card Blog -->
  <div class="max-w-[85rem] mx-auto px-4 py-16 lg:px-6 lg:py-24">
    <!-- Grid -->
    <div class="grid lg:grid-cols-2 lg:gap-y-16 gap-10">
      <template
        v-for="story in stories"
        :key="story.uuid"
      >
        <!-- Card -->
        <BaseLink
          class="group block rounded-xl overflow-hidden focus:outline-hidden"
          :href="`/${story.full_slug}`"
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div class="shrink-0 relative rounded-xl overflow-hidden w-full sm:w-56 h-44">
              <template v-if="getFirstImageFromStory(story)">
                <NuxtImg
                  provider="storyblok"
                  :src="getFirstImageFromStory(story)"
                  :alt="story.name"
                  class="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out size-full absolute top-0 start-0 object-cover rounded-xl"
                  loading="lazy"
                  placeholder
                  :modifiers="{
                    fit: 'max',
                  }"
                  sizes="sm:320px md:320px lg:320px xl:320px"
                />
              </template>
              <template v-else>
                <img
                  src="/images/fallback.png"
                  :alt="story.name"
                  class="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out size-full absolute top-0 start-0 object-cover rounded-xl"
                  loading="lazy"
                >
              </template>
            </div>

            <div class="grow">
              <h3 class="text-xl font-semibold text-gray-800 group-hover:text-gray-600">
                {{ story.name || 'Untitled' }}
              </h3>
              <p class="mt-3 text-gray-600">
                {{ getFirstTextFromStory(story) }}
              </p>
              <p
                class="mt-4 inline-flex items-center gap-x-1 text-sm text-action hover:text-secondary decoration-2 group-hover:underline group-focus:underline font-medium"
              >
                Read more
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </p>
            </div>
          </div>
        </BaseLink>
        <!-- End Card -->
      </template>
    </div>
    <!-- End Grid -->

    <!-- Pagination -->
    <nav
      v-if="totalPages > 1"
      class="flex items-center gap-x-1 mt-12 justify-center"
      aria-label="Pagination"
    >
      <NuxtLink
        :to="getPaginationUrl(currentPage - 1)"
        class="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        :class="{ 'opacity-50 pointer-events-none': currentPage <= 1 }"
        aria-label="Previous"
        :tabindex="currentPage <= 1 ? -1 : 0"
      >
        <svg
          class="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span>Previous</span>
      </NuxtLink>

      <div class="flex items-center gap-x-1">
        <template
          v-for="page in visiblePages"
          :key="page"
        >
          <NuxtLink
            v-if="page !== '...'"
            :to="getPaginationUrl(page)"
            class="min-h-9.5 min-w-9.5 flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg focus:outline-hidden focus:bg-gray-100"
            :class="{ 'bg-gray-100 font-semibold': page === currentPage }"
            :aria-current="page === currentPage ? 'page' : undefined"
          >
            {{ page }}
          </NuxtLink>
          <span
            v-else
            class="min-h-9.5 min-w-9.5 flex justify-center items-center text-gray-500 py-2 px-3 text-sm"
          >
            ...
          </span>
        </template>
      </div>

      <NuxtLink
        :to="getPaginationUrl(currentPage + 1)"
        class="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        :class="{ 'opacity-50 pointer-events-none': currentPage >= totalPages }"
        aria-label="Next"
        :tabindex="currentPage >= totalPages ? -1 : 0"
      >
        <span>Next</span>
        <svg
          class="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </NuxtLink>
    </nav>
    <!-- End Pagination -->
  </div>
  <!-- End Card Blog -->
</template>

<script setup>
import { useStoryblokApi } from '@storyblok/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig, useHead } from '#app'

const props = defineProps({
  blok: {
    type: Object,
    required: true,
  },
})

const config = useRuntimeConfig()
const storyblokApi = useStoryblokApi()
const route = useRoute()

const stories = ref([])
const total = ref(0)
const perPage = ref(12) // Default items per page
const loading = ref(false)

// Get current page from URL query or default to 1
const currentPage = computed(() => {
  const page = parseInt(route.query.page) || 1
  return page > 0 ? page : 1
})

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(total.value / perPage.value)
})

// Generate pagination URL preserving other query parameters
const getPaginationUrl = (page) => {
  if (page < 1 || page > totalPages.value) {
    return route.path
  }

  if (page === 1) {
    // For page 1, remove the page parameter to keep clean URLs
    const { page: removedPage, ...otherQuery } = route.query
    return {
      path: route.path,
      query: Object.keys(otherQuery).length > 0 ? otherQuery : undefined,
    }
  }

  return {
    path: route.path,
    query: {
      ...route.query,
      page: page,
    },
  }
}

// Generate visible page numbers with ellipsis
const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const totalPagesValue = totalPages.value

  // Always show first page
  if (totalPagesValue > 0) {
    pages.push(1)
  }

  if (totalPagesValue <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 2; i <= totalPagesValue; i++) {
      pages.push(i)
    }
  }
  else {
    // Complex pagination with ellipsis
    if (current <= 4) {
      // Show pages 2-5, then ellipsis, then last
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPagesValue)
    }
    else if (current >= totalPagesValue - 3) {
      // Show first, ellipsis, then last 4 pages
      pages.push('...')
      for (let i = totalPagesValue - 3; i <= totalPagesValue; i++) {
        pages.push(i)
      }
    }
    else {
      // Show first, ellipsis, current-1, current, current+1, ellipsis, last
      pages.push('...')
      pages.push(current - 1)
      pages.push(current)
      pages.push(current + 1)
      pages.push('...')
      pages.push(totalPagesValue)
    }
  }

  return pages
})

// SEO: Set up proper head tags for pagination
const pageTitle = computed(() => {
  const baseTitle = props.blok?.title || 'Articles'
  return currentPage.value > 1
    ? `${baseTitle} - Page ${currentPage.value} of ${totalPages.value}`
    : baseTitle
})

const pageDescription = computed(() => {
  const baseDescription = props.blok?.description || 'Browse our latest articles and stories.'
  return currentPage.value > 1
    ? `${baseDescription} Page ${currentPage.value} of ${totalPages.value}.`
    : baseDescription
})

// SEO: Add rel=prev and rel=next links
const headLinks = computed(() => {
  const links = []

  // Self-referencing canonical
  links.push({
    rel: 'canonical',
    href: `${config.public.siteUrl}${route.path}${currentPage.value > 1 ? `?page=${currentPage.value}` : ''}`,
  })

  // Previous page
  if (currentPage.value > 1) {
    const prevPage = currentPage.value - 1
    const prevUrl = prevPage === 1
      ? `${config.public.siteUrl}${route.path}`
      : `${config.public.siteUrl}${route.path}?page=${prevPage}`

    links.push({
      rel: 'prev',
      href: prevUrl,
    })
  }

  // Next page
  if (currentPage.value < totalPages.value) {
    links.push({
      rel: 'next',
      href: `${config.public.siteUrl}${route.path}?page=${currentPage.value + 1}`,
    })
  }

  return links
})

// Set head tags for SEO
useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: pageDescription.value },
    // Discourage search engines from indexing paginated pages beyond page 1
    ...(currentPage.value > 1 ? [{ name: 'robots', content: 'noindex,follow' }] : []),
  ],
  link: headLinks.value,
}))

const getFirstImageFromStory = (story) => {
  // Check if story has content and body
  if (!story?.content?.body || !Array.isArray(story.content.body)) {
    return
  }

  // Search through body components for the first image
  for (const component of story.content.body) {
    // Case 1: Direct image component
    if (component.component === 'image' && component.image?.filename) {
      return component.image.filename
    }

    // Case 2: Grid component with columns that might contain images
    if (component.component === 'grid' && Array.isArray(component.columns)) {
      for (const column of component.columns) {
        if (column.component === 'image' && column.image?.filename) {
          return column.image.filename
        }
      }
    }
  }
}

const getFirstTextFromStory = (story) => {
  // Default text
  const defaultText = 'Read this article to learn more...'

  // Check if story has content and body
  if (!story?.content?.body || !Array.isArray(story.content.body)) {
    return defaultText
  }

  // Search through body components for the first text component
  for (const component of story.content.body) {
    // Case 1: Direct text component
    if (component.component === 'text' && component.text) {
      // Limit text to a reasonable length for a teaser
      return truncateText(component.text, 120)
    }

    // Case 2: Grid component with columns that might contain text
    if (component.component === 'grid' && Array.isArray(component.columns)) {
      for (const column of component.columns) {
        if (column.component === 'text' && column.text) {
          return truncateText(column.text, 120)
        }
      }
    }
  }

  return defaultText
}

const truncateText = (text, maxLength) => {
  // Remove HTML tags
  const plainText = text.replace(/<[^>]*>/g, '')

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Find the last space before maxLength to avoid cutting words
  const lastSpace = plainText.lastIndexOf(' ', maxLength)
  return plainText.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...'
}

const fetchStories = async () => {
  if (!props.blok?.path) return

  loading.value = true

  try {
    const { data, headers } = await storyblokApi.get('cdn/stories', {
      starts_with: props.blok.path,
      sort_by: 'first_published_at:desc,published_at:desc,created_at:desc',
      version: config.public.storyblokVersion,
      page: currentPage.value,
      per_page: perPage.value,
    })

    stories.value = data.stories
    total.value = parseInt(headers.total) || 0
  }
  catch (error) {
    console.error('Error fetching stories:', error)
    stories.value = []
    total.value = 0
  }
  finally {
    loading.value = false
  }
}

// Watch for page changes
watch(() => currentPage.value, fetchStories, { immediate: false })

onMounted(fetchStories)
</script>
