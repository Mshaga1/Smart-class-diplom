<script setup lang="ts">
type JwtPayload = {
  userId: string
  name: string
  email: string
  role: 'admin' | 'user'
}

const token = useCookie('smartclass_token')
const route = useRoute()
const { isLightMode, toggleTheme } = useTheme()

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

const logout = () => {
  token.value = null
  window.location.href = '/login'
}

const allNavItems = [
  { label: 'Ангиуд', to: '/classrooms', icon: 'classroom', adminOnly: false },
  { label: 'Профайл', to: '/profile', icon: 'profile', adminOnly: false },
  { label: 'Төхөөрөмжүүд', to: '/devices', icon: 'devices', adminOnly: true }
]

const navItems = computed(() =>
  allNavItems.filter(item => !item.adminOnly || user.value?.role === 'admin')
)

const isActive = (to: string) =>
  route.path === to || route.path.startsWith(to + '/')
</script>

<template>
  <div class="flex">
    <!-- Fixed Sidebar -->
    <aside class="sidebar-glass fixed inset-y-0 left-0 z-40 flex w-60 flex-col">
      <!-- Logo -->
      <div class="px-6 py-7">
        <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400">
          Smart
        </p>
        <h2 class="mt-0.5 text-xl font-extrabold text-white">
          Classroom
        </h2>
      </div>

      <div class="mx-5 h-px bg-slate-700/50" />

      <!-- Navigation -->
      <nav class="mt-3 flex-1 space-y-0.5 px-3">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(item.to) }"
        >
          <!-- Classroom icon -->
          <svg
            v-if="item.icon === 'classroom'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>

          <!-- Profile icon -->
          <svg
            v-if="item.icon === 'profile'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>

          <!-- Devices icon -->
          <svg
            v-if="item.icon === 'devices'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
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

          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Bottom section -->
      <div class="space-y-3 p-4">
        <div class="mx-1 h-px bg-slate-700/50" />

        <!-- Theme toggle -->
        <button
          class="nav-link w-full"
          @click="toggleTheme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span>{{ isLightMode ? 'Light mode' : 'Dark mode' }}</span>
        </button>

        <!-- User card -->
        <div class="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-3">
          <div class="flex items-center gap-3">
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              :class="
                user?.role === 'admin'
                  ? 'bg-red-500/30 text-red-200'
                  : 'bg-cyan-500/30 text-cyan-200'
              "
            >
              {{ user?.email?.charAt(0).toUpperCase() || 'U' }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-white">
                {{ user?.name || 'Хэрэглэгч' }}
              </p>

              <span
                class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
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

          <button
            class="mt-2.5 flex w-full items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-red-300"
            @click="logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Гарах
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content (offset by sidebar width) -->
    <main class="ml-60 min-h-screen flex-1">
      <slot />
    </main>
  </div>
</template>
