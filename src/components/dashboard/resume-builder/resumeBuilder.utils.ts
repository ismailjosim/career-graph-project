import { DEMO_RESUME_DATA, EMPTY_RESUME_DATA } from "./demoResumeData";
export { DEMO_RESUME_DATA, EMPTY_RESUME_DATA };

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/**
 * Executes a pristine, print-optimized document print or PDF save.
 * Extracts the inner printable HTML of the preview element into a standalone print window
 * with strict A4 styling, preserving exact fonts, vector sharpness, and colors.
 */
export function printResumeDocument(targetElementId = "resume-preview-sheet") {
  const previewEl = document.getElementById(targetElementId);
  if (!previewEl) {
    window.print();
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }

  const htmlContent = previewEl.innerHTML;
  const computedStyle = window.getComputedStyle(previewEl);

  const printDocument = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Resume Print</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: ${computedStyle.fontFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"};
      font-size: 9.5pt;
      line-height: 1.45;
    }
    .print-sheet {
      width: 210mm;
      min-height: 297mm;
      padding: 14mm 16mm;
      margin: 0 auto;
      background: #ffffff;
      page-break-after: always;
    }
    /* Hide screen-only interactive icons and helper toolbars */
    .no-print, [data-no-print="true"] {
      display: none !important;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    ul {
      margin-top: 4px;
      margin-bottom: 6px;
      padding-left: 16px;
    }
    li {
      margin-bottom: 2px;
    }
    @media print {
      body {
        width: 210mm;
        height: 297mm;
      }
      .print-sheet {
        padding: 12mm 14mm;
        margin: 0;
        width: 100%;
        page-break-inside: auto;
      }
    }
  </style>
</head>
<body>
  <div class="print-sheet">
    ${htmlContent}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
        window.close();
      }, 250);
    };
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
}

/**
 * Generates an instant high-fidelity vector PDF download dialog.
 * Opens the dedicated print engine configured specifically with PDF instruction headers.
 */
export function exportResumeToPdf(
  resumeName = "Resume",
  targetElementId = "resume-preview-sheet",
) {
  const safeName =
    resumeName.trim().replace(/[^a-zA-Z0-9_-]/g, "_") || "Resume";
  const previewEl = document.getElementById(targetElementId);
  if (!previewEl) {
    window.print();
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }

  const htmlContent = previewEl.innerHTML;
  const computedStyle = window.getComputedStyle(previewEl);

  const printDocument = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${safeName}.pdf</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: ${computedStyle.fontFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"};
      font-size: 9.5pt;
      line-height: 1.45;
    }
    .print-sheet {
      width: 210mm;
      min-height: 297mm;
      padding: 14mm 16mm;
      margin: 0 auto;
      background: #ffffff;
    }
    .no-print, [data-no-print="true"] {
      display: none !important;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    ul {
      margin-top: 4px;
      margin-bottom: 6px;
      padding-left: 16px;
    }
    li {
      margin-bottom: 2px;
    }
  </style>
</head>
<body>
  <div class="print-sheet">
    ${htmlContent}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
        window.close();
      }, 250);
    };
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
}
