# useStickyElement Composable

This documentation explains how to use the reusable sticky element functionality in your components with the `useStickyElement` composable.

## Basic Usage

### Method 1: Using the StickyContainer Component (Recommended)

The simplest way to implement sticky elements is to use the provided `StickyContainer` component:

```vue
<template>
  <StickyContainer>
    <!-- Your content that should stick to the top of the viewport -->
    <YourHeader />
    <YourNavbar />
  </StickyContainer>
</template>
```

### Method 2: Manual Implementation with useStickyElement

If you need more flexibility, you can use the `useStickyElement` composable directly:

```vue
<template>
  <div class="is-sticky">
    <!-- Your content that should stick to the top of the viewport -->
  </div>
</template>

<script setup>
const { initStickyElements } = useStickyElement()

onMounted(() => {
  initStickyElements()
})
</script>
```

## useStickyElement Composable

The `useStickyElement` composable provides functionality to initialize sticky behavior for elements with the `is-sticky` class.

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `initStickyElements()` | `function` | Initializes sticky behavior for all elements with `.is-sticky` class |

## How It Works

1. The system uses native CSS `position: sticky` for optimal performance
2. Elements with the `is-sticky` class automatically stick to the top of the viewport during scroll
3. Intersection Observer API detects when elements become stuck (no scroll events)
4. When an element becomes stuck, an `is-stuck` class is added for visual enhancements
5. No content jumps occur since elements remain in the document flow
6. A sentinel element is created above each sticky element to detect intersection changes

## Key Features

- **Native Sticky Positioning**: Uses CSS `position: sticky` for best performance
- **No Content Jumps**: Elements remain in document flow, maintaining layout integrity
- **Visual Enhancements**: Shadow effect when elements are stuck via `is-stuck` class
- **Performance Optimized**: Uses Intersection Observer instead of scroll events
- **Responsive**: Works across all screen sizes
- **Automatic Setup**: Sets parent element to `position: relative` if needed

## CSS Customization

The default sticky behavior adds a subtle shadow when elements become stuck. If you want to customize this:

```css
/* In your component or global CSS */
.is-sticky.is-stuck {
  /* Override the default shadow */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Add a background color */
  background-color: white;
}
```

## Implementation Details

The composable:
- Creates a sentinel element above each sticky element
- Uses Intersection Observer with `-1px` root margin to detect when element becomes stuck
- Automatically adjusts parent positioning if needed
- Toggles `is-stuck` class based on intersection state

## Best Practices

- Use the sticky container for navigation bars, announcements, and important UI elements
- Don't make overly tall elements sticky as they can take up too much viewport space
- For complex sticky behaviors, you can nest multiple sticky elements with different offsets
- Call `initStickyElements()` after dynamically adding sticky elements to the DOM 