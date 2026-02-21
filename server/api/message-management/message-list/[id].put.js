import prisma from "~/server/utils/prisma2";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required",
      };
    }

    // Check if record exists before updating
    const existingRecord = await prisma.adm_message_log.findUnique({
      where: { ml_message_log_id: parseInt(id) },
    });

    if (!existingRecord) {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }

    // Map aliased fields back to original field names
    // CRITICAL: Process aliases FIRST (stale values from form load), then original fields LAST (user edits)
    // This ensures user edits take priority over stale alias values
    const updateData = {};
    if (body.Code !== undefined) updateData.mm_mesg_code = body.Code;
    if (body.code !== undefined) updateData.mm_mesg_code = body.code;
    if (body.Type !== undefined) updateData.mm_mesg_type = body.Type;
    if (body.type !== undefined) updateData.mm_mesg_type = body.type;
    if (body["Page Name"] !== undefined) updateData.ml_page_name = body["Page Name"];
    if (body.Page_Name !== undefined) updateData.ml_page_name = body.Page_Name;
    if (body.page_name !== undefined) updateData.ml_page_name = body.page_name;
    if (body["Bread Crumb"] !== undefined) updateData.ml_page_breadcrumb = body["Bread Crumb"];
    if (body.Bread_Crumb !== undefined) updateData.ml_page_breadcrumb = body.Bread_Crumb;
    if (body.bread_crumb !== undefined) updateData.ml_page_breadcrumb = body.bread_crumb;
    if (body.Module !== undefined) updateData.ml_module_name = body.Module;
    if (body.module !== undefined) updateData.ml_module_name = body.module;
    if (body.Message !== undefined) updateData.ml_mesg_desc = body.Message;
    if (body.message !== undefined) updateData.ml_mesg_desc = body.message;
    if (body.Respond !== undefined) updateData.ml_user_action = body.Respond;
    if (body.respond !== undefined) updateData.ml_user_action = body.respond;
    // Process original field names LAST so they take priority over stale alias values
    if (body.mm_mesg_code !== undefined) updateData.mm_mesg_code = body.mm_mesg_code;
    if (body.mm_mesg_type !== undefined) updateData.mm_mesg_type = body.mm_mesg_type;
    if (body.ml_page_name !== undefined) updateData.ml_page_name = body.ml_page_name;
    if (body.ml_page_breadcrumb !== undefined) updateData.ml_page_breadcrumb = body.ml_page_breadcrumb;
    if (body.ml_module_name !== undefined) updateData.ml_module_name = body.ml_module_name;
    if (body.ml_mesg_desc !== undefined) updateData.ml_mesg_desc = body.ml_mesg_desc;
    if (body.ml_user_action !== undefined) updateData.ml_user_action = body.ml_user_action;
    // Copy any other fields that match original field names (excluding id fields)
    Object.keys(body).forEach(key => {
      if (key.startsWith('ml_message_log_') && key !== 'ml_message_log_id' && body[key] !== undefined) {
        if (!updateData.hasOwnProperty(key)) {
          updateData[key] = body[key];
        }
      }
    });

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return {
        statusCode: 400,
        message: "No fields to update",
      };
    }

    // Convert year fields to string if they are numbers (database may expect String for year fields)
    Object.keys(updateData).forEach(key => {
      if ((key.toLowerCase().includes('year') || key.toLowerCase().includes('_year')) && typeof updateData[key] === 'number') {
        updateData[key] = String(updateData[key]);
      }
    });

    // Update record
    const data = await prisma.adm_message_log.update({
      where: { ml_message_log_id: parseInt(id) },
      data: updateData,
    });

    return {
      statusCode: 200,
      message: "Record updated successfully",
      data,
    };
  } catch (error) {
    console.error("Error updating record:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }
    
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return {
        statusCode: 409,
        message: `Record with this ${field} already exists`,
        error: "Unique constraint violation",
      };
    }
    
    if (error.code === 'P2003') {
      return {
        statusCode: 400,
        message: "Foreign key constraint violation. Please check related records.",
        error: "Foreign key constraint violation",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to update record",
      error: "development" === 'development' ? error.message : "An error occurred while updating the record",
    };
  }
});
