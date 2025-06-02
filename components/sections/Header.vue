<template>
  <!-- ========== HEADER ========== -->
  <header class="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-white border-b border-gray-200">
    <nav
      class="relative max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-6 px-4 sm:px-6 lg:px-8"
    >
      <div class="flex justify-between items-center gap-x-1 z-10">
        <BaseLink
          class="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 flex items-end"
          href="/"
          aria-label="Brand"
        >
          <img
            src="/assets/images/logo.png"
            alt="Logo"
            class="h-8 inline-block pr-2"
          >
          <span class="text-xl lg:text-3xl leading-none lg:leading-8 has-text-gradient">Nuxt + Storyblok<span
            class="lg:hidden"
          ><br></span> Boilerplate</span>
        </BaseLink>

        <!-- Collapse Button -->
        <button
          id="hs-header-base-collapse"
          type="button"
          class="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-sm border border-gray-200 text-gray-900 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          aria-expanded="false"
          aria-controls="hs-header-base"
          aria-label="Toggle navigation"
          data-hs-collapse="#hs-header-base"
        >
          <svg
            class="hs-collapse-open:hidden size-4"
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
            <line
              x1="3"
              x2="21"
              y1="6"
              y2="6"
            />
            <line
              x1="3"
              x2="21"
              y1="12"
              y2="12"
            />
            <line
              x1="3"
              x2="21"
              y1="18"
              y2="18"
            />
          </svg>
          <svg
            class="hs-collapse-open:block shrink-0 hidden size-4"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span class="sr-only">Toggle navigation</span>
        </button>
        <!-- End Collapse Button -->
      </div>

      <!-- Collapse -->
      <div
        id="hs-header-base"
        class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
        aria-labelledby="hs-header-base-collapse"
      >
        <div
          class="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          <div class="py-2 md:py-0 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
            <div class="grow">
              <div class="flex flex-col md:flex-row md:justify-end md:items-center gap-0.5 md:gap-1">
                <!-- Root-level Navigation Items -->
                <BaseLink
                  v-for="item in navData.rootItems"
                  :key="item.id"
                  :href="`/${item.slug}`"
                  class="w-full md:w-auto p-2 flex items-center text-sm font-semibold text-action hover:text-action-300 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
                >
                  <svg
                    class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                    <path
                      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </svg>
                  {{ item.name }}
                </BaseLink>

                <!-- Dynamic Mega Menus -->
                <div
                  v-for="(items, category) in navData.groupedNavItems"
                  :key="category"
                  :class="items.length > 1 ? 'hs-dropdown [--strategy:static] md:[--strategy:fixed] [--adaptive:none] md:[--adaptive:adaptive] [--is-collapse:true] md:[--is-collapse:false]' : ''"
                >
                  <!-- Direct link for single item categories -->
                  <BaseLink
                    v-if="items.length === 1"
                    :href="`/${items[0].slug}`"
                    class="w-full p-2 flex items-center text-sm font-semibold text-action hover:text-action-300 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
                  >
                    <svg
                      class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                      <path
                        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l-.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                    {{ getCategoryName(category) }}
                  </BaseLink>

                  <!-- Dropdown for multi-item categories -->
                  <template v-else>
                    <button
                      :id="`hs-header-base-mega-menu-${category}`"
                      type="button"
                      class="hs-dropdown-toggle w-full p-2 flex items-center text-sm font-semibold text-action hover:text-action-300 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-label="Mega Menu"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path
                          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l-.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </svg>
                      {{ getCategoryName(category) }}
                      <svg
                        class="hs-dropdown-open:-rotate-180 md:hs-dropdown-open:rotate-0 duration-300 shrink-0 size-4 ms-auto md:ms-1"
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
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 relative md:w-80 hidden z-10 top-full md:bg-white md:rounded-lg md:shadow-md before:absolute before:-top-4 before:start-0 before:w-full before:h-5"
                      role="menu"
                      aria-orientation="vertical"
                      :aria-labelledby="`hs-header-base-mega-menu-${category}`"
                    >
                      <div class="py-1 md:px-1 space-y-0.5">
                        <!-- Dynamic Links -->
                        <template
                          v-for="(item, index) in items"
                          :key="item.id"
                        >
                          <BaseLink
                            class="p-3 flex gap-x-4 hover:bg-gray-100 hover:text-action-300 focus:outline-hidden focus:bg-gray-100 rounded-lg"
                            :href="`/${item.slug}`"
                          >
                            <!-- Use a default icon if none provided, with proper SVG structure -->
                            <div
                              v-if="item.icon"
                              class="shrink-0 size-4 mt-1 text-action"
                              v-html="sanitizeSVG(item.icon)"
                            />
                            <div class="grow">
                              <span class="block font-semibold text-sm text-action">{{
                                item.name
                              }}</span>
                              <p
                                v-if="item.description"
                                class="text-sm text-gray-500"
                              >
                                {{ item.description }}
                              </p>
                            </div>
                          </BaseLink>
                          <div
                            v-if="index < items.length - 1"
                            class="my-2 border-t border-gray-100"
                          />
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
                <!-- End Dynamic Mega Menus -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- End Collapse -->
    </nav>
  </header>
  <!-- ========== END HEADER ========== -->
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'

interface NavItem {
  id: string | number
  name: string
  description: string
  icon: string
  slug: string
  category: string
  isFolder: boolean
  categoryName?: string
}

interface NavData {
  navItems: NavItem[]
  groupedNavItems: Record<string, NavItem[]>
  rootItems: NavItem[]
}

const navData = ref<NavData>({
  navItems: [],
  groupedNavItems: {},
  rootItems: [],
})

onMounted(async () => {
  try {
    const navigationData = await useNavigation()
    navData.value = navigationData

    // Re-initialize Preline components after navigation data is loaded
    if (import.meta.client && window.HSStaticMethods) {
      setTimeout(() => {
        window.HSStaticMethods.autoInit()
      }, 100)
    }
  }
  catch (error) {
    console.error('Failed to load navigation data:', error)
  }
})

// Format category name (e.g., convert 'roles_and_competencies' to 'Roles and Competencies')
const formatCategoryName = (category: string) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper to ensure SVG is properly structured
const sanitizeSVG = (svgContent: string) => {
  if (!svgContent) return ''

  // Make sure SVG has complete tags
  if (!svgContent.includes('</svg>') && svgContent.includes('<svg')) {
    svgContent = svgContent + '</svg>'
  }

  // Basic SVG validation - at minimum return a placeholder if invalid
  if (!svgContent.includes('<svg')) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>'
  }

  return svgContent
}

// Get the categoryName for a given category key
const getCategoryName = (category: string) => {
  // Find first item in this category to get its categoryName
  for (const items of Object.values(navData.value.groupedNavItems)) {
    for (const item of items) {
      if (item.category === category && item.categoryName) {
        return formatCategoryName(item.categoryName)
      }
    }
  }
}
</script>
