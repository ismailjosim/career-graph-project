import type { AtsAnalysisResult } from "./types";

/**
 * Exports the comprehensive ATS audit report to Microsoft Word format (.doc).
 * Uses Microsoft Office HTML specification for high-fidelity formatting, tables, and colors.
 */
export function exportToWord(
  result: AtsAnalysisResult,
  resumeTitle = "Resume",
) {
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ratingColor =
    result.overallScore >= 85
      ? "#10b981"
      : result.overallScore >= 70
        ? "#3b82f6"
        : result.overallScore >= 50
          ? "#f59e0b"
          : "#ef4444";

  const content = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>ATS Resume Audit Report - ${resumeTitle}</title>
  <style>
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1e293b;
      margin: 40px;
    }
    h1 {
      font-size: 20pt;
      color: #0f172a;
      margin-bottom: 4px;
      font-weight: bold;
    }
    h2 {
      font-size: 13pt;
      color: #1e293b;
      margin-top: 24px;
      margin-bottom: 8px;
      border-bottom: 1.5pt solid #cbd5e1;
      padding-bottom: 4px;
    }
    h3 {
      font-size: 11pt;
      color: #334155;
      margin-top: 12px;
      margin-bottom: 4px;
    }
    .header-box {
      border: 1pt solid #e2e8f0;
      background-color: #f8fafc;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 24px;
    }
    .score-badge {
      font-size: 24pt;
      font-weight: bold;
      color: ${ratingColor};
    }
    .badge-pill {
      display: inline-block;
      padding: 4px 10px;
      background-color: #e0e7ff;
      color: #3730a3;
      border-radius: 4px;
      font-weight: bold;
      font-size: 9pt;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 16px;
    }
    th {
      background-color: #f1f5f9;
      color: #334155;
      text-align: left;
      padding: 8px 10px;
      font-size: 9.5pt;
      border: 1pt solid #cbd5e1;
    }
    td {
      padding: 8px 10px;
      border: 1pt solid #e2e8f0;
      font-size: 9.5pt;
      vertical-align: top;
    }
    .severity-high {
      color: #dc2626;
      font-weight: bold;
    }
    .severity-medium {
      color: #d97706;
      font-weight: bold;
    }
    .severity-low {
      color: #2563eb;
      font-weight: bold;
    }
    .pill {
      display: inline-block;
      padding: 2px 6px;
      margin: 2px;
      border-radius: 4px;
      font-size: 8.5pt;
    }
    .pill-green {
      background-color: #ecfdf5;
      color: #065f46;
      border: 1pt solid #a7f3d0;
    }
    .pill-amber {
      background-color: #fffbeb;
      color: #92400e;
      border: 1pt solid #fde68a;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <h1>Career Graph &bull; ATS Resume Audit</h1>
    <p style="margin: 0; color: #64748b; font-size: 10pt;">
      <strong>Target Document:</strong> ${resumeTitle} | <strong>Audit Date:</strong> ${dateStr}
    </p>
    <div style="margin-top: 14px;">
      <span class="score-badge">${result.overallScore}/100</span>
      <span style="margin-left: 12px;" class="badge-pill">${result.badge}</span>
    </div>
  </div>

  <h2>1. Executive Summary</h2>
  <p>${result.executiveSummary}</p>

  ${
    result.quickWins && result.quickWins.length > 0
      ? `
  <h3>High-Priority Quick Wins:</h3>
  <ul>
    ${result.quickWins.map((w) => `<li>${w}</li>`).join("")}
  </ul>
  `
      : ""
  }

  <h2>2. Category Score Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Category</th>
        <th style="width: 15%;">Score</th>
        <th style="width: 60%;">Detailed Assessment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Formatting & Layout</strong></td>
        <td style="font-weight: bold;">${result.categoryScores.formatting}%</td>
        <td>${result.categoryFeedback.formatting}</td>
      </tr>
      <tr>
        <td><strong>Keyword Optimization</strong></td>
        <td style="font-weight: bold;">${result.categoryScores.keywords}%</td>
        <td>${result.categoryFeedback.keywords}</td>
      </tr>
      <tr>
        <td><strong>Impact & Metrics</strong></td>
        <td style="font-weight: bold;">${result.categoryScores.contentImpact}%</td>
        <td>${result.categoryFeedback.contentImpact} (Found ~${result.actionVerbCount} strong action verbs)</td>
      </tr>
      <tr>
        <td><strong>Structure & Completeness</strong></td>
        <td style="font-weight: bold;">${result.categoryScores.structure}%</td>
        <td>${result.categoryFeedback.structure}</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Actionable Issues & Recommendations</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Severity</th>
        <th style="width: 18%;">Section</th>
        <th style="width: 30%;">Identified Issue</th>
        <th style="width: 37%;">Recommended Fix</th>
      </tr>
    </thead>
    <tbody>
      ${result.criticalIssues
        .map(
          (issue) => `
      <tr>
        <td class="severity-${issue.severity}">${issue.severity.toUpperCase()}</td>
        <td><strong>${issue.section}</strong><br/><small style="color: #64748b;">${issue.title}</small></td>
        <td>${issue.issue}</td>
        <td>${issue.recommendation}</td>
      </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <h2>4. Keyword & Skill Analysis</h2>
  <p><strong>Detected Skills in Resume:</strong></p>
  <p>
    ${result.detectedKeywords.map((k) => `<span class="pill pill-green">${k}</span>`).join(" ")}
  </p>

  <p style="margin-top: 16px;"><strong>Recommended Missing ATS Keywords:</strong></p>
  <p>
    ${result.missingKeywords.map((k) => `<span class="pill pill-amber">${k}</span>`).join(" ")}
  </p>

  <div style="margin-top: 40px; padding-top: 10px; border-top: 1pt solid #cbd5e1; font-size: 8.5pt; color: #94a3b8; text-align: center;">
    Report generated by Career Graph ATS Audit Engine &bull; Confidential
  </div>
</body>
</html>
  `;

  const blob = new Blob(["\ufeff", content], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `${resumeTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}-ATS-Audit-Report.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * Triggers clean print-to-PDF flow with dedicated executive report styling.
 */
export function exportToPdf(result: AtsAnalysisResult, resumeTitle = "Resume") {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }

  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ratingColor =
    result.overallScore >= 85
      ? "#059669"
      : result.overallScore >= 70
        ? "#2563eb"
        : result.overallScore >= 50
          ? "#d97706"
          : "#dc2626";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>ATS Audit - ${resumeTitle}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.45;
      font-size: 10pt;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .report-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 18px;
    }
    .header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .score-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 76px;
      border-radius: 50%;
      background: #f8fafc;
      border: 4px solid ${ratingColor};
      font-size: 20pt;
      font-weight: 800;
      color: ${ratingColor};
    }
    h1 { font-size: 18pt; margin: 0 0 4px 0; font-weight: 800; }
    h2 { font-size: 12pt; margin: 18px 0 8px 0; font-weight: 700; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 12px; }
    th { background: #f1f5f9; text-align: left; padding: 7px 8px; font-size: 8.5pt; border: 1px solid #cbd5e1; }
    td { padding: 7px 8px; border: 1px solid #e2e8f0; font-size: 8.5pt; vertical-align: top; }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 8pt;
      text-transform: uppercase;
      background: #e0e7ff;
      color: #3730a3;
    }
    .pill {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 8pt;
      margin: 2px;
    }
    .pill-green { background: #d1fae5; color: #065f46; font-weight: 600; }
    .pill-amber { background: #fef3c7; color: #92400e; font-weight: 600; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="header-flex">
    <div>
      <div style="text-transform: uppercase; letter-spacing: 1px; font-size: 8pt; font-weight: 700; color: #4f46e5;">
        Career Graph AI &bull; Official Report
      </div>
      <h1>ATS Resume Audit</h1>
      <p style="margin: 0; color: #64748b; font-size: 9pt;">
        <strong>Document:</strong> ${resumeTitle} &bull; <strong>Date:</strong> ${dateStr}
      </p>
    </div>
    <div style="text-align: right;">
      <div class="score-circle">${result.overallScore}</div>
      <div style="margin-top: 6px;"><span class="badge">${result.badge}</span></div>
    </div>
  </div>

  <h2>1. Executive Summary</h2>
  <p style="margin-top: 4px;">${result.executiveSummary}</p>

  ${
    result.quickWins && result.quickWins.length > 0
      ? `
  <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 8px 12px; margin-top: 10px; border-radius: 4px;">
    <strong>Top Quick Wins to Boost Score:</strong>
    <ul style="margin: 4px 0 0 16px; padding: 0;">
      ${result.quickWins.map((w) => `<li>${w}</li>`).join("")}
    </ul>
  </div>
  `
      : ""
  }

  <h2>2. Category Assessment</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Category</th>
        <th style="width: 15%;">Score</th>
        <th style="width: 60%;">Feedback</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Formatting & Readability</strong></td>
        <td><strong>${result.categoryScores.formatting}%</strong></td>
        <td>${result.categoryFeedback.formatting}</td>
      </tr>
      <tr>
        <td><strong>Keyword Optimization</strong></td>
        <td><strong>${result.categoryScores.keywords}%</strong></td>
        <td>${result.categoryFeedback.keywords}</td>
      </tr>
      <tr>
        <td><strong>Content Impact & Metrics</strong></td>
        <td><strong>${result.categoryScores.contentImpact}%</strong></td>
        <td>${result.categoryFeedback.contentImpact}</td>
      </tr>
      <tr>
        <td><strong>Structure & Completeness</strong></td>
        <td><strong>${result.categoryScores.structure}%</strong></td>
        <td>${result.categoryFeedback.structure}</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Actionable Recommendations</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Severity</th>
        <th style="width: 20%;">Section / Title</th>
        <th style="width: 32%;">Identified Issue</th>
        <th style="width: 36%;">Fix Recommendation</th>
      </tr>
    </thead>
    <tbody>
      ${result.criticalIssues
        .map(
          (i) => `
      <tr>
        <td style="font-weight: 700; color: ${
          i.severity === "high"
            ? "#dc2626"
            : i.severity === "medium"
              ? "#d97706"
              : "#2563eb"
        };">${i.severity.toUpperCase()}</td>
        <td><strong>${i.section}</strong><br/><small style="color: #64748b;">${i.title}</small></td>
        <td>${i.issue}</td>
        <td>${i.recommendation}</td>
      </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <h2>4. Keyword Alignment</h2>
  <div style="margin-bottom: 8px;">
    <strong>Skills Found in Resume:</strong><br/>
    ${result.detectedKeywords.map((k) => `<span class="pill pill-green">${k}</span>`).join(" ")}
  </div>
  <div style="margin-top: 10px;">
    <strong>Recommended Missing Keywords:</strong><br/>
    ${result.missingKeywords.map((k) => `<span class="pill pill-amber">${k}</span>`).join(" ")}
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
