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
    const existingRecord = await prisma.lookup_details_adm.findUnique({
      where: { lde_id: parseInt(id) },
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
    if (body.Code !== undefined) updateData.lde_value = body.Code;
    if (body.code !== undefined) updateData.lde_value = body.code;
    if (body.Description !== undefined) updateData.lde_description = body.Description;
    if (body.description !== undefined) updateData.lde_description = body.description;
    if (body.Status !== undefined) updateData.lde_status = body.Status;
    if (body.status !== undefined) updateData.lde_status = body.status;
    // Process original field names LAST so they take priority over stale alias values
    if (body.lde_value !== undefined) updateData.lde_value = body.lde_value;
    if (body.lde_description !== undefined) updateData.lde_description = body.lde_description;
    if (body.lde_status !== undefined) updateData.lde_status = body.lde_status;
    // Copy any other fields that match original field names (excluding id fields)
    Object.keys(body).forEach(key => {
      if (key.startsWith('lde_') && key !== 'lde_id' && body[key] !== undefined) {
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
    const data = await prisma.lookup_details_adm.update({
      where: { lde_id: parseInt(id) },
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
