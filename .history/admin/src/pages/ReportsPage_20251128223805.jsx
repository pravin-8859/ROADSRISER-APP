export const exportCSV = (data = []) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("CSV Export: No data found.");
    return;
  }

  const keys = Object.keys(data[0]);
  let csv = keys.join(",") + "\n";

  data.forEach(item => {
    csv += keys.map(k => JSON.stringify(item[k] ?? "")).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "report.csv";
  a.click();
};
