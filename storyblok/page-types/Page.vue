<template>
  <div v-editable="blok">
    <StoryblokComponent
      v-for="item in blok.body"
      :key="item._uid"
      :blok="item"
    />
  </div>
</template>

<script setup lang="ts">
import type { PageBlok } from '~/types/storyblok'

defineProps<{
  blok: PageBlok
}>()
</script>
