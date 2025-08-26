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
import { AlertCircle, BarChart3 } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import useSWR from "swr";

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

interface SubscriptionDetails {
  userCountBySubscription: {
    normalCount: number;
    superCount: number;
  };
  subscriptionStatusTotals: {
    activeSubscriptions: number;
    expiredSubscriptions: number;
    cancelledSubscriptions: number;
  };
}

interface SubscriptionDetails {
  userCountBySubscription: {
    normalCount: number;
    superCount: number;
  };
  subscriptionStatusTotals: {
    activeSubscriptions: number;
    expiredSubscriptions: number;
    cancelledSubscriptions: number;
  };
}

const overviewFetcher = (apiPath:string)=>apiGet<ApiResponse<SubscriptionDetails>>(apiPath)

const DataPlaceholder = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Card className="border-border/50">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80 flex flex-col items-center justify-center text-muted-foreground">
        <BarChart3 className="h-16 w-16 mb-4 opacity-50" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">No Data Available</p>
          <p className="text-sm">
            Data is currently being loaded or unavailable
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span className="text-sm font-medium text-muted-foreground">
              --
            </span>
          </div>
          <p className="text-lg font-bold text-muted-foreground">--</p>
          <p className="text-xs text-muted-foreground">--%</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span className="text-sm font-medium text-muted-foreground">
              --
            </span>
          </div>
          <p className="text-lg font-bold text-muted-foreground">--</p>
          <p className="text-xs text-muted-foreground">--%</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Count:{" "}
          <span className="font-medium text-foreground">
            {data.value.toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Percentage:{" "}
          <span className="font-medium text-foreground">
            {((data.value / data.payload.total) * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function OverviewCharts() {

    const {data : subscriptionDetailsResponse,isLoading} = useSWR("/api/analytics/subscriptionDetails",overviewFetcher,{
      revalidateIfStale : false,
      refreshInterval : 10*1000*60
    })

  // if(isLoading){
  //   return <OverviewChartsSkeleton/>
  // }

  if (!subscriptionDetailsResponse?.data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataPlaceholder
          title="Subscription Status"
          description="Distribution of subscription statuses"
        />
        <DataPlaceholder
          title="User Types"
          description="Distribution of normal vs super users"
        />
      </div>
    );
  }

  const subscriptionStatusData = [
    {
      name: "Active",
      value: subscriptionDetailsResponse.data?.subscriptionStatusTotals?.activeSubscriptions,
      color: "#10b981",
    },
    {
      name: "Expired",
      value:
        subscriptionDetailsResponse.data?.subscriptionStatusTotals?.expiredSubscriptions,
      color: "#f59e0b",
    },
    {
      name: "Cancelled",
      value:
        subscriptionDetailsResponse.data?.subscriptionStatusTotals?.cancelledSubscriptions,
      color: "#ef4444",
    },
  ];

  const userTypeData = [
    {
      name: "Normal",
      value: subscriptionDetailsResponse.data?.userCountBySubscription?.normalCount,
      color: "#3b82f6",
    },
    {
      name: "Super",
      value: subscriptionDetailsResponse.data?.userCountBySubscription?.superCount,
      color: "#8b5cf6",
    },
  ];

  const statusTotal = subscriptionStatusData.reduce(
    (sum, item) => sum + (item.value ?? 0),
    0
  );
  const userTypeTotal = userTypeData.reduce(
    (sum, item) => sum + (item?.value ?? 0),
    0
  );

  const statusDataWithTotal = subscriptionStatusData.map((item) => ({
    ...item,
    total: statusTotal,
  }));
  const userTypeDataWithTotal = userTypeData.map((item) => ({
    ...item,
    total: userTypeTotal,
  }));

  if (statusTotal === 0 && userTypeTotal === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataPlaceholder
          title="Subscription Status"
          description="No subscription data found"
        />
        <DataPlaceholder title="User Types" description="No user data found" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subscription Status Pie Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Subscription Status
          </CardTitle>
          <CardDescription>
            Distribution of subscription statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusTotal > 0 ? (
            <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDataWithTotal}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusDataWithTotal.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry: any) => (
                        <span
                          style={{ color: entry.color }}
                          className="text-sm font-medium"
                        >
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                {subscriptionStatusData.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <p className="text-lg font-bold">
                      {item.value!.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((item.value! / statusTotal) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">No subscription status data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Type Pie Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">User Types</CardTitle>
          <CardDescription>
            Distribution of normal vs super users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userTypeTotal > 0 ? (
            <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userTypeDataWithTotal}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {userTypeDataWithTotal.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry: any) => (
                        <span
                          style={{ color: entry.color }}
                          className="text-sm font-medium"
                        >
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                {userTypeData.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <p className="text-lg font-bold">
                      {item.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((item.value / userTypeTotal) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">No user type data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
