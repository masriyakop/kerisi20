<script setup>
definePageMeta({
  title: "Notification",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Notification</div>
      </template>
      <template #body>
        <div>Content for Notification</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
