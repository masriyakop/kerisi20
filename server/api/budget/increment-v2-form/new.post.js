import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Get next sequence for master
    const maxMaster = await prisma.budget_movement_master.findFirst({
      orderBy: {
        bmm_budget_movement_id: 'desc',
      },
    });
    
    const movementId = (maxMaster?.bmm_budget_movement_id || 0) + 1;
    const currentYear = new Date().getFullYear().toString();
    
    // Generate reference number
    const refNo = `INC-${currentYear}-${String(movementId).padStart(6, '0')}`;

    // Create new draft master record
    const master = await prisma.budget_movement_master.create({
      data: {
        bmm_budget_movement_id: movementId,
        bmm_year: currentYear,
        bmm_budget_movement_no: refNo,
        bmm_trans_type: "INCREMENT",
        bmm_movement_type: "INCREMENT",
        bmm_total_amt: 0,
        bmm_status: "DRAFT",
        createdby: "system", // TODO: Get from auth
      },
    });

    return {
      statusCode: 200,
      message: "New increment record created successfully",
      data: {
        bmm_budget_movement_id: master.bmm_budget_movement_id,
        bmm_budget_movement_no: master.bmm_budget_movement_no,
        bmm_year: master.bmm_year,
        bmm_status: master.bmm_status,
      },
    };
  } catch (error) {
    console.error("Error creating new increment:", error);
    return {
      statusCode: 500,
      message: "Failed to create new increment record",
      error: error.message,
    };
  }
});

