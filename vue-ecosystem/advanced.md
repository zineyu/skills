# Advanced Topics

## Performance Optimization

Apply only after core behavior is correct.

### Large List Virtualization

For lists with 1000+ items, use virtual scrolling:

```ts
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  { itemHeight: 80 }
)
```

```vue
<template>
  <div v-bind="containerProps" style="height: 400px">
    <div v-bind="wrapperProps">
      <div 
        v-for="item in list" 
        :key="item.index"
        :style="{ height: '80px' }"
      >
        {{ item.data.name }}
      </div>
    </div>
  </div>
</template>
```

### Static Content Optimization

Use `v-once` for static content and `v-memo` for conditional caching:

```vue
<template>
  <!-- v-once: Render once, never update -->
  <header v-once>
    <h1>{{ appName }}</h1>
  </header>

  <!-- v-memo: Only re-render when dependencies change -->
  <div v-memo="[user.name, user.avatar]">
    <img :src="user.avatar" />
    <h2>{{ user.name }}</h2>
  </div>
</template>
```

### Component Avoidance in Lists

Avoid component abstraction in hot list paths:

```vue
<!-- Bad: Component per item in large lists -->
<ListItem 
  v-for="item in items" 
  :key="item.id" 
  :item="item" 
/>

<!-- Good: Inline template for performance-critical lists -->
<div v-for="item in items" :key="item.id">
  <img :src="item.image" loading="lazy" />
  <span>{{ item.name }}</span>
</div>
```

### Reactivity Optimization

- Use `shallowRef` instead of `ref` for large objects that don't need deep reactivity
- Use `shallowReactive` for objects where only top-level properties need reactivity
- Use `markRaw` for objects that should never be made reactive
- Avoid unnecessary `computed` in hot paths

```ts
// Large config object - shallow reactivity
const config = shallowRef({
  theme: { colors: { /* thousands of colors */ } },
  layout: { /* complex layout */ }
})

// Update without triggering deep reactivity
config.value = { ...config.value, theme: newTheme }

// Mark raw for external libraries
const map = markRaw(new Map())
```

## Built-in Components

### KeepAlive

Cache component state when switching tabs:

```vue
<template>
  <KeepAlive :include="['TabA', 'TabB']" :max="10">
    <component :is="currentTab" />
  </KeepAlive>
</template>
```

```vue
<script setup lang="ts">
// Control caching with lifecycle hooks
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // Component is activated (switched to)
  refreshData()
})

onDeactivated(() => {
  // Component is deactivated (switched away)
  clearTimers()
})
</script>
```

### Teleport

Render content to a different DOM location:

```vue
<template>
  <div class="page">
    <!-- Modal rendered to body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal">
          <slot />
        </div>
      </div㹮
    </Teleport>
  </div>
</template>
```

### Suspense

Handle async dependencies in components:

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncDashboard />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>
```

```vue
<!-- AsyncDashboard.vue -->
<script setup lang="ts">
const data = await fetchDashboardData() // Top-level await
</script>
```

### Transition

```vue
<template>
  <Transition name="fade" mode="out-in">
    <component :is="currentView" />
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## SSR and Nuxt

### Nuxt 3 Basics

```ts
// composables/useAuth.ts - Auto-imported
export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  
  const login = async (credentials: Credentials) => {
    user.value = await $fetch('/api/login', { method: 'POST', body: credentials })
  }
  
  return { user, login }
}

// server/api/users.get.ts - Server route
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await fetchUsers(query)
})
```

### SSR-Safe Code

```vue
<script setup lang="ts">
// Only run on client
onMounted(() => {
  // DOM-dependent code
})

// Conditional client-only rendering
<client-only>
  <ChartComponent />
</client-only>

// Or with Nuxt
<ClientOnly>
  <MapComponent />
</ClientOnly>
</script>
```

### useFetch in Nuxt

```ts
// Automatic SSR + client hydration
const { data: posts, pending, error, refresh } = await useFetch('/api/posts', {
  query: { page: 1 },
  watch: [page],
  transform: (data) => data.map(normalizePost)
})

// For reactive params
const page = ref(1)
const { data } = await useFetch('/api/posts', {
  query: { page }
})
```

## Async Components

```ts
// Define async component with loading and error states
const AsyncModal = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000
})
```

## Custom Directives

```ts
// v-focus directive
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
}

// v-permission directive
const vPermission = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    const userStore = useUserStore()
    if (!userStore.hasPermission(binding.value)) {
      el.remove()
    }
  }
}
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Premature optimization | Wasted effort | Profile first, optimize hot paths |
| Over-using v-memo | Complexity | Only for heavy static subtrees |
| Deep nesting in Suspense | Hard to debug | Flatten or extract components |
| Not handling async errors | Silent failures | Always provide error boundaries |
| Client-only code in SSR | Hydration mismatches | Use onMounted or ClientOnly |
| Not using KeepAlive | Unnecessary re-renders | Cache tabs and wizard steps |

## References

- [Virtualize Large Lists](references/core/perf-virtualize-large-lists.md)
- [v-once and v-memo](references/core/perf-v-once-v-memo-directives.md)
- [Avoid Component Abstraction in Lists](references/core/perf-avoid-component-abstraction-in-lists.md)
- [Updated Hook Performance](references/core/updated-hook-performance.md)
- [Advanced Patterns](references/core/advanced-patterns.md)
- [KeepAlive](references/core/component-keep-alive.md)
- [Teleport](references/core/component-teleport.md)
- [Suspense](references/core/component-suspense.md)
- [Transition](references/core/component-transition.md)
- [TransitionGroup](references/core/component-transition-group.md)