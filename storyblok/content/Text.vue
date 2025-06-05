<template>
  <div
    :id="useStoryblokId(blok)"
    v-editable="blok"
    class="max-w-[85rem] mx-auto px-4 py-4 lg:px-6 lg:py-6 scroll-mt-20"
  >
    <div
      class="max-w-3xl standalone:mx-auto"
    >
      <div
        class="text-gray-600 has-richtext"
        v-html="md.render(blok.text || '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import type { TextBlok } from '~/types/storyblok'

const md = new MarkdownIt({
  breaks: true, // converts \n to <br>
})

defineProps<{
  blok: TextBlok
  pageType?: string
  isFirstOfType?: boolean
}>()
</script>
