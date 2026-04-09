<script setup>
definePageMeta({
  title: "Credit Note",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Credit Note</div>
      </template>
      <template #body>
        <div>Content for Credit Note</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
