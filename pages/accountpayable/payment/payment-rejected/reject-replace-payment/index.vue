<script setup>
definePageMeta({
  title: "Reject/Replace Payment",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Reject/Replace Payment</div>
      </template>
      <template #body>
        <div>Content for Reject/Replace Payment</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
