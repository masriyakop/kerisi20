<script setup>
definePageMeta({
  title: "Credit Note Listing",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Credit Note Listing</div>
      </template>
      <template #body>
        <div>Content for Credit Note Listing</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
