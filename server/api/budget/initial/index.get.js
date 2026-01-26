import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {};
    
    // Top filters (Warrant Filter)
    if (query.reference && query.reference !== 'null' && query.reference.trim() !== '') {
      where.bam_allocation_no = { contains: query.reference.trim() };
    }
    if (query.year && query.year !== 'null' && query.year.trim() !== '') {
      where.bam_year = query.year.trim();
    }
    if (query.quarter && query.quarter !== 'null' && query.quarter.trim() !== '') {
      // bam_quarter_id is a string, filter by matching quarter description
      where.bam_quarter_id = { contains: query.quarter.trim() };
    }
    
    // Smart filters (these override top filters if both are provided)
    if (query.sm_year && query.sm_year.trim() !== '') {
      where.bam_year = query.sm_year.trim();
    }
    if (query.sm_quarter && query.sm_quarter.trim() !== '') {
      where.bam_quarter_id = { contains: query.sm_quarter.trim() };
    }
    if (query.sm_status && query.sm_status.trim() !== '') {
      where.bam_status_cd = query.sm_status.trim();
    }
    
    // Search filter (searches across multiple fields)
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ bam_id: searchNum }]),
        { bam_year: { contains: searchTerm } },
        { bam_allocation_no: { contains: searchTerm } },
        { bam_endorse_doc: { contains: searchTerm } },
        { bam_status_cd: { contains: searchTerm } },
      ];
    }

    // Fetch all budget initial records from database (no pagination, frontend handles it)
    const records = await prisma.budget_allocation_master.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        createddate: 'desc',
      },
    });

    // Fetch quarter descriptions for mapping
    const quarterIds = [...new Set(records.map(r => r.bam_quarter_id).filter(Boolean))];
    const quarters = quarterIds.length > 0 ? await prisma.quarter_budget.findMany({
      where: {
        OR: [
          { qbu_quarter_id: { in: quarterIds.map(id => parseInt(id) || 0).filter(id => id > 0) } },
          { qbu_description: { in: quarterIds } },
        ],
      },
      select: {
        qbu_quarter_id: true,
        qbu_description: true,
      },
    }) : [];
    const quarterMap = new Map();
    quarters.forEach(q => {
      quarterMap.set(q.qbu_quarter_id.toString(), q.qbu_description);
      quarterMap.set(q.qbu_description, q.qbu_description);
    });

    // Format the response - map to dt_key fields
    const formattedData = records.map((item, index) => {
      const date = item.createddate ? new Date(item.createddate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) : '';
      return {
        ID: item.bam_id,
        YEARS: item.bam_year || '',
        DESCR: quarterMap.get(item.bam_quarter_id || '') || item.bam_quarter_id || '',
        ALLOCATE_NO: item.bam_allocation_no || '',
        ENDORSE: item.bam_endorse_doc || '',
        AMT: item.bam_total ? parseFloat(item.bam_total.toString()) : 0,
        STAT: item.bam_status_cd || '',
        date: date,
        PTJ: '', // PTJ is in detail table, not master
        // For action buttons
        urlEdit: `/budget/new-initial-v2?id=${item.bam_id}&mode=edit`,
        urlView: `/budget/new-initial-v2?id=${item.bam_id}&mode=view`,
      };
    });

    return {
      statusCode: 200,
      message: "Budget initial records fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching budget initial records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget initial records",
      error: error.message,
    };
  }
});

