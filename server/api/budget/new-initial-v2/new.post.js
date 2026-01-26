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

    // Create a new draft master record
    const newRecord = await prisma.budget_movement_master.create({
      data: {
        bmm_budget_movement_id: movementId,
        bmm_year: new Date().getFullYear().toString(),
        bmm_trans_type: "INITIAL",
        bmm_status: "DRAFT",
        bmm_total_amt: 0,
        createdby: "system", // TODO: Get from auth
      },
    });

    return {
      statusCode: 200,
      message: "New initial record created successfully",
      data: {
        bam_id: newRecord.bmm_budget_movement_id,
      },
    };
  } catch (error) {
    console.error("Error creating new initial record:", error);
    return {
      statusCode: 500,
      message: "Failed to create new initial record",
      error: error.message,
    };
  }
});

