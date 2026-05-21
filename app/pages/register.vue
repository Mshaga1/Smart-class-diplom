<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const register = async () => {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Нууц үг таарахгүй байна'
    return
  }

  loading.value = true

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value
      }
    })

    await navigateTo('/login')
  } catch (e) {
    error.value = 'Бүртгэл амжилтгүй боллоо'
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
    <form class="glass-card w-full max-w-md p-8" @submit.prevent="register">
      <h1 class="text-3xl font-bold text-white">Бүртгүүлэх</h1>

      <p class="mt-2 text-sm text-slate-400">
        Smart Classroom системд шинэ хэрэглэгч үүсгэх
      </p>

      <div class="mt-6 space-y-4">
        <input v-model="name" type="text" placeholder="Нэр"
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400" />

        <input v-model="email" type="email" placeholder="Email"
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400" />

        <input v-model="password" type="password" placeholder="Нууц үг"
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400" />

        <input v-model="confirmPassword" type="password" placeholder="Нууц үг давтах"
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400" />
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-400">
        {{ error }}
      </p>

      <button
        type="submit"
        class="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
      >
        {{ loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх' }}
      </button>

      <p class="mt-5 text-center text-sm text-slate-400">
        Бүртгэлтэй юу?
        <NuxtLink to="/login" class="text-cyan-300 hover:text-cyan-200">
          Нэвтрэх
        </NuxtLink>
      </p>
    </form>
  </main>
</template>