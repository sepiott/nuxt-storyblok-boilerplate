import { defineNuxtPlugin } from '#imports'
import useStickyElement from '~/composables/useStickyElement'

export default defineNuxtPlugin({
  name: 'sticky-elements',
  setup() {
    const script = document.createElement('script')
    script.innerHTML = `
      (function() {
        const style = document.createElement('style');
        style.textContent = \`
          .is-sticky {
            position: sticky;
            top: 0;
            width: 100%;
            z-index: 50;
          }
        \`;
        document.head.appendChild(style);
      })();
    `
    document.head.appendChild(script)
  },
  hooks: {
    'app:mounted': () => {
      const { initStickyElements } = useStickyElement()
      setTimeout(() => {
        initStickyElements()
      }, 100)
    },
  },
})
