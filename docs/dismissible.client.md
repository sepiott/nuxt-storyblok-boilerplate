# Dismissible Client Plugin

A Nuxt 3 client-side plugin that provides automatic functionality for dismissible UI elements. This plugin works in conjunction with the `useDismissible` composable to handle click events, apply hidden states, and prevent content flash.

## Features

- **Automatic Click Handling**: Listens for clicks on `.is-close-button` elements
- **State Application**: Applies hidden states on page load to prevent content flash
- **CSS Injection**: Adds necessary styles for dismissible functionality
- **Early Loading**: Runs before content is visible to prevent layout shifts
- **DOM Integration**: Works with any dismissible container with proper data attributes

## How It Works

The plugin automatically:

1. **Loads Hidden State**: Retrieves dismissible state from the `useDismissible` composable
2. **Applies CSS Classes**: Adds `hidden` class to previously dismissed elements
3. **Injects Styles**: Adds CSS rules for dismissible functionality
4. **Handles Clicks**: Listens for clicks on close buttons and triggers hide functionality
5. **Prevents Flash**: Ensures dismissed content doesn't flash on page load

## Implementation

The plugin is automatically loaded as `plugins/dismissible.client.ts`:

```typescript
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
```

## Usage

### HTML Structure

For automatic functionality, use this HTML structure:

```html
<div data-dismissible id="notification-banner">
  <p>Your dismissible content</p>
  <button class="is-close-button">
    ✕ Close
  </button>
</div>
```

### Required Attributes

- **`data-dismissible`**: Marks the container as dismissible
- **`id`**: Unique identifier for persistence
- **`.is-close-button`**: Class for close button elements

### Vue Component Example

```vue
<template>
  <div data-dismissible id="announcement" class="bg-blue-500 p-4">
    <div class="flex justify-between items-center">
      <p>Important announcement!</p>
      <button class="is-close-button hover:bg-blue-600 p-2 rounded">
        ✕
      </button>
    </div>
  </div>
</template>
```

## Integration with useDismissible

The plugin automatically integrates with the `useDismissible` composable:

### Automatic State Loading
```typescript
// Plugin automatically calls:
const { hide, hiddenItems } = useDismissible()

// And applies hidden state on page load
hiddenItems.value.forEach(id => {
  const el = document.getElementById(id)
  if (el) el.classList.add('hidden')
})
```

### Manual Integration
```vue
<script setup>
// You can still use the composable directly
const { hide, show, isHidden } = useDismissible()

// Plugin handles automatic clicking, but you can call manually
const dismissNotification = () => {
  hide('notification-banner')
}
</script>
```

## CSS Classes

### Injected Styles
The plugin automatically injects CSS:

```css
[data-dismissible].hidden {
  display: none !important;
}
```

### Required Classes
- **`.is-close-button`**: Applied to clickable close elements
- **`.hidden`**: Applied to dismissed elements

### Optional Classes
```css
.is-close-button {
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0.5rem;
}

.is-close-button:hover {
  opacity: 0.7;
}
```

## Preventing Content Flash

The plugin uses multiple strategies to prevent dismissed content from flashing:

### Early Application
```typescript
// Applies state as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyHiddenState)
} else {
  applyHiddenState()
}
```

### Attribute Markers
```typescript
// Sets marker when hidden state is loaded
document.documentElement.setAttribute('data-hidden-loaded', 'true')
```

### CSS Priority
```css
/* Important flag ensures hidden elements stay hidden */
[data-dismissible].hidden {
  display: none !important;
}
```

## Event Handling

### Automatic Click Detection
```typescript
window.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const closeButton = target.closest('.is-close-button')
  if (!closeButton) return

  const container = closeButton.closest('[data-dismissible]') as HTMLElement
  if (container) {
    hide(container.id)
  }
})
```

### Event Bubbling
- Clicks bubble up to find `.is-close-button` elements
- Close buttons can be nested inside other elements
- Container lookup finds the nearest `[data-dismissible]` parent

## Best Practices

### HTML Structure
```html
<!-- ✅ Good: Clear hierarchy -->
<div data-dismissible id="alert-banner">
  <div class="alert-content">
    <p>Alert message</p>
    <button class="is-close-button" aria-label="Close alert">
      ✕
    </button>
  </div>
</div>

<!-- ❌ Avoid: Missing required attributes -->
<div class="alert">
  <button onclick="hide()">Close</button>
</div>
```

### Accessibility
```html
<button class="is-close-button" aria-label="Close notification">
  <span aria-hidden="true">✕</span>
</button>
```

### Performance
- Plugin only runs on client-side
- Event delegation minimizes memory usage
- State application happens once per page load

## Troubleshooting

### Close Button Not Working
```html
<!-- Check for required class -->
<button class="is-close-button">Close</button>

<!-- Check for required container attribute -->
<div data-dismissible id="my-element">
  <!-- content -->
</div>
```

### Content Still Flashing
```css
/* Add CSS to prevent flash before plugin loads */
[data-dismissible] {
  opacity: 0;
  transition: opacity 0.1s;
}

[data-hidden-loaded] [data-dismissible]:not(.hidden) {
  opacity: 1;
}
```

### Elements Not Being Hidden
```typescript
// Check if IDs match localStorage
console.log(localStorage.getItem('hidden-your-element-id'))

// Verify element has required attributes
const el = document.getElementById('your-element')
console.log(el?.hasAttribute('data-dismissible'))
```

## Integration with Components

### Custom Components
```vue
<template>
  <DismissibleBanner id="promo-banner">
    <template #content>
      <p>Special promotion!</p>
    </template>
    <template #close>
      <button class="is-close-button custom-close-btn">
        Close
      </button>
    </template>
  </DismissibleBanner>
</template>
```

### Framework Components
The plugin works with any framework components that render the correct HTML structure with proper attributes.

This plugin provides the foundation for a seamless dismissible UI experience across your Nuxt application. 