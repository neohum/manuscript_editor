export function exportToCsv(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;

  const header = Object.keys(rows[0]).join(',');
  const values = rows.map((row) =>
    Object.values(row)
      .map((val) => {
        // Handle strings that might contain commas, newlines, or quotes
        if (typeof val === 'string') {
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        }
        return val === null || val === undefined ? '' : val;
      })
      .join(',')
  );

  const csvContent = [header, ...values].join('\n');
  
  // Create blob with BOM for Korean encoding in Excel
  const currBlob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(currBlob);
    link.href = url;
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
