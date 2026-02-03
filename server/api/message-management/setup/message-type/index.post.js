import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Map aliased fields back to original field names
    const createData = {};
    if (body.lde_value !== undefined) createData.lde_value = body.lde_value;
    if (body.lde_description !== undefined) createData.lde_description = body.lde_description;
    if (body.lde_status !== undefined) createData.lde_status = body.lde_status;
    if (body.Code !== undefined) createData.lde_value = body.Code;
    if (body.Description !== undefined) createData.lde_description = body.Description;
    if (body.Status !== undefined) createData.lde_status = body.Status;
    // Copy any fields that match original field names
    Object.keys(body).forEach(key => {
      if (key.startsWith('lde_') && key !== 'lde_id') {
        if (!createData.hasOwnProperty(key)) {
          createData[key] = body[key];
        }
      }
    });
    // Add WHERE conditions from queryMapping
    createData.lma_code_name = "MESSAGE_TYPE"; // From queryMapping WHERE clause

    // Validate required fields (check createData after mapping and WHERE conditions are applied)
    // No required fields validation needed

    // Create record
    const data = await prisma.lookup_details.create({
      data: createData,
    });

    return {
      statusCode: 200,
      message: "Record created successfully",
      data,
    };
  } catch (error) {
    console.error("Error creating record:", error);
    
    // Handle Prisma-specific errors
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
      message: "Failed to create record",
      error: "development" === 'development' ? error.message : "An error occurred while creating the record",
    };
  }
});
