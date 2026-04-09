<script setup>
definePageMeta({
  title: "BRF",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>BRF</div>
      </template>
      <template #body>
        <div>Content for BRF</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
