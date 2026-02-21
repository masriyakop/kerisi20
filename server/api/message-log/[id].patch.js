import prisma from "~/server/utils/prisma2";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return {
      statusCode: 400,
      message: "Message log id is required",
    };
  }

  try {
    const body = await readBody(event);
    const { ml_user_action } = body || {};

    const logId = BigInt(id);

    await prisma.adm_message_log.update({
      where: { ml_message_log_id: logId },
      data: {
        ml_user_action: ml_user_action != null ? String(ml_user_action).substring(0, 50) : null,
        updateddate: new Date(),
        updatedby: body?.ml_user_id ?? "system",
      },
    });

    return {
      statusCode: 200,
      message: "Message log updated",
    };
  } catch (error) {
    if (error?.code === "P2025") {
      return {
        statusCode: 404,
        message: "Message log not found",
      };
    }
    console.error("Error updating message log:", error?.code, error?.message);
    return {
      statusCode: 500,
      message: "Failed to update message log",
      error: error?.message || "Unknown error",
    };
  }
});
