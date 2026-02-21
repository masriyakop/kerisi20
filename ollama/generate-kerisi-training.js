/**
 * Generates kerisi_training.jsonl - 5000 samples for training TinyLlama
 * as Kerisi financial management system reporting expert.
 * Format: JSONL with instruction, input, output (Prisma read-only queries only)
 * Safe: findMany, findFirst, findUnique, groupBy, aggregate, count - NO create/update/delete
 */

const fs = require("fs");
const path = require("path");

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sampleN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

const samples = [];

function add(instruction, output) {
  samples.push({ instruction, input: "", output });
}

// --- findMany ---
const findManyData = [
  ["Get all active fund types", "fund_type", { fty_status: "ACTIVE" }, ["fty_fund_type", "fty_fund_desc"]],
  ["List active cost centres", "costcentre", { ccr_status: "ACTIVE" }, ["ccr_costcentre", "ccr_costcentre_desc"]],
  ["Get all organization units", "organization_unit", {}, ["oun_code", "oun_desc"]],
  ["Fetch active budget codes", "lkp_budget_code", { lbc_status: "ACTIVE" }, ["lbc_budget_code", "lbc_description"]],
  ["Get account codes", "account_main", null, ["acm_acct_code", "acm_acct_desc"]],
  ["List active organizations", "organization", { org_status: "ACTIVE" }, ["org_code", "org_desc"]],
  ["Get activity types", "activity_type", {}, ["at_activity_code", "at_activity_description_bm"]],
  ["Fetch org unit cost centres", "org_unit_costcentre", { ouc_status: "ACTIVE" }, ["oun_code", "ccr_costcentre", "fty_fund_type"]],
  ["Get structure budget records", "structure_budget", {}, ["sbg_budget_id", "lbc_budget_code", "sby_year"]],
  ["List quarter budgets", "quarter_budget", {}, ["qbu_quarter_id", "qbu_year", "qbu_description"]],
];

for (let i = 0; i < 600; i++) {
  const [inst, model, where, flds] = sample(findManyData);
  const select = flds ? flds.reduce((o, f) => ({ ...o, [f]: true }), {}) : undefined;
  const whereClause = where && Object.keys(where).length ? where : {};
  const opts = { where: whereClause };
  if (select && Object.keys(select).length) opts.select = select;
  add(`Generate Prisma query: ${inst}`, `const result = await prisma.${model}.findMany(${JSON.stringify(opts, null, 0)});`);
}

// --- findMany distinct ---
for (let i = 0; i < 400; i++) {
  const models = [
    ["fund_type", "fty_fund_type", "Get distinct fund types"],
    ["costcentre", "ccr_costcentre", "Get distinct cost centres"],
    ["lkp_budget_code", "lbc_budget_code", "Get distinct budget codes"],
    ["organization_unit", "oun_code", "Get distinct org units"],
    ["activity_type", "at_activity_code", "Get distinct activity codes"],
  ];
  const [model, distinctField, inst] = sample(models);
  const m = { fund_type: ["fty_fund_type", "fty_fund_desc"], costcentre: ["ccr_costcentre", "ccr_costcentre_desc"], lkp_budget_code: ["lbc_budget_code", "lbc_description"], organization_unit: ["oun_code", "oun_desc"], activity_type: ["at_activity_code", "at_activity_description_bm"] }[model];
  const selectObj = m.map((f) => `${f}: true`).join(", ");
  add(`Generate Prisma query: ${inst}`, `const result = await prisma.${model}.findMany({ distinct: ['${distinctField}'], select: { ${selectObj} } });`);
}

// --- groupBy ---
const groupByData = [
  ["Count purchase orders by status", "purchase_order_master", ["pom_order_status"], { _count: { pom_order_id: true } }],
  ["Sum budget balance by year", "budget", ["bdg_year"], { _sum: { bdg_balance_amt: true } }],
  ["Count requisitions by status", "requisition_master", ["rqm_status"], { _count: { rqm_requisition_id: true } }],
  ["Count structure budget by fund type", "structure_budget", ["fty_fund_type"], { _count: { sbg_budget_id: true } }],
  ["Count structure budget by org unit", "structure_budget", ["oun_code"], { _count: { sbg_budget_id: true } }],
  ["Sum PO total by status", "purchase_order_master", ["pom_order_status"], { _sum: { pom_order_amt: true } }],
  ["Count requisition details by requisition", "requisition_details", ["rqm_requisition_id"], { _count: { rqd_requisition_id: true } }],
  ["Sum budget allocated by year", "budget", ["bdg_year"], { _sum: { bdg_allocated_amt: true } }],
  ["Count budget by year", "budget", ["bdg_year"], { _count: { bdg_budget_id: true } }],
];

for (let i = 0; i < 600; i++) {
  const [inst, model, by, agg] = sample(groupByData);
  const where = model === "purchase_order_master" && Math.random() > 0.5 ? { pom_order_status: { contains: "APPROVE" } } : undefined;
  const opts = { by, ...agg };
  if (where) opts.where = where;
  add(`Generate Prisma groupBy: ${inst}`, `const result = await prisma.${model}.groupBy(${JSON.stringify(opts)});`);
}

// --- aggregate ---
const aggregateData = [
  ["Count total purchase orders", "purchase_order_master", "_count", "pom_order_id"],
  ["Sum total budget balance", "budget", "_sum", "bdg_balance_amt"],
  ["Count requisitions", "requisition_master", "_count", "rqm_requisition_id"],
  ["Sum purchase order amounts", "purchase_order_master", "_sum", "pom_order_amt"],
  ["Average budget balance", "budget", "_avg", "bdg_balance_amt"],
  ["Count structure budget", "structure_budget", "_count", "sbg_budget_id"],
  ["Sum budget expenses", "budget", "_sum", "bdg_expenses_amt"],
  ["Count purchase order details", "purchase_order_details", "_count", "pod_order_detl_id"],
  ["Sum PO detail total amount", "purchase_order_details", "_sum", "pod_total_amt"],
];

for (let i = 0; i < 500; i++) {
  const [inst, model, aggType, field] = sample(aggregateData);
  const where = Math.random() > 0.7 ? { [model === "budget" ? "bdg_year" : model === "purchase_order_master" ? "pom_order_status" : "rqm_status"]: model === "budget" ? sample(YEARS) : "ACTIVE" } : undefined;
  const opts = { [aggType]: { [field]: true } };
  if (where) opts.where = where;
  add(`Generate Prisma aggregate: ${inst}`, `const result = await prisma.${model}.aggregate(${JSON.stringify(opts)});`);
}

// --- nested relations (include) ---
const nestedData = [
  ["Get purchase orders with details", "purchase_order_master", { purchase_order_details: true }],
  ["Get requisitions with details", "requisition_master", { requisition_details: true }],
  ["Get budget with structure budget", "budget", { structure_budget: true }],
  ["Get structure budget with fund type", "structure_budget", { fund_type: true }],
  ["Get structure budget with lkp budget code", "structure_budget", { lkp_budget_code: true }],
  ["Get org unit cost centre with relations", "org_unit_costcentre", { organization_unit: true, costcentre: true }],
  ["Get PO master with purchase order details", "purchase_order_master", { purchase_order_details: { take: 10 } }],
  ["Get budget with structure and fund type", "budget", { structure_budget: { include: { fund_type: true } } }],
];

for (let i = 0; i < 500; i++) {
  const [inst, model, include] = sample(nestedData);
  add(`Generate Prisma query: ${inst}`, `const result = await prisma.${model}.findMany({ include: ${JSON.stringify(include)} });`);
}

// --- date filtering ---
const dateData = [
  ["Get purchase orders approved in 2025", "purchase_order_master", "pom_approve_date", 2025, "pom_order_status", "APPROVE"],
  ["Get requisitions requested in 2024", "requisition_master", "rqm_request_date", 2024],
  ["Get budget for year 2025", "budget", "bdg_year", "2025"],
  ["Get structure budget for year 2026", "structure_budget", "sby_year", "2026"],
  ["Get purchase orders approved between Jan-Dec 2025", "purchase_order_master", "pom_approve_date", 2025],
  ["Get budget movement approved in 2024", "budget_movement_master", "bmm_approve_date", 2024],
  ["Get quarter budget for 2025", "quarter_budget", "qbu_year", "2025"],
];

for (let i = 0; i < 600; i++) {
  const t = sample(dateData);
  const [inst, model, dateField, year, statusField, statusVal] = t;
  const y = typeof year === "number" ? year : year;
  let whereStr;
  if (typeof year === "number") {
    const datePart = `{ gte: new Date('${y}-01-01'), lte: new Date('${y}-12-31') }`;
    whereStr = statusField && statusVal
      ? `{ ${dateField}: ${datePart}, ${statusField}: { contains: '${statusVal}' } }`
      : `{ ${dateField}: ${datePart} }`;
  } else {
    whereStr = `{ ${dateField}: '${year}' }`;
  }
  add(`Generate Prisma query: ${inst.replace(/\d{4}/, y)}`, `const result = await prisma.${model}.findMany({ where: ${whereStr} });`);
}

// --- count ---
for (let i = 0; i < 400; i++) {
  const models = ["fund_type", "costcentre", "organization_unit", "lkp_budget_code", "purchase_order_master", "requisition_master", "budget", "structure_budget" ];
  const model = sample(models);
  const whereOpts = {
    fund_type: { fty_status: "ACTIVE" },
    costcentre: { ccr_status: "ACTIVE" },
    organization_unit: {},
    lkp_budget_code: { lbc_status: "ACTIVE" },
    purchase_order_master: { pom_order_status: { contains: "APPROVE" } },
    requisition_master: { rqm_status: "ACTIVE" },
    budget: { bdg_year: sample(YEARS) },
    structure_budget: { sby_year: sample(YEARS) },
  };
  const where = whereOpts[model] || {};
  add(`Generate Prisma count: Count ${model.replace(/_/g, " ")}`, `const result = await prisma.${model}.count({ where: ${JSON.stringify(where)} });`);
}

// --- findFirst ---
for (let i = 0; i < 300; i++) {
  const models = [
    ["fund_type", "fty_fund_type", "Get first fund type by code"],
    ["costcentre", "ccr_costcentre", "Get first cost centre"],
    ["requisition_master", "rqm_requisition_no", "Get requisition by number"],
    ["purchase_order_master", "pom_order_no", "Get purchase order by number"],
    ["lkp_budget_code", "lbc_budget_code", "Get budget code by code"],
  ];
  const [model, field, inst] = sample(models);
  add(`Generate Prisma findFirst: ${inst}`, `const result = await prisma.${model}.findFirst({ where: { ${field}: "VALUE" } });`);
}

// --- orderBy ---
for (let i = 0; i < 400; i++) {
  const models = [
    ["budget", "bdg_year", "Get budget ordered by year"],
    ["purchase_order_master", "pom_approve_date", "Get POs ordered by approve date"],
    ["requisition_master", "rqm_request_date", "Get requisitions ordered by request date"],
    ["structure_budget", "sby_year", "Get structure budget ordered by year"],
  ];
  const [model, orderField, inst] = sample(models);
  const order = sample(["asc", "desc"]);
  const take = sample([10, 20, 50, 100]);
  add(`Generate Prisma query: ${inst}`, `const result = await prisma.${model}.findMany({ orderBy: { ${orderField}: '${order}' }, take: ${take} });`);
}

// --- take/skip ---
for (let i = 0; i < 300; i++) {
  const model = sample(["fund_type", "costcentre", "budget", "purchase_order_master", "requisition_master", "structure_budget"]);
  const take = sample([10, 20, 50, 100]);
  const skip = sample([0, 10, 20, 50]);
  add(`Generate Prisma query: Get ${take} ${model.replace(/_/g, " ")} with skip ${skip}`, `const result = await prisma.${model}.findMany({ take: ${take}, skip: ${skip} });`);
}

// --- Safe filtering (read-only, no DELETE/UPDATE/INSERT) ---
const safeData = [
  ["Get active fund types - read only report", "fund_type", { fty_status: { not: "DELETED" } }],
  ["List budget codes - no modifications", "lkp_budget_code", { lbc_status: { not: "INACTIVE" } }],
  ["Fetch non-cancelled purchase orders", "purchase_order_master", { pom_order_status: { not: "CANCEL" } }],
  ["Get structure budget with filters", "structure_budget", { sbg_status: "ACTIVE", sby_year: "2025" }],
  ["Get approved requisitions only", "requisition_master", { rqm_status: { contains: "APPROVE" } }],
];

for (let i = 0; i < 400; i++) {
  const [inst, model, where] = sample(safeData);
  const y = sample(YEARS);
  const w = JSON.stringify(where).replace("2025", y);
  add(`Generate Prisma query (read-only): ${inst}`, `const result = await prisma.${model}.findMany({ where: ${w} });`);
}

// --- PO approved count (specific) ---
for (let i = 0; i < 300; i++) {
  const year = sample(YEARS);
  add(`How many purchase orders approved in ${year}? Generate Prisma query.`, `const result = await prisma.purchase_order_master.count({ where: { pom_order_status: { contains: 'APPROVE' }, pom_approve_date: { gte: new Date('${year}-01-01'), lte: new Date('${year}-12-31') } } });`);
}

// --- Budget balance ---
for (let i = 0; i < 300; i++) {
  const year = sample(YEARS);
  add(`Get budget balance for year ${year}. Generate Prisma aggregate.`, `const result = await prisma.budget.aggregate({ where: { bdg_year: '${year}' }, _sum: { bdg_balance_amt: true }, _count: true });`);
}

// --- PRO status ---
for (let i = 0; i < 200; i++) {
  add("Get requisition status by PRO number. Generate Prisma query.", "const result = await prisma.requisition_master.findFirst({ where: { rqm_requisition_no: 'PRO_NUMBER' }, select: { rqm_status: true, rqm_wflow_sts: true } });");
}

// --- Additional variations to reach 5000 ---
for (let i = 0; i < 500; i++) {
  const year = sample(YEARS);
  add(`Budget report for ${year} - Generate Prisma query`, `const result = await prisma.budget.findMany({ where: { bdg_year: '${year}' }, select: { bdg_balance_amt: true, bdg_allocated_amt: true, bdg_expenses_amt: true } });`);
}
for (let i = 0; i < 300; i++) {
  const year = sample(YEARS);
  add(`Structure budget by fund and year ${year}`, `const result = await prisma.structure_budget.findMany({ where: { sby_year: '${year}' }, include: { fund_type: true } });`);
}
const dropdownModels = [
  ["fund_type", "fty_fund_type", "fty_fund_desc", "fund type", "fty_status"],
  ["costcentre", "ccr_costcentre", "ccr_costcentre_desc", "cost centre", "ccr_status"],
  ["lkp_budget_code", "lbc_budget_code", "lbc_description", "budget code", "lbc_status"],
  ["organization_unit", "oun_code", "oun_desc", "org unit", "oun_status"],
];
for (let i = 0; i < 300; i++) {
  const [model, valF, labelF, name, statusF] = sample(dropdownModels);
  add(`Generate Prisma query: List ${name} for dropdown`, `const result = await prisma.${model}.findMany({ where: { ${statusF}: 'ACTIVE' }, select: { ${valF}: true, ${labelF}: true } }).then(r => r.map(x => ({ value: x.${valF}, label: x.${labelF} })));`);
}

const outputPath = path.join(__dirname, "kerisi_training.jsonl");
const lines = samples.slice(0, 5000).map((s) => JSON.stringify(s)).join("\n");
fs.writeFileSync(outputPath, lines, "utf8");

console.log(`Generated ${Math.min(samples.length, 5000)} samples to ${outputPath}`);
