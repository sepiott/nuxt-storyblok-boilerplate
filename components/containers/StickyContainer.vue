<template>
  <div :class="['is-sticky', containerClass]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  containerClass: {
    type: String,
    default: '',
  },
})
</script>
