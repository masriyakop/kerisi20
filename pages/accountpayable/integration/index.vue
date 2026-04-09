<script setup>
definePageMeta({
  title: "Integration",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Integration</div>
      </template>
      <template #body>
        <div>Content for Integration</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
