<script setup>
definePageMeta({
  title: "Other Payment (Update Payment Date)",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Other Payment (Update Payment Date)</div>
      </template>
      <template #body>
        <div>Content for Other Payment (Update Payment Date)</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
