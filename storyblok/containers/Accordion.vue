<template>
  <div
    :id="blok.title ? blok.title.replace(/\s+/g, '-') : blok.component + '-' + blok._uid"
    v-editable="blok"
    class="nestable-container hs-accordion-group max-w-[85rem] mx-auto px-4 py-4 lg:px-6 lg:py-6 scroll-mt-20"
  >
    <h2 class="text-2xl text-gray-900 font-bold sm:text-3xl pb-4 lg:pb-8">
      {{ blok.title }}
    </h2>
    <div
      v-for="(item, index) in blok.rows"
      :id="`hs-bordered-heading-${item._uid}`"
      :key="item._uid"
      class="hs-accordion bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg"
      :class="{ active: index === 0 }"
    >
      <button
        class="hs-accordion-toggle hs-accordion-active:text-secondary inline-flex items-center gap-x-3 w-full font-semibold text-start text-primary py-4 px-5 cursor-pointer hover:text-secondary disabled:opacity-50 disabled:pointer-events-none"
        :aria-expanded="index === 0 ? 'true' : 'false'"
        :aria-controls="`hs-basic-bordered-collapse-${item._uid}`"
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
        >
          <path d="M5 12h14" />
        </svg>
        {{ item.title }}
      </button>
      <div
        :id="`hs-basic-bordered-collapse-${item._uid}`"
        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
        :class="{ hidden: index !== 0 }"
        role="region"
        :aria-labelledby="`hs-bordered-heading-${item._uid}`"
      >
        <div class="pb-4 px-5">
          <StoryblokComponent :blok="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ blok: Object })
</script>
