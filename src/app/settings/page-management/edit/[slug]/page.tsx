"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenSquare, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import "react-quill/dist/quill.snow.css";
import henceforthApi from "@/utils/henceforthApis";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/providers/Provider";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <QuillLoader />,
});

const QuillLoader = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
];

export default function EditPage({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getPageContent = async () => {
    setLoading(true);
    try {
      const apiRes = await henceforthApi.SuperAdmin.getPageContent(
        params?.slug
      );
      const pageType = apiRes?.data?.page_type
        ?.split("_")
        ?.map(
          (word) =>
            word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()
        )
        .join(" ");
      setContent({
        title: pageType,
        content: apiRes?.data?.description,
      });
    } catch (error) {
      console.error("Error fetching page content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPageContent();
  }, [params.slug]);

  const router = useRouter();
  const { Toast } = useGlobalContext();
  const handleSave = async () => {
    setSaving(true);
    const info = {
      description: content.content,
      _id: params.slug,
    };
    try {
      const apiRes = await henceforthApi.SuperAdmin.updatePageContent(info);
      console.log(apiRes);
      Toast.success("Content saved successfully");
      router.push("/settings/page-management");
    } catch (error) {
      console.error(error);
      Toast.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PenSquare className="h-6 w-6" />
              {loading ? <Skeleton className="h-6 w-32" /> : content.title}
            </CardTitle>
            <div className="flex gap-2">
              <Link href="/settings/page-management">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to List
                </Button>
              </Link>
              <Button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              {loading ? (
                <QuillLoader />
              ) : (
                <ReactQuill
                  value={content.content}
                  onChange={(value) =>
                    setContent((prev) => ({ ...prev, content: value }))
                  }
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  className="h-[calc(60vh-60px)]"
                />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  );
}
