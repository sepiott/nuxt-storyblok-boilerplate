# useDismissible Composable

A Nuxt 3 composable for managing dismissible UI elements with persistent state. This composable handles showing/hiding elements, localStorage persistence, and state management across browser sessions.

## Features

- **Persistent State**: Automatically saves dismissed state to localStorage
- **Reactive State**: Uses Vue's reactivity system for immediate UI updates
- **Session Persistence**: Maintains state across browser sessions and page reloads
- **DOM Integration**: Automatically applies CSS classes to elements
- **Error Resilience**: Graceful fallback when localStorage is unavailable
- **Legacy Support**: Handles migration from legacy storage keys

## Usage

### Basic Implementation

```vue
<template>
  <div v-if="!isHidden('notification-banner')" id="notification-banner">
    <p>This is a dismissible notification</p>
    <button @click="hide('notification-banner')">
      ✕ Dismiss
    </button>
  </div>
  
  <div v-if="!isHidden('announcement')" id="announcement">
    <p>Important announcement</p>
    <button @click="hide('announcement')">Close</button>
  </div>
</template>

<script setup>
const { hide, isHidden } = useDismissible()
</script>
```

### Show Previously Hidden Elements

```vue
<template>
  <div>
    <button @click="show('notification-banner')">
      Show Notification Again
    </button>
    
    <div v-if="!isHidden('notification-banner')" id="notification-banner">
      <p>Notification is back!</p>
      <button @click="hide('notification-banner')">Dismiss</button>
    </div>
  </div>
</template>

<script setup>
const { hide, show, isHidden } = useDismissible()
</script>
```

### Accessing All Hidden Items

```vue
<template>
  <div>
    <p>Currently hidden items: {{ hiddenItems.length }}</p>
    <ul>
      <li v-for="id in hiddenItems" :key="id">
        {{ id }}
        <button @click="show(id)">Show</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { show, hiddenItems } = useDismissible()
</script>
```

## Return Values

| Property | Type | Description |
|----------|------|-------------|
| `hide(id)` | `function` | Hides element and saves state to localStorage |
| `show(id)` | `function` | Shows element and removes from hidden state |
| `isHidden(id)` | `function` | Returns boolean indicating if element is hidden |
| `loadFromStorage()` | `function` | Manually reload state from localStorage |
| `hiddenItems` | `Ref<string[]>` | Reactive array of currently hidden element IDs |

## Functions

### hide(id: string)
Hides an element and persists the state:
- Adds ID to `hiddenItems` reactive array
- Saves state to localStorage with key `hidden-${id}`
- Applies `hidden` CSS class to DOM element if it exists
- Immediate UI update through reactivity

### show(id: string)  
Shows a previously hidden element:
- Removes ID from `hiddenItems` array
- Removes localStorage entry for the element
- Removes `hidden` CSS class from DOM element
- Immediate UI update through reactivity

### isHidden(id: string): boolean
Checks if an element is currently hidden:
- Returns `true` if element ID is in `hiddenItems` array
- Returns `false` otherwise
- Use in `v-if` directives for conditional rendering

### loadFromStorage()
Manually loads hidden state from localStorage:
- Scans localStorage for keys starting with `hidden-`
- Populates `hiddenItems` array with found IDs
- Handles legacy `hidden-announcement-banner` key migration
- Automatically called on composable initialization

## State Management

### Reactive State
The `hiddenItems` array is reactive, providing:
- Immediate UI updates when elements are hidden/shown
- Automatic re-rendering of dependent components
- Consistent state across multiple component instances

### localStorage Schema
Hidden state is stored with the pattern:
```
localStorage key: "hidden-${elementId}"
localStorage value: "true"
```

Example localStorage entries:
```
hidden-notification-banner: "true"
hidden-announcement: "true"  
hidden-cookie-consent: "true"
```

### Legacy Migration
The composable handles migration from legacy storage:
- Converts `hidden-announcement-banner` to `announcement-banner`
- Ensures backward compatibility with existing implementations
- Maintains user preferences during updates

## Error Handling

The composable includes robust error handling:

### Storage Unavailable
- Gracefully handles localStorage being unavailable
- Logs warnings instead of throwing errors
- Continues to work with in-memory state only
- Provides console warnings for debugging

### Client-Side Only
- All storage operations are client-side only
- Safe to use in SSR environments
- No server-side storage operations attempted

## Best Practices

### Element IDs
- Use descriptive, unique IDs for dismissible elements
- Avoid changing IDs after deployment (breaks persistence)
- Use kebab-case for consistency: `notification-banner`, `cookie-consent`

### Performance
- The composable automatically loads from storage on initialization
- Minimal performance impact due to reactive design
- Consider using `v-if` instead of `v-show` for hidden elements

### User Experience
- Provide clear dismiss buttons or interactions
- Consider offering ways to restore dismissed content
- Use consistent dismissal patterns across your application

### Accessibility
- Ensure dismiss buttons have proper labels
- Consider keyboard navigation for dismiss actions
- Provide alternative ways to access dismissed information

## Integration with Components

### DismissibleContainer Component
When used with a `DismissibleContainer` component:

```vue
<template>
  <DismissibleContainer id="banner" container-class="bg-blue-500 p-4">
    <div>Your dismissible content</div>
    <button class="dismiss-btn">×</button>
  </DismissibleContainer>
</template>
```

The component can internally use the composable for state management.

### Custom Dismiss Logic
For complex dismiss scenarios:

```vue
<script setup>
const { hide, isHidden } = useDismissible()

const handleDismiss = (elementId: string) => {
  // Custom logic before dismissing
  trackAnalytics('element_dismissed', { elementId })
  
  // Dismiss the element
  hide(elementId)
  
  // Custom logic after dismissing
  showRelatedContent()
}
</script>
``` 