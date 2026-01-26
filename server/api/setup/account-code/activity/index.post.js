import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.lde_value || !body.lde_description || !body.lde_status) {
      return {
        statusCode: 400,
        message: "Missing required fields: lde_value, lde_description, and lde_status are required",
      };
    }

    // Check if account activity already exists
    const existing = await prisma.lookup_details.findFirst({
      where: {
        lma_code_name: 'ACCOUNT_ACTIVITY',
        lde_group: null,
        lde_value: body.lde_value,
      },
    });

    if (existing) {
      return {
        statusCode: 409,
        message: "Account activity code already exists",
      };
    }

    // Get the next ID (since lde_id is not auto-increment, we need to find max)
    const maxId = await prisma.lookup_details.findFirst({
      where: {
        lma_code_name: 'ACCOUNT_ACTIVITY',
      },
      orderBy: {
        lde_id: 'desc',
      },
      select: {
        lde_id: true,
      },
    });

    const nextId = maxId ? maxId.lde_id + 1 : 1;

    // Get max sorting value
    const maxSorting = await prisma.lookup_details.findFirst({
      where: {
        lma_code_name: 'ACCOUNT_ACTIVITY',
      },
      orderBy: {
        lde_sorting: 'desc',
      },
      select: {
        lde_sorting: true,
      },
    });

    const nextSorting = maxSorting?.lde_sorting ? maxSorting.lde_sorting + 1 : 1;

    // Create new account activity
    const newActivity = await prisma.lookup_details.create({
      data: {
        lde_id: nextId,
        lma_code_name: 'ACCOUNT_ACTIVITY',
        lde_value: body.lde_value,
        lde_description: body.lde_description,
        lde_description2: body.lde_description2 || null,
        lde_status: body.lde_status === 'ACTIVE' ? '1' : '0',
        lde_sorting: nextSorting,
        createddate: new Date(),
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Account activity created successfully",
      data: {
        lde_id: newActivity.lde_id,
        lde_value: newActivity.lde_value,
        lde_description: newActivity.lde_description,
        lde_description2: newActivity.lde_description2,
        lde_status: newActivity.lde_status === '1' || newActivity.lde_status === 1 ? 'ACTIVE' : 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error creating account activity:", error);
    
    if (error.code === 'P2002') {
      return {
        statusCode: 409,
        message: "Account activity code already exists",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while creating account activity",
      error: error.message,
    };
  }
});
