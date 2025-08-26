"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";
import React, { useState } from "react";

import { apiGet } from "@/helpers/axiosRequest";
import { ApiResponse } from "@/interfaces/api.interface";
import useSWR from "swr";
import { DashboardHeader } from "./components/DashBoardHeader";
import { MainCards } from "./components/MainCards";
import { OverviewCharts } from "./components/tabs/overview/OverviewCharts";
import { SubscriptionsChart } from "./components/tabs/subscriptions/SubscriptionChart";
import { SubscriptionsFilters } from "./components/tabs/subscriptions/SubscriptionFiilters";
import { TrendsChart } from "./components/tabs/trends/TrendsChart";
import { TrendsFilters } from "./components/tabs/trends/TrendsFilters";
import { UsersChart } from "./components/tabs/users/UserChart";
import { UsersFilters } from "./components/tabs/users/UserFilters";
import { useRouter } from "next/navigation";
import { MainCardsSkeleton } from "./components/MainCardsSkeleton";

interface BasicDetails {
  userTypeCount: {
    normal: number;
    super: number;
  };
  verifiedCount: number;
  activeCount: number;
  topPlan: {
    count: number;
    planName: string;
  };
  totalSubscriptions: number;
}

const basicDetailsFetcher = (apiPath: string) =>
  apiGet<ApiResponse<BasicDetails>>(apiPath);

export default function AnalyticsDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [, setActiveTab] = useState("overview");

  // Users tab filters
  const [selectedState, setSelectedState] = useState<string>("all");

  // Subscriptions tab filters
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUserType, setSelectedUserType] = useState<string>("all");
  const [selectedTime, setSelectedTime] = useState<string>("12");

  const [trendsSelectedState, setTrendsSelectedState] = useState<string>("all");

  const refreshData = async () => {
    router.refresh();
  };

  const clearUsersFilters = () => {
    setSelectedState("all");
  };

  const clearSubscriptionsFilters = () => {
    setSelectedStatus("all");
    setSelectedUserType("all");
    setSelectedTime("6");
  };

  const clearTrendsFilters = () => {
    setTrendsSelectedState("all");
  };

  const hasUsersFilters = selectedState !== "all";
  const hasSubscriptionsFilters =
    selectedStatus !== "all" ||
    selectedUserType !== "all" ||
    selectedTime !== "12";
  const hasTrendsFilters = trendsSelectedState !== "all";

  const { data: basicDetailsResponse, isLoading } = useSWR(
    "/api/analytics/basicDetails",
    basicDetailsFetcher,
    {
      revalidateIfStale: false,
      refreshInterval: 10 * 1000 * 60,
    }
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onRefresh={refreshData} loading={loading} />

      <div className="container mx-auto px-6 py-6 space-y-6">
        {isLoading ? (
          <MainCardsSkeleton />
        ) : (
          <MainCards
            totalUsers={
              (basicDetailsResponse?.data?.userTypeCount.normal ?? 0) +
              (basicDetailsResponse?.data?.userTypeCount.super ?? 0)
            }
            verifiedCount={basicDetailsResponse?.data?.verifiedCount ?? 0}
            activeSubscriptions={basicDetailsResponse?.data?.activeCount ?? 0}
            totalSubscriptions={
              basicDetailsResponse?.data?.totalSubscriptions ?? 0
            }
            topPlan={basicDetailsResponse?.data?.topPlan!}
            userTypeCount={
              basicDetailsResponse?.data?.userTypeCount ?? {
                normal: 0,
                super: 0,
              }
            }
          />
        )}

        <Tabs
          defaultValue="overview"
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewCharts />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersFilters
              selectedState={selectedState}
              onStateChange={setSelectedState}
              onClearFilters={clearUsersFilters}
              hasActiveFilters={hasUsersFilters}
            />
            <UsersChart selectedState={selectedState} />
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <SubscriptionsFilters
              selectedStatus={selectedStatus}
              selectedUserType={selectedUserType}
              selectedTime={selectedTime}
              onStatusChange={setSelectedStatus}
              onUserTypeChange={setSelectedUserType}
              onTimeChange={setSelectedTime}
              onClearFilters={clearSubscriptionsFilters}
              hasActiveFilters={hasSubscriptionsFilters}
            />
            <SubscriptionsChart
              selectedStatus={selectedStatus}
              selectedUserType={selectedUserType}
              selectedTime={selectedTime}
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <TrendsFilters
              selectedState={trendsSelectedState}
              onStateChange={setTrendsSelectedState}
              onClearFilters={clearTrendsFilters}
              hasActiveFilters={hasTrendsFilters}
            />
            <TrendsChart selectedState={trendsSelectedState} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
