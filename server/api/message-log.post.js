import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      mm_mesg_code,
      ml_user_id,
      ml_user_role,
      ml_page_name,
      ml_module_name,
      ml_page_breadcrumb,
    } = body || {};

    const mesgCode = mm_mesg_code || "TRX-CNF-002";

    const createdby = ml_user_id || "system";

    const record = await prisma.adm_message_log.create({
      data: {
        mm_mesg_code: mesgCode,
        ml_user_action: "CONFIRM",
        ml_root_cause: "TRANSACTION",
        ml_user_id: ml_user_id || null,
        ml_user_role: ml_user_role || null,
        ml_page_name: ml_page_name || null,
        ml_module_name: ml_module_name || null,
        ml_page_breadcrumb: ml_page_breadcrumb || null,
        createdby,
      },
    });

    return {
      statusCode: 200,
      message: "Message log recorded",
      data: { id: record.ml_message_log_id },
    };
  } catch (error) {
    console.error("Error writing message log:", error);
    return {
      statusCode: 500,
      message: "Failed to write message log",
      error: error?.message || "Unknown error",
    };
  }
});
