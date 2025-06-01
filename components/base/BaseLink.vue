<template>
  <NuxtLink
    v-if="isInternal"
    :to="href.startsWith('/') ? href : '/' + href"
    :class="classes"
    :style="style"
  >
    <slot />
  </NuxtLink>
  <a
    v-else
    :href="href"
    :target="target"
    :class="classes"
    :style="style"
    rel="noopener noreferrer"
  >
    <slot />
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    default: null,
  },
  classes: {
    type: [String, Array, Object],
    default: () => [],
  },
  style: {
    type: Object,
    default: () => ({}),
  },
})

const isInternal = computed(() => {
  if (!props.href) return false

  // If the URL starts with http(s):// or //, it's external
  if (
    props.href.startsWith('http://')
    || props.href.startsWith('https://')
    || props.href.startsWith('//')
  ) {
    return false
  }

  // If it's a mailto: or tel: link, it's external
  if (props.href.startsWith('mailto:') || props.href.startsWith('tel:')) {
    return false
  }

  // Otherwise, assume it's internal
  return true
})
</script>
