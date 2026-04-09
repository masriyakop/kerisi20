<script setup>
definePageMeta({
  title: "Book Cheque Setup",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Book Cheque Setup</div>
      </template>
      <template #body>
        <div>Content for Book Cheque Setup</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
