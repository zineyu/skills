# Vue Router

## Setup

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('@/views/UserDetailView.vue'),
    props: true,
    beforeEnter: (to, from, next) => {
      // Route-level guard
      const id = parseInt(to.params.id as string)
      if (isNaN(id)) {
        return next({ name: 'NotFound' })
      }
      next()
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})

export default router
```

## Navigation Guards

### Global Guards

```ts
// Before each route
router.beforeEach(async (to, from) => {
  // Return false to cancel navigation
  // Return route location to redirect
  // Return nothing to proceed
})

// After navigation
router.afterEach((to, from) => {
  // Update page title, analytics
  document.title = to.meta.title || 'My App'
})

// On error
router.onError((error) => {
  console.error('Navigation error:', error)
})
```

### In-Component Guards

```vue
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Confirm before leaving with unsaved changes
onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('You have unsaved changes. Leave anyway?')
    if (!answer) return false
  }
})

// React to param changes without remounting
onBeforeRouteUpdate(async (to, from) => {
  // Same component, different params
  if (to.params.id !== from.params.id) {
    await loadUser(to.params.id as string)
  }
})
</script>
```

### Guard Best Practices

- **Always await async operations**: Don't leave guards hanging
- **Avoid infinite redirect loops**: Check if already on target route
- **Use route meta for configuration**: Don't hardcode routes in guards
- **Handle errors gracefully**: Don't let users get stuck

```ts
// Bad: Infinite redirect loop
router.beforeEach((to, from) => {
  if (!isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' } // ❌ If Login also requires auth, infinite loop!
  }
})

// Good: Check target route
router.beforeEach((to, from) => {
  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'Register') {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})
```

## Route Lifecycle

### Param Changes Without Remount

When navigating between same route with different params, component doesn't remount:

```vue
<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// React to param changes
watch(() => route.params.id, async (newId) => {
  await loadData(newId as string)
}, { immediate: true })

// Or use onBeforeRouteUpdate
import { onBeforeRouteUpdate } from 'vue-router'
onBeforeRouteUpdate(async (to) => {
  await loadData(to.params.id as string)
})
</script>
```

### Cleanup on Unmount

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let pollingInterval: number

onMounted(() => {
  pollingInterval = window.setInterval(fetchUpdates, 5000)
})

onUnmounted(() => {
  clearInterval(pollingInterval)
})
</script>
```

## Route Meta & Typed Routes

```ts
// Route meta types
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
    layout?: 'default' | 'blank' | 'admin'
    roles?: string[]
  }
}

// Route definition with meta
{
  path: '/admin',
  component: AdminView,
  meta: {
    requiresAuth: true,
    title: 'Admin Dashboard',
    layout: 'admin',
    roles: ['admin', 'moderator']
  }
}
```

## Lazy Loading

```ts
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/AdminView.vue')
  }
]
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| `next()` in guards | Deprecated in Vue Router 4 | Return route location or false |
| Infinite redirect loops | Users can't navigate | Check current route before redirect |
| Not handling param changes | Stale data on route change | Use watchers or onBeforeRouteUpdate |
| Async guards without await | Race conditions | Always await async operations |
| Not cleaning up listeners | Memory leaks | Use onUnmounted |
| Accessing `this` in beforeRouteEnter | No instance yet | Use next callback or composition API |

## References

- [Vue Router Production Setup](references/routing/router-use-vue-router-for-production.md)
- [Navigation Guard Async Pattern](references/routing/router-guard-async-await-pattern.md)
- [Navigation Guard Infinite Loop](references/routing/router-navigation-guard-infinite-loop.md)
- [Router Param Change No Lifecycle](references/routing/router-param-change-no-lifecycle.md)
- [Router Simple Routing Cleanup](references/routing/router-simple-routing-cleanup.md)
- [Router BeforeRouteEnter No This](references/routing/router-beforerouteenter-no-this.md)
- [Router BeforeEnter No Param Trigger](references/routing/router-beforeenter-no-param-trigger.md)
- [Router Navigation Guard Next Deprecated](references/routing/router-navigation-guard-next-deprecated.md)