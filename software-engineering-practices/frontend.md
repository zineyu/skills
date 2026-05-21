# Layer 2: Frontend Development

## React

- Components are functions returning JSX (not classes)
- Use Hooks for state management (top-level only, never in loops/conditions)
- Lift state up for shared data; colocate state closest to where it's used
- Provide stable `key` props for lists (use IDs, not indices)
- Props down, events up (unidirectional data flow)
- Use `useMemo`/`useCallback` only when profiling shows benefit
- Prefer composition over inheritance for component reuse
- Split large components: container (logic) + presentational (UI)
- Use React.memo for pure components with expensive renders

```tsx
// Good: Simple, focused component
function UserCard({ user, onDelete }: UserCardProps) {
  const handleDelete = () => onDelete(user.id);
  return (
    <article className="user-card">
      <h3>{user.name}</h3>
      <button onClick={handleDelete}>Delete</button>
    </article>
  );
}
```

## Vue

- Use Composition API with `<script setup lang="ts">` (Vue 3)
- Extract reusable logic into composables (like React hooks)
- Use `ref` for primitives, `reactive` for objects (but prefer `ref` for consistency)
- Use `computed` for derived state, not methods
- Use `watch` for side effects, `watchEffect` for automatic dependencies
- Keep components under 200 lines; extract child components
- Use `defineProps`/`defineEmits` with TypeScript interfaces
- Prefer `v-model` over manual event handling for two-way binding
- Use `pinia` for global state (not Vuex in new projects)

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  items: Item[]
}

const props = defineProps<Props>()
const search = ref('')

const filtered = computed(() =>
  props.items.filter(i => i.name.includes(search.value))
)
</script>

<template>
  <input v-model="search" placeholder="Search..." />
  <ul>
    <li v-for="item in filtered" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
```

## TypeScript

- Enable strict mode (`strict: true`) — non-negotiable
- Use primitive types, not boxed types (`string` not `String`)
- Avoid `any`, prefer `unknown` with type guards
- Use `void` for callback return types that don't return values
- Order function overloads from specific to general
- Use `interface` for object shapes, `type` for unions/tuples
- Prefer `readonly` arrays and properties where mutation isn't needed
- Use discriminated unions for state machines
- Never use `@ts-ignore` or `@ts-expect-error` without justification

```ts
// Good: Discriminated union for state
 type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function handleState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'idle': return 'Waiting...'
    case 'loading': return 'Loading...'
    case 'success': return `Got: ${state.data}`
    case 'error': return `Error: ${state.error.message}`
  }
}
```

## JavaScript

- Use `const`, then `let`, never `var`
- Prefer object/array literals over constructors
- Use destructuring assignment
- Use template strings for interpolation
- Prefer spread syntax `...` over `Object.assign`
- Use `===` and `!==` (strict equality)
- Avoid `==` with mixed types
- Use optional chaining (`?.`) and nullish coalescing (`??`)

## CSS

- Use BEM naming: Block `__` Element `--` Modifier
- Avoid overly specific selectors (max 3 levels)
- Separate structure from presentation (OOCSS)
- Use CSS custom properties (variables) for theming
- Mobile-first responsive design (min-width media queries)
- Avoid `!important` (except utility overrides)

## Tailwind CSS

- Utility-first design — compose in className
- Use design system constraints (no magic numbers)
- Extract components for repeated patterns (`@layer components`)
- Use variants for states (`hover:`, `focus:`, `dark:`)
- Group related utilities with `@apply` in component CSS (sparingly)
- Use arbitrary values only when design system lacks the value

## HTML5

- Use semantic tags (`<header>`, `<nav>`, `<main>`, `<article>`, etc.)
- One `<main>` per page, directly inside `<body>`
- Provide structure for assistive technologies (ARIA when HTML semantics insufficient)
- Avoid abusing `<div>` and `<span>` — use semantic alternatives
- Maintain clear heading hierarchy (h1 → h2 → h3, no skips)
- Include `lang` attribute on `<html>`
- Use `alt` text for images (empty string for decorative images)

## Vite

- Use explicit import path extensions
- Avoid barrel files (index.ts re-exports) — they break tree-shaking
- Use `server.warmup` for common files in dev
- Prefer native CSS over preprocessors when possible
- Minimize `resolve.extensions`
- Use `build.rollupOptions` for advanced bundle control

## Frontend Anti-Patterns

| Practice | Anti-Pattern | Correct Approach |
|----------|-------------|------------------|
| React Hooks | Calling in loops/conditions | Call only at component top level |
| React Keys | Using array index as key | Use stable unique IDs |
| TypeScript | Using `any` | Use `unknown` + type guards |
| TypeScript | `@ts-ignore` without reason | Fix the type or use proper guard |
| JavaScript | Using `var` | Use `const` / `let` |
| CSS | Over-specific selectors | Use class selectors, max 3 levels |
| Tailwind | Copying 20+ classes everywhere | Extract as components |
| HTML | All `<div>` containers | Use semantic tags |
| Vue | Mixing Options and Composition API | Pick one (Composition API recommended) |
| Vue | `watch` without cleanup | Use `watchEffect` or manual cleanup |

## Frontend Project Structure

```
project/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/             # Primitive UI components (Button, Input)
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components (route-level)
│   ├── hooks/              # Custom React hooks / Vue composables
│   ├── stores/             # State management (Pinia/Redux/Zustand)
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types and interfaces
│   ├── styles/             # Global CSS, Tailwind config
│   └── api/                # API client and endpoints
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## Core Web Vitals Targets

- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- **FCP** (First Contentful Paint) < 1.8s
- **TTFB** (Time to First Byte) < 600ms