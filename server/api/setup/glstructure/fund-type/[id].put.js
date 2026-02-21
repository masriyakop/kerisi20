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

    // Check if record exists before updating
    const existingRecord = await prisma.fund_type.findUnique({
      where: { fty_fund_id: parseInt(id) },
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
    if (body.entryDate !== undefined) updateData.createddate = body.entryDate;
    if (body.entrydate !== undefined) updateData.createddate = body.entrydate;
    if (body["Fund Type"] !== undefined) updateData.fty_fund_type = body["Fund Type"];
    if (body.Fund_Type !== undefined) updateData.fty_fund_type = body.Fund_Type;
    if (body.fund_type !== undefined) updateData.fty_fund_type = body.fund_type;
    if (body.Description !== undefined) updateData.fty_fund_desc = body.Description;
    if (body.description !== undefined) updateData.fty_fund_desc = body.description;
    if (body["Type Basis"] !== undefined) updateData.fty_basis = body["Type Basis"];
    if (body.Type_Basis !== undefined) updateData.fty_basis = body.Type_Basis;
    if (body.type_basis !== undefined) updateData.fty_basis = body.type_basis;
    if (body.Remark !== undefined) updateData.fty_remark = body.Remark;
    if (body.remark !== undefined) updateData.fty_remark = body.remark;
    if (body.Status !== undefined) updateData.fty_status = body.Status;
    if (body.status !== undefined) updateData.fty_status = body.status;
    if (body["Entry Date"] !== undefined) updateData.createddate = body["Entry Date"];
    if (body.Entry_Date !== undefined) updateData.createddate = body.Entry_Date;
    if (body.entry_date !== undefined) updateData.createddate = body.entry_date;
    if (body.EntryDate !== undefined) updateData.createddate = body.EntryDate;
    if (body.entrydate !== undefined) updateData.createddate = body.entrydate;
    // Process original field names LAST so they take priority over stale alias values
    if (body.fty_fund_id !== undefined) updateData.fty_fund_id = body.fty_fund_id;
    if (body.fty_fund_type !== undefined) updateData.fty_fund_type = body.fty_fund_type;
    if (body.fty_fund_desc !== undefined) updateData.fty_fund_desc = body.fty_fund_desc;
    if (body.fty_basis !== undefined) updateData.fty_basis = body.fty_basis;
    if (body.fty_remark !== undefined) updateData.fty_remark = body.fty_remark;
    if (body.fty_status !== undefined) updateData.fty_status = body.fty_status;
    if (body.createddate !== undefined) updateData.createddate = body.createddate;
    if (body.fty_fund_entrydate !== undefined) updateData.createddate = body.fty_fund_entrydate;
    // Copy any other fields that match original field names (excluding id and schema-mismatched fields)
    Object.keys(body).forEach(key => {
      if (key.startsWith('fty_fund_') && key !== 'fty_fund_id' && key !== 'fty_fund_entrydate' && key !== 'fty_fund_fund-type' && body[key] !== undefined) {
        if (!updateData.hasOwnProperty(key)) {
          updateData[key] = body[key];
        }
      }
    });
    delete updateData['fty_fund_entrydate'];
    delete updateData['fty_fund_fund-type'];
    

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
    // Convert date-only strings (YYYY-MM-DD) to Date for Prisma DateTime fields
    const dateTimeFieldsPut = ['createddate', 'updateddate'];
    dateTimeFieldsPut.forEach((key) => {
      if (updateData[key] && typeof updateData[key] === 'string' && !updateData[key].includes('T')) {
        updateData[key] = new Date(updateData[key]);
      }
    });


    // Update record
    const data = await prisma.fund_type.update({
      where: { fty_fund_id: parseInt(id) },
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
