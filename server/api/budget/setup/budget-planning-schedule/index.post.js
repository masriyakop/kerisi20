import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validation
    if (!body.cmd_year || !body.cmd_start_date || !body.cmd_end_date || !body.cmd_status) {
      return {
        statusCode: 400,
        message: "Year, Start Date, End Date, and Status are required",
      };
    }
    
    const yearInt = parseInt(body.cmd_year);
    if (isNaN(yearInt)) {
      return {
        statusCode: 400,
        message: "Year must be a valid number",
      };
    }
    
    // Check if year already exists
    const existing = await prisma.budget_planning_schedule.findFirst({
      where: {
        bps_year_budget: yearInt,
      },
    });
    
    if (existing) {
      return {
        statusCode: 400,
        message: `Year ${body.cmd_year} already exists with status ${existing.bps_status === '1' ? 'ACTIVE' : 'INACTIVE'}`,
      };
    }
    
    // Parse dates - handle both date string and date input formats
    let startDate, endDate;
    if (body.cmd_start_date.includes('/')) {
      startDate = new Date(body.cmd_start_date.split('/').reverse().join('-'));
    } else {
      startDate = new Date(body.cmd_start_date);
    }
    
    if (body.cmd_end_date.includes('/')) {
      endDate = new Date(body.cmd_end_date.split('/').reverse().join('-'));
    } else {
      endDate = new Date(body.cmd_end_date);
    }
    
    // Create new schedule
    const schedule = await prisma.budget_planning_schedule.create({
      data: {
        bps_year_budget: yearInt,
        bps_plan_startDate: startDate,
        bps_plan_endDate: endDate,
        bps_status: body.cmd_status,
        createddate: new Date(),
      },
    });
    
    return {
      statusCode: 201,
      message: "New Schedule for Budget Planning successfully saved",
      data: {
        bps_id: schedule.bps_id.toString(),
        bps_year_budget: schedule.bps_year_budget,
        bps_plan_startDate: new Date(schedule.bps_plan_startDate).toLocaleDateString('en-GB'),
        bps_plan_endDate: new Date(schedule.bps_plan_endDate).toLocaleDateString('en-GB'),
        bps_status: schedule.bps_status,
      },
    };
  } catch (error) {
    console.error("Error creating budget planning schedule:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

