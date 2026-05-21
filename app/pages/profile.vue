<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

type JwtPayload = {
  userId: string
  name: string
  email: string
  role: 'admin' | 'user'
}

const token = useCookie('smartclass_token')

const user = computed<JwtPayload | null>(() => {
  if (!token.value) return null
  const parts = token.value.split('.')
  if (!parts[1]) return null
  try {
    return JSON.parse(atob(parts[1])) as JwtPayload
  } catch {
    return null
  }
})
</script>

<template>
  <div class="px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
        Тохиргоо
      </p>

      <h1
        class="mt-2 bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-4xl font-extrabold text-transparent"
      >
        Профайл
      </h1>
    </div>

    <div class="max-w-lg space-y-5">
      <!-- Avatar + name card -->
      <div class="glass-card p-8">
        <div class="flex items-center gap-5">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold"
            :class="
              user?.role === 'admin'
                ? 'bg-red-500/25 text-red-200'
                : 'bg-cyan-500/25 text-cyan-200'
            "
          >
            {{ user?.email?.charAt(0).toUpperCase() || 'U' }}
          </div>

          <div>
            <h2 class="text-xl font-bold text-white">
              {{ user?.name }}
            </h2>

            <span
              class="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
              :class="
                user?.role === 'admin'
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-cyan-500/20 text-cyan-300'
              "
            >
              {{ user?.role?.toUpperCase() }}
            </span>
          </div>
        </div>

        <!-- Info rows -->
        <div class="mt-7 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-700/40 pb-4">
            <span class="text-sm text-slate-400">Нэр</span>

            <span class="text-sm font-semibold text-white">
              {{ user?.name || '—' }}
            </span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-700/40 pb-4">
            <span class="text-sm text-slate-400">И-мэйл</span>

            <span class="text-sm font-semibold text-white">
              {{ user?.email || '—' }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">Эрх</span>

            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-bold"
              :class="
                user?.role === 'admin'
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-cyan-500/20 text-cyan-300'
              "
            >
              {{ user?.role === 'admin' ? 'Администратор' : 'Хэрэглэгч' }}
            </span>
          </div>
        </div>
      </div>

      <!-- System info -->
      <div class="glass-card p-6">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Системийн мэдээлэл
        </h3>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-400">Систем</span>

            <span class="text-white">Smart Classroom</span>
          </div>

          <div class="flex justify-between">
            <span class="text-slate-400">Хувилбар</span>

            <span class="text-white">v1.0.0</span>
          </div>

          <div class="flex justify-between">
            <span class="text-slate-400">Технологи</span>

            <span class="text-white">Nuxt 4 · Prisma · MongoDB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
