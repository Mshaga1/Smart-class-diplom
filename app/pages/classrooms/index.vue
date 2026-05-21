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

interface Classroom {
  id: string
  name: string
  slug: string
  description: string | null
  floor: number | null
  capacity: number | null
  isActive: boolean
  createdAt: string
}

// ── Current user ──────────────────────────────────────
const token = useCookie('smartclass_token')
const user = computed<JwtPayload | null>(() => {
  if (!token.value) return null
  const parts = token.value.split('.')
  if (!parts[1]) return null
  try { return JSON.parse(atob(parts[1])) as JwtPayload }
  catch { return null }
})
const isAdmin = computed(() => user.value?.role === 'admin')

// ── Classrooms fetch ───────────────────────────────────
const { data: classrooms, pending, refresh } = await useFetch<Classroom[]>('/api/classrooms')

// ── Inline edit ────────────────────────────────────────
const editingId = ref<string | null>(null)
const editLoading = ref(false)
const editError = ref('')
const editForm = ref({ name: '', description: '', floor: 1, capacity: 40 })

function startEdit(classroom: Classroom) {
  editingId.value = classroom.id
  editError.value = ''
  editForm.value = {
    name: classroom.name,
    description: classroom.description ?? '',
    floor: classroom.floor ?? 1,
    capacity: classroom.capacity ?? 40
  }
}

function cancelEdit() {
  editingId.value = null
  editError.value = ''
}

async function saveEdit(id: string) {
  editLoading.value = true
  editError.value = ''
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ($fetch as any)(`/api/classrooms/${id}`, {
      method: 'PATCH',
      body: {
        name: editForm.value.name,
        description: editForm.value.description,
        floor: editForm.value.floor,
        capacity: editForm.value.capacity
      }
    })
    editingId.value = null
    await refresh()
  } catch (e: any) {
    editError.value = e?.data?.statusMessage || 'Хадгалахад алдаа гарлаа'
  } finally {
    editLoading.value = false
  }
}

// ── Add classroom modal ────────────────────────────────
const showAddModal = ref(false)
const addLoading = ref(false)
const addError = ref('')
const addForm = ref({ name: '', room: '', floor: 1, capacity: 40 })

function openAddModal() {
  addForm.value = { name: '', room: '', floor: 1, capacity: 40 }
  addError.value = ''
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
  addError.value = ''
}

async function submitAddClassroom() {
  if (!addForm.value.room.trim()) {
    addError.value = 'Ангийн дугаар оруулна уу'
    return
  }

  addLoading.value = true
  addError.value = ''

  try {
    const room = addForm.value.room.trim()
    const slug = `angi-${room.toLowerCase().replace(/\s+/g, '-')}`
    const name = addForm.value.name.trim() || `Анги ${room}`
    const description = `${addForm.value.floor}-р давхар, ${room} тоот`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ($fetch as any)('/api/classrooms', {
      method: 'POST',
      body: {
        name,
        slug,
        description,
        floor: addForm.value.floor,
        capacity: addForm.value.capacity
      }
    })

    closeAddModal()
    await refresh()
  } catch (e: any) {
    addError.value = e?.data?.statusMessage || 'Үүсгэхэд алдаа гарлаа'
  } finally {
    addLoading.value = false
  }
}
</script>

<template>
  <div class="px-8 py-8">
    <!-- Header -->
    <div class="mb-8 flex items-end justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Smart Classroom
        </p>

        <h1
          class="mt-2 bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-4xl font-extrabold text-transparent"
        >
          Ангиуд
        </h1>

        <p class="mt-1 text-sm text-slate-400">
          Мэдрэгч суурилуулсан ангиудын жагсаалт
        </p>
      </div>

      <!-- Admin: Add button -->
      <button
        v-if="isAdmin"
        class="flex items-center gap-2 rounded-xl bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-300 border border-cyan-500/25 transition hover:bg-cyan-500/25"
        @click="openAddModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Анги нэмэх
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="pending" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="i in 4" :key="i" class="glass-card h-52 animate-pulse p-6" />
    </div>

    <!-- Classroom grid -->
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="classroom in classrooms"
        :key="classroom.id"
        class="glass-card p-6"
      >
        <!-- ── EDIT MODE ── -->
        <template v-if="editingId === classroom.id">
          <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Засах
          </p>

          <div class="space-y-3">
            <!-- Name -->
            <div>
              <label class="mb-1 block text-xs text-slate-400">Нэр</label>
              <input
                v-model="editForm.name"
                type="text"
                class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              />
            </div>

            <!-- Floor + Capacity -->
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="mb-1 block text-xs text-slate-400">Давхар</label>
                <input
                  v-model.number="editForm.floor"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label class="mb-1 block text-xs text-slate-400">Суудал</label>
                <input
                  v-model.number="editForm.capacity"
                  type="number"
                  min="1"
                  max="200"
                  class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="mb-1 block text-xs text-slate-400">Тайлбар</label>
              <input
                v-model="editForm.description"
                type="text"
                class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              />
            </div>

            <!-- Error -->
            <p v-if="editError" class="text-xs text-red-400">
              {{ editError }}
            </p>

            <!-- Save / Cancel -->
            <div class="flex gap-2 pt-1">
              <button
                class="flex-1 rounded-xl bg-cyan-500 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
                :disabled="editLoading"
                @click="saveEdit(classroom.id)"
              >
                {{ editLoading ? 'Хадгалж...' : 'Хадгалах' }}
              </button>

              <button
                class="rounded-xl border border-slate-700/60 px-4 py-2 text-sm text-slate-400 transition hover:text-white"
                :disabled="editLoading"
                @click="cancelEdit"
              >
                Болих
              </button>
            </div>
          </div>
        </template>

        <!-- ── NORMAL VIEW ── -->
        <template v-else>
          <!-- Header row -->
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <h3 class="text-lg font-bold text-white">
                {{ classroom.name }}
              </h3>

              <p class="mt-0.5 text-sm text-slate-400">
                {{ classroom.description }}
              </p>
            </div>

            <span
              class="ml-3 mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
              :class="
                classroom.isActive
                  ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                  : 'bg-slate-600'
              "
            />
          </div>

          <!-- Stats -->
          <div class="mt-5 grid grid-cols-2 gap-2">
            <div class="rounded-xl bg-slate-800/50 px-3 py-2.5">
              <p class="text-[11px] text-slate-400">
                Давхар
              </p>

              <p class="mt-0.5 font-semibold text-white">
                {{ classroom.floor }}-р давхар
              </p>
            </div>

            <div class="rounded-xl bg-slate-800/50 px-3 py-2.5">
              <p class="text-[11px] text-slate-400">
                Суудал
              </p>

              <p class="mt-0.5 font-semibold text-white">
                {{ classroom.capacity }}
              </p>
            </div>
          </div>

          <!-- Status + action row -->
          <div class="mt-4 flex items-center justify-between">
            <span
              class="text-xs font-semibold"
              :class="classroom.isActive ? 'text-green-400' : 'text-slate-500'"
            >
              {{ classroom.isActive ? '● Идэвхтэй' : '○ Офлайн' }}
            </span>

            <div class="flex items-center gap-2">
              <!-- Admin edit button -->
              <button
                v-if="isAdmin"
                class="flex items-center gap-1 rounded-lg border border-slate-700/50 px-2.5 py-1 text-xs text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
                @click.prevent="startEdit(classroom)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Засах
              </button>

              <NuxtLink
                :to="`/classrooms/${classroom.slug}`"
                class="text-xs text-slate-500 transition hover:text-slate-300"
              >
                Дэлгэрэнгүй →
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- ── ADD CLASSROOM MODAL ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            @click="closeAddModal"
          />

          <!-- Modal card -->
          <div class="glass-card relative z-10 w-full max-w-md p-8">
            <!-- Title -->
            <div class="mb-6 flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Администратор
                </p>

                <h2 class="mt-1 text-xl font-bold text-white">
                  Анги нэмэх
                </h2>
              </div>

              <button
                class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
                @click="closeAddModal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <!-- Room number -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-300">
                  Ангийн дугаар <span class="text-red-400">*</span>
                </label>

                <input
                  v-model="addForm.room"
                  type="text"
                  placeholder="Жишээ: 303, A-201"
                  class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />

                <p class="mt-1 text-xs text-slate-500">
                  URL хаяг: /classrooms/angi-{{ addForm.room.toLowerCase() || '???' }}
                </p>
              </div>

              <!-- Custom name (optional) -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-300">
                  Нэр
                  <span class="ml-1 text-xs text-slate-500">(орхивол автоматаар)</span>
                </label>

                <input
                  v-model="addForm.name"
                  type="text"
                  :placeholder="`Анги ${addForm.room || '???'}`"
                  class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <!-- Floor + Capacity -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-300">
                    Давхар
                  </label>

                  <input
                    v-model.number="addForm.floor"
                    type="number"
                    min="1"
                    max="10"
                    class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-300">
                    Суудалны тоо
                  </label>

                  <input
                    v-model.number="addForm.capacity"
                    type="number"
                    min="1"
                    max="200"
                    class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <!-- Error -->
              <p v-if="addError" class="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {{ addError }}
              </p>

              <!-- Submit -->
              <button
                class="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
                :disabled="addLoading"
                @click="submitAddClassroom"
              >
                {{ addLoading ? 'Үүсгэж байна...' : 'Анги үүсгэх' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .glass-card,
.modal-leave-active .glass-card {
  transition: transform 0.2s ease;
}
.modal-enter-from .glass-card,
.modal-leave-to .glass-card {
  transform: scale(0.95) translateY(8px);
}
</style>
