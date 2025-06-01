import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    stylistic: true,
  },
  linterOptions: {
    reportUnusedInlineConfigs: 'error',
  },
}).override('nuxt/vue/rules', {
  rules: {
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
  },
})
