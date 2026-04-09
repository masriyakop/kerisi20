<script setup>
definePageMeta({
  title: "Listing Approved Batching EPY",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Listing Approved Batching EPY</div>
      </template>
      <template #body>
        <div>Content for Listing Approved Batching EPY</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
