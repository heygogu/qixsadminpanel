// app/page-management/view/[slug]/page.tsx
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import Link from "next/link";

// Mock data function - replace with actual data fetching
const getPageContent = (slug: string) => {
  slug = decodeURIComponent(slug);
  const contents = {
    "about-us": `
      <h2>About Us</h2>
      <p>We are a company dedicated to excellence...</p>
    `,
    "privacy-policy": `
      <h2>Privacy Policy</h2>
      <p>Last updated: January 12, 2024</p>
      <p>This Privacy Policy describes how we collect, use, and handle your personal information...</p>
    `,
    "terms-&-conditions": `
      <h2>Terms and Conditions</h2>
      <p>Last updated: January 12, 2024</p>
      <p>Please read these Terms and Conditions carefully...</p>
    `,
  };
  return contents[slug] || "Content not found";
};

export default function ViewPage({ params }: { params: { slug: string } }) {
  const content = getPageContent(params.slug);
  const title = decodeURIComponent(params.slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <DashboardLayout>
      <PageContainer>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">{title}</CardTitle>
            <Link href="/settings/page-management">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </ScrollArea>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  );
}
