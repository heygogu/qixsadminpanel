// app/page-management/view/[slug]/page.tsx
"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import Link from "next/link";
import henceforthApi from "@/utils/henceforthApis";

// Mock data function - replace with actual data fetching

export default function ViewPage({ params }: { params: { slug: string } }) {
  const [contentPage, setContentPage] = React.useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = React.useState(false);

  const getPageContent = async (slug: string) => {
    setLoading(true);
    try {
      const apiRes = await henceforthApi.SuperAdmin.getPageContent(slug);
      console.log(apiRes);
      const pageType = apiRes?.data?.page_type
        ?.split("_")
        ?.map(
          (word) =>
            word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()
        )
        .join(" ");
      setContentPage((prev) => ({
        ...prev,
        title: pageType,
        content: apiRes?.data?.description,
      }));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPageContent(params.slug);
  }, []);
  return (
    <DashboardLayout>
      <PageContainer>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {loading ? (
                <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
              ) : (
                contentPage?.title
              )}
            </CardTitle>
            <Link href="/settings/page-management">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: contentPage?.content }}
                />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  );
}
