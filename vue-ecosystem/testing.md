# Vue Testing

## Stack

- **Vitest**: Unit and integration testing (recommended over Jest for Vue)
- **Vue Test Utils**: Vue component testing utilities
- **Playwright**: End-to-end testing
- **@vue/test-utils**: Mount, shallowMount, find, trigger

## Component Testing (Blackbox Approach)

Test component behavior, not implementation:

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('increments count when button is clicked', async () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 0 }
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('span').text()).toBe('1')
  })

  it('emits update event with new count', async () => {
    const wrapper = mount(Counter)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update')).toHaveLength(1)
    expect(wrapper.emitted('update')![0]).toEqual([1])
  })

  it('does not render negative counts', async () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 0 }
    })

    await wrapper.find('[data-test="decrement"]').trigger('click')

    expect(wrapper.find('span').text()).toBe('0')
  })
})
```

## Async Testing

Use `flushPromises` for async operations:

```ts
import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

describe('UserProfile', () => {
  it('displays user data after loading', async () => {
    const wrapper = mount(UserProfile, {
      props: { userId: '123' }
    })

    // Wait for all promises to resolve
    await flushPromises()

    expect(wrapper.find('[data-test="user-name"]').text()).toBe('John Doe')
  })

  it('shows loading state initially', async () => {
    const wrapper = mount(UserProfile, {
      props: { userId: '123' }
    })

    // Before flushPromises
    expect(wrapper.find('[data-test="loading"]').exists()).toBe(true)

    await flushPromises()

    expect(wrapper.find('[data-test="loading"]').exists()).toBe(false)
  })
})
```

## Composable Testing

```ts
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('increments count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })

  it('respects initial value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })
})
```

For composables using lifecycle hooks, use `mount` with a helper component:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useMouse } from './useMouse'

function useComposableInSetup<T>(composable: () => T): T {
  let result!: T
  
  mount(defineComponent({
    setup() {
      result = composable()
      return () => h('div')
    }
  }))
  
  return result
}

describe('useMouse', () => {
  it('tracks mouse position', () => {
    const { x, y } = useComposableInSetup(useMouse)
    
    // Simulate mouse move
    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    }))
    
    expect(x.value).toBe(100)
    expect(y.value).toBe(200)
  })
})
```

## Pinia Store Testing

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets user on login', () => {
    const store = useUserStore()
    
    store.login({ id: '1', name: 'John' })
    
    expect(store.user).toEqual({ id: '1', name: 'John' })
    expect(store.isAuthenticated).toBe(true)
  })

  it('clears user on logout', () => {
    const store = useUserStore()
    
    store.login({ id: '1', name: 'John' })
    store.logout()
    
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
```

## E2E Testing with Playwright

```ts
import { test, expect } from '@playwright/test'

test('user can complete purchase flow', async ({ page }) => {
  // Navigate to product page
  await page.goto('/products/1')
  
  // Add to cart
  await page.click('[data-test="add-to-cart"]')
  
  // Go to cart
  await page.click('[data-test="cart-link"]')
  
  // Proceed to checkout
  await page.click('[data-test="checkout"]')
  
  // Fill shipping info
  await page.fill('[data-test="shipping-name"]', 'John Doe')
  await page.fill('[data-test="shipping-address"]', '123 Main St')
  
  // Complete purchase
  await page.click('[data-test="place-order"]')
  
  // Verify confirmation
  await expect(page.locator('[data-test="order-confirmation"]')).toBeVisible()
  await expect(page.locator('[data-test="order-number"]')).toHaveText(/ORD-\d+/)
})
```

## Testing Best Practices

- **Blackbox approach**: Test behavior, not implementation details
- **Avoid snapshot-only tests**: They break easily and don't verify functionality
- **Use data-test attributes**: Don't rely on CSS classes or DOM structure
- **Mock external dependencies**: API calls, browser APIs
- **Test error states**: Not just happy paths
- **Keep tests fast**: Unit tests should run in milliseconds

```vue
<!-- Component with data-test attributes -->
<template>
  <div>
    <button data-test="increment" @click="increment">+</button>
    <span data-test="count">{{ count }}</span>
    <button data-test="decrement" @click="decrement">-</button>
  </div>
</template>
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Testing internal methods | Breaks on refactoring | Test public behavior only |
| Snapshot-only tests | Don't verify functionality | Combine with assertions |
| Testing CSS classes | Brittle | Use data-test attributes |
| Not awaiting async | Race conditions | Use flushPromises |
| Testing real API calls | Slow, unreliable | Mock API calls |
| Not cleaning up Pinia | State leaks between tests | Use createPinia() per test |
| Testing implementation details | Brittle tests | Blackbox approach |

## References

- [Vitest Recommended for Vue](references/testing/testing-vitest-recommended-for-vue.md)
- [E2E Playwright Recommended](references/testing/testing-e2e-playwright-recommended.md)
- [Component Blackbox Approach](references/testing/testing-component-blackbox-approach.md)
- [Async Await FlushPromises](references/testing/testing-async-await-flushpromises.md)
- [Composables Helper Wrapper](references/testing/testing-composables-helper-wrapper.md)
- [Pinia Store Setup](references/testing/testing-pinia-store-setup.md)
- [No Snapshot Only](references/testing/testing-no-snapshot-only.md)
- [Suspense Async Components](references/testing/testing-suspense-async-components.md)
- [Browser vs Node Runners](references/testing/testing-browser-vs-node-runners.md)
- [Async Component Testing](references/testing/async-component-testing.md)
- [Teleport Testing Complexity](references/testing/teleport-testing-complexity.md)