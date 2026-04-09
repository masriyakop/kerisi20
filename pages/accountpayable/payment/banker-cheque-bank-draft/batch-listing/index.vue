<script setup>
definePageMeta({
  title: "Batch Listing",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Batch Listing</div>
      </template>
      <template #body>
        <div>Content for Batch Listing</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
