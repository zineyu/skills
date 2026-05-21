# Vue Core Framework

## Component Template

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [value: string]
}>()

const model = defineModel<string>()

const doubled = computed(() => (props.count ?? 0) * 2)

watch(() => props.title, (newVal) => {
  console.log('Title changed:', newVal)
})

onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>{{ title }} - {{ doubled }}</div>
</template>
```

## Reactivity

### Key Imports

```ts
// Reactivity primitives
import { ref, shallowRef, computed, reactive, readonly, toRef, toRefs, toValue } from 'vue'

// Watchers
import { watch, watchEffect, watchPostEffect, onWatcherCleanup } from 'vue'

// Lifecycle
import { onMounted, onUpdated, onUnmounted, onBeforeMount, onBeforeUpdate, onBeforeUnmount } from 'vue'
```

### Best Practices

- **Keep source state minimal**: Use `ref`/`reactive` for source state, derive everything with `computed`
- **Use `shallowRef` when deep reactivity is not needed**: Better performance for large objects
- **Avoid `reactive` for primitives**: Use `ref` instead for consistency
- **Use `toRef` / `toRefs` when destructuring reactive objects**: Maintain reactivity
- **Prefer `computed` over methods in templates**: Caching and reactivity tracking
- **Use `watch` for side effects**: Not for deriving state
- **Always cleanup in watchers**: Use `onWatcherCleanup` or return cleanup function

```ts
// Good: Minimal source state, computed derived state
const items = ref<Item[]>([])
const searchQuery = ref('')

const filteredItems = computed(() =>
  items.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const itemCount = computed(() => filteredItems.value.length)

// Good: Watch with cleanup
watch(() => props.userId, async (newId, oldId) => {
  const controller = new AbortController()
  
  onWatcherCleanup(() => {
    controller.abort()
  })
  
  try {
    const user = await fetchUser(newId, { signal: controller.signal })
    userData.value = user
  } catch (e) {
    if (e.name !== 'AbortError') throw e
  }
})
```

## Component Data Flow

### Props Down, Events Up

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const count = ref(0)

function handleIncrement(delta: number) {
  count.value += delta
}
</script>

<template>
  <ChildComponent 
    :count="count" 
    @increment="handleIncrement" 
  />
</template>

<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  count: number
}

defineProps<Props>()

const emit = defineEmits<{
  increment: [delta: number]
}>()

function onClick() {
  emit('increment', 1)
}
</script>

<template>
  <button @click="onClick">Count: {{ count }}</button>
</template>
```

### v-model

```vue
<script setup lang="ts">
const modelValue = defineModel<string>('modelValue', { required: true })

// Or with custom prop name
const title = defineModel<string>('title', { default: '' })
</script>

<template>
  <input v-model="title" />
</template>
```

### Provide/Inject

Use only for deep-tree dependencies or shared context:

```ts
// Injection key
import { InjectionKey } from 'vue'

interface UserContext {
  user: Ref<User | null>
  logout: () => void
}

export const UserKey: InjectionKey<UserContext> = Symbol('user')

// Provider
import { provide } from 'vue'

const user = ref<User | null>(null)
const logout = () => { /* ... */ }

provide(UserKey, { user, logout })

// Consumer
import { inject } from 'vue'

const userContext = inject(UserKey)
if (!userContext) {
  throw new Error('UserContext not provided')
}
```

## Component Splitting

Split a component when it has **more than one clear responsibility**:

**Split triggers**:
- It owns both orchestration/state and substantial presentational markup for multiple sections
- It has 3+ distinct UI sections (form, filters, list, footer/status)
- A template block is repeated or could become reusable

**Entry/root and route view rule**:
- Keep entry/root and route view components thin: app shell/layout, provider wiring, and feature composition
- For CRUD/list features, split at least into: container, input/form, list/item, footer/actions

```
ProductPage.vue (thin container)
├── ProductFilters.vue
├── ProductList.vue
│   └── ProductItem.vue
└── ProductPagination.vue
```

## Composables

Extract logic into composables when it is reused, stateful, or side-effect heavy.

```ts
// Good: Reusable composable with cleanup
import { ref, watch, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}

// Good: Async composable with loading state
export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(response.statusText)
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)

  return { data, error, loading, refresh: fetchData }
}
```

## SFC Structure

- Keep SFC sections in this order: `<script>` → `<template>` → `<style>`
- Keep SFC responsibilities focused; split large components
- Keep templates declarative; move branching/derivation to script
- Apply Vue template safety rules (`v-html`, list rendering, conditional rendering choices)

```vue
<script setup lang="ts">
// 1. Imports
import { computed } from 'vue'
import UserCard from './UserCard.vue'

// 2. Props / Emits
interface Props {
  users: User[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ select: [user: User] }>()

// 3. Reactive state
const selectedId = ref<string | null>(null)

// 4. Computed
const sortedUsers = computed(() =>
  [...props.users].sort((a, b) => a.name.localeCompare(b.name))
)

// 5. Methods
function selectUser(user: User) {
  selectedId.value = user.id
  emit('select', user)
}
</script>

<template>
  <div class="user-list">
    <UserCard
      v-for="user in sortedUsers"
      :key="user.id"
      :user="user"
      :is-selected="user.id === selectedId"
      @click="selectUser(user)"
    />
  </div>
</template>

<style scoped>
.user-list {
  display: grid;
  gap: 1rem;
}
</style>
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Calling hooks conditionally | Breaks reactivity | Call at top level only |
| Using array index as key | Wrong reactivity updates | Use stable unique IDs |
| Destructuring reactive objects | Loses reactivity | Use `toRefs` or dot access |
| Computed with side effects | Unpredictable behavior | Use `watch` for side effects |
| Large templates with logic | Hard to maintain | Move logic to script, split components |
| Deep nesting in template | Hard to read | Extract child components |
| Mixing Options and Composition API | Inconsistent patterns | Use Composition API exclusively |
| `v-html` with untrusted content | XSS vulnerability | Sanitize or use text interpolation |
| Not cleaning up watchers | Memory leaks | Return cleanup function |

## References

- [Reactivity](references/core/reactivity.md)
- [SFC Structure](references/core/sfc.md)
- [Component Data Flow](references/core/component-data-flow.md)
- [Composables](references/core/composables.md)
- [Script Setup & Macros](references/core/script-setup-macros.md)
- [Core APIs](references/core/core-new-apis.md)