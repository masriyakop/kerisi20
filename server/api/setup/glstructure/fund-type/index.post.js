import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Map aliased fields back to original field names
    const createData = {};
    if (body.fty_fund_id !== undefined) createData.fty_fund_id = body.fty_fund_id;
    if (body.fty_fund_type !== undefined) createData.fty_fund_type = body.fty_fund_type;
    if (body.fty_fund_desc !== undefined) createData.fty_fund_desc = body.fty_fund_desc;
    if (body.fty_basis !== undefined) createData.fty_basis = body.fty_basis;
    if (body.fty_remark !== undefined) createData.fty_remark = body.fty_remark;
    if (body.fty_status !== undefined) createData.fty_status = body.fty_status;
    if (body.entryDate !== undefined) createData.createddate = body.entryDate;
    if (body.entrydate !== undefined && createData.createddate === undefined) createData.createddate = body.entrydate;
    if (body["Fund Type"] !== undefined) createData.fty_fund_type = body["Fund Type"];
    if (body.Fund_Type !== undefined && createData.fty_fund_type === undefined) createData.fty_fund_type = body.Fund_Type;
    if (body.fund_type !== undefined && createData.fty_fund_type === undefined) createData.fty_fund_type = body.fund_type;
    if (body.Description !== undefined) createData.fty_fund_desc = body.Description;
    if (body.description !== undefined && createData.fty_fund_desc === undefined) createData.fty_fund_desc = body.description;
    if (body["Type Basis"] !== undefined) createData.fty_basis = body["Type Basis"];
    if (body.Type_Basis !== undefined && createData.fty_basis === undefined) createData.fty_basis = body.Type_Basis;
    if (body.type_basis !== undefined && createData.fty_basis === undefined) createData.fty_basis = body.type_basis;
    if (body.Remark !== undefined) createData.fty_remark = body.Remark;
    if (body.remark !== undefined && createData.fty_remark === undefined) createData.fty_remark = body.remark;
    if (body.Status !== undefined) createData.fty_status = body.Status;
    if (body.status !== undefined && createData.fty_status === undefined) createData.fty_status = body.status;
    if (body["Entry Date"] !== undefined) createData.createddate = body["Entry Date"];
    if (body.Entry_Date !== undefined && createData.createddate === undefined) createData.createddate = body.Entry_Date;
    if (body.entry_date !== undefined && createData.createddate === undefined) createData.createddate = body.entry_date;
    if (body.EntryDate !== undefined) createData.createddate = body.EntryDate;
    if (body.entrydate !== undefined && createData.createddate === undefined) createData.createddate = body.entrydate;
    if (body.fty_fund_entrydate !== undefined && createData.createddate === undefined) createData.createddate = body.fty_fund_entrydate;
    // Copy any fields that match original field names (exclude schema-mismatched fields)
    Object.keys(body).forEach(key => {
      if (key.startsWith('fty_fund_') && key !== 'fty_fund_id' && key !== 'fty_fund_entrydate' && key !== 'fty_fund_fund-type') {
        if (!createData.hasOwnProperty(key)) {
          createData[key] = body[key];
        }
      }
    });
    delete createData['fty_fund_entrydate'];
    delete createData['fty_fund_fund-type'];
    
    

    // Auto-generate primary key if not provided (for non-auto-increment Int primary keys)
    if (!createData.fty_fund_id || createData.fty_fund_id === 0) {
      const maxRecord = await prisma.fund_type.findFirst({
        orderBy: { fty_fund_id: 'desc' },
        select: { fty_fund_id: true },
      });
      createData.fty_fund_id = maxRecord ? maxRecord.fty_fund_id + 1 : 1;
    }

    // Validate required fields (check createData after mapping and WHERE conditions are applied)
    // No required fields validation needed

    // Convert year fields to string if they are numbers (database may expect String for year fields)
    Object.keys(createData).forEach(key => {
      if ((key.toLowerCase().includes('year') || key.toLowerCase().includes('_year')) && typeof createData[key] === 'number') {
        createData[key] = String(createData[key]);
      }
    });
    // Convert date-only strings (YYYY-MM-DD) to Date for Prisma DateTime fields
    const dateTimeFieldsPost = ['createddate', 'updateddate'];
    dateTimeFieldsPost.forEach((key) => {
      if (createData[key] && typeof createData[key] === 'string' && !createData[key].includes('T')) {
        createData[key] = new Date(createData[key]);
      }
    });


    // Create record
    const data = await prisma.fund_type.create({
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
