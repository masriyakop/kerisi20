import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  // Log immediately - this should appear if route is recognized
  console.log("=== MESSAGE LOG API CALLED ===");
  console.log("Request method:", event.method);
  console.log("Request URL:", event.node?.req?.url);
  
  try {
    const body = await readBody(event);
    console.log("Message log request body:", JSON.stringify(body, null, 2));
    
    const {
      ml_user_id,
      ml_user_role,
      ml_page_name,
      ml_module_name,
      ml_page_breadcrumb,
    } = body || {};

    const mesgCode = "TRX-CNF-002";
    const userAction = "CONFIRM"; // Delete confirmation action
    const createdBy = ml_user_id || "system";
    const now = new Date();

    const dataToInsert = {
      mm_mesg_code: mesgCode,
      ml_user_id: ml_user_id || null,
      ml_user_role: ml_user_role || null,
      ml_page_name: ml_page_name || null,
      ml_user_action: userAction,
      ml_module_name: ml_module_name || null,
      ml_page_breadcrumb: ml_page_breadcrumb || null,
      ml_status: "OPEN",
      createddate: now,
      createdby: createdBy,
    };

    console.log("Attempting to create message log with:", JSON.stringify(dataToInsert, null, 2));

    if (!prisma || !prisma.adm_message_log) {
      console.error("Prisma client or adm_message_log model is not available");
      throw new Error("Database connection not available");
    }

    const record = await prisma.adm_message_log.create({
      data: dataToInsert,
    });

    console.log("Message log created successfully:", record.ml_message_log_id);

    return {
      statusCode: 200,
      message: "Message log recorded",
      data: { id: record.ml_message_log_id },
    };
  } catch (error) {
    console.error("=== ERROR WRITING MESSAGE LOG ===");
    console.error("Error code:", error?.code);
    console.error("Error message:", error?.message);
    console.error("Error meta:", error?.meta);
    console.error("Error stack:", error?.stack);
    
    // Handle Prisma-specific errors
    if (error?.code && error.code.startsWith('P')) {
      setResponseStatus(event, 400);
      return {
        statusCode: 400,
        message: "Database error",
        error: error.message,
        code: error.code,
        meta: error.meta,
      };
    }

    setResponseStatus(event, 500);
    return {
      statusCode: 500,
      message: "Failed to write message log",
      error: error?.message || "Unknown error",
    };
  }
});
