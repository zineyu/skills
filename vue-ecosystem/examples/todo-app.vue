<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

// State
const newTodoText = ref('')
const filter = ref<'all' | 'active' | 'completed'>('all')
const todos = ref<Todo[]>([
  { id: '1', text: 'Learn Vue 3', completed: true, createdAt: new Date() },
  { id: '2', text: 'Build an app', completed: false, createdAt: new Date() }
])

// Computed
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active': return todos.value.filter(t => !t.completed)
    case 'completed': return todos.value.filter(t => t.completed)
    default: return todos.value
  }
})

const stats = computed(() => ({
  total: todos.value.length,
  active: todos.value.filter(t => !t.completed).length,
  completed: todos.value.filter(t => t.completed).length
}))

// Methods
function addTodo() {
  const text = newTodoText.value.trim()
  if (!text) return

  todos.value.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: new Date()
  })
  newTodoText.value = ''
}

function toggleTodo(id: string) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.completed = !todo.completed
}

function removeTodo(id: string) {
  todos.value = todos.value.filter(t => t.id !== id)
}

// Watchers
watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos))
}, { deep: true })
</script>

<template>
  <div class="todo-app">
    <h1>Todo List</h1>
    
    <!-- Input -->
    <form @submit.prevent="addTodo">
      <input
        v-model="newTodoText"
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      />
      <button type="submit">Add</button>
    </form>

    <!-- Filters -->
    <div class="filters">
      <button
        v-for="f in ['all', 'active', 'completed']"
        :key="f"
        :class="{ active: filter === f }"
        @click="filter = f"
      >
        {{ f.charAt(0).toUpperCase() + f.slice(1) }}
      </button>
    </div>

    <!-- List -->
    <ul class="todo-list">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
        />
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">Remove</button>
      </li>
    </ul>

    <!-- Stats -->
    <div class="stats">
      <span>{{ stats.active }} items left</span>
      <span>{{ stats.completed }} completed</span>
    </div>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

input[type="text"] {
  flex: 1;
  padding: 8px;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.filters button.active {
  background: #007bff;
  color: white;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #999;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  color: #666;
}
</style>