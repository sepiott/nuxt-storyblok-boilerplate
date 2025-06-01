import { useState } from '#imports'

export function useDismissible() {
  type HiddenItems = string[]

  const hiddenItems = useState<HiddenItems>('hiddenItems', () => [])

  function saveToStorage(id: string, value: boolean): void {
    try {
      if (import.meta.client) {
        if (value) {
          localStorage.setItem(`hidden-${id}`, 'true')
        }
        else {
          localStorage.removeItem(`hidden-${id}`)
        }
      }
    }
    catch (e) {
      console.warn('Storage not available', e)
    }
  }

  function loadFromStorage(): void {
    if (!import.meta.client) return

    try {
      hiddenItems.value = []

      Object.keys(localStorage).forEach((key: string) => {
        if (key.startsWith('hidden-') && localStorage.getItem(key) === 'true') {
          const id = key.replace('hidden-', '')
          if (!hiddenItems.value.includes(id)) {
            hiddenItems.value.push(id)
          }
        }

        if (key === 'hidden-announcement-banner' && localStorage.getItem(key) === 'true') {
          if (!hiddenItems.value.includes('announcement-banner')) {
            hiddenItems.value.push('announcement-banner')
          }
        }
      })
    }
    catch (e) {
      console.warn('Storage not available', e)
    }
  }

  if (import.meta.client) {
    loadFromStorage()
  }

  function hide(id: string): void {
    if (!hiddenItems.value.includes(id)) {
      hiddenItems.value.push(id)
    }
    saveToStorage(id, true)

    if (import.meta.client) {
      const el = document.getElementById(id)
      if (el) el.classList.add('hidden')
    }
  }

  function show(id: string): void {
    const index = hiddenItems.value.indexOf(id)
    if (index !== -1) {
      hiddenItems.value.splice(index, 1)
    }
    saveToStorage(id, false)

    if (import.meta.client) {
      const el = document.getElementById(id)
      if (el) el.classList.remove('hidden')
    }
  }

  function isHidden(id: string): boolean {
    return hiddenItems.value.includes(id)
  }

  return {
    hide,
    show,
    isHidden,
    loadFromStorage,
    hiddenItems,
  }
}
