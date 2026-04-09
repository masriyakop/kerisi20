<script setup>
definePageMeta({
  title: "EFT",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>EFT</div>
      </template>
      <template #body>
        <div>Content for EFT</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
