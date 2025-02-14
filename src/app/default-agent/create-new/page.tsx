"use client";
import React from "react";
import CreateAgentForm from "./create-agent-form";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layouts/page-container";

const CreateNewAgent = () => {
  const router = useRouter();
  return (
    <PageContainer>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CreateAgentForm onCancel={() => router.back()} />
      </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <CreateNewAgent />
    </DashboardLayout>
  );
}
