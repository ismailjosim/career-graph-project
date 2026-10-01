import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Community Reviews & Testimonials - Career Graph",
  description:
    "Read verified reviews and success stories from job seekers, recruiters, and employers using Career Graph to accelerate hiring and job placement.",
};

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
