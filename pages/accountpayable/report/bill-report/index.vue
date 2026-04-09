<script setup>
definePageMeta({
  title: "Bill Report",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Bill Report</div>
      </template>
      <template #body>
        <div>Content for Bill Report</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
