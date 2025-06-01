<template>
  <div
    v-editable="blok"
    :class="['nestable-container container mx-auto grid gap-6 lg:gap-12 my-12', gridColumnsClass]"
  >
    <StoryblokComponent
      v-for="item in blok.columns"
      :key="item._uid"
      :blok="item"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ blok: Object })

const gridColumnsClass = computed(() => {
  const columnCount = props.blok?.columns?.length || 0

  if (columnCount <= 1) {
    return 'grid-cols-1'
  }
  else if (columnCount === 2) {
    return 'grid-cols-1 sm:grid-cols-2'
  }
  else {
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
  }
})
</script>
