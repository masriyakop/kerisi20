import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Create new budget planning application
    const planning = await prisma.budget_planning_master.create({
      data: {
        bpm_year: body.year || new Date().getFullYear().toString(),
        bpm_oun_code: body.ptj_code || '',
        fty_fund_type: body.fund || '',
        at_activity_code: body.activity || '',
        bpm_type: 'YEARLY',
        bpm_status: 'DRAFT',
        bpm_total_amt: 0,
      },
    });
    
    return {
      statusCode: 201,
      message: "New application created successfully",
      data: {
        bpm_id: planning.bpm_id.toString(),
        bpm_year: planning.bpm_year,
        bpm_oun_code: planning.bpm_oun_code,
        bpm_status: planning.bpm_status,
      },
    };
  } catch (error) {
    console.error("Error creating new application:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

