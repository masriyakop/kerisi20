import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    if (!query.pmt_posting_id) {
      return {
        statusCode: 400,
        message: "pmt_posting_id is required",
      };
    }
    
    const postingId = parseInt(query.pmt_posting_id);
    const searchTerm = query.search ? query.search.trim() : "";
    const start = parseInt(query.start) || 0;
    const length = parseInt(query.length) || 10;
    const orderBy = query.orderBy || "pde_posting_detl_id";
    const orderDirection = query.orderDirection || "asc";
    
    // Build where clause
    const where = {
      pmt_posting_id: postingId,
      pde_trans_type: "DT",
      pde_status: "APPROVE",
    };
    
    // Search filter - searches across multiple fields
    if (searchTerm) {
      where.OR = [
        { fty_fund_type: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { acm_acct_code: { contains: searchTerm } },
        { pde_document_no: { contains: searchTerm } },
        { pde_reference: { contains: searchTerm } },
        { pde_reference1: { contains: searchTerm } },
        { pde_payto_id: { contains: searchTerm } },
        { pde_payto_name: { contains: searchTerm } },
      ];
    }
    
    // Get total count and sum
    const [count, sumResult] = await Promise.all([
      prisma.posting_details.count({ where }),
      prisma.posting_details.aggregate({
        where,
        _sum: {
          pde_trans_amt: true,
        },
      }),
    ]);
    
    // Fetch posting details with related data
    const postingDetails = await prisma.posting_details.findMany({
      where,
      include: {
        fund_type: {
          select: {
            fty_fund_type: true,
            fty_fund_desc: true,
          },
        },
        organization_unit: {
          select: {
            oun_code: true,
            oun_desc: true,
          },
        },
        account_main: {
          select: {
            acm_acct_code: true,
            acm_acct_desc: true,
          },
        },
      },
      orderBy: {
        [orderBy]: orderDirection,
      },
      skip: start,
      take: length,
    });
    
    // Get unique activity codes and fetch activity type descriptions
    const activityCodes = [...new Set(postingDetails.map(d => d.at_activity_code).filter(Boolean))];
    const activityTypes = activityCodes.length > 0
      ? await prisma.activity_type.findMany({
          where: {
            at_activity_code: { in: activityCodes },
          },
          select: {
            at_activity_code: true,
            at_activity_description_bm: true,
          },
        })
      : [];
    
    const activityTypeMap = new Map(
      activityTypes.map(at => [at.at_activity_code, at.at_activity_description_bm || ""])
    );
    
    // Format the response
    const formattedData = postingDetails.map((detail) => {
      const fundType = detail.fund_type
        ? `${detail.fty_fund_type || ""} - ${detail.fund_type.fty_fund_desc || ""}`
        : detail.fty_fund_type || "";
      
      const activityDesc = activityTypeMap.get(detail.at_activity_code) || "";
      const activityCode = detail.at_activity_code
        ? `${detail.at_activity_code} - ${activityDesc}`
        : "";
      
      const ounCode = detail.organization_unit
        ? `${detail.oun_code || ""} - ${detail.organization_unit.oun_desc || ""}`
        : detail.oun_code || "";
      
      const acctCode = detail.account_main
        ? `${detail.acm_acct_code || ""} - ${detail.account_main.acm_acct_desc || ""}`
        : detail.acm_acct_code || "";
      
      const paytoInfo = detail.pde_payto_id && detail.pde_payto_name
        ? `${detail.pde_payto_id} - ${detail.pde_payto_name}`
        : detail.pde_payto_id || detail.pde_payto_name || "";
      
      return {
        pmt_posting_id: detail.pmt_posting_id,
        fty_fund_type: fundType,
        at_activity_code: activityCode,
        oun_code: ounCode,
        acm_acct_code: acctCode,
        pde_document_no: detail.pde_document_no ? detail.pde_document_no.trim() : "",
        pde_reference: detail.pde_reference ? detail.pde_reference.trim() : "",
        pde_reference1: detail.pde_reference1 ? detail.pde_reference1.trim() : "",
        pde_trans_amt: detail.pde_trans_amt ? parseFloat(detail.pde_trans_amt).toFixed(2) : "0.00",
        ID: paytoInfo,
      };
    });
    
    const sumDT = sumResult._sum.pde_trans_amt
      ? parseFloat(sumResult._sum.pde_trans_amt).toFixed(2)
      : "0.00";
    
    return {
      statusCode: 200,
      message: "Debit details fetched successfully",
      data: formattedData,
      recordsFiltered: count,
      sumDT: sumDT,
    };
  } catch (error) {
    console.error("Error fetching debit details:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
