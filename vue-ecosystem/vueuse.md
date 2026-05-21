# VueUse Composables

## Philosophy

- Always check VueUse first before writing custom composables
- Prefer VueUse composables over custom code for readability, maintainability, and performance
- Map requirements to the most appropriate VueUse function

## Invocation Rules

- **AUTO**: Use automatically when applicable
- **EXTERNAL**: Use only if the user already installed the required external dependency
- **EXPLICIT_ONLY**: Use only when explicitly requested by the user

## By Category

### State

| Function | Description | Rule |
|----------|-------------|------|
| `useStorage` | Reactive LocalStorage/SessionStorage | AUTO |
| `useLocalStorage` | Reactive LocalStorage | AUTO |
| `useSessionStorage` | Reactive SessionStorage | AUTO |
| `useAsyncState` | Reactive async state | AUTO |
| `createGlobalState` | Global shared state | AUTO |
| `useRefHistory` | Undo/redo history for ref | AUTO |

```ts
import { useStorage, useLocalStorage } from '@vueuse/core'

// Persistent reactive state
const state = useStorage('my-store', { name: 'John', age: 30 })

// Just LocalStorage
const token = useLocalStorage('auth-token', '')

// Async state with loading/error
const { state: users, isLoading, error } = useAsyncState(
  fetchUsers(),
  [],
  { immediate: true }
)
```

### Elements

| Function | Description | Rule |
|----------|-------------|------|
| `useElementBounding` | Element bounding rect | AUTO |
| `useElementSize` | Element dimensions | AUTO |
| `useIntersectionObserver` | Visibility detection | AUTO |
| `useResizeObserver` | Size changes | AUTO |

```ts
import { useElementBounding, useIntersectionObserver } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y, top, right, bottom, left, width, height } = useElementBounding(el)

// Lazy loading images
const imageRef = ref<HTMLImageElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(imageRef, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    isVisible.value = true
  }
})
```

### Browser

| Function | Description | Rule |
|----------|-------------|------|
| `useDark` | Dark mode with auto detection | AUTO |
| `useColorMode` | Color mode management | AUTO |
| `useClipboard` | Clipboard API | AUTO |
| `useFullscreen` | Fullscreen API | AUTO |
| `useMediaQuery` | CSS media queries | AUTO |

```ts
import { useDark, useClipboard, useMediaQuery } from '@vueuse/core'

// Dark mode
const isDark = useDark()
const toggleDark = useToggle(isDark)

// Clipboard
const { text, copy, copied, isSupported } = useClipboard()

async function copyLink(url: string) {
  await copy(url)
  // copied.value is true for 1.5s
}

// Responsive
const isMobile = useMediaQuery('(max-width: 768px)')
const isDesktop = useMediaQuery('(min-width: 1024px)')
```

### Sensors

| Function | Description | Rule |
|----------|-------------|------|
| `onClickOutside` | Click outside detection | AUTO |
| `onKeyStroke` | Keyboard events | AUTO |
| `onLongPress` | Long press detection | AUTO |
| `useMouse` | Mouse position | AUTO |
| `useScroll` | Scroll position | AUTO |
| `useInfiniteScroll` | Infinite scroll | AUTO |

```ts
import { onClickOutside, useInfiniteScroll } from '@vueuse/core'

// Modal close on click outside
const modalRef = ref<HTMLElement | null>(null)
onClickOutside(modalRef, () => {
  isOpen.value = false
})

// Infinite scroll
const listRef = ref<HTMLElement | null>(null)
const items = ref<Item[]>([])

useInfiniteScroll(listRef, async () => {
  const newItems = await fetchMoreItems(items.value.length)
  items.value.push(...newItems)
})
```

### Network

| Function | Description | Rule |
|----------|-------------|------|
| `useFetch` | Reactive fetch wrapper | AUTO |
| `useWebSocket` | WebSocket client | AUTO |
| `useEventSource` | Server-Sent Events | AUTO |

```ts
import { useFetch } from '@vueuse/core'

// Simple GET
const { data, error, isFetching } = useFetch('https://api.example.com/users')

// With options
const { data: user, execute } = useFetch('https://api.example.com/user', {
  immediate: false
}).get().json<User>()

// Execute manually
async function loadUser(id: string) {
  await execute()
}

// WebSocket
const { status, data, send, open, close } = useWebSocket('wss://ws.example.com', {
  autoReconnect: true,
  heartbeat: true
})
```

### Animation

| Function | Description | Rule |
|----------|-------------|------|
| `useInterval` | Interval timer | AUTO |
| `useTimeout` | Timeout timer | AUTO |
| `useRafFn` | RequestAnimationFrame | AUTO |
| `useTransition` | Transition between values | AUTO |

```ts
import { useInterval, useTransition } from '@vueuse/core'

// Counter
const counter = useInterval(1000) // increments every second

// Smooth number transition
const source = ref(0)
const output = useTransition(source, {
  duration: 1000,
  transition: [0.75, 0, 0.25, 1]
})

source.value = 100 // smoothly transitions from 0 to 100 over 1s
```

### Watch Utilities

| Function | Description | Rule |
|----------|-------------|------|
| `watchDebounced` | Debounced watcher | AUTO |
| `watchThrottled` | Throttled watcher | AUTO |
| `watchOnce` | Watch once | AUTO |
| `watchAtMost` | Watch at most N times | AUTO |

```ts
import { watchDebounced } from '@vueuse/core'

const searchQuery = ref('')

// Debounced search
watchDebounced(
  searchQuery,
  (query) => {
    performSearch(query)
  },
  { debounce: 500, maxWait: 1000 }
)
```

### Reactivity Utilities

| Function | Description | Rule |
|----------|-------------|------|
| `computedAsync` | Async computed | AUTO |
| `computedEager` | Eager computed | AUTO |
| `reactivePick` | Pick properties | AUTO |
| `reactiveOmit` | Omit properties | AUTO |

```ts
import { computedAsync } from '@vueuse/core'

// Async computed
const userData = computedAsync(async () => {
  if (!userId.value) return null
  return await fetchUser(userId.value)
}, null) // null is the initial value
```

### Time

| Function | Description | Rule |
|----------|-------------|------|
| `useDateFormat` | Format dates | AUTO |
| `useTimeAgo` | Relative time | AUTO |
| `useCountdown` | Countdown timer | AUTO |

```ts
import { useTimeAgo, useDateFormat } from '@vueuse/core'

const timeAgo = useTimeAgo(new Date('2024-01-01')) // "2 months ago"
const formatted = useDateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
```

### Utilities

| Function | Description | Rule |
|----------|-------------|------|
| `useCounter` | Counter with bounds | AUTO |
| `useToggle` | Boolean toggle | AUTO |
| `useMemoize` | Memoization | AUTO |
| `useDebounceFn` | Debounced function | AUTO |
| `useThrottleFn` | Throttled function | AUTO |

```ts
import { useCounter, useToggle, useDebounceFn } from '@vueuse/core'

const { count, inc, dec, set, reset } = useCounter(0, { min: 0, max: 10 })

const [isOpen, toggleOpen] = useToggle(false)

const debouncedSearch = useDebounceFn((query: string) => {
  search(query)
}, 500)
```

## VueUse with Vue Router

```ts
import { useRouteParams, useRouteQuery } from '@vueuse/router'

// Reactive route params
const userId = useRouteParams('id')

// Reactive query params with default
const page = useRouteQuery('page', '1')
const search = useRouteQuery('q', '')
```

## References

See `references/vueuse/` for detailed documentation on each function.