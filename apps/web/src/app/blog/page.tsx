import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { withCanonical } from "@/config/site";

export const metadata: Metadata = {
  title: "Essay",
  description: "Legacy route redirect to the current essay index.",
  alternates: {
    canonical: withCanonical("/essay"),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function BlogLegacyPage(): never {
  redirect("/de/essay");
}
