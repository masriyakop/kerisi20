import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause
    let whereClause = {
      rqm_status: { not: null },
    };

    // Search filter - search across multiple fields
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_requisition_title: { contains: searchTerm } },
        { rqm_status: { contains: searchTerm } },
        { rqm_agg_no: { contains: searchTerm } },
      ];
    }

    // Smart filter for Status
    if (query.smartFilter_Status) {
      whereClause.rqm_status = query.smartFilter_Status;
    }

    // Smart filter for DateFrom
    if (query.smartFilter_DateFrom) {
      const [day, month, year] = query.smartFilter_DateFrom.split('/');
      const startDate = new Date(`${year}-${month}-${day}`);
      whereClause.updateddate = {
        ...(whereClause.updateddate || {}),
        gte: startDate,
      };
    }

    // Smart filter for DateTo
    if (query.smartFilter_DateTo) {
      const [day, month, year] = query.smartFilter_DateTo.split('/');
      const endDate = new Date(`${year}-${month}-${day} 23:59:59`);
      whereClause.updateddate = {
        ...(whereClause.updateddate || {}),
        lte: endDate,
      };
    }

    // Smart filter for Requisition No
    if (query.smartFilter_RequisitionNo) {
      whereClause.rqm_requisition_no = { contains: query.smartFilter_RequisitionNo };
    }

    // Smart filter for Title
    if (query.smartFilter_Title) {
      whereClause.rqm_requisition_title = { contains: query.smartFilter_Title };
    }

    // Smart filter for Agreement No
    if (query.smartFilter_AgreementNo) {
      whereClause.rqm_agg_no = { contains: query.smartFilter_AgreementNo };
    }

    // Fetch requisitions
    const requisitions = await prisma.requisition_master.findMany({
      where: whereClause,
      orderBy: {
        updateddate: 'desc',
      },
    });

    // Process data to match expected format
    const data = requisitions.map((req) => {
      // Format created/updated date
      const createdDate = req.updateddate || req.createddate;
      const formattedDate = createdDate
        ? new Date(createdDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      return {
        rqm_requisition_id: req.rqm_requisition_id,
        rqm_requisition_no: req.rqm_requisition_no || '',
        rqm_requisition_title: req.rqm_requisition_title || '',
        rqm_amount: req.rqm_amount ? parseFloat(req.rqm_amount.toString()) : 0,
        rqm_agg_no: req.rqm_agg_no || '',
        rqm_status: req.rqm_status || '',
        updateddate: formattedDate,
        // urlEdit is kept for backward compatibility but not used for navigation
        urlEdit: `/purchasing/purchase-requisition/new`,
      };
    });

    return {
      statusCode: 200,
      message: "Purchase requisitions fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching purchase requisitions:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase requisitions",
      error: error.message,
    };
  }
});
