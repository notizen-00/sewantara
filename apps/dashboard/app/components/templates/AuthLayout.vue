<template>
  <main class="relative grid min-h-screen place-items-center overflow-hidden bg-[#fbf8f9] px-4 py-6 text-neutral-900 sm:px-6 sm:py-10">
    <div class="pointer-events-none absolute -left-40 -top-48 h-[500px] w-[500px] rounded-full bg-primary-100/80 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-56 -right-40 h-[520px] w-[520px] rounded-full bg-primary-50 blur-3xl"></div>
    <div class="relative w-full max-w-[1180px]">
      <slot />
    </div>
  </main>
</template>
