<script setup>
definePageMeta({
  title: "Account Bank Updated",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Account Bank Updated</div>
      </template>
      <template #body>
        <div>Content for Account Bank Updated</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
