<script setup lang="ts">
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Building2,
  KeyRound,
  LoaderCircle,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  UserRoundPlus,
  Users,
  X,
} from '@lucide/vue'
import { useUserPresenter } from '~/application/users/useUserPresenter'

defineEmits<{
  back: []
}>()

const users = useUserPresenter()
const statusOptions = [
  { label: 'Semua status', value: 'all' as const },
  { label: 'Aktif', value: 'active' as const },
  { label: 'Nonaktif', value: 'inactive' as const },
]

function onBranchChange(branchId: number, event: Event) {
  users.toggleBranch(branchId, (event.target as HTMLInputElement).checked)
}

onMounted(() => {
  users.initialize().catch(() => undefined)
})
</script>

<template>
  <section class="grid gap-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <button
          type="button"
          class="mb-4 inline-flex min-h-9 items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900"
          @click="$emit('back')"
        >
          <ArrowLeft :size="16" />
          Kembali ke dashboard
        </button>
        <div class="flex items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-md bg-primary-50 text-primary-700">
            <UserCog :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Manajemen pengguna</h1>
            <p class="mt-1 text-sm text-neutral-500">Atur akun tim, role, dan akses cabang tenant.</p>
          </div>
        </div>
      </div>

      <AtomsAppButton
        v-if="users.canCreate"
        :disabled="users.limitReached"
        @click="users.openCreate"
      >
        <UserRoundPlus :size="17" class="mr-2" />
        Tambah pengguna
      </AtomsAppButton>
    </header>

    <div
      v-if="!users.canView"
      class="grid min-h-[420px] place-items-center rounded-md border border-neutral-200 bg-neutral-0 px-6 py-12 text-center shadow-card"
    >
      <div class="max-w-sm">
        <ShieldCheck :size="30" class="mx-auto text-neutral-400" />
        <h2 class="mt-4 text-base font-semibold text-neutral-900">Akses pengguna dibatasi</h2>
        <p class="mt-2 text-sm leading-6 text-neutral-500">
          Akun Anda memerlukan permission <code>user.view</code> untuk membuka manajemen pengguna.
        </p>
      </div>
    </div>

    <template v-else>
      <div class="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1">
        <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
          <div class="flex items-center justify-between">
            <span class="grid h-9 w-9 place-items-center rounded-md bg-neutral-100 text-neutral-700">
              <Users :size="17" />
            </span>
            <span class="text-xs font-medium text-neutral-500">Total pengguna</span>
          </div>
          <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ users.store.total }}</strong>
          <span class="mt-1 block text-xs text-neutral-500">Akun tenant terdaftar</span>
        </article>
        <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
          <div class="flex items-center justify-between">
            <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
              <BadgeCheck :size="17" />
            </span>
            <span class="text-xs font-medium text-neutral-500">Aktif</span>
          </div>
          <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ users.activeUsers }}</strong>
          <span class="mt-1 block text-xs text-neutral-500">Dapat mengakses aplikasi</span>
        </article>
        <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
          <div class="flex items-center justify-between">
            <span class="grid h-9 w-9 place-items-center rounded-md bg-red-50 text-danger-500">
              <X :size="17" />
            </span>
            <span class="text-xs font-medium text-neutral-500">Nonaktif</span>
          </div>
          <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ users.inactiveUsers }}</strong>
          <span class="mt-1 block text-xs text-neutral-500">Akses dinonaktifkan</span>
        </article>
        <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
          <div class="flex items-center justify-between">
            <span class="grid h-9 w-9 place-items-center rounded-md bg-amber-50 text-amber-700">
              <KeyRound :size="17" />
            </span>
            <span class="text-xs font-medium text-neutral-500">Limit paket</span>
          </div>
          <strong class="mt-4 block text-2xl font-bold text-neutral-900">
            {{ users.userLimit ?? '∞' }}
          </strong>
          <span class="mt-1 block text-xs text-neutral-500">
            {{ users.userLimit ? `${users.store.total} dari ${users.userLimit} digunakan` : 'Tanpa batas terdeteksi' }}
          </span>
        </article>
      </div>

      <div
        v-if="users.limitReached"
        class="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800"
      >
        <AlertTriangle :size="18" class="mt-0.5 shrink-0" />
        <p class="text-sm leading-6">
          Batas {{ users.userLimit }} pengguna pada paket saat ini sudah tercapai. Nonaktifkan atau hapus pengguna,
          atau tingkatkan paket sebelum menambah akun baru.
        </p>
      </div>

      <section class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
        <div class="grid grid-cols-[minmax(240px,1fr)_200px_auto] gap-3 border-b border-neutral-200 bg-neutral-50 p-4 max-md:grid-cols-1">
          <label class="relative block">
            <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
            <input
              v-model="users.search"
              type="search"
              placeholder="Cari nama, email, role, atau cabang..."
              class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <AtomsAppSelect
            v-model="users.statusFilter"
            label="Status pengguna"
            :options="statusOptions"
            hide-label
          />
          <div class="flex gap-2">
            <button
              type="button"
              title="Reset filter"
              class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100"
              @click="users.resetFilters"
            >
              <RotateCcw :size="17" />
            </button>
            <button
              type="button"
              title="Perbarui data"
              :disabled="users.store.loading"
              class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 disabled:cursor-wait disabled:opacity-60"
              @click="users.store.fetchAll()"
            >
              <RefreshCw :size="17" :class="{ 'animate-spin': users.store.loading }" />
            </button>
          </div>
        </div>

        <div
          v-if="users.store.error && !users.store.loading && !users.store.items.length"
          class="grid min-h-72 place-items-center px-6 py-12 text-center"
        >
          <div class="max-w-md">
            <AlertTriangle :size="28" class="mx-auto text-amber-600" />
            <h2 class="mt-4 text-base font-semibold text-neutral-900">API pengguna belum dapat diakses</h2>
            <p class="mt-2 text-sm leading-6 text-neutral-500">{{ users.store.error }}</p>
            <AtomsAppButton variant="secondary" class="mt-5" @click="users.initialize(true)">
              <RefreshCw :size="16" class="mr-2" />
              Coba lagi
            </AtomsAppButton>
          </div>
        </div>

        <div v-else-if="users.store.loading" class="grid min-h-72 place-items-center">
          <div class="text-center">
            <LoaderCircle :size="27" class="mx-auto animate-spin text-primary-600" />
            <p class="mt-3 text-sm font-semibold text-neutral-900">Memuat pengguna</p>
          </div>
        </div>

        <div
          v-else-if="!users.filteredUsers.length"
          class="grid min-h-72 place-items-center px-6 py-12 text-center"
        >
          <div class="max-w-sm">
            <Users :size="28" class="mx-auto text-neutral-400" />
            <h2 class="mt-4 text-base font-semibold text-neutral-900">Pengguna tidak ditemukan</h2>
            <p class="mt-2 text-sm leading-6 text-neutral-500">Sesuaikan filter atau tambahkan akun tim baru.</p>
            <AtomsAppButton
              v-if="users.canCreate && !users.limitReached"
              class="mt-5"
              @click="users.openCreate"
            >
              <Plus :size="16" class="mr-2" />
              Tambah pengguna
            </AtomsAppButton>
          </div>
        </div>

        <template v-else>
          <div class="hidden overflow-x-auto md:block">
            <table class="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                  <th class="px-5 py-3">Pengguna</th>
                  <th class="px-4 py-3">Role</th>
                  <th class="px-4 py-3">Akses cabang</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Login terakhir</th>
                  <th class="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200">
                <tr v-for="user in users.filteredUsers" :key="user.id" class="hover:bg-neutral-50">
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
                        {{ users.initials(user.name) }}
                      </span>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-semibold text-neutral-900">
                          {{ user.name }}
                          <span v-if="user.id === users.auth.session?.user.id" class="ml-1 text-[10px] font-medium text-primary-700">(Anda)</span>
                        </p>
                        <p class="mt-0.5 truncate text-xs text-neutral-500">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 text-sm text-neutral-700">{{ users.roleLabel(user) }}</td>
                  <td class="max-w-[240px] px-4 py-4 text-sm text-neutral-600">
                    <span class="line-clamp-2">{{ users.branchLabel(user) }}</span>
                  </td>
                  <td class="px-4 py-4">
                    <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', user.is_active ? 'bg-primary-50 text-primary-700' : 'bg-red-50 text-danger-500']">
                      {{ user.is_active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-xs text-neutral-500">{{ users.formatDate(user.last_login_at) }}</td>
                  <td class="px-5 py-4">
                    <div class="flex justify-end gap-1">
                      <button
                        v-if="users.canUpdate"
                        type="button"
                        title="Edit pengguna"
                        class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                        @click="users.openEdit(user)"
                      >
                        <Pencil :size="16" />
                      </button>
                      <button
                        v-if="users.canDelete && user.id !== users.auth.session?.user.id"
                        type="button"
                        title="Hapus pengguna"
                        class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-red-50 hover:text-danger-500"
                        @click="users.requestDelete(user)"
                      >
                        <Trash2 :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="divide-y divide-neutral-200 md:hidden">
            <article v-for="user in users.filteredUsers" :key="user.id" class="p-4">
              <div class="flex items-start gap-3">
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
                  {{ users.initials(user.name) }}
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h3 class="text-sm font-semibold text-neutral-900">{{ user.name }}</h3>
                      <p class="mt-0.5 truncate text-xs text-neutral-500">{{ user.email }}</p>
                    </div>
                    <span :class="['rounded-full px-2 py-1 text-[10px] font-semibold', user.is_active ? 'bg-primary-50 text-primary-700' : 'bg-red-50 text-danger-500']">
                      {{ user.is_active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </div>
                  <div class="mt-3 grid gap-1.5 text-xs text-neutral-600">
                    <p><strong>Role:</strong> {{ users.roleLabel(user) }}</p>
                    <p><strong>Cabang:</strong> {{ users.branchLabel(user) }}</p>
                  </div>
                  <button
                    v-if="users.canUpdate"
                    type="button"
                    class="mt-3 text-xs font-semibold text-primary-700"
                    @click="users.openEdit(user)"
                  >
                    Edit pengguna
                  </button>
                </div>
              </div>
            </article>
          </div>

          <footer class="flex flex-wrap justify-between gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
            <span>Menampilkan {{ users.filteredUsers.length }} pengguna</span>
            <span>Total {{ users.store.total }} data</span>
          </footer>
        </template>
      </section>
    </template>
  </section>

  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="users.editorOpen" class="fixed inset-0 z-[70]">
        <button type="button" aria-label="Tutup editor" class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]" @click="users.closeEditor"></button>
        <form class="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-neutral-0 shadow-2xl" @submit.prevent="users.submit">
          <header class="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5 sm:px-6">
            <div>
              <h2 class="text-lg font-semibold text-neutral-900">{{ users.editingId ? 'Edit pengguna' : 'Tambah pengguna' }}</h2>
              <p class="mt-0.5 text-xs text-neutral-500">Atur identitas, cabang, status, dan role pengguna.</p>
            </div>
            <button type="button" class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100" @click="users.closeEditor">
              <X :size="18" />
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div class="grid gap-7">
              <section class="grid gap-4">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Identitas akun</h3>
                  <p class="mt-1 text-xs text-neutral-500">Email digunakan untuk masuk ke aplikasi tenant.</p>
                </div>
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <AtomsAppInput v-model="users.form.name" label="Nama lengkap" autocomplete="name" required />
                  <AtomsAppInput v-model="users.form.email" label="Email" type="email" autocomplete="email" required />
                  <div class="sm:col-span-2">
                    <AtomsAppInput v-model="users.form.phone" label="Nomor telepon" type="tel" inputmode="tel" autocomplete="tel" />
                  </div>
                </div>
              </section>

              <section class="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">{{ users.editingId ? 'Ganti password' : 'Password awal' }}</h3>
                  <p class="mt-1 text-xs text-neutral-500">
                    {{ users.editingId ? 'Kosongkan bila password tidak perlu diubah.' : 'Gunakan minimal 8 karakter.' }}
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <AtomsAppInput v-model="users.form.password" label="Password" type="password" autocomplete="new-password" :required="!users.editingId" />
                  <AtomsAppInput v-model="users.form.password_confirmation" label="Konfirmasi password" type="password" autocomplete="new-password" :required="!users.editingId" />
                </div>
              </section>

              <section class="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Akses cabang</h3>
                  <p class="mt-1 text-xs text-neutral-500">Pilih cabang yang dapat diakses pengguna.</p>
                </div>
                <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                  <label
                    v-for="branch in users.branches.items"
                    :key="branch.id"
                    class="flex cursor-pointer items-start gap-3 rounded-md border border-neutral-200 p-3 hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      :checked="users.form.branch_ids.includes(branch.id)"
                      class="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      @change="onBranchChange(branch.id, $event)"
                    />
                    <span class="min-w-0">
                      <strong class="block truncate text-sm font-semibold text-neutral-900">{{ branch.name }}</strong>
                      <span class="mt-0.5 block text-xs text-neutral-500">{{ branch.code }}</span>
                    </span>
                  </label>
                </div>
              </section>

              <section v-if="users.canAssignRole" class="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">{{ users.editingId ? 'Tambahkan role' : 'Role pengguna' }}</h3>
                  <p class="mt-1 text-xs text-neutral-500">
                    {{ users.editingId ? 'Endpoint assignment menambahkan role pada scope yang dipilih.' : 'Role menentukan permission pengguna.' }}
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <AtomsAppSelect v-model="users.form.role_id" label="Role" :options="users.roleOptions" />
                  <AtomsAppSelect v-model="users.form.role_branch_id" label="Scope role" :options="users.roleBranchOptions" />
                </div>
              </section>

              <section class="border-t border-neutral-200 pt-6">
                <label class="flex items-start gap-3 rounded-md border border-neutral-200 p-4">
                  <input v-model="users.form.is_active" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                  <span>
                    <strong class="block text-sm font-semibold text-neutral-900">Pengguna aktif</strong>
                    <span class="mt-1 block text-xs leading-5 text-neutral-500">Pengguna aktif dapat login dan menjalankan aksi sesuai permission.</span>
                  </span>
                </label>
              </section>
            </div>
          </div>

          <footer class="flex shrink-0 justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6">
            <AtomsAppButton variant="secondary" :disabled="users.store.saving" @click="users.closeEditor">Batal</AtomsAppButton>
            <AtomsAppButton type="submit" :disabled="users.store.saving">
              <LoaderCircle v-if="users.store.saving" :size="16" class="mr-2 animate-spin" />
              <UserRoundPlus v-else :size="16" class="mr-2" />
              {{ users.store.saving ? 'Menyimpan...' : 'Simpan pengguna' }}
            </AtomsAppButton>
          </footer>
        </form>
      </div>
    </Transition>

    <div v-if="users.deleteTarget" class="fixed inset-0 z-[80] grid place-items-center p-4">
      <button type="button" aria-label="Tutup konfirmasi" class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]" @click="users.cancelDelete"></button>
      <section class="relative w-full max-w-md rounded-md bg-neutral-0 p-6 shadow-2xl">
        <span class="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-danger-500"><Trash2 :size="19" /></span>
        <h2 class="mt-4 text-lg font-semibold text-neutral-900">Hapus pengguna?</h2>
        <p class="mt-2 text-sm leading-6 text-neutral-500">
          Akun <strong class="text-neutral-900">{{ users.deleteTarget.name }}</strong> akan dihapus dan tidak dapat login kembali.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <AtomsAppButton variant="secondary" :disabled="users.store.deleting" @click="users.cancelDelete">Batal</AtomsAppButton>
          <button
            type="button"
            :disabled="users.store.deleting"
            class="inline-flex min-h-11 items-center rounded-md bg-danger-500 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            @click="users.confirmDelete"
          >
            <LoaderCircle v-if="users.store.deleting" :size="16" class="mr-2 animate-spin" />
            Hapus pengguna
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 180ms ease;
}

.drawer-enter-active form,
.drawer-leave-active form {
  transition: transform 220ms ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from form,
.drawer-leave-to form {
  transform: translateX(100%);
}
</style>
