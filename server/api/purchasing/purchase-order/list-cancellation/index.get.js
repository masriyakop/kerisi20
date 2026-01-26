import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {
      pom_order_status: { contains: 'CANCEL' },
    };

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } },
      ];
    }

    const purchaseOrders = await prisma.purchase_order_master.findMany({
      where: whereClause,
      orderBy: {
        pom_order_id: 'desc',
      },
    });

    const vendorCodes = [...new Set(purchaseOrders.map(po => po.vcs_vendor_code).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true },
    }) : [];

    const vendorMap = new Map(vendors.map(v => [v.vcs_vendor_code, v]));

    const data = purchaseOrders.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || '',
        pom_description: po.pom_description || '',
        oun_code: po.pom_order_ref || '',
        vcs_vendor_code: po.vcs_vendor_code || '',
        vcs_vendor_name: vendor?.vcs_vendor_name || '',
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        pom_order_status: po.pom_order_status || '',
        pom_cancel_remark: po.pom_cancel_remark || '',
        urlEdit: `/purchasing/purchase-order/edit/${po.pom_order_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Purchase order cancellations fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching purchase order cancellations:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase order cancellations",
      error: error.message,
    };
  }
});
