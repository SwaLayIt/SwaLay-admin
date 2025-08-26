"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiGet } from "@/helpers/axiosRequest";
import { ApiResponse } from "@/interfaces/api.interface";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";
import { UsersChartSkeleton } from "./UsersChartsSkeleton";

export interface SubscriptionStats {
  count: number;
  active: number;
  expired: number;
  cancelled: number;
}

export interface UserTypeStats {
  normal?: SubscriptionStats;
  super?: SubscriptionStats;
}

export interface SubscriptionStatsData {
  all: UserTypeStats;
  [state: string]: UserTypeStats;
}

interface UsersChartProps {
  selectedState: string;
}

const subscriptionDetailsFetcher = (apiPath: string) =>
  apiGet<ApiResponse<SubscriptionStatsData>>(apiPath);

export function UsersChart({ selectedState }: UsersChartProps) {
  const { data: subscriptionStatsDataResponse, isLoading } = useSWR(
    "/api/analytics/userDetails",
    subscriptionDetailsFetcher,
    {
      revalidateIfStale: false,
      refreshInterval: 10 * 1000 * 60,
    }
  );

  // Derive userData based on selectedState
  const userData = useMemo(() => {
    if (!subscriptionStatsDataResponse?.data) return undefined;
    return subscriptionStatsDataResponse.data[selectedState];
  }, [
    subscriptionStatsDataResponse,
    selectedState,
    subscriptionStatsDataResponse?.data,
  ]);

  const chartData = [
    {
      userType: "Normal",
      count: userData?.normal?.count ?? 0,
      active: userData?.normal?.active ?? 0,
      expired: userData?.normal?.expired ?? 0,
      cancelled: userData?.normal?.cancelled ?? 0,
    },
    {
      userType: "Super",
      count: userData?.super?.count ?? 0,
      active: userData?.super?.active ?? 0,
      expired: userData?.super?.expired ?? 0,
      cancelled: userData?.super?.cancelled ?? 0,
    },
  ];

  if (isLoading) {
    return <UsersChartSkeleton />;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${label} Users`}</p>
          <p className="text-sm text-muted-foreground">{`Total: ${data.count}`}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-green-600">{`Active: ${data.active}`}</p>
            <p className="text-sm text-yellow-600">{`Expired: ${data.expired}`}</p>
            <p className="text-sm text-red-600">{`Cancelled: ${data.cancelled}`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>
          {selectedState === "all" ? "All states" : selectedState} - Normal vs
          Super users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="userType" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
