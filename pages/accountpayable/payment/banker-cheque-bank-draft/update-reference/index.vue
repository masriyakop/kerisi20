<script setup>
definePageMeta({
  title: "Update Reference",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Update Reference</div>
      </template>
      <template #body>
        <div>Content for Update Reference</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
