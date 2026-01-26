import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Check if work_progress_note_master table exists by trying to access it
    // If it doesn't exist, return empty data
    let wpnList = [];
    try {
      // Get all vendor assessments that have WPN progress numbers
      const vendorAssessments = await prisma.vendor_assessment_master.findMany({
        where: {
          wpm_progress_no: { not: null },
        },
        select: {
          wpm_progress_no: true,
        },
      });

      // Create a set of WPN numbers that have vendor assessments
      const wpnNumbersWithAssessment = new Set(
        vendorAssessments
          .map(va => va.wpm_progress_no)
          .filter(Boolean)
      );

      // Try to fetch work progress notes if the table exists
      // Note: This will fail if the table doesn't exist, which is expected
      let whereClause = {};

      if (query.search) {
        const searchTerm = query.search.trim();
        whereClause.OR = [
          { wpm_progress_no: { contains: searchTerm } },
          { pom_order_no: { contains: searchTerm } },
          { vcs_vendor_code: { contains: searchTerm } },
        ];
      }

      // Attempt to fetch from work_progress_note_master
      // This will throw an error if the table doesn't exist
      const allWPNs = await prisma.work_progress_note_master.findMany({
        where: whereClause,
        include: {
          work_progress_note_details: {
            select: {
              wpd_total_amtrm: true,
            },
          },
        },
        orderBy: {
          wpm_progress_id: 'desc',
        },
      });

      // Filter WPNs that don't have vendor assessment
      wpnList = allWPNs.filter(
        wpn => !wpnNumbersWithAssessment.has(wpn.wpm_progress_no)
      );

      console.log(`Total WPNs found: ${allWPNs.length}`);
      console.log(`WPNs with vendor assessment: ${wpnNumbersWithAssessment.size}`);
      console.log(`WPNs without vendor assessment: ${wpnList.length}`);
    } catch (tableError) {
      // If table doesn't exist or other error, return empty array
      console.log("Work progress note table may not exist or error occurred:", tableError.message);
      wpnList = [];
    }

    // If no WPNs found, return empty data
    if (wpnList.length === 0) {
      return {
        statusCode: 200,
        message: "WPN without vendor assessment fetched successfully",
        data: [],
      };
    }

    const vendorCodes = [...new Set(wpnList.map(wpn => wpn.vcs_vendor_code).filter(Boolean))];
    const poNumbers = [...new Set(wpnList.map(wpn => wpn.pom_order_no).filter(Boolean))];

    const vendors = vendorCodes.length > 0 ? await prisma.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true },
    }) : [];

    const purchaseOrders = poNumbers.length > 0 ? await prisma.purchase_order_master.findMany({
      where: { pom_order_no: { in: poNumbers } },
      select: { pom_order_no: true, pom_description: true },
    }) : [];

    const vendorMap = new Map(vendors.map(v => [v.vcs_vendor_code, v]));
    const poMap = new Map(purchaseOrders.map(po => [po.pom_order_no, po]));

    const data = wpnList.map((wpn) => {
      const vendor = vendorMap.get(wpn.vcs_vendor_code);
      const po = poMap.get(wpn.pom_order_no);

      const amount = wpn.work_progress_note_details?.reduce((sum, detail) => {
        return sum + (detail.wpd_total_amtrm ? parseFloat(detail.wpd_total_amtrm.toString()) : 0);
      }, 0) || 0;

      return {
        wpn_no: wpn.wpm_progress_no || '',
        pom_order_no: po?.pom_order_no || '',
        vcs_vendor_code: wpn.vcs_vendor_code || '',
        vcs_vendor_name: vendor?.vcs_vendor_name || '',
        pom_description: po?.pom_description || '',
        amount: amount,
        status: wpn.wpm_status || '',
        assessment_status: '',
        urlEdit: `/purchasing/work-progress-note/edit/${wpn.wpm_progress_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "WPN without vendor assessment fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching WPN without vendor assessment:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch WPN without vendor assessment",
      error: error.message,
    };
  }
});
