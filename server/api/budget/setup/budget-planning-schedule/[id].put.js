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
    if (body.cmd_start_date) {
      if (body.cmd_start_date.includes('/')) {
        updateData.bps_plan_startDate = new Date(body.cmd_start_date.split('/').reverse().join('-'));
      } else {
        updateData.bps_plan_startDate = new Date(body.cmd_start_date);
      }
    }
    if (body.cmd_end_date) {
      if (body.cmd_end_date.includes('/')) {
        updateData.bps_plan_endDate = new Date(body.cmd_end_date.split('/').reverse().join('-'));
      } else {
        updateData.bps_plan_endDate = new Date(body.cmd_end_date);
      }
    }
    if (body.cmd_status) {
      updateData.bps_status = body.cmd_status;
    }
    if (body.cmd_year) {
      const yearInt = parseInt(body.cmd_year);
      if (!isNaN(yearInt)) {
        updateData.bps_year_budget = yearInt;
      }
    }
    updateData.updateddate = new Date();
    
    // Update schedule
    const schedule = await prisma.budget_planning_schedule.update({
      where: {
        bps_id: parseInt(id),
      },
      data: updateData,
    });
    
    return {
      statusCode: 200,
      message: `Schedule for Budget Planning Year ${schedule.bps_year_budget} successfully updated`,
      data: {
        bps_id: schedule.bps_id.toString(),
        bps_year_budget: schedule.bps_year_budget,
        bps_plan_startDate: new Date(schedule.bps_plan_startDate).toLocaleDateString('en-GB'),
        bps_plan_endDate: new Date(schedule.bps_plan_endDate).toLocaleDateString('en-GB'),
        bps_status: schedule.bps_status,
      },
    };
  } catch (error) {
    console.error("Error updating budget planning schedule:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Budget planning schedule not found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

