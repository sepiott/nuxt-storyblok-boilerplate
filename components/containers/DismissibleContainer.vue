<template>
  <div
    :id="id"
    data-dismissible
    :class="containerClass"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  containerClass: {
    type: String,
    default: '',
  },
})

// Add early script to handle hiding (executed before Vue hydration)
if (import.meta.client) {
  // Execute once immediately to hide element if needed
  const script = document.createElement('script')
  script.textContent = `
    (function() {
      try {
        if (localStorage.getItem('hidden-${props.id}') === 'true') {
          const el = document.getElementById('${props.id}');
          if (el) el.style.display = 'none';
        }
      } catch(e) {}
    })();
  `
  document.head.appendChild(script)
}

// Let global dismissible system handle the rest
</script>

<style>
/* Hide during page load if dismissible data is loaded into DOM */
html[data-hidden-loaded] [data-dismissible].should-hide {
  display: none !important;
}
</style>
