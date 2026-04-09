<script setup>
definePageMeta({
  title: "Print SAB By Batch",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Print SAB By Batch</div>
      </template>
      <template #body>
        <div>Content for Print SAB By Batch</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
