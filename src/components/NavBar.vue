<template>
  <header class="backdrop-blur bg-white/70 dark:bg-neutral-900/70 border-b border-black/5 dark:border-white/10 sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
      <div class="font-semibold flex-1 min-w-0 text-[#1e88e5]">VERTEX</div>
      <nav class="flex items-center gap-4 text-sm flex-wrap w-full sm:w-auto">
        <RouterLink class="hover:underline" to="/">Scanner</RouterLink>
        <!-- <RouterLink class="hover:underline" to="/admin/logs">Admin Logs</RouterLink> -->
      </nav>
      <div class="hidden sm:block sm:ml-auto text-sm opacity-70"><Clock/></div>
    </div>
  </header>
</template>

<script setup>
import Clock from './Clock.vue'
</script>
