<template>
  <div v-editable="blok">
    <StoryblokComponent
      v-for="item in blok.body"
      :key="item._uid"
      :blok="item"
    />
  </div>
</template>

<script setup>
defineProps({ blok: Object })
</script>
