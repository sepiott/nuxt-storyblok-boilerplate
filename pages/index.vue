<script setup>
const { storyContent } = await useStoryblokPage({
  isHomePage: true,
})
</script>

<template>
  <StoryblokComponent
    v-if="storyContent"
    :blok="storyContent.content"
  />
</template>
