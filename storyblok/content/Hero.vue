<template>
  <!-- Hero -->
  <div
    v-editable="blok"
    class="relative min-h-[700px] overflow-hidden group"
  >
    <!-- Background Image -->
    <div class="absolute inset-0">
      <NuxtImg
        provider="storyblok"
        :src="blok.image?.filename"
        :alt="blok.image?.alt || 'Hero Image'"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        preload
        :modifiers="{
          fit: 'max',
          smart: true,
        }"
        sizes="sm:100vw md:100vw lg:100vw xl:100vw"
      />
    </div>

    <!-- Gradient Overlay for Text Readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    <!-- Optional: Glass morphism overlay for more modern effect -->
    <div class="absolute inset-0 backdrop-blur-[0.5px] bg-black/5" />

    <!-- Content Container -->
    <div class="relative h-full min-h-[700px] flex items-end">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div class="max-w-4xl">
          <!-- Subline -->
          <p
            v-if="blok.subline"
            class="inline-block mb-4 text-sm sm:text-base font-semibold tracking-wider text-white/90 uppercase
                   drop-shadow-lg backdrop-blur-sm px-3 py-1 rounded-full border border-white/20
                   bg-white/10 backdrop-brightness-150"
          >
            {{ blok.subline }}
          </p>

          <!-- Main Title -->
          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight
                     drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)]"
          >
            {{ blok.title }}
          </h1>

          <!-- Optional: CTA or additional content area -->
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <!-- Add CTA buttons or additional content here if needed -->
          </div>
        </div>
      </div>
    </div>

    <!-- Optional: Decorative elements -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  </div>
  <!-- End Hero -->
</template>

<script setup>
defineProps({ blok: Object })
</script>
