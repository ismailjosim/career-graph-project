import { Suspense } from "react";
import { ResumeBuilderStudio } from "@/components/dashboard/resume-builder";

export const metadata = {
  title: "Resume Builder Studio | Career Graph",
  description:
    "Build ATS-friendly, multi-template resumes with real-time live preview, AI bullet point enhancement, and instant vector PDF export.",
};

export default function ResumeBuilderPage() {
  return (
    <div className="-m-3 sm:-m-4 md:-m-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-500">
                Loading Resume Builder Studio...
              </p>
            </div>
          </div>
        }
      >
        <ResumeBuilderStudio />
      </Suspense>
    </div>
  );
}
