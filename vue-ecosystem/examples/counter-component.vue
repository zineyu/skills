<script setup lang="ts">
import { ref } from 'vue'

// v-model implementation
const title = defineModel<string>('title', { required: true })
const count = defineModel<number>('count', { default: 0 })

// Props with defaults
interface Props {
  maxCount?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 100,
  disabled: false
})

// Typed emits
const emit = defineEmits<{
  'max-reached': [count: number]
  reset: []
}>()

function increment() {
  if (props.disabled) return
  if (count.value >= props.maxCount) {
    emit('max-reached', count.value)
    return
  }
  count.value++
}

function decrement() {
  if (props.disabled || count.value <= 0) return
  count.value--
}

function reset() {
  count.value = 0
  emit('reset')
}
</script>

<template>
  <div class="counter">
    <h3>{{ title }}</h3>
    
    <div class="controls">
      <button 
        :disabled="disabled || count <= 0"
        @click="decrement"
      >
        -
      </button>
      
      <span class="count" :class="{ 'at-max': count >= maxCount }">
        {{ count }}
      </span>
      
      <button
        :disabled="disabled || count >= maxCount"
        @click="increment"
      >
        +
      </button>
    </div>
    
    <button v-if="count > 0" @click="reset">
      Reset
    </button>
    
    <div v-if="count >= maxCount" class="warning">
      Maximum reached!
    </div>
  </div>
</template>

<style scoped>
.counter {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}

.count {
  font-size: 24px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.count.at-max {
  color: #dc3545;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.warning {
  color: #dc3545;
  font-size: 14px;
}
</style>