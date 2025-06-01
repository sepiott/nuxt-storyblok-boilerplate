# Sticky Elements Client Plugin

A Nuxt 3 client-side plugin that provides automatic initialization and styling for sticky elements. This plugin works with the `useStickyElement` composable to ensure sticky elements function correctly across the application.

## Features

- **Automatic CSS Injection**: Adds essential sticky element styles to the document head
- **Early Initialization**: Injects styles before content renders to prevent layout shifts
- **Auto-Mount Integration**: Automatically initializes sticky behavior after app mounting
- **CSS Import**: Loads external sticky styles for enhanced functionality
- **Performance Optimized**: Uses efficient DOM manipulation and timing

## How It Works

The plugin automatically:

1. **Imports Styles**: Loads `~/assets/css/sticky.css` for additional styling
2. **Injects Core CSS**: Adds essential sticky positioning styles to the document head
3. **Waits for Mount**: Delays initialization until after the app is fully mounted
4. **Initializes Elements**: Calls `useStickyElement().initStickyElements()` to activate functionality

## Implementation

The plugin is automatically loaded as `plugins/stickyElements.client.ts`:

```typescript
import '~/assets/css/sticky.css'
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
```

## Usage

### Automatic Functionality

The plugin works automatically with any element that has the `.is-sticky` class:

```html
<header class="is-sticky bg-white shadow">
  <nav>Your navigation content</nav>
</header>
```

### Vue Component Example

```vue
<template>
  <div>
    <header class="is-sticky bg-white border-b">
      <div class="container mx-auto px-4 py-2">
        <nav class="flex justify-between items-center">
          <div class="logo">Brand</div>
          <ul class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
    
    <main>
      <!-- Page content -->
    </main>
  </div>
</template>
```

## CSS Styles

### Injected Core Styles
The plugin automatically injects essential CSS:

```css
.is-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 50;
}
```

### External Stylesheet
Additional styles are loaded from `~/assets/css/sticky.css`:

```css
/* Example sticky.css content */
.is-sticky.is-stuck {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.is-sticky-sentinel {
  pointer-events: none;
  visibility: hidden;
}
```

## Integration with useStickyElement

The plugin automatically integrates with the composable:

### Automatic Initialization
```typescript
// Plugin automatically calls after app mount:
const { initStickyElements } = useStickyElement()
setTimeout(() => {
  initStickyElements()
}, 100)
```

### Manual Integration
```vue
<script setup>
// You can still manually initialize if needed
const { initStickyElements } = useStickyElement()

onMounted(() => {
  // For dynamically added elements
  nextTick(() => {
    initStickyElements()
  })
})
</script>
```

## Timing and Performance

### Plugin Setup Phase
```typescript
setup() {
  // Runs immediately when plugin loads
  const script = document.createElement('script')
  // Injects CSS into document head
}
```

### App Mount Phase
```typescript
hooks: {
  'app:mounted': () => {
    // Runs after Vue app is fully mounted
    setTimeout(() => {
      initStickyElements() // 100ms delay for DOM stability
    }, 100)
  }
}
```

### Delayed Initialization
The 100ms delay ensures:
- DOM is fully rendered
- Other plugins have initialized
- CSS transitions are ready
- No layout thrashing occurs

## Sticky Element Behavior

### Default Positioning
```css
.is-sticky {
  position: sticky;  /* Native CSS sticky positioning */
  top: 0;           /* Sticks to top of viewport */
  width: 100%;      /* Full width */
  z-index: 50;      /* Above most content */
}
```

### Enhanced States
When elements become stuck, additional classes are applied:

```css
.is-sticky.is-stuck {
  /* Applied when element is stuck to viewport top */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

## Multiple Sticky Elements

### Stacking Order
```html
<!-- First sticky element (z-index: 50) -->
<header class="is-sticky">
  <nav>Main Navigation</nav>
</header>

<!-- Second sticky element (may need custom z-index) -->
<div class="is-sticky" style="z-index: 49; top: 64px;">
  <div>Sub Navigation</div>
</div>
```

### Custom Positioning
```vue
<template>
  <div>
    <!-- Main header sticks to top -->
    <header class="is-sticky">
      <nav>Main Nav</nav>
    </header>
    
    <!-- Sub nav sticks below main header -->
    <div class="is-sticky sticky-offset">
      <nav>Sub Nav</nav>
    </div>
  </div>
</template>

<style scoped>
.sticky-offset {
  top: 64px; /* Height of main header */
  z-index: 49;
}
</style>
```

## Best Practices

### HTML Structure
```html
<!-- ✅ Good: Clean semantic structure -->
<header class="is-sticky site-header">
  <div class="container">
    <nav role="navigation">
      <!-- Navigation content -->
    </nav>
  </div>
</header>

<!-- ❌ Avoid: Nested sticky elements without purpose -->
<div class="is-sticky">
  <div class="is-sticky">
    <!-- Unnecessary nesting -->
  </div>
</div>
```

### Performance
```vue
<template>
  <!-- Use fixed heights for better performance -->
  <header class="is-sticky h-16">
    <nav class="h-full">
      <!-- Content -->
    </nav>
  </header>
</template>
```

### Accessibility
```html
<header class="is-sticky" role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>
```

## Troubleshooting

### Sticky Elements Not Working
```typescript
// Check if plugin initialized
console.log('Plugin loaded:', document.querySelector('style')?.textContent?.includes('is-sticky'))

// Verify composable is available
const { initStickyElements } = useStickyElement()
console.log('Composable available:', typeof initStickyElements)
```

### CSS Not Loading
```html
<!-- Check if styles are injected -->
<head>
  <style>
    .is-sticky {
      position: sticky;
      /* ... */
    }
  </style>
</head>
```

### Elements Not Sticking
```css
/* Ensure parent containers allow sticky positioning */
.sticky-container {
  /* Avoid: */
  /* overflow: hidden; */
  /* height: 100vh; */
  
  /* Use instead: */
  overflow: visible;
  min-height: 100vh;
}
```

## Dynamic Elements

### Adding Sticky Elements Dynamically
```vue
<script setup>
const { initStickyElements } = useStickyElement()

const addStickyElement = () => {
  // Add element to DOM
  const element = document.createElement('div')
  element.className = 'is-sticky'
  document.body.appendChild(element)
  
  // Re-initialize sticky functionality
  nextTick(() => {
    initStickyElements()
  })
}
</script>
```

### Reactive Sticky Elements
```vue
<template>
  <div v-for="item in stickyItems" :key="item.id" class="is-sticky">
    <!-- Dynamic content -->
  </div>
</template>

<script setup>
const { initStickyElements } = useStickyElement()

watch(stickyItems, () => {
  nextTick(() => {
    initStickyElements()
  })
})
</script>
```

## Integration with Other Plugins

The plugin is designed to work alongside other Nuxt plugins:
- Loads after critical CSS plugins
- Initializes after DOM-dependent plugins
- Coordinates with dismissible elements plugin
- Compatible with UI framework plugins

This plugin ensures sticky elements work seamlessly across your entire Nuxt application with minimal configuration. 