import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { grm_receive_no: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
      ];
    }

    // Get all GRNs
    const allGRNs = await prisma.goods_receive_master.findMany({
      where: whereClause,
      include: {
        goods_receive_details: {
          select: {
            grd_total_amtrm: true,
          },
        },
      },
      orderBy: {
        grm_receive_id: 'desc',
      },
    });

    // Get all vendor assessments that have GRN numbers
    const vendorAssessments = await prisma.vendor_assessment_master.findMany({
      where: {
        vam_grn_no: { not: null },
      },
      select: {
        vam_grn_no: true,
      },
    });

    // Create a set of GRN numbers that have vendor assessments
    const grnNumbersWithAssessment = new Set(
      vendorAssessments
        .map(va => va.vam_grn_no)
        .filter(Boolean)
    );

    // Filter GRNs that don't have vendor assessment
    const grnList = allGRNs.filter(
      grn => !grnNumbersWithAssessment.has(grn.grm_receive_no)
    );

    console.log(`Total GRNs found: ${allGRNs.length}`);
    console.log(`GRNs with vendor assessment: ${grnNumbersWithAssessment.size}`);
    console.log(`GRNs without vendor assessment: ${grnList.length}`);

    const vendorCodes = [...new Set(grnList.map(grn => grn.vcs_vendor_code).filter(Boolean))];
    const poNumbers = [...new Set(grnList.map(grn => grn.pom_order_no).filter(Boolean))];

    const vendors = vendorCodes.length > 0 ? await prisma.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true },
    }) : [];

    const purchaseOrders = poNumbers.length > 0 ? await prisma.purchase_order_master.findMany({
      where: { pom_order_no: { in: poNumbers } },
      select: { pom_order_no: true, pom_description: true },
    }) : [];

    const bills = await prisma.bills_master.findMany({
      where: {
        grm_receive_no: { in: grnList.map(grn => grn.grm_receive_no).filter(Boolean) },
      },
      select: {
        grm_receive_no: true,
        bim_bills_no: true,
      },
    });

    const vendorMap = new Map(vendors.map(v => [v.vcs_vendor_code, v]));
    const poMap = new Map(purchaseOrders.map(po => [po.pom_order_no, po]));
    const billMap = new Map(bills.map(b => [b.grm_receive_no, b]));

    const data = grnList.map((grn) => {
      const vendor = vendorMap.get(grn.vcs_vendor_code);
      const po = poMap.get(grn.pom_order_no);
      const bill = billMap.get(grn.grm_receive_no);

      const amount = grn.goods_receive_details.reduce((sum, detail) => {
        return sum + (detail.grd_total_amtrm ? parseFloat(detail.grd_total_amtrm.toString()) : 0);
      }, 0);

      return {
        grm_receive_id: grn.grm_receive_id,
        grm_receive_no: grn.grm_receive_no || '',
        pom_order_no: po?.pom_order_no || '',
        vcs_vendor_code: grn.vcs_vendor_code || '',
        vcs_vendor_name: vendor?.vcs_vendor_name || '',
        pom_description: po?.pom_description || '',
        amount: amount,
        grm_status: grn.grm_status || '',
        bim_bills_no: bill?.bim_bills_no || '',
        vam_status: '', // TODO: Get from vendor assessment
        urlEdit: `/purchasing/good-receive-note/edit/${grn.grm_receive_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "GRN without vendor assessment fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching GRN without vendor assessment:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch GRN without vendor assessment",
      error: error.message,
    };
  }
});
