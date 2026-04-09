<script setup>
definePageMeta({
  title: "Historical Sender",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Historical Sender</div>
      </template>
      <template #body>
        <div>Content for Historical Sender</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
