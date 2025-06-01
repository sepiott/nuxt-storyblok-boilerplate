export default function useStickyElement() {
  const initStickyElements = (): void => {
    if (import.meta.client) {
      const stickyElements: NodeListOf<HTMLElement> = document.querySelectorAll('.is-sticky')

      const observerOptions: IntersectionObserverInit = {
        rootMargin: '-1px 0px 0px 0px',
        threshold: 0,
      }

      stickyElements.forEach((element: HTMLElement) => {
        const sentinel: HTMLDivElement = document.createElement('div')
        sentinel.style.height = '0px'
        sentinel.style.width = '100%'
        sentinel.style.position = 'absolute'
        sentinel.style.top = '0px'
        sentinel.style.visibility = 'hidden'
        sentinel.classList.add('is-sticky-sentinel')

        if (window.getComputedStyle(element.parentElement!).position === 'static') {
          element.parentElement!.style.position = 'relative'
        }

        element.parentNode!.insertBefore(sentinel, element)

        const observer = new IntersectionObserver((entries) => {
          const [entry] = entries
          element.classList.toggle('is-stuck', !entry.isIntersecting)
        }, observerOptions)

        observer.observe(sentinel)
      })
    }
  }

  return {
    initStickyElements,
  }
}
