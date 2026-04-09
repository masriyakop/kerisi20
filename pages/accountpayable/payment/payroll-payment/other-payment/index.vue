<script setup>
definePageMeta({
  title: "Other Payment",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Other Payment</div>
      </template>
      <template #body>
        <div>Content for Other Payment</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
