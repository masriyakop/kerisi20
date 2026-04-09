<script setup>
definePageMeta({
  title: "Payment Record",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payment Record</div>
      </template>
      <template #body>
        <div>Content for Payment Record</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
