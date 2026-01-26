import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required",
      };
    }
    
    const planning = await prisma.budget_planning_master.findUnique({
      where: {
        bpm_id: BigInt(id),
      },
    });
    
    if (!planning) {
      return {
        statusCode: 404,
        message: "Budget planning not found",
      };
    }
    
    return {
      statusCode: 200,
      message: "Budget planning fetched successfully",
      data: {
        bpm_id: planning.bpm_id.toString(),
        bpm_planning_no: planning.bpm_planning_no,
        bpm_year: planning.bpm_year,
        bpm_oun_code: planning.bpm_oun_code,
        bpm_ccr_costcentre: planning.bpm_ccr_costcentre,
        bpm_remark: planning.bpm_remark,
        bpm_total_amt: planning.bpm_total_amt?.toString(),
        bpm_status: planning.bpm_status,
      },
    };
  } catch (error) {
    console.error("Error fetching budget planning:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

