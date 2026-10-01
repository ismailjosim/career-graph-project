"use client";

import { ArrowLeft, Download, FileText, Printer } from "lucide-react";

interface AtsExportActionsProps {
  onDownloadWord: () => void;
  onDownloadPdf: () => void;
  onReset: () => void;
}

export function AtsExportActions({
  onDownloadWord,
  onDownloadPdf,
  onReset,
}: AtsExportActionsProps) {
  return (
    <div className="card p-6 bg-linear-to-r from-indigo-900 to-slate-900 text-white border-0 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1 text-center sm:text-left">
        <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
          <Download className="w-5 h-5 text-indigo-400" />
          <span>Export Overall ATS Audit Report</span>
        </h3>
        <p className="text-xs text-slate-300">
          Download formatted feedback to share with career coaches or review
          offline.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Audit Another</span>
        </button>

        <button
          type="button"
          onClick={onDownloadWord}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <FileText className="w-4 h-4" />
          <span>Download Word (.doc)</span>
        </button>

        <button
          type="button"
          onClick={onDownloadPdf}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Download / Print PDF</span>
        </button>
      </div>
    </div>
  );
}
