import React from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { KeyManagementView } from "@/components/views/key-management-view";
import PageContainer from "@/components/layouts/page-container";

const KeyManagement = () => {
  return (
    <PageContainer>
      <KeyManagementView />
    </PageContainer>
  );
};

// export default PhoneSettings

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <KeyManagement />
    </DashboardLayout>
  );
}
