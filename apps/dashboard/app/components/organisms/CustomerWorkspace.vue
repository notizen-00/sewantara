<script setup lang="ts">
import {
  ArrowLeft,
  AtSign,
  ContactRound,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  UserRoundPlus,
  Users,
  X,
} from '@lucide/vue'
import { useCustomerPresenter } from '~/application/customers/useCustomerPresenter'

defineEmits<{
  back: []
}>()

const customers = useCustomerPresenter()

onMounted(() => {
  customers.initialize().catch(() => undefined)
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
            <Users :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Pelanggan</h1>
            <p class="mt-1 text-sm text-neutral-500">
              Kelola data pelanggan untuk {{ customers.auth.activeWorkspace.branchName || 'cabang aktif' }}.
            </p>
          </div>
        </div>
      </div>

      <AtomsAppButton @click="customers.openCreate">
        <UserRoundPlus :size="17" class="mr-2" />
        Tambah pelanggan
      </AtomsAppButton>
    </header>

    <div class="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
            <ContactRound :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Total pelanggan</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ customers.store.total }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Pelanggan terdaftar</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-700">
            <Phone :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Kontak telepon</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ customers.customersWithPhone }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Memiliki telepon atau WhatsApp</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-amber-50 text-amber-700">
            <AtSign :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Kontak email</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ customers.customersWithEmail }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Memiliki alamat email</span>
      </article>
    </div>

    <section class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
        <label class="relative block min-w-[260px] flex-1">
          <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
          <input
            v-model="customers.search"
            type="search"
            placeholder="Cari nama, kontak, atau alamat..."
            class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
          />
        </label>
        <div class="flex gap-2">
          <button
            v-if="customers.search"
            type="button"
            title="Reset pencarian"
            class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            @click="customers.resetSearch"
          >
            <RotateCcw :size="17" />
          </button>
          <button
            type="button"
            title="Perbarui data"
            :disabled="customers.store.loading"
            class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-wait disabled:opacity-60"
            @click="customers.fetchAll()"
          >
            <RefreshCw :size="17" :class="{ 'animate-spin': customers.store.loading }" />
          </button>
        </div>
      </div>

      <div v-if="customers.store.loading" class="grid min-h-72 place-items-center">
        <div class="text-center">
          <LoaderCircle :size="27" class="mx-auto animate-spin text-primary-600" />
          <p class="mt-3 text-sm font-semibold text-neutral-900">Memuat pelanggan</p>
        </div>
      </div>

      <div
        v-else-if="!customers.filteredCustomers.length"
        class="grid min-h-80 place-items-center px-6 py-12 text-center"
      >
        <div class="max-w-sm">
          <Users :size="28" class="mx-auto text-neutral-400" />
          <h2 class="mt-4 text-base font-semibold text-neutral-900">
            {{ customers.search ? 'Pelanggan tidak ditemukan' : 'Belum ada pelanggan' }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-neutral-500">
            {{
              customers.search
                ? 'Coba gunakan nama, nomor kontak, email, atau alamat yang berbeda.'
                : 'Tambahkan pelanggan agar dapat dipilih saat membuat booking.'
            }}
          </p>
          <AtomsAppButton v-if="!customers.search" class="mt-5" @click="customers.openCreate">
            <Plus :size="16" class="mr-2" />
            Tambah pelanggan
          </AtomsAppButton>
        </div>
      </div>

      <template v-else>
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                <th class="px-5 py-3">Pelanggan</th>
                <th class="px-4 py-3">Telepon</th>
                <th class="px-4 py-3">WhatsApp</th>
                <th class="px-4 py-3">Alamat</th>
                <th class="px-5 py-3">Terdaftar</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr v-for="customer in customers.filteredCustomers" :key="customer.id" class="hover:bg-neutral-50">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
                      {{ customers.initials(customer.name) }}
                    </span>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-neutral-900">{{ customer.name }}</p>
                      <a
                        v-if="customer.email"
                        :href="`mailto:${customer.email}`"
                        class="mt-0.5 block truncate text-xs text-neutral-500 hover:text-primary-700"
                      >
                        {{ customer.email }}
                      </a>
                      <span v-else class="mt-0.5 block text-xs text-neutral-400">Tanpa email</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-neutral-700">
                  <a v-if="customer.phone" :href="`tel:${customer.phone}`" class="hover:text-primary-700">
                    {{ customer.phone }}
                  </a>
                  <span v-else class="text-neutral-400">—</span>
                </td>
                <td class="px-4 py-4 text-sm text-neutral-700">
                  <span v-if="customer.whatsapp">{{ customer.whatsapp }}</span>
                  <span v-else class="text-neutral-400">—</span>
                </td>
                <td class="max-w-[280px] px-4 py-4 text-sm text-neutral-600">
                  <span class="line-clamp-2">{{ customer.address || '—' }}</span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-xs text-neutral-500">
                  {{ customers.formatDate(customer.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-neutral-200 md:hidden">
          <article v-for="customer in customers.filteredCustomers" :key="customer.id" class="p-4">
            <div class="flex items-start gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
                {{ customers.initials(customer.name) }}
              </span>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-semibold text-neutral-900">{{ customer.name }}</h3>
                <a v-if="customer.email" :href="`mailto:${customer.email}`" class="mt-1 block truncate text-xs text-primary-700">
                  {{ customer.email }}
                </a>
              </div>
            </div>
            <div class="mt-4 grid gap-2 text-xs text-neutral-600">
              <p v-if="customer.phone" class="flex items-center gap-2"><Phone :size="14" /> {{ customer.phone }}</p>
              <p v-if="customer.whatsapp" class="flex items-center gap-2"><MessageCircle :size="14" /> {{ customer.whatsapp }}</p>
              <p v-if="customer.address" class="flex items-start gap-2"><MapPin :size="14" class="mt-0.5 shrink-0" /> {{ customer.address }}</p>
            </div>
          </article>
        </div>

        <footer class="flex flex-wrap justify-between gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
          <span>Menampilkan {{ customers.filteredCustomers.length }} pelanggan</span>
          <span>Total {{ customers.store.total }} data</span>
        </footer>
      </template>
    </section>
  </section>

  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="customers.createOpen" class="fixed inset-0 z-[70]">
        <button
          type="button"
          aria-label="Tutup form pelanggan"
          class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
          @click="customers.closeCreate"
        ></button>

        <form
          class="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-neutral-0 shadow-2xl"
          @submit.prevent="customers.submit"
        >
          <header class="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5 sm:px-6">
            <div>
              <h2 class="text-lg font-semibold text-neutral-900">Tambah pelanggan</h2>
              <p class="mt-0.5 text-xs text-neutral-500">Pelanggan baru akan tersedia pada form booking.</p>
            </div>
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
              @click="customers.closeCreate"
            >
              <X :size="18" />
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div class="grid gap-6">
              <section class="grid gap-4">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Identitas pelanggan</h3>
                  <p class="mt-1 text-xs text-neutral-500">Nama wajib diisi untuk identifikasi pada transaksi.</p>
                </div>
                <AtomsAppInput
                  v-model="customers.form.name"
                  label="Nama lengkap"
                  placeholder="Contoh: Budi Santoso"
                  autocomplete="name"
                  :maxlength="150"
                  required
                />
              </section>

              <section class="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Informasi kontak</h3>
                  <p class="mt-1 text-xs text-neutral-500">Gunakan kontak yang dapat dihubungi untuk informasi booking.</p>
                </div>
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <AtomsAppInput
                    v-model="customers.form.email"
                    label="Email"
                    type="email"
                    inputmode="email"
                    autocomplete="email"
                    placeholder="budi@email.com"
                  />
                  <AtomsAppInput
                    v-model="customers.form.phone"
                    label="Nomor telepon"
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    placeholder="0812 3456 7890"
                  />
                  <div class="sm:col-span-2">
                    <AtomsAppInput
                      v-model="customers.form.whatsapp"
                      label="Nomor WhatsApp"
                      type="tel"
                      inputmode="tel"
                      placeholder="0812 3456 7890"
                    />
                  </div>
                </div>
              </section>

              <section class="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Alamat</h3>
                  <p class="mt-1 text-xs text-neutral-500">Opsional, dapat digunakan sebagai referensi pengiriman atau penagihan.</p>
                </div>
                <label class="grid gap-2 text-sm font-medium text-neutral-700">
                  Alamat pelanggan
                  <textarea
                    v-model="customers.form.address"
                    rows="4"
                    maxlength="1000"
                    placeholder="Masukkan alamat lengkap..."
                    class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
                  ></textarea>
                </label>
              </section>
            </div>
          </div>

          <footer class="flex shrink-0 justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6">
            <AtomsAppButton variant="secondary" :disabled="customers.store.creating" @click="customers.closeCreate">
              Batal
            </AtomsAppButton>
            <AtomsAppButton type="submit" :disabled="customers.store.creating">
              <LoaderCircle v-if="customers.store.creating" :size="16" class="mr-2 animate-spin" />
              <UserRoundPlus v-else :size="16" class="mr-2" />
              {{ customers.store.creating ? 'Menyimpan...' : 'Simpan pelanggan' }}
            </AtomsAppButton>
          </footer>
        </form>
      </div>
    </Transition>
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
