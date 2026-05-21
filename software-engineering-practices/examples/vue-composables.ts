// Vue 3 Composables Best Practices
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// ✅ Good: Reusable composable with cleanup
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

// ✅ Good: Async composable with loading state
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

// ✅ Good: Computed with TypeScript
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export function useCart(items: Ref<CartItem[]>) {
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const itemCount = computed(() =>
    items.value.reduce((count, item) => count + item.quantity, 0)
  )

  function addItem(item: CartItem) {
    items.value.push(item)
  }

  function removeItem(id: number) {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1) items.value.splice(index, 1)
  }

  return { total, itemCount, addItem, removeItem }
}