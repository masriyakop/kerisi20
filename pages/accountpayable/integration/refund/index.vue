<script setup>
definePageMeta({
  title: "Refund",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Refund</div>
      </template>
      <template #body>
        <div>Content for Refund</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
