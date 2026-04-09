<script setup>
definePageMeta({
  title: "Banker Cheque & Bank Draft",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Banker Cheque & Bank Draft</div>
      </template>
      <template #body>
        <div>Content for Banker Cheque & Bank Draft</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
