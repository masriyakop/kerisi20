<script setup>
definePageMeta({
  title: "EFT Preparation",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>EFT Preparation</div>
      </template>
      <template #body>
        <div>Content for EFT Preparation</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
