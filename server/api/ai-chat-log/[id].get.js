import prisma2 from "~/server/utils/prisma2";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id, 10);
    if (!id || Number.isNaN(id)) {
      setResponseStatus(event, 400);
      return { statusCode: 400, error: "Invalid chat id" };
    }

    const chat = await prisma2.ai_chat_log.findUnique({
      where: { ail_chat_log_id: id },
    });

    if (!chat) {
      setResponseStatus(event, 404);
      return { statusCode: 404, error: "Chat not found" };
    }

    return {
      statusCode: 200,
      data: chat,
    };
  } catch (err) {
    console.error("[ai-chat-log] get error:", err?.message);
    setResponseStatus(event, 500);
    return {
      statusCode: 500,
      error: err?.message || "Failed to fetch chat",
    };
  }
});
