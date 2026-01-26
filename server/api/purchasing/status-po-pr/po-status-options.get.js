import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const statuses = await prisma.purchase_order_master.findMany({
      select: {
        pom_order_status: true,
      },
      distinct: ['pom_order_status'],
      where: {
        pom_order_status: { not: null },
      },
      orderBy: {
        pom_order_status: 'asc',
      },
    });

    const options = statuses.map(status => ({
      label: status.pom_order_status,
      value: status.pom_order_status,
    }));

    return {
      statusCode: 200,
      message: 'PO status options fetched successfully',
      data: options,
    };
  } catch (error) {
    console.error('Error in po-status-options API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
