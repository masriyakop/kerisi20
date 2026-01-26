import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause
    let whereClause = {};

    // Search filter
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { tdm_tender_no: { contains: searchTerm } },
        { tdm_briefing_ref_no: { contains: searchTerm } },
        { tdm_tender_type: { contains: searchTerm } },
        { tdm_title: { contains: searchTerm } },
        { tdm_requisition_no: { contains: searchTerm } },
        { tdm_status: { contains: searchTerm } },
      ];
    }

    // Smart filter for Status
    if (query.smartFilter_Status) {
      whereClause.tdm_status = query.smartFilter_Status;
    }

    // Smart filter for Type
    if (query.smartFilter_Type) {
      whereClause.tdm_tender_type = query.smartFilter_Type;
    }

    // Smart filter for Start Date
    if (query.smartFilter_StartDate) {
      const [day, month, year] = query.smartFilter_StartDate.split('/');
      const startDate = new Date(`${year}-${month}-${day}`);
      whereClause.tdm_start_date = {
        ...(whereClause.tdm_start_date || {}),
        gte: startDate,
      };
    }

    // Smart filter for End Date
    if (query.smartFilter_EndDate) {
      const [day, month, year] = query.smartFilter_EndDate.split('/');
      const endDate = new Date(`${year}-${month}-${day} 23:59:59`);
      whereClause.tdm_end_date = {
        ...(whereClause.tdm_end_date || {}),
        lte: endDate,
      };
    }

    // Fetch tender/advertisement requests
    const tenderRequests = await prisma.tender_master.findMany({
      where: whereClause,
      orderBy: {
        tdm_tender_id: 'desc',
      },
    });

    // Process data to match expected format
    const data = tenderRequests.map((tender) => {
      // Format dates
      const startDate = tender.tdm_start_date
        ? new Date(tender.tdm_start_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      const endDate = tender.tdm_end_date
        ? new Date(tender.tdm_end_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      return {
        tdm_tender_id: tender.tdm_tender_id,
        tdm_tender_no: tender.tdm_tender_no || '',
        tdm_briefing_ref_no: tender.tdm_briefing_ref_no || '',
        tdm_tender_type: tender.tdm_tender_type || '',
        tdm_start_date: startDate,
        tdm_end_date: endDate,
        tdm_title: tender.tdm_title || '',
        tdm_estimated_amount: tender.tdm_estimated_amount ? parseFloat(tender.tdm_estimated_amount.toString()) : 0,
        tdm_requisition_no: tender.tdm_requisition_no || '',
        tdm_status: tender.tdm_status || '',
        urlEdit: `/purchasing/advertisement/edit/${tender.tdm_tender_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Advertisement requests fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching advertisement requests:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch advertisement requests",
      error: error.message,
    };
  }
});
