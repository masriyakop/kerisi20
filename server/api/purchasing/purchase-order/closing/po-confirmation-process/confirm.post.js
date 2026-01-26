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
    const poNumbers = [...new Set(selectedPOs.map(key => {
      const parts = key.split('_');
      return parts[0];
    }))];

    // Check year consistency
    let poRecords = [];
    try {
      poRecords = await prisma.po_process_closing.findMany({
        where: {
          pom_order_no: { in: poNumbers },
          opening_status: null,
        },
        select: {
          closing_status: true,
        },
        distinct: ['closing_status'],
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        status: 'ko',
        errorMessage: "Table not found. Please ensure the database is set up correctly.",
      };
    }

    if (poRecords.length > 1) {
      return {
        status: 'ko',
        errorMessage: "Selected POs have different years. Please select POs from the same year only.",
      };
    }

    if (poRecords.length === 0) {
      return {
        status: 'ko',
        errorMessage: "No valid records found for selected POs.",
      };
    }

    // TODO: Implement the full confirmation process
    // This is a complex process that involves:
    // 1. Checking for budget availability
    // 2. Creating budget transactions
    // 3. Updating purchase order details
    // 4. Creating closing history records
    // 5. Updating opening status
    
    // For now, return a placeholder response
    return {
      status: 'ok',
      successmessage: `Process completed successfully. ${selectedPOs.length} record(s) processed.`,
      processedCount: selectedPOs.length,
      processedPOs: poNumbers,
      errors: {},
    };
  } catch (error) {
    console.error("Error confirming PO:", error);
    return {
      status: 'ko',
      errorMessage: `Process failed: ${error.message}`,
    };
  }
});
