import prisma from "~/server/utils/prisma2";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      mm_mesg_code,
      mm_mesg_type,
      mm_mesg_category,
      mm_user_mesg,
      ml_mesg_desc,
      ml_user_id,
      ml_user_role,
      ml_page_name,
      ml_module_name,
      ml_page_breadcrumb,
    } = body || {};

    const mesgCode = mm_mesg_code || "TRX-CNF-002";
    const createdby = ml_user_id || "system";

    // Ensure message code exists in adm_message_master (required by FK)
    await prisma.adm_message_master.upsert({
      where: { mm_mesg_code: mesgCode },
      create: {
        mm_mesg_code: mesgCode,
        mm_mesg_type: mm_mesg_type || "CONFIRM",
        mm_mesg_category: mm_mesg_category || "TRANSACTION",
        mm_user_mesg: mm_user_mesg || "Message",
        createdby,
      },
      update: {},
    });

    const record = await prisma.adm_message_log.create({
      data: {
        mm_mesg_code: mesgCode,
        ml_user_action: null,
        ml_root_cause: null,
        ml_mesg_desc: ml_mesg_desc != null && String(ml_mesg_desc).trim() !== ""
          ? String(ml_mesg_desc).substring(0, 500)
          : null,
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
      data: { id: record.ml_message_log_id != null ? Number(record.ml_message_log_id) : null },
    };
  } catch (error) {
    console.error("Error writing message log:", error?.code, error?.message, error?.meta);
    return {
      statusCode: 500,
      message: "Failed to write message log",
      error: error?.message || "Unknown error",
      code: error?.code,
    };
  }
});
