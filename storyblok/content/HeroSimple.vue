<template>
  <!-- Hero Simple -->
  <div
    v-editable="blok"
    class="relative min-h-[300px] w-full overflow-hidden bg-gradient-to-br from-primary-800 via-primary-500 to-primary-800"
  >
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

    <!-- Optional: Subtle pattern overlay -->
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />

    <!-- Content Container -->
    <div class="relative h-full min-h-[300px] flex items-center">
      <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div class="max-w-4xl text-center mx-auto">
          <!-- Subline -->
          <p
            v-if="blok.subline"
            class="inline-block mb-6 text-sm sm:text-base font-semibold tracking-wider text-white/90 uppercase
                   drop-shadow-lg backdrop-blur-sm px-4 py-2 rounded-full border border-white/20
                   bg-white/10 backdrop-brightness-100"
          >
            {{ blok.subline }}
          </p>

          <!-- Main Title -->
          <h1
            v-if="blok.title"
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight
                   drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)]"
          >
            {{ blok.title }}
          </h1>
        </div>
      </div>
    </div>

    <!-- Decorative bottom border -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  </div>
  <!-- End Hero Simple -->
</template>

<script setup lang="ts">
import type { HeroSimpleBlok } from '~/types/storyblok'

defineProps<{
  blok: HeroSimpleBlok
}>()
</script>
