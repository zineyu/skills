import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

// useLocalStorage - Reactive localStorage
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const data = ref<T>(stored ? JSON.parse(stored) : defaultValue)

  const write = () => {
    localStorage.setItem(key, JSON.stringify(data.value))
  }

  return {
    data,
    write
  }
}

// useDebounce - Debounced ref
export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout>

  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  onUnmounted(() => clearTimeout(timeout))

  return debouncedValue
}

// useFetch - Async data fetching composable
interface UseFetchOptions {
  immediate?: boolean
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  execute: () => Promise<void>
}

export function useFetch<T>(
  url: string | Ref<string>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { immediate = true } = options
  
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const execute = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(typeof url === 'string' ? url : url.value)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    onMounted(execute)
  }

  return { data, error, loading, execute }
}

// useEventListener - Safe event listener
export function useEventListener(
  target: EventTarget | Ref<EventTarget | null>,
  event: string,
  handler: EventListener
) {
  onMounted(() => {
    const el = 'value' in target ? target.value : target
    el?.addEventListener(event, handler)
  })

  onUnmounted(() => {
    const el = 'value' in target ? target.value : target
    el?.removeEventListener(event, handler)
  })
}

// useMouse - Track mouse position
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  useEventListener(window, 'mousemove', update as EventListener)

  return { x, y }
}

// useCounter - Counter with bounds
interface UseCounterOptions {
  min?: number
  max?: number
}

export function useCounter(initial = 0, options: UseCounterOptions = {}) {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = options
  const count = ref(initial)

  const inc = () => {
    if (count.value < max) count.value++
  }

  const dec = () => {
    if (count.value > min) count.value--
  }

  const set = (value: number) => {
    count.value = Math.max(min, Math.min(max, value))
  }

  const reset = () => {
    count.value = initial
  }

  return { count, inc, dec, set, reset }
}