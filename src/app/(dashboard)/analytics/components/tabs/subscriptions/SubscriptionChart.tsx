"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/helpers/axiosRequest";
import { ApiResponse } from "@/interfaces/api.interface";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useSWR from "swr";

export interface PlanCount {
  planName: string;
  count: number;
}

export interface SubscriptionStatus {
  normal: PlanCount[];
  super: PlanCount[];
}

export interface SubscriptionDuration {
  active: SubscriptionStatus;
  cancelled: SubscriptionStatus;
  expired: SubscriptionStatus;
}

export interface PlanDetails {
  1: SubscriptionDuration;
  3: SubscriptionDuration;
  6: SubscriptionDuration;
  9: SubscriptionDuration;
  12: SubscriptionDuration;
}

interface SubscriptionsChartProps {
  selectedStatus: string
  selectedUserType: string
  selectedTime: string // "1" | "3" | "6" | "9" | "12"
}

const planDetailsFetcher = (apiPath:string)=>apiGet<ApiResponse<PlanDetails>>(apiPath)

export function SubscriptionsChart({ selectedStatus, selectedUserType, selectedTime }: SubscriptionsChartProps) {


  const {data : planDetailsResponse} = useSWR("/api/analytics/planDetails",planDetailsFetcher,{
    revalidateIfStale : false,
    refreshInterval : 10*1000*60
  })

  // Pick the right bucket, fallback to "6 months" if invalid
  const timeData = planDetailsResponse?.data?.[Number(selectedTime) as keyof PlanDetails] ?? planDetailsResponse?.data?.[12]

  let chartData: any[] = []

  if (timeData) {
    if (selectedStatus === "all" && selectedUserType === "all") {
      // Combine all data
      const planCounts: { [key: string]: number } = {}
      Object.values(timeData).forEach((statusData) => {
        Object.values(statusData).forEach((userTypeData) => {
          (userTypeData as PlanCount[]).forEach((plan: PlanCount) => {
            planCounts[plan.planName] = (planCounts[plan.planName] || 0) + plan.count
          })
        })
      })
      chartData = Object.entries(planCounts).map(([planName, count]) => ({ planName, count }))
    } else if (selectedStatus !== "all" && selectedUserType === "all") {
      // Filter by status only
      const statusData = timeData[selectedStatus as keyof typeof timeData]
      const planCounts: { [key: string]: number } = {}
      Object.values(statusData ?? {}).forEach((userTypeData) => {
        userTypeData.forEach((plan: PlanCount) => {
          planCounts[plan.planName] = (planCounts[plan.planName] || 0) + plan.count
        })
      })
      chartData = Object.entries(planCounts).map(([planName, count]) => ({ planName, count }))
    } else if (selectedStatus === "all" && selectedUserType !== "all") {
      // Filter by user type only
      const planCounts: { [key: string]: number } = {}
      Object.values(timeData).forEach((statusData) => {
        const userTypeData = statusData[selectedUserType as keyof typeof statusData]
        userTypeData.forEach((plan: PlanCount) => {
          planCounts[plan.planName] = (planCounts[plan.planName] || 0) + plan.count
        })
      })
      chartData = Object.entries(planCounts).map(([planName, count]) => ({ planName, count }))
    } else {
      // Filter by both status and user type
      const statusData = timeData[selectedStatus as keyof typeof timeData]
      const userTypeData = statusData?.[selectedUserType as keyof typeof statusData]
      chartData = (userTypeData ?? []).map((plan) => ({ planName: plan.planName, count: plan.count }))
    }
  }

  // chartData = chartData.sort((a, b) => b.count - a.count).slice(0, 10) // Top 10 plans

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Subscription Plans</CardTitle>
        <CardDescription>
          Most subscribed plans in the last {selectedTime} month(s)
          {selectedStatus !== "all" && ` - ${selectedStatus} subscriptions`}
          {selectedUserType !== "all" && ` - ${selectedUserType} users`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="planName" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground">No data available for this selection.</p>
        )}
      </CardContent>
    </Card>
  )
}
