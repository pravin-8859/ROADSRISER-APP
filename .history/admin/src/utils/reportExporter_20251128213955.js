// src/utils/reportExporter.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// -------------------------------------------
// CSV EXPORT
// -------------------------------------------
export function exportCSV(filename, rows) {
  const csv = rows.map((r) => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();

  URL.revokeObjectURL(url);
}

// -------------------------------------------
// PDF REPORT (Requests)
// -------------------------------------------
export function exportRequestsPDF({ title, requests }) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.text(`Total Requests: ${requests.length}`, 14, 34);

  const rows = requests.map((r) => [
    r.date,
    r.customer,
    r.issue,
    r.status,
    r.location,
  ]);

  autoTable(doc, {
    head: [["Date", "Customer", "Issue", "Status", "Location"]],
    body: rows,
    startY: 40,
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

// -------------------------------------------
// PDF REPORT (MechanicsPerformance)
// -------------------------------------------
export function exportMechanicsPDF({ title, mechanics }) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.text(`Mechanics Count: ${mechanics.length}`, 14, 34);

  const rows = mechanics.map((m) => [m.name, m.jobsCompleted, m.rating]);

  autoTable(doc, {
    head: [["Name", "Jobs Completed", "Rating"]],
    body: rows,
    startY: 40,
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}
