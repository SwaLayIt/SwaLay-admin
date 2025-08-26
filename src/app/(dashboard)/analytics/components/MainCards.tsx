"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Zap, TrendingUp, Target } from "lucide-react";
import { useMemo } from "react";

interface MainCardsProps {
  totalUsers: number;
  verifiedCount: number;
  activeSubscriptions: number;
  totalSubscriptions: number;
  topPlan: { planName: string; count: number } | null;
  userTypeCount: { normal: number; super: number };
}

export function MainCards({
  totalUsers,
  verifiedCount,
  activeSubscriptions,
  totalSubscriptions,
  topPlan,
  userTypeCount,
}: MainCardsProps) {

  const verificationRate = useMemo(()=>((verifiedCount/totalUsers)*100),[verifiedCount,totalUsers])
  const activeRate = useMemo(()=>((activeSubscriptions/totalSubscriptions)*100),[activeSubscriptions,totalSubscriptions])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-chart-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Users
          </CardTitle>
          <div className="w-8 h-8 bg-chart-1/10 rounded-lg flex items-center justify-center">
            <Users className="h-4 w-4 text-chart-1" />
          </div>
        </CardHeader>
        <CardContent className="text-lg">
          <div className="text-2xl font-bold">
            {totalUsers.toLocaleString()}
          </div>
          <p className=" text-muted-foreground mt-1">
            {userTypeCount.normal > 1
              ? userTypeCount.normal + " Artists"
              : userTypeCount.normal + " Artist"}{" "}
            |{" "}
            {userTypeCount.super > 1
              ? userTypeCount.super + " Labels"
              : userTypeCount.super + " Label"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-chart-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Verified Users
          </CardTitle>
          <div className="w-8 h-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-chart-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {verifiedCount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {
              Number.isFinite(verificationRate) && <>{verificationRate}% verification rate</>
            }
          </p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-chart-2 h-2 rounded-full transition-all duration-300"
              style={{ width: `${verificationRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-chart-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Subscriptions
          </CardTitle>
          <div className="w-8 h-8 bg-chart-3/10 rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-chart-3" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activeSubscriptions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalSubscriptions} total subscriptions
          </p>
          <div className="flex items-center mt-2 text-xs">
            <Target className="h-3 w-3 text-chart-3 mr-1" />
            {
              Number.isFinite(activeRate) && <span className="text-chart-3">{activeRate}%</span>
            }
            <span className="text-muted-foreground ml-1">active rate</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-chart-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Plan
          </CardTitle>
          <div className="w-8 h-8 bg-chart-4/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-chart-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topPlan?.planName || "N/A"}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {topPlan?.count || 0} Subscribes
          </p>
          <Badge variant="secondary" className="mt-2 text-xs">
            Most Popular
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
