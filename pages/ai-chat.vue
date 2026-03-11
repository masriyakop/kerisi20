<script setup>
/**
 * URL-accessible AI Chat page.
 * Visiting /ai-chat (e.g. https://demo.kerisi.my/ai-chat) opens the KERINA chat window.
 * Closing the chat navigates back to home.
 */
definePageMeta({
  layout: "default",
});

const { isOpen, open } = useAIChatStandalone();
const router = useRouter();

onMounted(() => {
  open();
});

watch(isOpen, (val) => {
  if (!val) {
    router.push("/");
  }
});
</script>

<template>
  <div class="ai-chat-page">
    <AIChatStandalone />
    <!-- Minimal placeholder while chat is loading -->
    <div v-if="!isOpen" class="ai-chat-page-placeholder">
      <p>Opening KERINA AI Chat...</p>
    </div>
  </div>
</template>

<style scoped>
.ai-chat-page {
  min-height: 100%;
}

.ai-chat-page-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #6b7280;
  font-size: 14px;
}
</style>
