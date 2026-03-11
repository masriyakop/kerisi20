/**
 * Standalone AI Chat state - for URL-accessible chat window (/ai-chat).
 * Separate from useAIChat (KERINA header popup) - no changes to existing chat.
 */
const isOpen = ref(false);

export function useAIChatStandalone() {
  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return {
    isOpen,
    toggle,
    open,
    close,
  };
}
