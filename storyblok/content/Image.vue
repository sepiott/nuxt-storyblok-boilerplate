<template>
  <div
    :id="blok.title ? blok.title.replace(/\s+/g, '-') : blok.component + '-' + blok._uid"
    v-editable="blok"
    class="max-w-[85rem] mx-auto px-4 py-4 lg:px-6 lg:py-6 scroll-mt-20"
  >
    <nuxt-img
      provider="storyblok"
      :src="blok.image?.filename"
      :alt="blok.image?.alt || 'Visual'"
      class="w-full h-full object-cover"
      loading="lazy"
      placeholder
      :modifiers="{
        fit: 'cover',
      }"
    />
  </div>
</template>

<script setup>
defineProps({ blok: Object })
</script>
