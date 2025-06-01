# useCurrentYear Composable

A simple Nuxt 3 composable that returns the current year. This utility is commonly used for copyright notices, footer dates, and other year-based display needs.

## Features

- **Server-Side Safe**: Returns current year from server on initial render
- **Simple API**: Direct number return, no reactive wrapper needed
- **Performance Optimized**: Minimal overhead, single function call
- **Type Safe**: Returns number type for TypeScript compatibility

## Usage

### Basic Implementation

```vue
<template>
  <footer>
    <p>&copy; {{ currentYear }} Your Company Name. All rights reserved.</p>
  </footer>
</template>

<script setup>
const currentYear = useCurrentYear()
</script>
```

### In Copyright Notices

```vue
<template>
  <div class="footer-copyright">
    <p>Copyright {{ useCurrentYear() }} - {{ siteName }}</p>
  </div>
</template>

<script setup>
const siteName = 'My Awesome Website'
</script>
```

### With Reactive Data

```vue
<template>
  <div>
    <h2>Annual Report {{ currentYear }}</h2>
    <p>This report covers the period from January 1, {{ currentYear }} to December 31, {{ currentYear }}</p>
  </div>
</template>

<script setup>
const currentYear = useCurrentYear()
</script>
```

## Return Value

The composable returns a `number` representing the current year.

```typescript
const currentYear: number = useCurrentYear()
// Example: 2024
```

## How It Works

The composable uses JavaScript's native `Date` object to get the current year:

```javascript
new Date().getFullYear()
```

This ensures:
- **Server-Side Rendering**: Year is calculated on the server
- **Accuracy**: Always returns the current year based on system time
- **Simplicity**: No caching or reactivity needed since year changes infrequently

## Use Cases

### Copyright Notices
```vue
<template>
  <footer>
    &copy; {{ useCurrentYear() }} Your Company
  </footer>
</template>
```

### Date Ranges
```vue
<template>
  <select>
    <option v-for="year in yearRange" :key="year" :value="year">
      {{ year }}
    </option>
  </select>
</template>

<script setup>
const currentYear = useCurrentYear()
const yearRange = Array.from({ length: 10 }, (_, i) => currentYear - i)
</script>
```

### Archive Pages
```vue
<template>
  <div>
    <h1>{{ currentYear }} Blog Posts</h1>
    <NuxtLink :to="`/archive/${currentYear - 1}`">
      View {{ currentYear - 1 }} Posts
    </NuxtLink>
  </div>
</template>

<script setup>
const currentYear = useCurrentYear()
</script>
```

### Form Validation
```vue
<template>
  <form>
    <input 
      v-model="birthYear" 
      type="number" 
      :max="currentYear - 13" 
      placeholder="Birth Year"
    >
  </form>
</template>

<script setup>
const currentYear = useCurrentYear()
const birthYear = ref('')
</script>
```

## Best Practices

### Performance
- Call once and store in a variable if used multiple times in the same component
- No need to make reactive since year changes are infrequent
- Safe to call directly in templates for simple usage

### Caching
The composable doesn't implement caching because:
- Year changes infrequently (once per year)
- Performance impact is negligible
- Server-side rendering handles initial value correctly

### Time Zones
The composable uses the server's system time zone:
- Consistent across all users on initial render
- Client-side hydration may show different year if user is in different time zone
- Consider this for applications where time zone accuracy is critical

### Alternative Implementation
If you need time zone-specific years or more complex date logic:

```vue
<script setup>
// For specific time zones
const getYearInTimeZone = (timeZone: string) => {
  return new Date().toLocaleDateString('en-US', { 
    timeZone, 
    year: 'numeric' 
  })
}

// Example: Get year in user's time zone
const userYear = computed(() => {
  if (import.meta.client) {
    return new Date().getFullYear()
  }
  return useCurrentYear() // Fallback to server year
})
</script>
```

## Common Patterns

### Dynamic Copyright Range
```vue
<template>
  <footer>
    &copy; {{ companyStartYear }}-{{ currentYear }} Your Company
  </footer>
</template>

<script setup>
const currentYear = useCurrentYear()
const companyStartYear = 2020
</script>
```

### Conditional Display
```vue
<template>
  <div v-if="isCurrentYear">
    This content is for the current year: {{ currentYear }}
  </div>
</template>

<script setup>
const currentYear = useCurrentYear()
const targetYear = 2024
const isCurrentYear = computed(() => currentYear === targetYear)
</script>
```

### Archive Navigation
```vue
<template>
  <nav>
    <NuxtLink 
      v-for="year in recentYears" 
      :key="year" 
      :to="`/posts/${year}`"
    >
      {{ year }}
    </NuxtLink>
  </nav>
</template>

<script setup>
const currentYear = useCurrentYear()
const recentYears = Array.from({ length: 5 }, (_, i) => currentYear - i)
</script>
``` 