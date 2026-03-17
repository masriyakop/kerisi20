import prisma from "~/server/utils/prisma";

/**
 * Export monitoring data for PDF using the raw SQL that matches the report spec.
 * Returns aggregated rows: one per structure_budget with summed amounts.
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const yearParam = query.year && query.year.trim() !== "" ? query.year.trim() : null;
    const year = yearParam || String(new Date().getFullYear());
    const fundType = query.fundType && query.fundType.trim() !== "" ? query.fundType.trim() : null;
    const ounCode = query.oun_code && query.oun_code.trim() !== "" ? query.oun_code.trim() : null;
    const ccrCostcentre = query.ccr_costcentre_top && query.ccr_costcentre_top.trim() !== "" ? query.ccr_costcentre_top.trim() : null;
    const atActivityCode = query.at_activity_code_top && query.at_activity_code_top.trim() !== "" ? query.at_activity_code_top.trim() : null;

    const conditions = ["B.bdg_year = ?"];
    const params = [year];
    if (fundType) {
      conditions.push("SB.fty_fund_type = ?");
      params.push(fundType);
    }
    if (ounCode) {
      conditions.push("SB.oun_code = ?");
      params.push(ounCode);
    }
    if (ccrCostcentre) {
      conditions.push("SB.ccr_costcentre = ?");
      params.push(ccrCostcentre);
    }
    if (atActivityCode) {
      conditions.push("SB.at_activity_code = ?");
      params.push(atActivityCode);
    }

    const whereClause = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT
        CONCAT_WS(
          '-',
          SB.fty_fund_type,
          SB.at_activity_code,
          SB.oun_code,
          SB.ccr_costcentre,
          SB.lbc_budget_code
        ) AS structure_budget,
        IFNULL(B.bdg_bal_carryforward, 0) AS Opening,
        IFNULL(B.bdg_initial_amt, 0) AS Initial,
        SUM(IFNULL(B.bdg_additional_amt, 0)) AS bdg_additional_amt,
        SUM(IFNULL(B.bdg_virement_amt, 0)) AS Virement,
        SUM(IFNULL(B.bdg_allocated_amt, 0)) AS Allocated,
        SUM(IFNULL(B.bdg_lock_amt, 0)) AS bdg_lock_amt,
        SUM(IFNULL(B.bdg_request_amt, 0)) AS \`Request\`,
        SUM(IFNULL(B.bdg_commit_amt, 0)) AS \`Commit\`,
        SUM(IFNULL(B.bdg_expenses_amt, 0)) AS Expenses,
        SUM(IFNULL(B.bdg_balance_amt, 0)) AS Balance
      FROM
        budget B
        INNER JOIN structure_budget SB ON B.sbg_budget_id = SB.sbg_budget_id AND B.bdg_year = SB.sby_year
      WHERE
        B.bdg_status = 'APPROVED'
        ${whereClause}
      GROUP BY
        1, 2, 3
      ORDER BY
        2 ASC
    `;

    const rows = await prisma.$queryRawUnsafe(sql, ...params);

    const data = (rows || []).map((row) => ({
      structure_budget: row.structure_budget ?? "",
      Opening: row.Opening != null ? parseFloat(row.Opening) : 0,
      Initial: row.Initial != null ? parseFloat(row.Initial) : 0,
      bdg_additional_amt: row.bdg_additional_amt != null ? parseFloat(row.bdg_additional_amt) : 0,
      Virement: row.Virement != null ? parseFloat(row.Virement) : 0,
      Allocated: row.Allocated != null ? parseFloat(row.Allocated) : 0,
      bdg_lock_amt: row.bdg_lock_amt != null ? parseFloat(row.bdg_lock_amt) : 0,
      Request: row.Request != null ? parseFloat(row.Request) : 0,
      Commit: row.Commit != null ? parseFloat(row.Commit) : 0,
      Expenses: row.Expenses != null ? parseFloat(row.Expenses) : 0,
      Balance: row.Balance != null ? parseFloat(row.Balance) : 0,
    }));

    return {
      statusCode: 200,
      message: "OK",
      data,
    };
  } catch (error) {
    console.error("Error in monitoring export-pdf:", error);
    return {
      statusCode: 500,
      message: error?.message || "Failed to export monitoring data for PDF",
      data: [],
    };
  }
});
