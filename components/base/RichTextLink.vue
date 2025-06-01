<template>
  <BaseLink
    :href="href"
    :text="text"
    :target="target"
    :classes="classes"
    :style="style"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  getLinkHref: {
    type: Function,
    required: true,
  },
  getLinkTarget: {
    type: Function,
    default: () => null,
  },
  getTextClasses: {
    type: Function,
    default: () => [],
  },
  getTextStyle: {
    type: Function,
    default: () => ({}),
  },
})

const href = computed(() => props.getLinkHref(props.node))
const target = computed(() => props.getLinkTarget(props.node))
const classes = computed(() => props.getTextClasses(props.node))
const style = computed(() => props.getTextStyle(props.node))
const text = computed(() => (props.node.type === 'text' ? props.node.text : ''))
</script>
