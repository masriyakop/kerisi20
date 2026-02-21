/**
 * Export report data in CSV, PDF, Excel, or JSON format.
 * Follows the format used on Fund Type page.
 */

function formatDateTime(d) {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return String(d);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${day}/${month}/${year} ${String(displayHours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
}

function getFormattedDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `Date : ${day}/${month}/${year} ${String(displayHours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
}

function humanizeKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeReportData(reportData) {
  if (!reportData || reportData.error) return null;
  if (Array.isArray(reportData)) {
    if (reportData.length === 0) return null;
    return reportData;
  }
  return [reportData];
}

function getColumns(data) {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.map((k) => humanizeKey(k));
}

function escapeCSVField(field) {
  if (field === null || field === undefined) return "";
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function useReportExport() {
  const exportCSV = (reportData, title = "KERISI Report") => {
    const data = normalizeReportData(reportData);
    if (!data) return false;

    const columns = getColumns(data);
    const formattedDateTime = getFormattedDateTime();

    let csvContent = "";
    csvContent += escapeCSVField(formattedDateTime) + "\n";
    csvContent += escapeCSVField(title) + "\n\n";
    csvContent += ["No.", ...columns].map(escapeCSVField).join(",") + "\n";

    data.forEach((item, index) => {
      const row = [(index + 1).toString()];
      columns.forEach((_, i) => {
        const key = Object.keys(data[0])[i];
        const val = item[key];
        const str = val != null ? String(val) : "";
        row.push(str);
      });
      csvContent += row.map(escapeCSVField).join(",") + "\n";
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `KERISI_Report_${new Date().toISOString().split("T")[0]}.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return true;
  };

  const exportJSON = (reportData, title = "KERISI Report") => {
    const data = normalizeReportData(reportData);
    if (!data) return false;

    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `KERISI_Report_${new Date().toISOString().split("T")[0]}.json`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return true;
  };

  const exportPDF = async (reportData, title = "KERISI Report") => {
    const data = normalizeReportData(reportData);
    if (!data) return false;

    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const columns = getColumns(data);
    const formattedDateTime = getFormattedDateTime();

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    doc.setFontSize(10);
    doc.text(formattedDateTime, pageWidth - margin - doc.getTextWidth(formattedDateTime), margin + 8);

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, margin + 15);

    const tableData = data.map((item, index) => {
      const row = [(index + 1).toString()];
      columns.forEach((_, i) => {
        const key = Object.keys(data[0])[i];
        const val = item[key];
        row.push(val != null ? String(val) : "");
      });
      return row;
    });

    autoTable(doc, {
      head: [["No.", ...columns]],
      body: tableData,
      startY: margin + 22,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: { halign: "left" },
      columnStyles: { 0: { halign: "center", cellWidth: 15 } },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`KERISI_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    return true;
  };

  const exportExcel = async (reportData, title = "KERISI Report") => {
    const data = normalizeReportData(reportData);
    if (!data) return false;

    const ExcelJS = await import("exceljs");
    const columns = getColumns(data);
    const formattedDateTime = getFormattedDateTime();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.addRow([formattedDateTime]);
    worksheet.addRow([title]);
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(["No.", ...columns]);
    headerRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD3D3D3" } };
      cell.font = { bold: true };
    });

    data.forEach((item, index) => {
      const row = [(index + 1).toString()];
      columns.forEach((_, i) => {
        const key = Object.keys(data[0])[i];
        const val = item[key];
        row.push(val != null ? val : "");
      });
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `KERISI_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return true;
  };

  const exportReport = async (reportData, format, title = "KERISI Report") => {
    const fmt = (format || "csv").toLowerCase();
    if (fmt === "csv") return exportCSV(reportData, title);
    if (fmt === "json") return exportJSON(reportData, title);
    if (fmt === "pdf") return exportPDF(reportData, title);
    if (fmt === "excel" || fmt === "xlsx") return exportExcel(reportData, title);
    return exportCSV(reportData, title);
  };

  return { exportCSV, exportJSON, exportPDF, exportExcel, exportReport };
}
