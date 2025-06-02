<template>
  <DismissibleContainer
    id="announcement-banner"
    container-class="bg-primary-500"
  >
    <div class="max-w-7xl px-4 py-4 sm:px-6 lg:px-8 mx-auto">
      <!-- Grid -->
      <div class="flex justify-between items-start md:items-center gap-4">
        <div class="text-center md:text-start flex-1 min-w-0">
          <p class="text-xs text-white/80 uppercase">
            Open Source Project
          </p>
          <p class="mt-1 text-white text-lg md:text-xl">
            Check out this Nuxt 3 + Storyblok boilerplate at
            <BaseLink
              href="https://github.com/sepiott/nuxt-storyblok-boilerplate"
              target="_blank"
              class="font-semibold text-white underline hover:text-action"
            >
              GitHub
            </BaseLink>
          </p>
        </div>
        <!-- End Col -->

        <div class="flex-shrink-0">
          <button
            type="button"
            class="is-close-button inline-flex rounded-lg p-1.5 text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <span class="sr-only">Dismiss</span>
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
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
          </button>
        </div>
        <!-- End Col -->
      </div>
      <!-- End Grid -->
    </div>
  </DismissibleContainer>
</template>

<script setup>
// This component doesn't need any script setup
</script>
