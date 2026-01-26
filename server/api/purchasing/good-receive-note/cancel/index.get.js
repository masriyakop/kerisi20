import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {
      grm_status: { contains: 'CANCEL' },
    };

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { grm_receive_no: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
      ];
    }

    const grnList = await prisma.goods_receive_master.findMany({
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

    const vendorMap = new Map(vendors.map(v => [v.vcs_vendor_code, v]));
    const poMap = new Map(purchaseOrders.map(po => [po.pom_order_no, po]));

    const data = grnList.map((grn) => {
      const vendor = vendorMap.get(grn.vcs_vendor_code);
      const po = poMap.get(grn.pom_order_no);

      const amount = grn.goods_receive_details.reduce((sum, detail) => {
        return sum + (detail.grd_total_amtrm ? parseFloat(detail.grd_total_amtrm.toString()) : 0);
      }, 0);

      const grnDate = grn.grm_receive_date
        ? new Date(grn.grm_receive_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      return {
        grm_receive_id: grn.grm_receive_id,
        grm_receive_no: grn.grm_receive_no || '',
        pom_order_no: po?.pom_order_no || '',
        vcs_vendor_code: grn.vcs_vendor_code || '',
        vcs_vendor_name: vendor?.vcs_vendor_name || '',
        pom_description: po?.pom_description || '',
        grm_receive_date: grnDate,
        amount: amount,
        urlEdit: `/purchasing/good-receive-note/edit/${grn.grm_receive_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Good receive note cancel list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching good receive note cancel list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch good receive note cancel list",
      error: error.message,
    };
  }
});
