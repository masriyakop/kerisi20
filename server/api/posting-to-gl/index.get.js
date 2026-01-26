import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build WHERE clause conditions directly from query parameters
    const whereConditions = [];
    const params = [];
    
    // Base conditions
    whereConditions.push("pm.pmt_status = ?");
    params.push('APPROVE');
    whereConditions.push("PD.pde_status = ?");
    params.push('APPROVE');
    whereConditions.push("pm.pmt_posting_id = PD.pmt_posting_id");
    
    // Top filter: System ID
    if (query.pmt_system_id && query.pmt_system_id !== 'null' && query.pmt_system_id.trim() !== '') {
      whereConditions.push("pm.pmt_system_id = ?");
      params.push(query.pmt_system_id.trim());
    }
    
    // Top filter: Amount (RM)
    if (query.pmt_total_amt && query.pmt_total_amt !== 'null' && query.pmt_total_amt.trim() !== '') {
      whereConditions.push("pm.pmt_total_amt = ?");
      params.push(parseFloat(query.pmt_total_amt));
    }
    
    // Top filter: Date From
    if (query.date_from && query.date_from.trim() !== '') {
      let startDate;
      if (query.date_from.includes('/')) {
        const [day, month, year] = query.date_from.split('/');
        startDate = `${year}-${month}-${day}`;
      } else {
        startDate = query.date_from;
      }
      whereConditions.push("PD.pde_trans_date >= ?");
      params.push(startDate);
    }
    
    // Top filter: Date To
    if (query.date_to && query.date_to.trim() !== '') {
      let endDate;
      if (query.date_to.includes('/')) {
        const [day, month, year] = query.date_to.split('/');
        endDate = `${year}-${month}-${day} 23:59:59`;
      } else {
        endDate = query.date_to + ' 23:59:59';
      }
      whereConditions.push("PD.pde_trans_date <= ?");
      params.push(endDate);
    }
    
    // Smart filter: Posting No
    if (query.smartFilter_pmt_posting_no && query.smartFilter_pmt_posting_no.trim() !== '') {
      whereConditions.push("pm.pmt_posting_no = ?");
      params.push(query.smartFilter_pmt_posting_no.trim());
    }
    
    // Smart filter: System ID
    if (query.smartFilter_pmt_system_id && query.smartFilter_pmt_system_id.trim() !== '') {
      whereConditions.push("pm.pmt_system_id = ?");
      params.push(query.smartFilter_pmt_system_id.trim());
    }
    
    // Smart filter: Status
    if (query.smartFilter_pmt_status && query.smartFilter_pmt_status.trim() !== '') {
      whereConditions.push("pm.pmt_status = ?");
      params.push(query.smartFilter_pmt_status.trim());
    }
    
    // Smart filter: Date From
    if (query.smartFilter_date_from && query.smartFilter_date_from.trim() !== '') {
      let startDate;
      if (query.smartFilter_date_from.includes('/')) {
        const [day, month, year] = query.smartFilter_date_from.split('/');
        startDate = `${year}-${month}-${day}`;
      } else {
        startDate = query.smartFilter_date_from;
      }
      whereConditions.push("PD.pde_trans_date >= ?");
      params.push(startDate);
    }
    
    // Smart filter: Date To
    if (query.smartFilter_date_to && query.smartFilter_date_to.trim() !== '') {
      let endDate;
      if (query.smartFilter_date_to.includes('/')) {
        const [day, month, year] = query.smartFilter_date_to.split('/');
        endDate = `${year}-${month}-${day} 23:59:59`;
      } else {
        endDate = query.smartFilter_date_to + ' 23:59:59';
      }
      whereConditions.push("PD.pde_trans_date <= ?");
      params.push(endDate);
    }
    
    // Smart filter: Reference 1
    if (query.smartFilter_pde_reference && query.smartFilter_pde_reference.trim() !== '') {
      whereConditions.push("PD.pde_reference = ?");
      params.push(query.smartFilter_pde_reference.trim());
    }
    
    // Smart filter: Reference 2
    if (query.smartFilter_pde_reference1 && query.smartFilter_pde_reference1.trim() !== '') {
      whereConditions.push("PD.pde_reference1 = ?");
      params.push(query.smartFilter_pde_reference1.trim());
    }
    
    // Smart filter: Document No
    if (query.smartFilter_pde_document_no && query.smartFilter_pde_document_no.trim() !== '') {
      whereConditions.push("PD.pde_document_no = ?");
      params.push(query.smartFilter_pde_document_no.trim());
    }
    
    // Search filter - searches across multiple fields
    if (query.search && query.search.trim() !== '') {
      const searchTerm = `%${query.search.trim()}%`;
      const searchNum = parseInt(query.search.trim());
      
      if (!isNaN(searchNum)) {
        whereConditions.push(`(
          pm.pmt_posting_id = ? OR
          pm.pmt_posting_no LIKE ? OR
          pm.pmt_system_id LIKE ? OR
          pm.pmt_status LIKE ? OR
          PD.pde_document_no LIKE ? OR
          PD.pde_reference LIKE ? OR
          PD.pde_reference1 LIKE ?
        )`);
        params.push(searchNum, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      } else {
        whereConditions.push(`(
          pm.pmt_posting_no LIKE ? OR
          pm.pmt_system_id LIKE ? OR
          pm.pmt_status LIKE ? OR
          PD.pde_document_no LIKE ? OR
          PD.pde_reference LIKE ? OR
          PD.pde_reference1 LIKE ?
        )`);
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get pagination parameters
    const start = parseInt(query.start) || 0;
    const length = parseInt(query.length) || 10;
    const sortColumn = query.orderBy || 'pmt_posting_no';
    const sortDirection = query.orderDirection || 'asc';
    
    // Validate sort column to prevent SQL injection
    const allowedSortColumns = ['pmt_posting_id', 'pmt_posting_no', 'pde_document_no', 'pmt_system_id', 
                                'amountDT', 'amountCR', 'pmt_status', 'pde_reference', 'pde_reference1', 'pde_trans_date'];
    const safeSortColumn = allowedSortColumns.includes(sortColumn) ? sortColumn : 'pmt_posting_no';
    const safeSortDirection = sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    // Build the main query with GROUP BY and pagination at database level
    // This ensures only the requested page is processed, not all 500k records
    const mainQuery = `
      SELECT
        pm.pmt_posting_id,
        pm.pmt_posting_no,
        PD.pde_document_no,
        pm.pmt_system_id,
        SUM(CASE WHEN PD.pde_trans_type = 'DT' THEN PD.pde_trans_amt ELSE 0 END) as amountDT,
        SUM(CASE WHEN PD.pde_trans_type = 'CR' THEN PD.pde_trans_amt ELSE 0 END) as amountCR,
        pm.pmt_status,
        PD.pde_reference as Reference1,
        PD.pde_reference1 as Reference2,
        DATE_FORMAT(PD.pde_trans_date, '%d/%m/%Y') as postedDate
      FROM posting_master pm, posting_details PD
      ${whereClause}
      GROUP BY pm.pmt_posting_id, pm.pmt_posting_no, PD.pde_document_no, pm.pmt_system_id, 
               pm.pmt_status, PD.pde_reference, PD.pde_reference1, PD.pde_trans_date
      ORDER BY ${safeSortColumn} ${safeSortDirection}
      LIMIT ? OFFSET ?
    `;
    
    // Count query for total records (without pagination)
    // This is still needed for pagination info, but MySQL handles it efficiently
    const countQuery = `
      SELECT COUNT(*) as total
      FROM (
        SELECT pm.pmt_posting_id
        FROM posting_master pm, posting_details PD
        ${whereClause}
        GROUP BY pm.pmt_posting_id, pm.pmt_posting_no, PD.pde_document_no, pm.pmt_system_id, 
                 pm.pmt_status, PD.pde_reference, PD.pde_reference1, PD.pde_trans_date
      ) as grouped_data
    `;
    
    // Grand totals query - calculates totals for all matching records
    const totalsQuery = `
      SELECT
        FORMAT(SUM(CASE WHEN PD.pde_trans_type = 'DT' THEN PD.pde_trans_amt ELSE 0 END), 2) as grandTotalDT,
        FORMAT(SUM(CASE WHEN PD.pde_trans_type = 'CR' THEN PD.pde_trans_amt ELSE 0 END), 2) as grandTotalCR
      FROM posting_master pm, posting_details PD
      ${whereClause}
    `;
    
    // Execute queries in parallel for better performance
    // The main query uses LIMIT/OFFSET to only fetch the requested page
    const allParams = [...params, length, start];
    const [data, countResult, totalsResult] = await Promise.all([
      prisma.$queryRawUnsafe(mainQuery, ...allParams),
      prisma.$queryRawUnsafe(countQuery, ...params),
      prisma.$queryRawUnsafe(totalsQuery, ...params),
    ]);
    
    // Format the results
    const formattedResult = (data || []).map((item, index) => ({
      pmt_posting_id: item.pmt_posting_id,
      pmt_posting_no: item.pmt_posting_no || '',
      pde_document_no: item.pde_document_no ? String(item.pde_document_no).trim() : '',
      pmt_system_id: item.pmt_system_id || '',
      amountDT: parseFloat(item.amountDT || 0),
      amountCR: parseFloat(item.amountCR || 0),
      pmt_status: item.pmt_status || '',
      pde_reference: item.Reference1 ? String(item.Reference1).trim() : '',
      pde_reference1: item.Reference2 ? String(item.Reference2).trim() : '',
      pde_trans_date: item.postedDate || '',
      no: start + index + 1,
    }));
    
    const recordsFiltered = countResult && countResult[0] ? parseInt(countResult[0].total) : 0;
    const grandTotalDT = totalsResult && totalsResult[0] ? totalsResult[0].grandTotalDT : "0.00";
    const grandTotalCR = totalsResult && totalsResult[0] ? totalsResult[0].grandTotalCR : "0.00";
    
    return {
      statusCode: 200,
      message: "Posting records fetched successfully",
      data: formattedResult,
      recordsFiltered: recordsFiltered,
      footer: {
        amountDT: grandTotalDT,
        amountCR: grandTotalCR,
      },
    };
  } catch (error) {
    console.error("Error fetching posting to GL records:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
