<template>
  <div
    :id="useStoryblokId(blok)"
    v-editable="blok"
    class="nestable-container hs-accordion-group max-w-[85rem] mx-auto px-4 py-4 lg:px-6 lg:py-6 scroll-mt-20"
    role="group"
    :aria-label="`${blok.title} accordion`"
  >
    <h2
      :id="`accordion-title-${blok._uid}`"
      class="text-2xl text-gray-900 font-bold sm:text-3xl pb-4 lg:pb-8"
      role="heading"
      aria-level="2"
    >
      {{ blok.title }}
    </h2>
    <div
      v-for="item in blok.rows"
      :id="`hs-bordered-heading-${item._uid}`"
      :key="item._uid"
      class="hs-accordion bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg"
      :class="{ active: item.first_active }"
      role="group"
      :aria-labelledby="`accordion-header-${item._uid}`"
    >
      <button
        :id="`accordion-header-${item._uid}`"
        class="hs-accordion-toggle hs-accordion-active:text-secondary inline-flex items-center gap-x-3 w-full font-semibold text-start text-primary py-4 px-5 cursor-pointer hover:text-secondary disabled:opacity-50 disabled:pointer-events-none"
        :aria-expanded="item.first_active ? 'true' : 'false'"
        :aria-controls="`hs-basic-bordered-collapse-${item._uid}`"
        :aria-describedby="`accordion-title-${blok._uid}`"
        role="button"
        tabindex="0"
      >
        <svg
          class="hs-accordion-active:hidden block size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          role="img"
          aria-label="Expand"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        <svg
          class="hs-accordion-active:block hidden size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          role="img"
          aria-label="Collapse"
        >
          <path d="M5 12h14" />
        </svg>
        <span role="text">{{ item.title }}</span>
      </button>
      <div
        :id="`hs-basic-bordered-collapse-${item._uid}`"
        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
        :class="{ hidden: !item.first_active }"
        role="region"
        :aria-labelledby="`accordion-header-${item._uid}`"
        :aria-hidden="item.first_active ? 'false' : 'true'"
        :aria-expanded="item.first_active ? 'true' : 'false'"
      >
        <div
          class="pb-4 px-5"
          role="group"
        >
          <StoryblokComponent :blok="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionBlok } from '~/types/storyblok'

defineProps<{
  blok: AccordionBlok
}>()
</script>
