import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bam_id,
      bam_year,
      bam_quarter_id,
      bam_endorse_doc,
      bam_file_name,
      submitMode,
      workflow,
    } = body;

    if (!bam_year || !bam_quarter_id || !bam_endorse_doc) {
      return {
        statusCode: 400,
        message: "All required fields must be provided",
      };
    }

    let movementId = bam_id;

    // If no ID provided, create new record
    if (!movementId) {
      const maxMaster = await prisma.budget_movement_master.findFirst({
        orderBy: {
          bmm_budget_movement_id: 'desc',
        },
      });
      movementId = (maxMaster?.bmm_budget_movement_id || 0) + 1;

      await prisma.budget_movement_master.create({
        data: {
          bmm_budget_movement_id: movementId,
          bmm_year: bam_year,
          qbu_quarter_id: parseInt(bam_quarter_id),
          bmm_trans_type: "INITIAL",
          bmm_status: submitMode === "Submit" ? "ENTRY" : "DRAFT",
          bmm_endorse_doc: bam_endorse_doc,
          bmm_fileid: bam_file_name,
          bmm_total_amt: 0,
          createdby: "system", // TODO: Get from auth
        },
      });
    } else {
      // Update existing record
      await prisma.budget_movement_master.update({
        where: {
          bmm_budget_movement_id: movementId,
        },
        data: {
          bmm_year: bam_year,
          qbu_quarter_id: parseInt(bam_quarter_id),
          bmm_endorse_doc: bam_endorse_doc,
          bmm_fileid: bam_file_name,
          bmm_status: submitMode === "Submit" ? "ENTRY" : "DRAFT",
          updatedby: "system", // TODO: Get from auth
        },
      });
    }

    // TODO: Handle workflow submission if submitMode === "Submit"
    // This would involve calling workflow procedures similar to increment form

    return {
      statusCode: 200,
      message: submitMode === "Submit" ? "Application submitted successfully" : "Application saved successfully",
      bam_id: movementId,
    };
  } catch (error) {
    console.error("Error saving/submitting application:", error);
    return {
      statusCode: 500,
      message: "Failed to save/submit application",
      error: error.message,
    };
  }
});

