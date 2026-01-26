import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bmm_budget_movement_id,
      bmm_year,
      bmm_endorse_doc,
      bmm_movement_type,
      bmm_description,
      bmm_money_transfer,
      bmm_total_amt,
      submitMode,
      workflow,
      dataArraySource,
      dataArrayTarget,
    } = body;

    if (!bmm_year || !bmm_endorse_doc || !bmm_movement_type || !bmm_description || !bmm_total_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields",
      };
    }

    let movementId = bmm_budget_movement_id;

    // Get next sequence for master if new
    if (!movementId) {
      const maxMaster = await prisma.budget_movement_master.findFirst({
        orderBy: {
          bmm_budget_movement_id: 'desc',
        },
      });
      movementId = (maxMaster?.bmm_budget_movement_id || 0) + 1;
    }

    // Generate reference number (simplified)
    const refNo = `VIRE-${bmm_year}-${String(movementId).padStart(6, '0')}`;

    const masterData = {
      bmm_year: bmm_year,
      bmm_budget_movement_no: refNo,
      bmm_trans_type: "VIREMENT",
      bmm_movement_type: bmm_movement_type,
      bmm_total_amt: parseFloat(bmm_total_amt.toString().replace(/,/g, "")),
      bmm_endorse_doc: bmm_endorse_doc,
      bmm_description: bmm_description,
      bmm_money_transfer: bmm_money_transfer || "N",
      bmm_status: submitMode === "Submit" ? "ENTRY" : "DRAFT",
      createdby: "system", // TODO: Get from auth
    };

    if (bmm_budget_movement_id) {
      // Update existing
      await prisma.budget_movement_master.update({
        where: {
          bmm_budget_movement_id: parseInt(bmm_budget_movement_id),
        },
        data: {
          ...masterData,
          updatedby: "system",
          updateddate: new Date(),
        },
      });
    } else {
      // Create new
      await prisma.budget_movement_master.create({
        data: {
          bmm_budget_movement_id: movementId,
          ...masterData,
        },
      });
    }

    // Update detail status if submitting
    if (submitMode === "Submit" && bmm_budget_movement_id) {
      await prisma.budget_movement_detl.updateMany({
        where: {
          bmm_budget_movement_id: parseInt(bmm_budget_movement_id),
        },
        data: {
          bmd_mvt_status: "ENTRY",
          updatedby: "system",
          updateddate: new Date(),
        },
      });
    }

    return {
      statusCode: 200,
      message: submitMode === "Submit" ? "Application submitted successfully" : "Application saved successfully",
      bmm_budget_movement_id: movementId,
      referenceNo: refNo,
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    return {
      statusCode: 500,
      message: "Failed to submit application",
      error: error.message,
    };
  }
});

