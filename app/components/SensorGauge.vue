<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'danger' | 'Bright' | 'Dark'
  min: number
  max: number
  offline?: boolean
}>()

const percentage = computed(() => {
  const range = props.max - props.min
  const value = ((props.value - props.min) / range) * 100
  return Math.min(Math.max(value, 0), 100)
})

const statusClass = computed(() => {
  if (props.offline) return 'sensor-offline'
  return {
    good: 'sensor-good',
    warning: 'sensor-warning',
    danger: 'sensor-danger',
    Bright: 'sensor-bright',
    Dark: 'sensor-dark'
  }[props.status]
})
</script>

<template>
  <div
    class="glass-card p-6 transition-opacity duration-300"
    :class="offline ? 'opacity-70' : 'opacity-100'"
  >
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-sm font-medium text-slate-300">
        {{ title }}
      </h3>

      <!-- Offline badge -->
      <span
        v-if="offline"
        class="sensor-offline flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-slate-400" />
        Офлайн
      </span>

      <!-- Normal status badge -->
      <span
        v-else
        class="rounded-full border px-3 py-1 text-xs font-semibold uppercase"
        :class="statusClass"
      >
        {{ status }}
      </span>
    </div>

    <div class="mb-4">
      <span
        class="text-4xl font-bold transition-colors duration-300"
        :class="offline ? 'text-slate-400' : 'text-white'"
      >
        {{ value }}
      </span>

      <span class="ml-1 text-slate-400">{{ unit }}</span>

      <span
        v-if="offline"
        class="ml-2 text-xs text-slate-500"
      >
        (сүүлийн)
      </span>
    </div>

    <div class="h-3 overflow-hidden rounded-full bg-slate-800">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="offline ? 'bg-slate-600' : 'bg-cyan-400'"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
