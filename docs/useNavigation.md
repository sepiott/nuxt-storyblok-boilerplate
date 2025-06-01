# useNavigation Composable

A comprehensive Nuxt 3 composable for fetching and organizing navigation items from Storyblok. This composable handles complex navigation structures, content enrichment, and hierarchical organization for navigation menus.

## Features

- **Hierarchical Navigation**: Organizes navigation items by categories/folders
- **Content Enrichment**: Fetches icons and descriptions from story content
- **Smart Filtering**: Excludes system pages, nested folders, and private content
- **Position-Based Sorting**: Maintains consistent ordering across categories
- **Preview Mode Support**: Respects Storyblok draft/published modes
- **Error Resilience**: Graceful fallbacks for API failures

## Usage

### Basic Implementation

```vue
<template>
  <nav>
    <!-- Root-level pages (displayed directly) -->
    <div v-if="navigation.rootItems.length > 0" class="root-navigation">
      <ul>
        <li v-for="item in navigation.rootItems" :key="item.id">
          <NuxtLink :to="`/${item.slug}`">
            <span v-if="item.icon" v-html="item.icon"></span>
            <div>
              <span>{{ item.name }}</span>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Grouped navigation (folders/categories) -->
    <div v-for="(items, category) in navigation.groupedNavItems" :key="category" class="category-navigation">
      <h3>{{ getCategoryName(category) }}</h3>
      <ul>
        <li v-for="item in items" :key="item.id">
          <NuxtLink :to="`/${item.slug}`">
            <span v-if="item.icon" v-html="item.icon"></span>
            <div>
              <span>{{ item.name }}</span>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
const navigation = await useNavigation()

const getCategoryName = (category: string) => {
  const item = navigation.navItems.find(item => item.category === category && item.isFolder)
  return item?.categoryName || category
}
</script>
```

### Flat Navigation List

```vue
<template>
  <ul>
    <!-- Root-level items first -->
    <li v-for="item in navigation.rootItems" :key="item.id">
      <NuxtLink :to="`/${item.slug}`">
        {{ item.name }}
      </NuxtLink>
    </li>
    
    <!-- Then categorized items -->
    <li v-for="item in navigation.navItems.filter(item => !item.isFolder && !item.isRootLevel)" :key="item.id">
      <NuxtLink :to="`/${item.slug}`">
        {{ item.name }} ({{ item.categoryName }})
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
const navigation = await useNavigation()
</script>
```

## Return Value

The composable returns a `NavData` object:

```typescript
interface NavData {
  navItems: NavItem[]
  groupedNavItems: Record<string, NavItem[]>
  rootItems: NavItem[]
}

interface NavItem {
  id: string | number
  name: string
  description: string
  icon: string
  slug: string
  category: string
  isFolder: boolean
  categoryName: string
  position: number
  isRootLevel: boolean
}
```

## Navigation Structure

### navItems
A flat array of all navigation items including:
- Individual content pages (both root-level and within folders)
- Top-level folder items
- Filtered and sorted by position

### groupedNavItems  
An organized object where:
- Keys are category slugs (folder names)
- Values are arrays of navigation items in that category
- Categories are ordered by folder position
- Items within categories are sorted by position
- **Excludes root-level pages** (they appear in `rootItems` instead)

### rootItems
An array of pages that exist at the root level (not in any folder):
- Contains only content pages, not folders
- Sorted by position
- These should be displayed directly in navigation alongside category folders

## Root-Level vs Grouped Navigation

The composable distinguishes between two types of navigation items:

### Root-Level Pages
- Pages that exist directly in the root of your Storyblok space
- Not contained within any folder
- Available in the `rootItems` array
- Should be displayed directly in navigation alongside category folders
- **Not included in `groupedNavItems`**

### Grouped Pages  
- Pages that exist within folders/categories
- Available in the `groupedNavItems` object organized by category
- Each category can be displayed as a dropdown or separate section

This separation allows for flexible navigation structures where some pages appear at the top level while others are organized into categories.

## Content Organization in Storyblok

### Recommended Structure
```
navigation/
├── info/                    (category folder)
│   ├── tech-manifest       (navigation item)
│   ├── structure          (navigation item)
│   └── teams              (navigation item)
├── roles-and-competencies/ (category folder)
│   ├── frontend-engineer  (navigation item)
│   └── backend-engineer   (navigation item)
└── tools/                  (category folder)
    ├── development        (navigation item)
    └── deployment         (navigation item)
```

### Content Fields
Each navigation item should have:
- **name**: Display text
- **description**: Brief description text
- **icon**: SVG icon markup
- **position**: Numeric ordering value

## Filtering Logic

The composable automatically excludes:
- **Home page** (`slug === 'home'`)
- **Private content** (names/slugs starting with `_`)
- **Nested folders** (folders within folders)
- **Nested folder content** (content within nested folders)

## Content Enrichment

The composable performs two API calls:
1. **Links API**: Gets basic navigation structure
2. **Stories API**: Enriches with icons and descriptions from story content

This ensures navigation items have complete metadata for rich display.

## Error Handling

The composable provides multiple layers of error handling:
- **Primary API Failure**: Returns empty navigation structure
- **Enrichment Failure**: Continues with basic navigation (no icons/descriptions)
- **Malformed Data**: Safely processes incomplete responses
- **Console Warnings**: Logs enrichment failures for debugging

## Category Ordering

Categories are ordered by their parent folder positions in Storyblok:
1. **Folder Position Order**: Categories appear in folder position order
2. **Main Category Last**: Items not in folders appear in 'main' category last
3. **Within Category**: Items sorted by their individual position values

## Preview Mode Support

Automatically detects and respects Storyblok preview mode:
- **Draft Mode**: When preview enabled, fetches draft content
- **Published Mode**: Otherwise, fetches only published content

## Default Fallback

On API failure, returns safe empty state:

```typescript
{
  navItems: [],
  groupedNavItems: {},
  rootItems: []
}
```

## Best Practices

### Content Organization
- Use consistent folder structure in Storyblok
- Set meaningful position values for ordering
- Include rich descriptions and SVG icons in story content
- Keep folder nesting to maximum 2 levels

### Implementation
- **Async Loading**: Always use `await` when calling the composable
- **Error Boundaries**: Implement fallback navigation for API failures
- **Loading States**: Show skeleton or loading indicators during fetch
- **Caching**: Consider caching navigation data for performance

### Accessibility
- Ensure icons have proper alt text or are decorative
- Use semantic HTML structure for navigation
- Implement proper ARIA labels for complex navigation

## Example Grouped Navigation Component

```vue
<template>
  <nav class="navigation">
    <div v-for="(items, category) in navigation.groupedNavItems" :key="category" class="nav-category">
      <h3 class="category-title">
        {{ getCategoryDisplayName(category, items[0]?.categoryName) }}
      </h3>
      <ul class="nav-items">
        <li v-for="item in items" :key="item.id" class="nav-item">
          <NuxtLink :to="`/${item.slug}`" class="nav-link">
            <div v-if="item.icon" class="nav-icon" v-html="item.icon"></div>
            <div class="nav-content">
              <span class="nav-name">{{ item.name }}</span>
              <p v-if="item.description" class="nav-description">{{ item.description }}</p>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
const navigation = await useNavigation()

const getCategoryDisplayName = (category: string, categoryName?: string) => {
  return categoryName || category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
}
</script>
``` 