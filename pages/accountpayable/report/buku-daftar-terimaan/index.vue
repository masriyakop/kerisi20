<script setup>
definePageMeta({
  title: "Buku Daftar Terimaan",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Buku Daftar Terimaan</div>
      </template>
      <template #body>
        <div>Content for Buku Daftar Terimaan</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
