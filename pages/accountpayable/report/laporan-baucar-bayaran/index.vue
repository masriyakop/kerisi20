<script setup>
definePageMeta({
  title: "Laporan Baucar Bayaran",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Laporan Baucar Bayaran</div>
      </template>
      <template #body>
        <div>Content for Laporan Baucar Bayaran</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
