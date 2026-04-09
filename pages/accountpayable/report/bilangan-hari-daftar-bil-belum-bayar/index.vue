<script setup>
definePageMeta({
  title: "Bilangan Hari Daftar Bil Belum Bayar",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Bilangan Hari Daftar Bil Belum Bayar</div>
      </template>
      <template #body>
        <div>Content for Bilangan Hari Daftar Bil Belum Bayar</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
