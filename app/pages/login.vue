<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value.trim().toLowerCase(),
        password: password.value
      }
    })

    window.location.href = '/classrooms'
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Нэвтрэхэд алдаа гарлаа'
  } finally {
    loading.value = false
  }
}
const { isLightMode, toggleTheme } = useTheme()
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-4">
    <button
  class="theme-toggle"
  @click="toggleTheme"
>
  {{ isLightMode ? '🌙 Dark' : '☀️ Light' }}
</button>
    
    <form class="glass-card w-full max-w-md p-8" @submit.prevent="login">
      <h1 class="text-3xl font-bold text-white">
        Smart Classroom Login
      </h1>

      <p class="mt-2 text-sm text-slate-400">
        Системд нэвтрэх хэсэг
      </p>

      <div class="mt-6 space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-400">
        {{ error }}
      </p>

      <button
        type="submit"
        class="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
      >
        {{ loading ? 'Нэвтэрч байна...' : 'Нэвтрэх' }}
      </button>
      <p class="mt-5 text-center text-sm text-slate-400">
  Бүртгэлгүй юу?
  <NuxtLink to="/register" class="text-cyan-300 hover:text-cyan-200">
    Бүртгүүлэх
  </NuxtLink>
</p>
    </form>
  </main>
</template>