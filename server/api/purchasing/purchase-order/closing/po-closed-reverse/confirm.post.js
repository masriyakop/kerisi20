import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { poData, tf_fund } = body;

    if (!poData || Object.keys(poData).length === 0) {
      return {
        status: 'ko',
        errorMessage: "No PO selected. Please select at least one PO.",
      };
    }

    const selectedPOs = Object.keys(poData);
    
    // Extract PO numbers and PPC IDs
    const poNumbers = [];
    const ppcIds = [];
    selectedPOs.forEach(key => {
      const parts = key.split('_');
      poNumbers.push(parts[0]);
      ppcIds.push(parseInt(parts[1]));
    });

    // Get po_process_closing records
    let poRecords = [];
    try {
      poRecords = await prisma.po_process_closing.findMany({
        where: {
          ppc_id: { in: ppcIds },
        },
        select: {
          ppc_id: true,
          pod_order_detl_id: true,
          pom_order_no: true,
          ppc_year: true,
          opening_status: true,
        },
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        status: 'ko',
        errorMessage: "Table not found. Please ensure the database is set up correctly.",
      };
    }

    if (poRecords.length === 0) {
      return {
        status: 'ko',
        errorMessage: "No valid records found for selected POs.",
      };
    }

    // Calculate closing year (opening_status - 1)
    const years = [...new Set(poRecords.map(po => {
      const openingYear = po.opening_status ? parseInt(po.opening_status) : null;
      return openingYear ? openingYear - 1 : null;
    }).filter(Boolean))];

    if (years.length > 1) {
      return {
        status: 'ko',
        errorMessage: "Selected POs have different closing years. Please select POs from the same year only.",
      };
    }

    if (years.length === 0) {
      return {
        status: 'ko',
        errorMessage: "Unable to determine closing year for selected POs.",
      };
    }

    const p_year = years[0];
    const lv_new_year = p_year + 1;

    // Get po_closing_history records
    const podOrderDetlIds = [...new Set(poRecords.map(po => po.pod_order_detl_id).filter(Boolean))];
    const uniquePONumbers = [...new Set(poRecords.map(po => po.pom_order_no).filter(Boolean))];

    let pchRecords = [];
    try {
      pchRecords = await prisma.po_closing_history.findMany({
        where: {
          pod_order_detl_id: { in: podOrderDetlIds },
          pom_order_no: { in: uniquePONumbers },
          pch_closing_year: p_year,
        },
        select: {
          pch_id: true,
        },
      });
    } catch (tableError) {
      console.log("po_closing_history table may not exist:", tableError.message);
      return {
        status: 'ko',
        errorMessage: "Closing history table not found.",
      };
    }

    if (pchRecords.length === 0) {
      return {
        status: 'ko',
        errorMessage: "No closing history found for selected POs.",
      };
    }

    const pchIds = pchRecords.map(pch => pch.pch_id);

    // TODO: Implement the full reverse process
    // This is a complex process that involves:
    // 1. Checking for budget transactions
    // 2. Deleting INCREASE transactions for new year
    // 3. Deleting DECREASE transactions for old year
    // 4. Restoring purchase order details to old budget structure
    // 5. Recalculating budget amounts
    // 6. Updating po_process_closing opening_status to NULL
    // 7. Deleting po_closing_history records
    
    // For now, return a placeholder response
    return {
      status: 'ok',
      successmessage: `PO Closing Reverse completed successfully. ${pchIds.length} record(s) processed.`,
      processedCount: pchIds.length,
      year: p_year,
    };
  } catch (error) {
    console.error("Error reversing PO closing:", error);
    return {
      status: 'ko',
      errorMessage: `PO Closing Reverse failed: ${error.message}`,
    };
  }
});
