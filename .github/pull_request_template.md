<!--
Title must follow Conventional Commits with an app scope, e.g.
  feat(api): add stock transfer endpoint
  fix(tenant-web): quote expiry off by one
Allowed scopes: api, dashboard, tenant-web, landing, deploy, ci, docs, repo
-->

## Apa yang berubah

<!-- Ringkas, 1-3 kalimat. Kenapa perubahan ini dibutuhkan, bukan hanya apa. -->

## App yang terdampak

- [ ] `apps/api` (Laravel)
- [ ] `apps/dashboard` (Nuxt SPA)
- [ ] `apps/tenant-web` (Nuxt SSR)
- [ ] `apps/landing` (Nuxt)
- [ ] `deploy/` atau `.github/` (pipeline / infrastruktur)

## Cara verifikasi

<!-- Perintah yang dijalankan reviewer, atau langkah manual. -->

```bash
```

## Checklist rilis

- [ ] Migration baru sudah idempotent dan aman dijalankan ulang (`--force`)
- [ ] Environment variable baru sudah ditambahkan ke `*.env.example` **dan** didokumentasikan di [docs/07_SECRETS_AND_ENV.md](../docs/07_SECRETS_AND_ENV.md)
- [ ] Perubahan berdampak breaking → dicatat di deskripsi PR dan butuh bump versi mayor
- [ ] Dokumentasi terkait sudah diperbarui

## Catatan deploy

<!-- Kosongkan jika tidak ada. Contoh: butuh `php artisan tenants:migrate`,
     butuh secret baru di GitHub Environment, butuh restart worker. -->
