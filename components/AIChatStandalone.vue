<script setup>
/**
 * Standalone AI Chat - URL-accessible version (/ai-chat).
 * Same functionality as AIChatPopup (KERINA) but uses useAIChatStandalone.
 * No changes to existing KERINA chat.
 */
const { isOpen, close } = useAIChatStandalone();
const { render: renderMarkdown } = useMarkdown();

const MIN_WIDTH = 480;
const MAX_WIDTH = 1000;
const DEFAULT_WIDTH = 680;

const position = ref({ x: 0, y: 0 });
const width = ref(DEFAULT_WIDTH);
const isDragging = ref(false);
const isResizing = ref(false);
const resizeSide = ref("right"); // 'left' | 'right'
const dragStart = ref({ x: 0, y: 0 });
const resizeStartX = ref(0);
const resizeStartWidth = ref(0);
const resizeStartLeft = ref(0);

function initPosition() {
  if (typeof window === "undefined") return;
  position.value = {
    x: window.innerWidth - width.value - 24,
    y: window.innerHeight - 520 - 24,
  };
}

function onHeaderMouseDown(e) {
  if (e.target.closest(".ai-chat-close") || e.target.closest(".ai-chat-resize")) return;
  isDragging.value = true;
  dragStart.value = { x: e.clientX - position.value.x, y: e.clientY - position.value.y };
}

function onResizeMouseDown(e, side) {
  e.preventDefault();
  isResizing.value = true;
  resizeSide.value = side;
  resizeStartX.value = e.clientX;
  resizeStartWidth.value = width.value;
  resizeStartLeft.value = position.value.x;
}

function onMouseMove(e) {
  if (isDragging.value) {
    position.value = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y,
    };
    position.value.x = Math.max(0, Math.min(position.value.x, window.innerWidth - 100));
    position.value.y = Math.max(0, Math.min(position.value.y, window.innerHeight - 100));
  } else if (isResizing.value) {
    if (resizeSide.value === "right") {
      const delta = e.clientX - resizeStartX.value;
      width.value = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStartWidth.value + delta));
    } else {
      const rightEdge = resizeStartLeft.value + resizeStartWidth.value;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, rightEdge - e.clientX));
      const newLeft = rightEdge - newWidth;
      position.value.x = Math.max(0, newLeft);
      width.value = newWidth;
    }
  }
}

function onMouseUp() {
  isDragging.value = false;
  isResizing.value = false;
}


onMounted(() => {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
});

const suggestedQuestions = [
  "How many Purchase Order being approve in 2025?",
  "What is the balance of budget B0227000 for 2026?",
  "What is the status of this PRO00052/2601?",
  "List down all rejected PO",
  "How to submit PO?",
];

const userInput = ref("");
const messages = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const chatList = ref([]);
const selectedChatId = ref(null);
const loadingChatList = ref(false);

const { exportReport } = useReportExport();

async function fetchChatList() {
  loadingChatList.value = true;
  try {
    const res = await $fetch("/api/ai-chat-log");
    if (res?.statusCode === 200 && res?.data) {
      chatList.value = res.data;
    }
  } catch {
    chatList.value = [];
  } finally {
    loadingChatList.value = false;
  }
}

async function selectChat(chat) {
  if (!chat || selectedChatId.value === chat.ail_chat_log_id) return;
  selectedChatId.value = chat.ail_chat_log_id;
  try {
    const res = await $fetch(`/api/ai-chat-log/${chat.ail_chat_log_id}`);
    if (res?.statusCode === 200 && res?.data?.ail_chat_details) {
      const details = res.data.ail_chat_details;
      const msgs = details?.messages || [];
      messages.value = msgs.map((m) => ({
        role: m.role,
        content: m.content,
        reportData: details?.reportData && m.role === "assistant" ? details.reportData : null,
      }));
    }
  } catch {
    messages.value = [];
  }
}

function startNewChat() {
  selectedChatId.value = null;
  messages.value = [];
  errorMessage.value = "";
}

function formatChatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return date.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString("en-MY", { day: "numeric", month: "short" });
}

watch(isOpen, (open) => {
  if (open) {
    initPosition();
    fetchChatList();
  }
});

function parseDownloadFormat(text) {
  const m = text.match(/\b(?:download|export|save)\s*(?:as|to|in)?\s*(csv|pdf|excel|xlsx|json)\b/i)
    || text.match(/\b(?:in|as)\s*(csv|pdf|excel|xlsx|json)\b/i);
  return m ? m[1].toLowerCase().replace("xlsx", "excel") : "csv";
}

function isDownloadOnlyRequest(text) {
  const t = text.trim().toLowerCase();
  return /^(?:download|export|save)\s*(?:the\s*report)?\s*(?:as|to|in)?\s*(csv|pdf|excel|xlsx|json)?\s*$/.test(t)
    || /^(?:give\s*me\s*)?(?:in|as)\s*(csv|pdf|excel|xlsx|json)\s*(?:format)?\s*$/.test(t);
}

function getLastReportData() {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const msg = messages.value[i];
    if (msg.role === "assistant" && msg.reportData && !msg.reportData.error) {
      const data = Array.isArray(msg.reportData) ? msg.reportData : [msg.reportData];
      if (data.length > 0) return msg.reportData;
    }
  }
  return null;
}

function selectQuestion(question) {
  userInput.value = question;
}

async function handleDownloadClick(format) {
  const reportData = getLastReportData();
  if (!reportData) return;
  const fmt = format.toLowerCase();
  try {
    await exportReport(reportData, fmt);
  } catch {
    messages.value.push({
      role: "assistant",
      content: "Failed to export report. Please try again.",
      reportData: null,
    });
  }
}

async function submitQuestion() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  userInput.value = "";
  errorMessage.value = "";

  // Add user message
  messages.value.push({ role: "user", content: prompt });
  selectedChatId.value = null;

  // Handle "download only" - use last report data
  if (isDownloadOnlyRequest(prompt)) {
    const reportData = getLastReportData();
    if (!reportData) {
      messages.value.push({
        role: "assistant",
        content: "No report data to download. Please run a report first.",
        reportData: null,
      });
      return;
    }
    const format = parseDownloadFormat(prompt);
    try {
      const ok = await exportReport(reportData, format);
      messages.value.push({
        role: "assistant",
        content: ok ? `Report downloaded as ${format.toUpperCase()}.` : "Failed to export report.",
        reportData: null,
      });
    } catch (e) {
      messages.value.push({
        role: "assistant",
        content: "Failed to export report. Please try again.",
        reportData: null,
      });
    }
    return;
  }

  isLoading.value = true;

  try {
    const result = await $fetch("/api/ai-report/query", {
      method: "POST",
      body: {
        message: prompt,
      },
    });

    if (result?.statusCode === 200 && result?.message) {
      messages.value.push({
        role: "assistant",
        content: result.message,
        reportData: result.reportData ?? null,
      });
      fetchChatList();

      // Auto-download if format was requested in the message
      const downloadFormat = result.downloadFormat;
      if (downloadFormat && result.reportData && !result.reportData.error) {
        try {
          await exportReport(result.reportData, downloadFormat);
        } catch {
          // Ignore export errors
        }
      }
    } else {
      errorMessage.value = result?.error || "Failed to get AI response.";
    }
  } catch (err) {
    errorMessage.value = err?.data?.error || err?.message || "Failed to connect to AI.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="ai-chat-fade">
      <div
        v-if="isOpen"
        class="ai-chat-popup"
        :style="{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${width}px`,
          height: '520px',
          userSelect: isDragging || isResizing ? 'none' : undefined,
        }"
      >
        <!-- Header - Dark purple (draggable) -->
        <div
          class="ai-chat-header"
          :class="{ 'ai-chat-header-dragging': isDragging }"
          @mousedown="onHeaderMouseDown"
        >
          <button
            class="ai-chat-close"
            aria-label="Close"
            @click="close"
          >
            <Icon name="mdi:close" size="18" />
          </button>
          <div class="ai-chat-header-content">
            <img src="@/assets/img/kerina-mascot.png" alt="KERINA" class="ai-chat-mascot" />
            <p class="ai-chat-greeting">Assalamualaikum, I'm KERINA the KERISI Navigation Assistant</p>
          </div>
        </div>

        <!-- Main: Chat + Sidebar -->
        <div class="ai-chat-main">
        <!-- Body - White -->
        <div class="ai-chat-body">
          <!-- Scrollable chat area -->
          <div class="ai-chat-scroll-area">
          <!-- Chat messages -->
          <div v-if="messages.length > 0" class="ai-chat-messages">
            <div
              v-for="(msg, i) in messages"
              :key="i"
              :class="['ai-chat-msg', msg.role === 'user' ? 'ai-chat-msg-user' : 'ai-chat-msg-assistant']"
            >
              <div class="ai-chat-msg-content" v-html="renderMarkdown(msg.content)"></div>
              <div v-if="msg.reportData && msg.role === 'assistant' && !msg.reportData.error && (msg.reportData.count !== undefined || (msg.reportData.found && (msg.reportData.balance !== undefined || msg.reportData.status)))" class="ai-chat-report-data">
                <div v-if="msg.reportData.count !== undefined" class="ai-chat-report-row">
                  <strong>Count:</strong> {{ msg.reportData.count }}
                  <span v-if="msg.reportData.year"> ({{ msg.reportData.year }})</span>
                </div>
                <div v-else-if="msg.reportData.found && msg.reportData.balance !== undefined" class="ai-chat-report-row">
                  <strong>Balance:</strong> RM {{ Number(msg.reportData.balance).toLocaleString('en-MY', { minimumFractionDigits: 2 }) }}
                  <span v-if="msg.reportData.allocated !== undefined"> | Allocated: RM {{ Number(msg.reportData.allocated).toLocaleString('en-MY', { minimumFractionDigits: 2 }) }}</span>
                  <span v-if="msg.reportData.expenses !== undefined"> | Expenses: RM {{ Number(msg.reportData.expenses).toLocaleString('en-MY', { minimumFractionDigits: 2 }) }}</span>
                </div>
                <div v-else-if="msg.reportData.found && msg.reportData.status" class="ai-chat-report-row">
                  <strong>Status:</strong> {{ msg.reportData.status }}
                  <span v-if="msg.reportData.number"> ({{ msg.reportData.number }})</span>
                </div>
              </div>
            </div>
            <div v-if="isLoading" class="ai-chat-msg ai-chat-msg-assistant ai-chat-msg-loading">
              <div class="ai-chat-msg-content">Thinking...</div>
            </div>
          </div>

          <p v-if="errorMessage" class="ai-chat-error">{{ errorMessage }}</p>

          <div v-if="messages.length === 0" class="ai-chat-questions">
            <button
              v-for="(question, index) in suggestedQuestions"
              :key="index"
              class="ai-chat-question-item"
              @click="selectQuestion(question)"
            >
              <span class="ai-chat-question-text">{{ question }}</span>
              <Icon name="mdi:chevron-down" size="16" class="ai-chat-question-arrow" />
            </button>
          </div>
          </div>

          <p v-if="messages.length > 0" class="ai-chat-citation">AI-Generated report, for reference only</p>

          <div class="ai-chat-input-wrap">
            <textarea
              v-model="userInput"
              class="ai-chat-input"
              placeholder="Ask any report"
              rows="2"
              @keydown.enter.exact.prevent="submitQuestion"
            />
          </div>

          <div class="ai-chat-submit-wrap">
            <div v-if="getLastReportData()" class="ai-chat-download-btns">
              <button
                v-for="fmt in ['CSV', 'PDF', 'Excel', 'JSON']"
                :key="fmt"
                class="ai-chat-download-btn"
                @click="handleDownloadClick(fmt)"
              >
                {{ fmt }}
              </button>
            </div>
            <button class="ai-chat-submit" @click="submitQuestion">
              <Icon name="mdi:play" size="16" class="ai-chat-submit-arrow" />
              <span>Submit</span>
            </button>
          </div>
        </div>

        <!-- Right sidebar - Chat titles -->
        <div class="ai-chat-sidebar">
          <button class="ai-chat-new-btn" @click="startNewChat">
            <Icon name="mdi:plus" size="18" />
            <span>New chat</span>
          </button>
          <div class="ai-chat-sidebar-title">Chat history</div>
          <div v-if="loadingChatList" class="ai-chat-sidebar-loading">Loading...</div>
          <div v-else class="ai-chat-sidebar-list">
            <button
              v-for="chat in chatList"
              :key="chat.ail_chat_log_id"
              :class="['ai-chat-sidebar-item', { active: selectedChatId === chat.ail_chat_log_id }]"
              @click="selectChat(chat)"
            >
              <span class="ai-chat-sidebar-item-title">{{ chat.ail_chat_title || 'Untitled' }}</span>
              <span class="ai-chat-sidebar-item-date">{{ formatChatDate(chat.createddate) }}</span>
            </button>
            <p v-if="!loadingChatList && chatList.length === 0" class="ai-chat-sidebar-empty">No chats yet</p>
          </div>
        </div>
        </div>

        <!-- Resize handle (left edge) -->
        <div
          class="ai-chat-resize ai-chat-resize-left"
          :class="{ 'ai-chat-resize-active': isResizing && resizeSide === 'left' }"
          @mousedown="(e) => onResizeMouseDown(e, 'left')"
          title="Drag to resize width"
        />
        <!-- Resize handle (right edge) -->
        <div
          class="ai-chat-resize ai-chat-resize-right"
          :class="{ 'ai-chat-resize-active': isResizing && resizeSide === 'right' }"
          @mousedown="(e) => onResizeMouseDown(e, 'right')"
          title="Drag to resize width"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ai-chat-popup {
  position: fixed;
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 80px);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

/* Header - Dark purple (draggable) */
.ai-chat-header {
  position: relative;
  background: #4c1d95;
  padding: 20px 40px 16px 20px;
  text-align: center;
  cursor: move;
}

.ai-chat-header-dragging {
  cursor: grabbing;
}

.ai-chat-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.ai-chat-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.ai-chat-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.ai-chat-mascot {
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
  mix-blend-mode: screen;
}

.ai-chat-greeting {
  margin: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

/* Main: Chat + Sidebar */
.ai-chat-main {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Body - White */
.ai-chat-body {
  padding: 16px;
  background: #fff;
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid #e5e7eb;
}

/* Right sidebar - Chat titles */
.ai-chat-sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-chat-new-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px;
  padding: 10px 14px;
  background: #4c1d95;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.ai-chat-new-btn:hover {
  background: #5b21b6;
}

.ai-chat-sidebar-title {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ai-chat-sidebar-loading {
  padding: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.ai-chat-sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 12px;
  -webkit-overflow-scrolling: touch;
}

.ai-chat-sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 4px;
  background: transparent;
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.ai-chat-sidebar-item:hover {
  background: #f3f4f6;
}

.ai-chat-sidebar-item.active {
  background: #ede9fe;
  color: #4c1d95;
}

.ai-chat-sidebar-item-title {
  font-size: 12px;
  line-height: 1.3;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.ai-chat-sidebar-item.active .ai-chat-sidebar-item-title {
  color: #4c1d95;
}

.ai-chat-sidebar-item-date {
  font-size: 10px;
  color: #9ca3af;
}

.ai-chat-sidebar-item.active .ai-chat-sidebar-item-date {
  color: #7c3aed;
}

.ai-chat-sidebar-empty {
  padding: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.ai-chat-scroll-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 16px;
  -webkit-overflow-scrolling: touch;
}

.ai-chat-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-chat-msg {
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.4;
}

.ai-chat-msg-content {
  white-space: pre-wrap;
}
.ai-chat-msg-content :deep(strong) {
  font-weight: 600;
}
.ai-chat-msg-content :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}
.ai-chat-msg-content :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}
.ai-chat-msg-content :deep(li) {
  margin: 4px 0;
}

.ai-chat-msg-user {
  background: #eef2ff;
  color: #3730a3;
  margin-left: 24px;
}

.ai-chat-msg-assistant {
  background: #f3f4f6;
  color: #374151;
  margin-right: 24px;
}

.ai-chat-msg-loading .ai-chat-msg-content {
  opacity: 0.7;
  font-style: italic;
}

.ai-chat-report-data {
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(76, 29, 149, 0.08);
  border-radius: 6px;
  font-size: 12px;
  border-left: 3px solid #4c1d95;
}

.ai-chat-report-row {
  line-height: 1.5;
}

.ai-chat-error {
  margin: 0 0 12px;
  padding: 8px 12px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 12px;
  border-radius: 6px;
}

.ai-chat-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.ai-chat-question-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.ai-chat-question-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.ai-chat-question-text {
  flex: 1;
  line-height: 1.4;
}

.ai-chat-question-arrow {
  flex-shrink: 0;
  color: #9ca3af;
}

.ai-chat-citation {
  flex-shrink: 0;
  margin: 8px 0 0;
  padding: 6px 0;
  font-size: 10px;
  color: #9ca3af;
  font-style: italic;
  text-align: center;
}

.ai-chat-input-wrap {
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

.ai-chat-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.4;
  color: #374151;
  background: #fff;
  outline: none;
  resize: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.ai-chat-input::placeholder {
  color: #9ca3af;
}

.ai-chat-input:focus {
  border-color: #4c1d95;
  box-shadow: 0 0 0 2px rgba(76, 29, 149, 0.15);
}

.ai-chat-submit-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

.ai-chat-download-btns {
  display: flex;
  gap: 4px;
}

.ai-chat-download-btn {
  padding: 4px 8px;
  font-size: 11px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.ai-chat-download-btn:hover {
  background: #e5e7eb;
  color: #4c1d95;
}

.ai-chat-submit {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.ai-chat-submit:hover {
  color: #6b7280;
}

.ai-chat-submit-arrow {
  flex-shrink: 0;
}

/* Resize handles */
.ai-chat-resize {
  position: absolute;
  top: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
}

.ai-chat-resize-left {
  left: 0;
}

.ai-chat-resize-right {
  right: 0;
}

.ai-chat-resize:hover,
.ai-chat-resize-active {
  background: rgba(76, 29, 149, 0.15);
}

.ai-chat-resize-left::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 2px;
  width: 2px;
  height: 24px;
  margin-top: -12px;
  background: rgba(76, 29, 149, 0.3);
  border-radius: 1px;
}

.ai-chat-resize-right::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 2px;
  width: 2px;
  height: 24px;
  margin-top: -12px;
  background: rgba(76, 29, 149, 0.3);
  border-radius: 1px;
}

/* Transition */
.ai-chat-fade-enter-active,
.ai-chat-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.ai-chat-fade-enter-from,
.ai-chat-fade-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
