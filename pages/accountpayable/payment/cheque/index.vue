<script setup>
definePageMeta({
  title: "Cheque",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Cheque</div>
      </template>
      <template #body>
        <div>Content for Cheque</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
