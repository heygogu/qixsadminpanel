import EditAgentForm from "@/components/common/EditAgentTemplate";
import EditDefaultAgent from "@/components/common/EditDefaultAgent";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import { cn } from "@/lib/utils";
import React from "react";

const EditAgentTemplateCompo = () => {
  return (
    <PageContainer>
      <div
        className={cn(
          "animate-in fade-in-50 grid grid-cols-1 duration-500 ",
          "slide-in-from-bottom-5"
        )}
      >
        <div className="col-span-12">
          <EditDefaultAgent />;
        </div>
      </div>
    </PageContainer>
  );
};

export default function EditAgentTemplate() {
  return (
    <DashboardLayout>
      <EditAgentTemplateCompo />
    </DashboardLayout>
  );
}
