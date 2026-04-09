# Kerisi AI Chat – File Reference

This document lists all files related to the Kerisi AI Chat (AINA) feature.

---

## Frontend Components

| File | Purpose |
|------|---------|
| `components/AIChatPopup.vue` | Chat popup triggered from header icon |
| `components/AIChatStandalone.vue` | Standalone chat window (e.g. `/ai-chat` page) |
| `components/layouts/Header.vue` | Header bar with AI chat icon button |
| `components/layouts/index.vue` | Layout that mounts the chat component |

---

## Composables (State & Logic)

| File | Purpose |
|------|---------|
| `composables/useAIChat.js` | State for popup chat (open/close/toggle) |
| `composables/useAIChatStandalone.js` | State for standalone chat |

---

## Pages

| File | Purpose |
|------|---------|
| `pages/ai-chat.vue` | `/ai-chat` route – opens standalone chat window |

---

## Server API

| File | Purpose |
|------|---------|
| `server/api/ai-chat.post.js` | Sends messages to AI (Ollama) |
| `server/api/ai-report/query.post.js` | AI report queries (budget, PO, PR, etc.) |
| `server/api/ai-chat-log/index.get.js` | List chat sessions |
| `server/api/ai-chat-log/[id].get.js` | Get single chat session by ID |

---

## Server Utilities

| File | Purpose |
|------|---------|
| `server/utils/aiEngine.js` | AI/Ollama integration |
| `server/utils/aiReportHandlers.js` | Report query handlers |

---

## Assets

| Path | Purpose |
|------|---------|
| `assets/img/kerina-mascot.png` | Chat mascot image |
| `public/img/kerina-mascot-header.png` | Header mascot image |

---

