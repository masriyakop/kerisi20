import prisma from "~/server/utils/prisma";

/**
 * Report handlers for KERINA AI - execute Prisma queries based on report type
 */

export async function getPOApprovedCount(year) {
  const y = String(year || new Date().getFullYear());
  const startDate = new Date(`${y}-01-01`);
  const endDate = new Date(`${y}-12-31 23:59:59`);

  const count = await prisma.purchase_order_master.count({
    where: {
      pom_order_status: { contains: "APPROVE" },
      pom_approve_date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return { count, year: y };
}

export async function getBudgetBalance(budgetCode, year) {
  const y = String(year || new Date().getFullYear());
  const code = String(budgetCode || "").trim();

  const structureBudgets = await prisma.structure_budget.findMany({
    where: {
      lbc_budget_code: code,
      sby_year: { contains: y },
    },
    include: {
      budget: {
        where: { bdg_year: y },
      },
    },
  });

  if (!structureBudgets.length) {
    return { found: false, budgetCode: code, year: y };
  }

  let totalBalance = 0;
  let totalAllocated = 0;
  let totalExpenses = 0;

  for (const sb of structureBudgets) {
    for (const b of sb.budget || []) {
      totalBalance += Number(b.bdg_balance_amt ?? 0);
      totalAllocated += Number(b.bdg_allocated_amt ?? 0);
      totalExpenses += Number(b.bdg_expenses_amt ?? 0);
    }
  }

  return {
    found: true,
    budgetCode: code,
    year: y,
    balance: totalBalance,
    allocated: totalAllocated,
    expenses: totalExpenses,
  };
}

export async function getPROStatus(proNumber) {
  const num = String(proNumber || "").trim().toUpperCase();

  const requisition = await prisma.requisition_master.findFirst({
    where: {
      OR: [
        { rqm_requisition_no: { contains: num } },
        { rqm_requisition_no: num },
      ],
    },
  });

  if (!requisition) {
    const po = await prisma.purchase_order_master.findFirst({
      where: {
        OR: [
          { pom_order_no: { contains: num } },
          { pom_requisition_no: { contains: num } },
        ],
      },
    });

    if (po) {
      return {
        found: true,
        type: "PO",
        number: po.pom_order_no || po.pom_requisition_no,
        status: po.pom_order_status || "Unknown",
        requisitionNo: po.pom_requisition_no,
      };
    } else {
      return { found: false, proNumber: num };
    }
  }

  return {
    found: true,
    type: "PRO",
    number: requisition.rqm_requisition_no,
    status: requisition.rqm_status || requisition.rqm_wflow_sts || "Unknown",
  };
}

export async function getSalaryReleaseInfo() {
  return {
    available: false,
    message: "Salary release schedule is not available in the database. Please contact HR or Finance for this information.",
  };
}
