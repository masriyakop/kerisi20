import prisma from "~/server/utils/prisma";
import ExcelJS from "exceljs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

function getClientIP(event) {
  const forwarded = getHeader(event, "x-forwarded-for");
  let ip = forwarded ? String(forwarded).split(",")[0].trim() : event.node?.req?.socket?.remoteAddress || "unknown";
  if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";
  return ip;
}

function getBrowserFromUserAgent(ua) {
  if (!ua || typeof ua !== "string") return "Unknown";
  const u = ua.toLowerCase();
  if (u.includes("edg/")) return "Microsoft Edge";
  if (u.includes("opr/") || u.includes("opera")) return "Opera";
  if (u.includes("samsungbrowser")) return "Samsung Internet";
  if (u.includes("firefox") || u.includes("fxios")) return "Mozilla Firefox";
  if (u.includes("chrome") && !u.includes("edg")) return "Google Chrome";
  if (u.includes("safari") && !u.includes("chrome")) return "Apple Safari";
  return "Unknown";
}

function getSessionId(event) {
  const accessToken = getCookie(event, "accessToken");
  if (accessToken) {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(accessToken).digest("hex").substring(0, 64);
  }
  return "anonymous";
}

async function logApiExecution(event, apiKey) {
  try {
    const agl_client_ip = getClientIP(event);
    const userAgent = getHeader(event, "user-agent");
    const agl_client_browser = getBrowserFromUserAgent(userAgent);
    const agl_session_id = getSessionId(event);
    const createdby =
      event.context?.user?.userID ?? event.context?.user?.email ?? event.context?.user?.username ?? "guest";

    await prisma.api_gen_log.create({
      data: {
        api_key: apiKey,
        agl_client_ip,
        agl_client_browser,
        agl_session_id,
        createdby: String(createdby || "guest"),
      },
    });
  } catch (err) {
    console.error("api_gen_log insert error:", err);
  }
}

function applyTemplateFilters(data, template) {
  let filtered = [...data];
  const details = template?.api_gen_template_details || {};
  const searchKeyword = details.searchKeyword || "";
  const smartFilter = details.smartFilter || {};

  if (searchKeyword && String(searchKeyword).trim() !== "") {
    const keyword = String(searchKeyword).toLowerCase().trim();
    filtered = filtered.filter((item) => {
      return Object.keys(item).some((key) => {
        if (key === "no" || key === "Action") return false;
        const value = String(item[key] || "").toLowerCase();
        return value.includes(keyword);
      });
    });
  }

  Object.keys(smartFilter || {}).forEach((key) => {
    if (smartFilter[key]) {
      const fieldName = key.replace(/_filter_filter$/, "").replace(/_filter$/, "") || key;
      filtered = filtered.filter((item) => {
        const itemValue = item[fieldName] ?? item[key];
        const filterValue = smartFilter[key];
        const itemStr = String(itemValue || "").toLowerCase();
        const filterStr = String(filterValue).toLowerCase();
        return itemStr.includes(filterStr) || itemStr === filterStr;
      });
    }
  });

  const sortColumn = details.sortColumn;
  const sortDirection = details.sortDirection || "asc";
  if (sortColumn && filtered.length > 0 && filtered[0][sortColumn] !== undefined) {
    filtered.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const cmp = String(aVal || "").localeCompare(String(bVal || ""), undefined, { numeric: true });
      return sortDirection === "desc" ? -cmp : cmp;
    });
  }

  const hiddenColumns = details.hiddenColumns || [];
  let exportColumns = details.exportColumns;
  if (!exportColumns || !Array.isArray(exportColumns) || exportColumns.length === 0) {
    const columnOrder = (details.columnOrder || []).filter(
      (c) => !hiddenColumns.includes(c) && (c || "").toLowerCase() !== "no" && (c || "").toLowerCase() !== "action"
    );
    const firstRow = filtered[0] || {};
    const allKeys = Object.keys(firstRow).filter((k) => k !== "no" && k !== "Action");
    exportColumns = columnOrder.length > 0 ? columnOrder.filter((c) => allKeys.includes(c) || firstRow[c] !== undefined) : allKeys;
    if (exportColumns.length === 0) exportColumns = allKeys;
  }

  return { filtered, exportColumns };
}

function formatDateForDisplay(dateVal) {
  if (!dateVal) return "";
  try {
    const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

async function fetchFundTypeData() {
  const data = await prisma.fund_type.findMany({
    orderBy: { fty_fund_id: "desc" },
  });
  return data.map((item, idx) => {
    const statusDisplay = item.fty_status === "1" || item.fty_status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
    const entryDateDisplay = formatDateForDisplay(item.createddate);
    return {
      no: idx + 1,
      id: item.fty_fund_id,
      "Fund Type": item.fty_fund_type,
      Description: item.fty_fund_desc || "",
      "Type Basis": item.fty_basis || "",
      Remark: item.fty_remark || "",
      Status: statusDisplay,
      "Entry Date": entryDateDisplay,
    };
  });
}

function escapeCSVField(field) {
  if (field === null || field === undefined) return "";
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const kerisiApiKey = query.kerisiApiKey;

    if (!kerisiApiKey) {
      return {
        statusCode: 400,
        message: "kerisiApiKey is required",
      };
    }

    const template = await prisma.api_gen_template.findUnique({
      where: { api_key: kerisiApiKey },
    });

    if (!template) {
      setResponseStatus(event, 404);
      return {
        statusCode: 404,
        message: "Invalid or expired API key",
      };
    }

    await logApiExecution(event, kerisiApiKey);

    const outputType = (template.api_output_type || "JSON").toUpperCase();
    const rawData = await fetchFundTypeData();
    const { filtered, exportColumns } = applyTemplateFilters(rawData, template);

    const dataToExport = filtered.map((item, idx) => ({
      no: idx + 1,
      ...item,
    }));

    const title = "Fund Type";

    if (outputType === "JSON") {
      setResponseHeader(event, "Content-Type", "application/json");
      setResponseHeader(event, "Content-Disposition", "inline");
      return dataToExport;
    }

    if (outputType === "CSV") {
      const headers = ["No.", ...exportColumns];
      let csvContent = headers.map(escapeCSVField).join(",") + "\n";
      dataToExport.forEach((item) => {
        const row = [item.no, ...exportColumns.map((c) => escapeCSVField(item[c]))];
        csvContent += row.join(",") + "\n";
      });
      setResponseHeader(event, "Content-Type", "text/csv; charset=utf-8");
      setResponseHeader(event, "Content-Disposition", `attachment; filename="${title}_${new Date().toISOString().split("T")[0]}.csv"`);
      return csvContent;
    }

    if (outputType === "EXCEL") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(title);
      const headers = ["No.", ...exportColumns];
      worksheet.addRow(headers);
      dataToExport.forEach((item) => {
        worksheet.addRow([item.no, ...exportColumns.map((c) => item[c] ?? "")]);
      });
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD3D3D3" } };
        cell.font = { bold: true };
      });
      const buffer = await workbook.xlsx.writeBuffer();
      setResponseHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      setResponseHeader(event, "Content-Disposition", `attachment; filename="${title}_${new Date().toISOString().split("T")[0]}.xlsx"`);
      return buffer;
    }

    if (outputType === "PDF") {
      const jspdfNode = require("jspdf/dist/jspdf.node.min.js");
      const jsPDF = jspdfNode.jsPDF || jspdfNode.default;
      const autoTable = require("jspdf-autotable").default || require("jspdf-autotable");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 10;
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text(title, margin, margin + 10);
      const tableData = dataToExport.map((item) => [(item.no || "").toString(), ...exportColumns.map((c) => (item[c] ?? "").toString())]);
      autoTable(doc, {
        head: [["No.", ...exportColumns]],
        body: tableData,
        startY: margin + 16,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
        bodyStyles: { halign: "left" },
        columnStyles: { 0: { halign: "center", cellWidth: 15 } },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
      const buffer = Buffer.from(doc.output("arraybuffer"));
      setResponseHeader(event, "Content-Type", "application/pdf");
      setResponseHeader(event, "Content-Disposition", `inline; filename="${title}.pdf"`);
      return buffer;
    }

    setResponseStatus(event, 400);
    return { statusCode: 400, message: "Invalid output type" };
  } catch (error) {
    console.error("Kerisi export (Fund Type) error:", error);
    setResponseStatus(event, 500);
    return { statusCode: 500, message: "Internal server error", error: error.message };
  }
});
