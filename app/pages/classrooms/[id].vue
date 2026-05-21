<script setup lang="ts">
import { useIotStore } from '~/stores/iotStore'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

interface Classroom {
  id: string
  name: string
  slug: string
  description: string | null
  floor: number | null
  capacity: number | null
  isActive: boolean
}

const route = useRoute()
const slug = route.params.id as string

const { data: classrooms } = await useFetch<Classroom[]>('/api/classrooms')
const classroom = computed(() => classrooms.value?.find(c => c.slug === slug) ?? null)

const store = useIotStore()
let timer: ReturnType<typeof setInterval> | null = null

// Offline = device was active before but stopped sending data
const isOffline = computed(() =>
  store.deviceStatus === 'offline' && store.updatedAt !== ''
)

onMounted(async () => {
  if (!classroom.value?.isActive) return

  store.refreshNow()
  await store.fetchLatestSensors()

  timer = setInterval(async () => {
    store.refreshNow()
    await store.fetchLatestSensors()
  }, 2000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="px-8 py-8">
    <!-- Back + header -->
    <div class="mb-8">
      <NuxtLink
        to="/classrooms"
        class="inline-flex items-center gap-1.5 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Ангиуд
      </NuxtLink>

      <div class="mt-3 flex items-center gap-4">
        <div>
          <h1
            class="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-4xl font-extrabold text-transparent"
          >
            {{ classroom?.name }}
          </h1>

          <p class="mt-1 text-sm text-slate-400">
            {{ classroom?.description }}
            <span class="mx-2 text-slate-600">·</span>
            {{ classroom?.capacity }} суудал
          </p>
        </div>

        <span
          class="ml-auto rounded-full px-3 py-1 text-xs font-bold"
          :class="
            classroom?.isActive
              ? 'bg-green-500/15 text-green-400'
              : 'bg-slate-700/50 text-slate-400'
          "
        >
          {{ classroom?.isActive ? '● Идэвхтэй' : '○ Офлайн' }}
        </span>
      </div>
    </div>

    <!-- Offline state -->
    <div
      v-if="!classroom?.isActive"
      class="glass-card flex flex-col items-center justify-center py-20 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-slate-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
      >
        <path d="M5 12.55a11 11 0 0114.08 0" />
        <path d="M1.42 9a16 16 0 0121.16 0" />
        <path d="M8.53 16.11a6 6 0 016.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" stroke-width="3" stroke-linecap="round" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>

      <h3 class="mt-5 text-2xl font-bold text-white">
        Мэдрэгч холбогдоогүй
      </h3>

      <p class="mt-2 max-w-sm text-slate-400">
        {{ classroom?.name }}-д суурилуулсан мэдрэгч одоогоор идэвхгүй байна.
        Төхөөрөмж холбогдсоны дараа энд мэдээлэл харагдана.
      </p>
    </div>

    <!-- Active: sensor dashboard -->
    <template v-else>
      <!-- Device mode + last update -->
      <div class="mb-5 flex items-center gap-3">
        <div class="glass-card px-4 py-3">
          <p class="text-xs text-slate-400">
            Device Mode
          </p>

          <div class="mt-1 flex items-center gap-2">
            <span
              class="h-2.5 w-2.5 rounded-full"
              :class="store.mode === 'real' ? 'bg-green-400' : 'bg-cyan-400'"
            />

            <span class="text-sm font-semibold uppercase text-white">
              {{ store.mode }}
            </span>
          </div>
        </div>

        <div class="glass-card px-4 py-3 text-sm text-slate-400">
          Сүүлд шинэчлэгдсэн:
          <span class="ml-1 text-white">{{ store.updatedAt || '—' }}</span>
        </div>
      </div>

      <!-- Offline banner -->
      <div
        v-if="isOffline"
        class="mb-5 flex items-center gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-3.5"
      >
        <span class="h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />
        <p class="text-sm text-red-300">
          Төхөөрөмж холбогдоогүй байна — доорх утгууд <span class="font-semibold">сүүлд хадгалагдсан</span> мэдээлэл болно.
        </p>
      </div>

      <!-- Sensor gauges -->
      <div class="grid gap-5 md:grid-cols-5">
        <SensorGauge
          title="Temperature"
          :value="store.temperature"
          unit="°C"
          :status="store.tempStatus"
          :offline="isOffline"
          :min="0"
          :max="50"
        />

        <SensorGauge
          title="Humidity"
          :value="store.humidity"
          unit="%"
          :status="store.humidityStatus"
          :offline="isOffline"
          :min="0"
          :max="100"
        />

        <SensorGauge
          title="Air Quality"
          :value="store.airQuality"
          unit="PPM"
          :status="store.airStatus"
          :offline="isOffline"
          :min="300"
          :max="1500"
        />

        <SensorGauge
          title="Light Level"
          :value="store.light"
          unit="LUX"
          :status="store.lightStatus"
          :offline="isOffline"
          :min="0"
          :max="4095"
        />

        <SensorGauge
          title="Fire Level"
          :value="store.fireValue"
          unit=""
          :status="store.fireStatus"
          :offline="isOffline"
          :min="0"
          :max="4095"
        />
      </div>

      <!-- Chart -->
      <SensorLineChart
        class="mt-6"
        :data="store.history"
      />

      <!-- Admin control panel -->
      <div
        v-if="false"
        class="glass-card mt-6 p-6"
      >
        <!-- Reserved for admin controls -->
      </div>
    </template>
  </div>
</template>
