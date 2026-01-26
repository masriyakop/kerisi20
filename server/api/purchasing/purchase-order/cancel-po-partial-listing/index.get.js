import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {
      pom_order_status: { contains: 'PARTIAL' },
    };

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
      ];
    }

    const purchaseOrders = await prisma.purchase_order_master.findMany({
      where: whereClause,
      include: {
        purchase_order_details: {
          select: {
            pod_total_amtrm: true,
          },
        },
      },
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
      const partialAmount = po.purchase_order_details.reduce((sum, detail) => {
        return sum + (detail.pod_total_amtrm ? parseFloat(detail.pod_total_amtrm.toString()) : 0);
      }, 0);
      
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || '',
        oun_code: po.pom_order_ref || '',
        pom_description: po.pom_description || '',
        vcs_vendor_code: po.vcs_vendor_code || '',
        vcs_vendor_name: vendor?.vcs_vendor_name || '',
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        partial_amount: partialAmount,
        pom_order_status: po.pom_order_status || '',
        urlEdit: `/purchasing/purchase-order/edit/${po.pom_order_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Cancel PO partial listing fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching cancel PO partial listing:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch cancel PO partial listing",
      error: error.message,
    };
  }
});
