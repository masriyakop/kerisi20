<script setup>
definePageMeta({
  title: "Batching EFT",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Batching EFT</div>
      </template>
      <template #body>
        <div>Content for Batching EFT</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
