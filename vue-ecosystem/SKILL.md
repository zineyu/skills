---
name: vue-ecosystem
description: Comprehensive Vue.js 3 ecosystem best practices covering core framework (Composition API, reactivity, SFC), Vue Router, testing (Vitest/Vue Test Utils/Playwright), and VueUse composables. Use for ANY Vue.js, Vue Router, Pinia, VueUse, or Vite+Vue work.
triggers:
  layer-1:
    - always
  layer-2:
    core:
      - "vue"
      - "composition api"
      - "script setup"
      - "defineProps"
      - "ref"
      - "reactive"
      - "computed"
      - "watch"
      - "sfc"
      - ".vue"
    routing:
      - "vue router"
      - "router"
      - "route"
      - "navigation guard"
      - "beforeEach"
      - "beforeEnter"
    testing:
      - "vitest"
      - "vue test utils"
      - "playwright"
      - "test vue"
      - "component test"
      - "e2e"
    vueuse:
      - "vueuse"
      - "composable"
      - "useLocalStorage"
      - "useFetch"
      - "useDark"
  layer-3:
    - "deep"
    - "advanced"
    - "performance"
    - "optimize"
    - "ssr"
    - "nuxt"
---

# Vue Ecosystem

Based on Vue 3.5+. Always use Composition API with `<script setup lang="ts">`.

## Quick Navigation

| Topic | File | Keywords |
|-------|------|----------|
| **Core Framework** | [core.md](core.md) | Reactivity, components, composables, SFC |
| **Vue Router** | [routing.md](routing.md) | Navigation guards, route lifecycle, setup |
| **Testing** | [testing.md](testing.md) | Vitest, Vue Test Utils, Playwright, Pinia |
| **VueUse** | [vueuse.md](vueuse.md) | Composables by category, invocation rules |
| **Advanced** | [advanced.md](advanced.md) | Performance, SSR, Nuxt, built-in components |
| **References** | [references/](references/) | Detailed docs for specific scenarios |
| **Examples** | [examples/](examples/) | Working code snippets |

## Stack Defaults

- Vue 3 + Composition API + `<script setup lang="ts">`
- TypeScript over JavaScript
- `shallowRef` over `ref` if deep reactivity is not needed
- Pinia for state management
- Vitest + Vue Test Utils for unit tests
- Playwright for E2E tests

## Core Principles

1. **Keep state predictable**: One source of truth, derive everything with `computed`
2. **Make data flow explicit**: Props down, Events up
3. **Favor small, focused components**: Easier to test, reuse, and maintain
4. **Extract logic into composables**: Reused, stateful, or side-effect heavy logic
5. **Always check VueUse first**: Before writing custom composables

## Self-Check

Before finishing any Vue task:
- [ ] All must-read references were read and applied
- [ ] Reactivity model is minimal and predictable
- [ ] Components are focused and well-factored
- [ ] Data flow contracts are explicit and typed
- [ ] Composables are used where reuse/complexity justifies them
- [ ] Router guards handle async correctly and avoid infinite loops
- [ ] Tests use blackbox approach
- [ ] VueUse functions were considered before writing custom code

## External References

- [Vue.js Official Docs](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Vitest](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright](https://playwright.dev/)