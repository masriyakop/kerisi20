import { createRequire } from "module";
import prisma2 from "~/server/utils/prisma2";

const require = createRequire(import.meta.url);

function getSessionId(event) {
  const accessToken = getCookie(event, "accessToken");
  if (accessToken) {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(accessToken).digest("hex").substring(0, 64);
  }
  return "anonymous";
}

export default defineEventHandler(async (event) => {
  try {
    const createdby =
      event.context?.user?.userID ?? event.context?.user?.email ?? event.context?.user?.username ?? null;
    const sessionId = getSessionId(event);

    const where = createdby
      ? { createdby: String(createdby) }
      : { ail_session_id: sessionId };

    const chats = await prisma2.ai_chat_log.findMany({
      where,
      orderBy: { createddate: "desc" },
      take: 50,
      select: {
        ail_chat_log_id: true,
        ail_chat_title: true,
        ail_session_id: true,
        createddate: true,
      },
    });

    return {
      statusCode: 200,
      data: chats,
    };
  } catch (err) {
    console.error("[ai-chat-log] list error:", err?.message);
    setResponseStatus(event, 500);
    return {
      statusCode: 500,
      error: err?.message || "Failed to fetch chat list",
    };
  }
});
