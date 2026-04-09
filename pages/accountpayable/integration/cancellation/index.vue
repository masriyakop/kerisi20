<script setup>
definePageMeta({
  title: "Cancellation",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Cancellation</div>
      </template>
      <template #body>
        <div>Content for Cancellation</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
