// app/page-management/edit/[slug]/page.tsx
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
import { get } from "http";

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

export default function EditPage({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [pageSlug, setPageSlug] = useState("");
  const getPageContent = async () => {
    let realSlug = "";
    if (params.slug === "privacy-policy") {
      realSlug = "PRIVACY_POLICY";
    } else if (params.slug === "terms-&-conditions") {
      realSlug = "TERM_AND_CONDITIONS";
    } else if (params.slug === "about-us") {
      realSlug = "ABOUT_US";
    }
    try {
      if (!realSlug) {
        console.error("Invalid page slug");
        return;
      }
      setPageSlug(realSlug);
      const apiRes = await henceforthApi.SuperAdmin.getPageContent(realSlug);
      if (apiRes?.data?.[0]) {
        setContent(apiRes.data[0]);
      }
    } catch (error) {
      console.error("Error fetching page content:", error);
    }
  };

  useEffect(() => {
    getPageContent();
  }, [params.slug]);

  const title = decodeURIComponent(params.slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call

    //   "_id": "string",
    // "image_url": "content.png",
    // "title": "Title...",
    // "page_type": "ABOUT_US",
    // "description": "content description",
    // "page_url": "www.google.com"
    const info = {
      image_url: "content.png",
      title: title,
      page_type: pageSlug,
      description: content,
      page_url: "www.google.com",
    };
    try {
      const apiRes = await henceforthApi.SuperAdmin.updatePageContent(info);
      console.log(apiRes);
    } catch (error) {
      console.error(error);
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
              {title}
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
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                theme="snow"
                className="h-[calc(60vh-60px)]"
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  );
}
