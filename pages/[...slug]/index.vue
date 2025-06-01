<script setup>
const { storyContent } = await useStoryblokPage({
  enableValidation: true,
})
</script>

<template>
  <StoryblokComponent
    v-if="storyContent && storyContent.content"
    :blok="storyContent.content"
  />
</template>
