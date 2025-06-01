import { defineNuxtPlugin } from '#imports'
import { useDismissible } from '~/composables/useDismissible'

export default defineNuxtPlugin({
  name: 'dismissible',
  setup() {
    const { hide, hiddenItems } = useDismissible()

    function applyHiddenState(): void {
      if (hiddenItems.value.length > 0) {
        hiddenItems.value.forEach((id: string) => {
          const el = document.getElementById(id)
          if (el) {
            el.classList.add('hidden')
          }
        })

        document.documentElement.setAttribute('data-hidden-loaded', 'true')
      }
    }

    window.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const closeButton = target.closest('.is-close-button')
      if (!closeButton) return

      const container = closeButton.closest('[data-dismissible]') as HTMLElement
      if (container) {
        hide(container.id)
      }
    })

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyHiddenState)
    }
    else {
      applyHiddenState()
    }

    const styleEl = document.createElement('style')
    styleEl.textContent = `
      [data-dismissible].hidden {
        display: none !important;
      }
    `
    document.head.appendChild(styleEl)
  },
})
