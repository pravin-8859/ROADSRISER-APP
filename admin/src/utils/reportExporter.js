import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// -------------------------------------------
// CSV VALUE ESCAPER
// -------------------------------------------
function escapeCSVValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

// -------------------------------------------
// CSV EXPORT
// Supports:
// exportCSV(rows)
// exportCSV(filename, rows)
// -------------------------------------------
export function exportCSV(
  filenameOrRows,
  maybeRows
) {
  let filename;
  let rows;

  if (Array.isArray(filenameOrRows)) {
    filename = "RoadsRiser_Report";
    rows = filenameOrRows;
  } else {
    filename = filenameOrRows || "RoadsRiser_Report";
    rows = Array.isArray(maybeRows)
      ? maybeRows
      : [];
  }

  if (!rows.length) {
    return;
  }

  let csvRows = [];

  // Object rows
  if (
    typeof rows[0] === "object" &&
    !Array.isArray(rows[0])
  ) {
    const headers = Object.keys(rows[0]);

    csvRows.push(
      headers.map(escapeCSVValue).join(",")
    );

    rows.forEach((row) => {
      csvRows.push(
        headers
          .map((header) =>
            escapeCSVValue(row[header])
          )
          .join(",")
      );
    });
  } else {
    // Array rows
    csvRows = rows.map((row) =>
      row
        .map(escapeCSVValue)
        .join(",")
    );
  }

  const csv = csvRows.join("\n");

  const blob = new Blob(
    ["\uFEFF" + csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;
  a.download = `${filename}.csv`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

// -------------------------------------------
// PDF REPORT (REQUESTS)
// -------------------------------------------
export function exportRequestsPDF({
  title,
  requests,
}) {
  if (!requests?.length) {
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 20);

  doc.setFontSize(10);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    28
  );

  doc.text(
    `Total Requests: ${requests.length}`,
    14,
    34
  );

  const rows = requests.map((r) => [
    r.date || "—",
    r.customer || "—",
    r.issue || "—",
    r.status || "—",
    r.location || "—",
  ]);

  autoTable(doc, {
    head: [
      [
        "Date",
        "Customer",
        "Issue",
        "Status",
        "Location",
      ],
    ],
    body: rows,
    startY: 40,
  });

  doc.save(
    `${title.replace(/\s+/g, "_")}.pdf`
  );
}

// -------------------------------------------
// PDF REPORT (MECHANICS PERFORMANCE)
// -------------------------------------------
export function exportMechanicsPDF({
  title,
  mechanics,
}) {
  if (!mechanics?.length) {
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 20);

  doc.setFontSize(10);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    28
  );

  doc.text(
    `Mechanics Count: ${mechanics.length}`,
    14,
    34
  );

  const rows = mechanics.map((m) => [
    m.name || "—",
    m.jobsCompleted ?? 0,
    m.rating ?? "—",
  ]);

  autoTable(doc, {
    head: [
      [
        "Name",
        "Jobs Completed",
        "Rating",
      ],
    ],
    body: rows,
    startY: 40,
  });

  doc.save(
    `${title.replace(/\s+/g, "_")}.pdf`
  );
}