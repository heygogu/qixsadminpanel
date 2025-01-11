"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Save } from "lucide-react";
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import PageContainer from '@/components/layouts/page-container';
// Dynamically import ReactQuill to prevent SSR issues
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <QuillLoader />,
});

// Dummy content
const dummyPrivacyPolicy = `
<h2>Privacy Policy</h2>
<p>Last updated: January 12, 2024</p>
<p>This Privacy Policy describes how we collect, use, and handle your personal information when you use our services.</p>
<h3>1. Information Collection</h3>
<p>We collect information that you provide directly to us, including:</p>
<ul>
  <li>Account information (name, email, etc.)</li>
  <li>Payment information</li>
  <li>Communication data</li>
</ul>
<h3>2. Use of Information</h3>
<p>We use the collected information to:</p>
<ul>
  <li>Provide and maintain our services</li>
  <li>Process your transactions</li>
  <li>Send you important updates</li>
</ul>
`;

const dummyTerms = `
<h2>Terms and Conditions</h2>
<p>Last updated: January 12, 2024</p>
<p>Please read these Terms and Conditions carefully before using our services.</p>
<h3>1. Acceptance of Terms</h3>
<p>By accessing or using our services, you agree to be bound by these Terms and Conditions.</p>
<h3>2. User Responsibilities</h3>
<p>You are responsible for:</p>
<ul>
  <li>Maintaining account security</li>
  <li>Complying with all applicable laws</li>
  <li>Providing accurate information</li>
</ul>
`;

// Quill editor configuration
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
];

// Loading skeleton component for Quill
const QuillLoader = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
    </div>
);

const PageManagement = () => {
    const [loading, setLoading] = useState(true);
    const [privacyPolicy, setPrivacyPolicy] = useState(dummyPrivacyPolicy);
    const [terms, setTerms] = useState(dummyTerms);
    const [saving, setSaving] = useState(false);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = async (type) => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
    };

    return (
        <PageContainer>
            <div className="grid grid-cols-1 col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-6 w-6" />
                            Page Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="privacy" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                                <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                            </TabsList>

                            <TabsContent value="privacy" className="space-y-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <ScrollArea className="h-[60vh]">
                                            {loading ? (
                                                <QuillLoader />
                                            ) : (
                                                <>
                                                    <ReactQuill
                                                        value={privacyPolicy}
                                                        onChange={setPrivacyPolicy}
                                                        modules={modules}
                                                        formats={formats}
                                                        theme="snow"
                                                        className="h-[calc(60vh-60px)]"
                                                    />
                                                </>
                                            )}
                                        </ScrollArea>
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                onClick={() => handleSave('privacy')}
                                                disabled={saving}
                                                className="flex items-center gap-2"
                                            >
                                                <Save className="h-4 w-4" />
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="terms" className="space-y-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <ScrollArea className="h-[60vh]">
                                            {loading ? (
                                                <QuillLoader />
                                            ) : (
                                                <>
                                                    <ReactQuill
                                                        value={terms}
                                                        onChange={setTerms}
                                                        modules={modules}
                                                        formats={formats}
                                                        theme="snow"
                                                        className="h-[calc(60vh-60px)]"
                                                    />
                                                </>
                                            )}
                                        </ScrollArea>
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                onClick={() => handleSave('terms')}
                                                disabled={saving}
                                                className="flex items-center gap-2"
                                            >
                                                <Save className="h-4 w-4" />
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

export default function DashboardPage() {
    return <DashboardLayout><PageManagement /></DashboardLayout>
}