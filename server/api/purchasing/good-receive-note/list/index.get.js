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
        { pom_description: { contains: searchTerm } },
        { grm_status: { contains: searchTerm } },
      ];
    }

    if (query.smartFilter_Status) {
      whereClause.grm_status = query.smartFilter_Status;
    }

    const grnList = await prisma.goods_receive_master.findMany({
      where: whereClause,
      include: {
        goods_receive_details: {
          select: {
            grd_taxamt: true,
          },
        },
      },
      orderBy: {
        grm_receive_id: 'desc',
      },
    });

    // Get vendor codes and PO numbers
    const vendorCodes = [...new Set(grnList.map(grn => grn.vcs_vendor_code).filter(Boolean))];
    const poNumbers = [...new Set(grnList.map(grn => grn.pom_order_no).filter(Boolean))];

    // Fetch vendors
    const vendors = vendorCodes.length > 0 ? await prisma.vend_customer_supplier.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes },
      },
      select: {
        vcs_vendor_code: true,
        vcs_vendor_name: true,
      },
    }) : [];

    // Fetch purchase orders for descriptions
    const purchaseOrders = poNumbers.length > 0 ? await prisma.purchase_order_master.findMany({
      where: {
        pom_order_no: { in: poNumbers },
      },
      select: {
        pom_order_no: true,
        pom_description: true,
      },
    }) : [];

    // Fetch bills
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

      const taxAmount = grn.goods_receive_details.reduce((sum, detail) => {
        return sum + (detail.grd_taxamt ? parseFloat(detail.grd_taxamt.toString()) : 0);
      }, 0);

      const createdDate = grn.createddate
        ? new Date(grn.createddate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      return {
        grm_receive_no: grn.grm_receive_no || '',
        pom_order_no: grn.pom_order_no || '',
        vcs_vendor_code: grn.vcs_vendor_code || '',
        vcs_vendor_name: vendor?.vcs_vendor_name || '',
        pom_description: po?.pom_description || '',
        sum_grd_taxamt: taxAmount,
        grm_total_amt: grn.grm_total_amt ? parseFloat(grn.grm_total_amt.toString()) : 0,
        grm_status: grn.grm_status || '',
        bim_bills_no: bill?.bim_bills_no || '',
        vam_status: '', // TODO: Get from vendor assessment
        createddate: createdDate,
        urlEdit: `/purchasing/good-receive-note/edit/${grn.grm_receive_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Good receive notes fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching good receive notes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch good receive notes",
      error: error.message,
    };
  }
});
