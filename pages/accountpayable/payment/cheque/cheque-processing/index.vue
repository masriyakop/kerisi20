<script setup>
definePageMeta({
  title: "Cheque Processing",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Cheque Processing</div>
      </template>
      <template #body>
        <div>Content for Cheque Processing</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
