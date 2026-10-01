import { Suspense } from "react";
import { TemplateSelectionPage } from "@/components/dashboard/resume-builder/TemplateSelectionPage";

export const metadata = {
  title: "Select Resume Template | Career Graph",
  description:
    "Choose from professionally crafted, ATS-compliant resume templates before editing your resume.",
};

export default function ResumeTemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">
              Loading Resume Templates...
            </p>
          </div>
        </div>
      }
    >
      <TemplateSelectionPage />
    </Suspense>
  );
}
