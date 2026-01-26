import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    const bgdID = query.bgdID;
    const year = query.year;
    const search = query.search || "";
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    if (!bgdID || !year) {
      return {
        statusCode: 400,
        message: "bgdID and year are required",
        data: [],
      };
    }

    // Parse budgetID (format: FUND-ACTIVITY-OUN-CCR-BUDGETCODE)
    const budgetParts = bgdID.split("-");
    if (budgetParts.length < 5) {
      return {
        statusCode: 400,
        message: "Invalid bgdID format",
        data: [],
      };
    }

    const [fundType, activityCode, ounCode, costCentre, budgetCode] = budgetParts;

    // Build common where clause for structure_budget
    const structureBudgetWhere = {
      fty_fund_type: fundType,
      at_activity_code: activityCode,
      oun_code: ounCode,
      ccr_costcentre: costCentre,
      lbc_budget_code: budgetCode,
    };

    // Handle different query types
    if (query.dt_initial) {
      return await getBudgetInitial(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query.dt_increment_decrement) {
      return await getIncrementDecrement(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query.dt_virement) {
      return await getVirement(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query.prerequisition_v2) {
      return await getPreRequisition(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query.dt_requisition_v2) {
      return await getRequisition(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query.dt_comitment_v2) {
      return await getCommitment(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query.dt_expenses_v2) {
      return await getExpenses(structureBudgetWhere, year, search, skip, pageSize);
    }

    return {
      statusCode: 400,
      message: "Invalid query parameter",
      data: [],
    };
  } catch (error) {
    console.error("Error in budget listing API:", error);
    console.error("Error stack:", error.stack);
    console.error("Query parameters:", {
      bgdID: query.bgdID,
      year: query.year,
      search: query.search,
      queryType: Object.keys(query).find(key => key.startsWith('dt_') || key === 'prerequisition_v2'),
    });
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      data: [],
    };
  }
});

// Budget Initial
async function getBudgetInitial(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    // Ensure year is a string
    const yearStr = String(year);

    // Get structure budget IDs
    const structureBudgets = await prisma.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true },
    });

    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);

    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 },
      };
    }

    // Get budget allocation details
    const budgetAllocationDetls = await prisma.budget_allocation_detl.findMany({
      where: {
        bad_sbg_id: { in: sbgIds },
      },
      include: {
        budget_allocation_master: true,
      },
    });

    // Filter to only get approved allocations and extract master IDs
    const approvedDetls = budgetAllocationDetls.filter(
      (bad) => bad.budget_allocation_master && bad.budget_allocation_master.bam_status_cd === "APPROVE"
    );

    const masterIds = [...new Set(approvedDetls
      .map((bad) => bad.bad_master_id)
      .filter(Boolean))]; // Remove duplicates

    if (masterIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 },
      };
    }

    // Get budgets with structure_budget - ensure we get all required relations
    const budgets = await prisma.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: yearStr, // Use string year
        bdg_status: "APPROVED",
      },
      include: {
        structure_budget: {
          select: {
            sbg_budget_id: true,
            fty_fund_type: true,
            at_activity_code: true,
            oun_code: true,
            ccr_costcentre: true,
            lbc_budget_code: true,
          },
        },
      },
    });

    // Get quarter_budget for budgets that have qbu_quarter_id
    const quarterIds = budgets
      .map((b) => b.qbu_quarter_id)
      .filter(Boolean);
    
    const quarterBudgets = quarterIds.length > 0
      ? await prisma.quarter_budget.findMany({
          where: {
            qbu_quarter_id: { in: quarterIds },
          },
        })
      : [];
    
    const quarterMap = new Map(
      quarterBudgets.map((qb) => [qb.qbu_quarter_id, qb])
    );

    // Get allocation masters
    const allocationMasters = await prisma.budget_allocation_master.findMany({
      where: {
        bam_id: { in: masterIds },
        bam_status_cd: "APPROVE",
      },
    });

    // Map and format data
    const data = budgets
      .map((budget) => {
        try {
          const allocation = allocationMasters.find(
            (am) => am.bam_allocation_no === budget.bdg_ref_id
          );

          if (!allocation) return null;

          // Safely access structure_budget with null checks
          const sb = budget.structure_budget;
          if (!sb) {
            console.warn("Structure budget not found for budget:", budget.bdg_budget_id);
            return null;
          }

          const budgetID = `${sb.fty_fund_type || ''}-${sb.at_activity_code || ''}-${sb.oun_code || ''}-${sb.ccr_costcentre || ''}-${sb.lbc_budget_code || ''}`;
          
          const quarter = budget.qbu_quarter_id
            ? quarterMap.get(budget.qbu_quarter_id)
            : null;

          return {
            bdg_year: budget.bdg_year || "",
            bdg_budget_id: budgetID,
            ALLOCATION: quarter
              ? `${quarter.qbu_quarter_id} - ${quarter.qbu_description}`
              : "",
            trans_date: allocation.createddate
              ? (() => {
                  try {
                    const date = new Date(allocation.createddate);
                    if (isNaN(date.getTime())) return "";
                    return date.toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  } catch (dateError) {
                    console.warn("Error formatting date:", dateError, allocation.createddate);
                    return "";
                  }
                })()
              : "",
            bdg_initial_amt: budget.bdg_initial_amt?.toString() || "0",
            bdg_ref_id: allocation.bam_allocation_no || "",
            bdg_status: allocation.bam_status_cd || "",
          };
        } catch (mapError) {
          console.error("Error mapping budget data:", mapError, budget);
          return null;
        }
      })
      .filter(Boolean);

    // Apply search filter
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    // Pagination
    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);

    return {
      statusCode: 200,
      message: "Budget initial data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching budget initial:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      data: [],
      meta: { total: 0, page: 1, pageSize, totalPages: 0 },
    };
  }
}

// Increment / Decrement
async function getIncrementDecrement(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true },
    });

    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);

    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 },
      };
    }

    // Get budgets
    const budgets = await prisma.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year,
      },
      select: { bdg_budget_id: true, bdg_year: true },
    });

    const budgetIds = budgets.map((b) => b.bdg_budget_id);

    // Get transactions
    const transactions = await prisma.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: { in: ["DECREMENT", "INCREMENT"] },
        bgt_task_id: { in: ["05", "06", "APPROVE", "REJECT", "COMPLETE"] },
      },
      include: {
        budget: {
          where: {
            bdg_year: year,
          },
        },
        structure_budget: true,
      },
    });

    const data = transactions
      .filter((t) => t.budget && t.budget.bdg_year === year)
      .map((transaction) => {
        const budgetID = transaction.structure_budget
          ? `${transaction.structure_budget.fty_fund_type}-${transaction.structure_budget.at_activity_code}-${transaction.structure_budget.oun_code}-${transaction.structure_budget.ccr_costcentre}-${transaction.structure_budget.lbc_budget_code}`
          : "";

        return {
          bdg_year: transaction.budget?.bdg_year || year,
          bdg_budget_id: budgetID,
          bgt_trans_date: transaction.bgt_trans_date,
          bgt_ref: transaction.bgt_ref || "",
          bgt_trans_amt: transaction.bgt_trans_amt?.toString() || "0",
        };
      });

    // Apply search filter
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);

    return {
      statusCode: 200,
      message: "Increment/Decrement data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching increment/decrement:", error);
    throw error;
  }
}

// Virement
async function getVirement(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true },
    });

    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);

    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 },
      };
    }

    const budgets = await prisma.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year,
      },
      select: { bdg_budget_id: true },
    });

    const budgetIds = budgets.map((b) => b.bdg_budget_id);

    const transactions = await prisma.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: "VIREMENT",
        bgt_task_id: { in: ["05", "06", "APPROVE", "REJECT", "COMPLETE"] },
      },
      include: {
        budget: {
          where: {
            bdg_year: year,
          },
        },
        structure_budget: true,
      },
    });

    const data = transactions
      .filter((t) => t.budget && t.budget.bdg_year === year)
      .map((transaction) => {
        const budgetID = transaction.structure_budget
          ? `${transaction.structure_budget.fty_fund_type}-${transaction.structure_budget.at_activity_code}-${transaction.structure_budget.oun_code}-${transaction.structure_budget.ccr_costcentre}-${transaction.structure_budget.lbc_budget_code}`
          : "";

        return {
          bdg_year: transaction.budget?.bdg_year || year,
          bdg_budget_id: budgetID,
          bgt_trans_date: transaction.bgt_trans_date,
          bgt_ref: transaction.bgt_ref || "",
          bgt_trans_amt: transaction.bgt_trans_amt?.toString() || "0",
        };
      });

    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);

    return {
      statusCode: 200,
      message: "Virement data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching virement:", error);
    throw error;
  }
}

// Pre Requisition
async function getPreRequisition(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true },
    });

    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);

    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 },
      };
    }

    const transactions = await prisma.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bgt_system_id: "PRE_REQUISITION",
      },
      include: {
        structure_budget: true,
      },
    });

    const data = transactions.map((transaction) => {
      const sb = transaction.structure_budget;
      return {
        sbg_budget_id: transaction.sbg_budget_id?.toString() || "",
        fty_fund_type: sb?.fty_fund_type || "",
        at_activity_code: sb?.at_activity_code || "",
        oun_code: sb?.oun_code || "",
        ccr_costcentre: sb?.ccr_costcentre || "",
        acm_acct_code: transaction.acm_acct_code || "",
        lbc_budget_code: sb?.lbc_budget_code || "",
        bgt_trans_date: transaction.bgt_trans_date,
        bgt_ref: transaction.bgt_ref || "",
        bgt_trans_amt: transaction.bgt_trans_amt?.toString() || "0",
      };
    });

    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);

    return {
      statusCode: 200,
      message: "Pre Requisition data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching pre requisition:", error);
    throw error;
  }
}

// Requisition
async function getRequisition(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true },
    });

    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);

    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 },
      };
    }

    const budgets = await prisma.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year,
      },
      select: { bdg_budget_id: true },
    });

    const budgetIds = budgets.map((b) => b.bdg_budget_id);

    const transactions = await prisma.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: "RQUISITION",
        bgt_task_id: { in: ["05", "06", "APPROVE", "REJECT", "COMPLETE"] },
      },
      include: {
        budget: {
          where: {
            bdg_year: year,
          },
        },
        structure_budget: true,
      },
    });

    const data = transactions
      .filter((t) => t.budget && t.budget.bdg_year === year)
      .map((transaction) => {
        const sb = transaction.structure_budget;
        const budgetID = sb
          ? `${sb.fty_fund_type}-${sb.at_activity_code}-${sb.oun_code}-${sb.ccr_costcentre}-${sb.lbc_budget_code}`
          : "";

        return {
          bdg_budget_id: transaction.bdg_budget_id?.toString() || "",
          sbg_budget_id: transaction.sbg_budget_id?.toString() || "",
          fty_fund_type: sb?.fty_fund_type || "",
          at_activity_code: sb?.at_activity_code || "",
          oun_code: sb?.oun_code || "",
          ccr_costcentre: sb?.ccr_costcentre || "",
          acm_acct_code: transaction.acm_acct_code || "",
          bgt_trans_date: transaction.bgt_trans_date,
          bgt_ref: transaction.bgt_ref || "",
          rqm_requisition_no: transaction.bgt_ref || "", // Assuming requisition no is in bgt_ref
          bgt_trans_amt: transaction.bgt_trans_amt?.toString() || "0",
        };
      });

    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);

    return {
      statusCode: 200,
      message: "Requisition data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching requisition:", error);
    throw error;
  }
}

// Commitment
async function getCommitment(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true },
    });

    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);

    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 },
      };
    }

    const budgets = await prisma.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year,
      },
      select: { bdg_budget_id: true },
    });

    const budgetIds = budgets.map((b) => b.bdg_budget_id);

    const transactions = await prisma.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: "COMMITMENT",
        bgt_task_id: { in: ["05", "06", "APPROVE", "REJECT", "COMPLETE"] },
      },
      include: {
        budget: {
          where: {
            bdg_year: year,
          },
        },
        structure_budget: true,
      },
    });

    const data = transactions
      .filter((t) => t.budget && t.budget.bdg_year === year)
      .map((transaction) => {
        const sb = transaction.structure_budget;
        const budgetID = sb
          ? `${sb.fty_fund_type}-${sb.at_activity_code}-${sb.oun_code}-${sb.ccr_costcentre}-${sb.lbc_budget_code}`
          : "";

        return {
          bdg_budget_id: transaction.bdg_budget_id?.toString() || "",
          sbg_budget_id: transaction.sbg_budget_id?.toString() || "",
          fty_fund_type: sb?.fty_fund_type || "",
          at_activity_code: sb?.at_activity_code || "",
          oun_code: sb?.oun_code || "",
          ccr_costcentre: sb?.ccr_costcentre || "",
          lbc_budget_code: sb?.lbc_budget_code || "",
          bgt_trans_date: transaction.bgt_trans_date,
          bgt_ref: transaction.bgt_ref || "",
          bgt_trans_amt: transaction.bgt_trans_amt?.toString() || "0",
        };
      });

    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);

    return {
      statusCode: 200,
      message: "Commitment data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching commitment:", error);
    throw error;
  }
}

// Expenses
async function getExpenses(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true },
    });

    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);

    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 },
      };
    }

    const budgets = await prisma.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year,
      },
      select: { bdg_budget_id: true },
    });

    const budgetIds = budgets.map((b) => b.bdg_budget_id);

    const transactions = await prisma.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: "EXPENSES",
      },
      include: {
        budget: {
          where: {
            bdg_year: year,
          },
        },
        structure_budget: true,
      },
    });

    const data = transactions
      .filter((t) => t.budget && t.budget.bdg_year === year)
      .map((transaction) => {
        const sb = transaction.structure_budget;
        const budgetID = sb
          ? `${sb.fty_fund_type}-${sb.at_activity_code}-${sb.oun_code}-${sb.ccr_costcentre}-${sb.lbc_budget_code}`
          : "";

        return {
          bdg_budget_id: transaction.bdg_budget_id?.toString() || "",
          sbg_budget_id: transaction.sbg_budget_id?.toString() || "",
          fty_fund_type: sb?.fty_fund_type || "",
          at_activity_code: sb?.at_activity_code || "",
          oun_code: sb?.oun_code || "",
          ccr_costcentre: sb?.ccr_costcentre || "",
          acm_acct_code: transaction.acm_acct_code || "",
          bdg_budget_code: budgetID,
          bgt_trans_date: transaction.bgt_trans_date,
          bgt_ref: transaction.bgt_ref || "",
          bgt_trans_amt: transaction.bgt_trans_amt?.toString() || "0",
        };
      });

    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);

    return {
      statusCode: 200,
      message: "Expenses data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
}
