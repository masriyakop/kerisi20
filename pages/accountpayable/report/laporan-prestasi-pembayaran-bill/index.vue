<script setup>
definePageMeta({
  title: "Laporan Prestasi Pembayaran Bill",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Laporan Prestasi Pembayaran Bill</div>
      </template>
      <template #body>
        <div>Content for Laporan Prestasi Pembayaran Bill</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
