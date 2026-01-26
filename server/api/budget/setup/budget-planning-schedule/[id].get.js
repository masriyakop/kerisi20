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
    
    const schedule = await prisma.budget_planning_schedule.findUnique({
      where: {
        bps_id: parseInt(id),
      },
    });
    
    if (!schedule) {
      return {
        statusCode: 404,
        message: "Budget planning schedule not found",
      };
    }
    
    const startDate = schedule.bps_plan_startDate ? new Date(schedule.bps_plan_startDate).toLocaleDateString('en-GB') : '';
    const endDate = schedule.bps_plan_endDate ? new Date(schedule.bps_plan_endDate).toLocaleDateString('en-GB') : '';
    
    return {
      statusCode: 200,
      message: "Budget planning schedule fetched successfully",
      data: {
        bps_id: schedule.bps_id.toString(),
        bps_year_budget: schedule.bps_year_budget,
        bps_plan_startDate: startDate,
        bps_plan_endDate: endDate,
        bps_status: schedule.bps_status,
      },
    };
  } catch (error) {
    console.error("Error fetching budget planning schedule:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

