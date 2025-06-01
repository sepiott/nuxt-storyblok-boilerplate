<template>
  <div
    :id="blok.title ? blok.title.replace(/\s+/g, '-') : blok.component + '-' + blok._uid"
    v-editable="blok"
    class="max-w-[85rem] mx-auto px-4 py-4 lg:px-6 lg:py-6 scroll-mt-20"
  >
    <div
      class="max-w-3xl standalone:mx-auto"
    >
      <div
        class="text-gray-600 has-richtext"
        v-html="md.render(blok.text)"
      />
    </div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  breaks: true, // converts \n to <br>
})

defineProps({
  blok: Object,
  pageType: {
    type: String,
    default: 'page',
  },
  isFirstOfType: {
    type: Boolean,
    default: false,
  },
})
</script>
