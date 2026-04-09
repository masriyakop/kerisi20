<script setup>
definePageMeta({
  title: "Send Email",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Send Email</div>
      </template>
      <template #body>
        <div>Content for Send Email</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
