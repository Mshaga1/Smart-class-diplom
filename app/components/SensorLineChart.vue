<script setup lang="ts">
interface ChartPoint {
  label: string
  temperature: number
  humidity: number
  airQuality: number
}

const props = defineProps<{
  data: ChartPoint[]
}>()

const width = 800
const height = 260
const padding = 36

const normalize = (value: number, min: number, max: number) => {
  return height - padding - ((value - min) / (max - min)) * (height - padding * 2)
}

const makePath = (
  key: 'temperature' | 'humidity' | 'airQuality',
  min: number,
  max: number
) => {
  if (props.data.length < 2) return ''

  return props.data
    .map((item, index) => {
      const x = padding + (index / (props.data.length - 1)) * (width - padding * 2)
      const y = normalize(item[key], min, max)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}
</script>

<template>
  <div class="glass-card p-6">
    <div class="mb-5 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-white">
          Real-time Sensor Graph
        </h2>
        <p class="text-sm text-slate-400">
          Сүүлийн 20 хэмжилтийн өөрчлөлт
        </p>
      </div>
    </div>

    <div v-if="data.length < 2" class="py-16 text-center text-slate-400">
      Sensor data хүлээж байна...
    </div>

    <div v-else class="overflow-x-auto">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        class="min-w-[720px] rounded-2xl bg-slate-950/50"
      >
        <line
          v-for="i in 5"
          :key="i"
          :x1="padding"
          :x2="width - padding"
          :y1="padding + i * 40"
          :y2="padding + i * 40"
          stroke="rgba(148,163,184,0.15)"
        />

        <path
          :d="makePath('temperature', 0, 50)"
          fill="none"
          stroke="#22d3ee"
          stroke-width="3"
          stroke-linecap="round"
        />

        <path
          :d="makePath('humidity', 0, 100)"
          fill="none"
          stroke="#a78bfa"
          stroke-width="3"
          stroke-linecap="round"
        />

        <path
          :d="makePath('airQuality', 300, 1500)"
          fill="none"
          stroke="#facc15"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <div class="mt-5 flex flex-wrap gap-4 text-sm">
      <span class="text-cyan-300">● Temperature</span>
      <span class="text-violet-300">● Humidity</span>
      <span class="text-yellow-300">● Air Quality</span>
    </div>
  </div>
</template>