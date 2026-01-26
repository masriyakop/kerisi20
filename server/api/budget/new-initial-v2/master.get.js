import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bam_id = parseInt(query.bam_id);

    if (!bam_id) {
      return {
        statusCode: 400,
        message: "bam_id is required",
      };
    }

    // Using budget_movement_master with transaction type INITIAL
    const master = await prisma.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id: bam_id,
      },
      include: {
        quarter_budget: true,
      },
    });

    if (!master || master.bmm_trans_type !== "INITIAL") {
      return {
        statusCode: 404,
        message: "Budget initial master not found",
      };
    }

    return {
      statusCode: 200,
      data: {
        REFERENCE: master.bmm_budget_movement_no || "",
        QUARTER: master.quarter_budget ? `${master.quarter_budget.qbu_year} - ${master.quarter_budget.qbu_description}` : "",
        ENDORSE_DOC: master.bmm_endorse_doc || "",
        FILENAMING: master.bmm_fileid || "",
        STAT: master.bmm_status || "DRAFT",
        YEAR: master.bmm_year || "",
      },
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch master data",
      error: error.message,
    };
  }
});

