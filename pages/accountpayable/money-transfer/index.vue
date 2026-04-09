<script setup>
definePageMeta({
  title: "Money Transfer",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Money Transfer</div>
      </template>
      <template #body>
        <div>Content for Money Transfer</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
