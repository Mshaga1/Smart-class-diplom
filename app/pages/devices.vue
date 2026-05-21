<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard'
})

interface SensorReading {
  temperature: number
  humidity: number
  airQuality: number
  fireValue: number
  light: number
  mode: string
  createdAt: string
}

const { data: latest } = await useFetch<SensorReading>('/api/sensors/latest')

const deviceStatus = computed(() => {
  if (!latest.value?.createdAt) return 'offline'
  const diff = (Date.now() - new Date(latest.value.createdAt).getTime()) / 1000
  return diff <= 15 ? 'online' : 'offline'
})

const lastSeen = computed(() => {
  if (!latest.value?.createdAt) return '—'
  return new Date(latest.value.createdAt).toLocaleString('mn-MN')
})

const sensors = [
  { name: 'DHT22 — Температур / Чийгшил', pin: 'D4', status: true },
  { name: 'MQ-135 — Агаарын чанар', pin: 'A0', status: true },
  { name: 'LDR — Гэрэлт байдал', pin: 'A1', status: true },
  { name: 'Fire Sensor — Гал илрүүлэгч', pin: 'D2', status: true }
]
</script>

<template>
  <div class="px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
        Тоног төхөөрөмж
      </p>

      <h1
        class="mt-2 bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-4xl font-extrabold text-transparent"
      >
        Төхөөрөмжүүд
      </h1>
    </div>

    <div class="space-y-5">
      <!-- Main device card -->
      <div class="glass-card p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <!-- Device icon -->
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-7 w-7 text-cyan-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" />
                <line x1="20" y1="14" x2="23" y2="14" />
                <line x1="1" y1="9" x2="4" y2="9" />
                <line x1="1" y1="14" x2="4" y2="14" />
              </svg>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white">
                ESP32 IoT Module
              </h3>

              <p class="text-sm text-slate-400">
                Анги 101 · Мэдрэгчийн үндсэн хяналтын блок
              </p>
            </div>
          </div>

          <!-- Online/offline badge -->
          <div
            class="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
            :class="
              deviceStatus === 'online'
                ? 'bg-green-500/15 text-green-400'
                : 'bg-red-500/15 text-red-400'
            "
          >
            <span
              class="h-2 w-2 rounded-full"
              :class="
                deviceStatus === 'online'
                  ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]'
                  : 'bg-red-400'
              "
            />
            {{ deviceStatus === 'online' ? 'Онлайн' : 'Офлайн' }}
          </div>
        </div>

        <!-- Device details -->
        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-slate-800/50 px-4 py-3">
            <p class="text-[11px] text-slate-400">
              Горим
            </p>

            <p class="mt-1 font-semibold capitalize text-white">
              {{ latest?.mode || '—' }}
            </p>
          </div>

          <div class="rounded-xl bg-slate-800/50 px-4 py-3">
            <p class="text-[11px] text-slate-400">
              Сүүлийн өгөгдөл
            </p>

            <p class="mt-1 text-sm font-semibold text-white">
              {{ lastSeen }}
            </p>
          </div>

          <div class="rounded-xl bg-slate-800/50 px-4 py-3">
            <p class="text-[11px] text-slate-400">
              Анги
            </p>

            <p class="mt-1 font-semibold text-white">
              Анги 101
            </p>
          </div>
        </div>
      </div>

      <!-- Sensors list -->
      <div class="glass-card p-6">
        <h3 class="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Холбогдсон мэдрэгчүүд
        </h3>

        <div class="space-y-3">
          <div
            v-for="sensor in sensors"
            :key="sensor.name"
            class="flex items-center justify-between rounded-xl border border-slate-700/30 px-4 py-3.5"
          >
            <div class="flex items-center gap-3">
              <span
                class="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]"
              />

              <div>
                <p class="text-sm font-medium text-white">
                  {{ sensor.name }}
                </p>

                <p class="text-xs text-slate-500">
                  Pin: {{ sensor.pin }}
                </p>
              </div>
            </div>

            <span class="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold text-green-400">
              Идэвхтэй
            </span>
          </div>
        </div>
      </div>

      <!-- Note for future devices -->
      <div class="rounded-2xl border border-dashed border-slate-700/50 px-6 py-5 text-center text-sm text-slate-500">
        Ирээдүйд нэмэгдэх төхөөрөмжүүд энд харагдана
      </div>
    </div>
  </div>
</template>
