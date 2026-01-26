import prisma from "~/server/utils/prisma";

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
    
    // Parse dates if provided
    const updateData = {};
    if (body.YEARS) updateData.qbu_year = body.YEARS;
    if (body.DESCS) updateData.qbu_description = body.DESCS.toUpperCase();
    if (body.SDATE) {
      updateData.qbu_start_date = new Date(body.SDATE.split('/').reverse().join('-'));
    }
    if (body.EDATE) {
      updateData.qbu_end_date = new Date(body.EDATE.split('/').reverse().join('-'));
    }
    if (body.STAT) {
      updateData.qbu_status = body.STAT;
      updateData.qbu_extended_field = {
        statusDesc: body.STAT,
      };
    }
    updateData.updateddate = new Date();
    
    // Update allocation
    const allocation = await prisma.quarter_budget.update({
      where: {
        qbu_quarter_id: BigInt(id),
      },
      data: updateData,
    });
    
    return {
      statusCode: 200,
      message: "Allocation updated successfully",
      data: {
        ID: allocation.qbu_quarter_id.toString(),
        YEARS: allocation.qbu_year,
        DESCS: allocation.qbu_description,
        SDATE: new Date(allocation.qbu_start_date).toLocaleDateString('en-GB'),
        EDATE: new Date(allocation.qbu_end_date).toLocaleDateString('en-GB'),
        STAT: allocation.qbu_status || 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error updating allocation:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Allocation not found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

