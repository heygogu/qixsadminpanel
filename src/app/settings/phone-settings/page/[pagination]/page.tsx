import { PhoneNumberView } from "@/components/views/phone-number-view";
import React from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";

const PhoneSettings = () => {
  return (
    <PageContainer>
      <PhoneNumberView />
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PhoneSettings />
    </DashboardLayout>
  );
}
