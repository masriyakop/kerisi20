import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause
    let whereClause = {
      pom_order_status: { not: null },
    };

    // Search filter - search across multiple fields
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { pom_requisition_no: { contains: searchTerm } },
      ];
    }

    // Smart filter for Status
    if (query.smartFilter_Status) {
      whereClause.pom_order_status = query.smartFilter_Status;
    }

    // Smart filter for DateFrom
    if (query.smartFilter_DateFrom) {
      const [day, month, year] = query.smartFilter_DateFrom.split('/');
      const startDate = new Date(`${year}-${month}-${day}`);
      whereClause.pom_approve_date = {
        ...(whereClause.pom_approve_date || {}),
        gte: startDate,
      };
    }

    // Smart filter for DateTo
    if (query.smartFilter_DateTo) {
      const [day, month, year] = query.smartFilter_DateTo.split('/');
      const endDate = new Date(`${year}-${month}-${day} 23:59:59`);
      whereClause.pom_approve_date = {
        ...(whereClause.pom_approve_date || {}),
        lte: endDate,
      };
    }

    // Smart filter for Description
    if (query.smartFilter_Description) {
      whereClause.pom_description = { contains: query.smartFilter_Description };
    }

    // Smart filter for PoNo
    if (query.smartFilter_PoNo) {
      whereClause.pom_order_no = query.smartFilter_PoNo;
    }

    // Fetch purchase orders
    const purchaseOrders = await prisma.purchase_order_master.findMany({
      where: whereClause,
      include: {
        purchase_order_details: {
          select: {
            pom_order_id: true,
            rqm_requisition_no: true,
            oun_code: true,
          },
        },
      },
      orderBy: {
        createddate: 'desc',
      },
    });

    // Get unique vendor codes and requisition numbers
    const vendorCodes = [...new Set(purchaseOrders.map(po => po.vcs_vendor_code).filter(Boolean))];
    const requisitionNos = [...new Set(purchaseOrders.flatMap(po => 
      po.purchase_order_details.map(pod => pod.rqm_requisition_no).filter(Boolean)
    ))];

    // Fetch vendors
    const vendors = vendorCodes.length > 0 ? await prisma.vend_customer_supplier.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes },
      },
      select: {
        vcs_vendor_code: true,
        vcs_vendor_name: true,
        vcs_addr3: true,
      },
    }) : [];

    // Fetch requisitions
    const requisitions = requisitionNos.length > 0 ? await prisma.requisition_master.findMany({
      where: {
        rqm_requisition_no: { in: requisitionNos },
      },
      select: {
        rqm_requisition_no: true,
        oun_code: true,
      },
    }) : [];

    // Create maps for quick lookup
    const vendorMap = new Map(vendors.map(v => [v.vcs_vendor_code, v]));
    const requisitionMap = new Map(requisitions.map(r => [r.rqm_requisition_no, r]));

    // Apply smart filter for Cancellation and VenName after fetching vendors
    let filteredPOs = purchaseOrders;
    if (query.smartFilter_Cancellation || query.smartFilter_VenName) {
      filteredPOs = purchaseOrders.filter(po => {
        const vendor = vendorMap.get(po.vcs_vendor_code);
        if (!vendor) return false;
        
        if (query.smartFilter_Cancellation && !vendor.vcs_addr3?.includes(query.smartFilter_Cancellation)) {
          return false;
        }
        if (query.smartFilter_VenName && !vendor.vcs_vendor_name?.includes(query.smartFilter_VenName)) {
          return false;
        }
        return true;
      });
    }

    // Process data to match expected format
    const data = filteredPOs.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      
      // Get PTJ code from requisition_master or pom_order_ref
      let ounCode = po.pom_order_ref || null;
      
      // Try to get PTJ from requisition if available
      const requisitionNosFromPO = po.purchase_order_details
        .map((pod) => pod.rqm_requisition_no)
        .filter(Boolean);
      
      if (requisitionNosFromPO.length > 0) {
        const firstReq = requisitionMap.get(requisitionNosFromPO[0]);
        if (firstReq?.oun_code) {
          ounCode = firstReq.oun_code;
        }
      }
      
      // Get requisition numbers (prlno) - GROUP_CONCAT equivalent
      const prlno = requisitionNosFromPO.join(',');
      
      // Format approve/update date
      const approveDate = po.pom_approve_date || po.updateddate || po.createddate;
      const formattedDate = approveDate
        ? new Date(approveDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      // Format created/updated date
      const createdDate = po.updateddate || po.createddate;
      const formattedCreatedDate = createdDate
        ? new Date(createdDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || '',
        pom_description: po.pom_description || '',
        oun_code: ounCode || '',
        vcs_vendor_code: po.vcs_vendor_code || '',
        vcs_vendor_name: vendor?.vcs_vendor_name || '',
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        pom_order_status: po.pom_order_status || '',
        prlno: prlno || '',
        createddate: formattedCreatedDate,
        APPROVE_UPDATEDATE: formattedDate,
        pom_approve_by: po.pom_approve_by || '',
        // urlEdit is kept for backward compatibility but not used for navigation
        urlEdit: `/purchasing/purchase-order/new`,
        was_notes: '', // Will be populated if needed from wf_application_status
      };
    });

    return {
      statusCode: 200,
      message: "Purchase orders fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase orders",
      error: error.message,
    };
  }
});
