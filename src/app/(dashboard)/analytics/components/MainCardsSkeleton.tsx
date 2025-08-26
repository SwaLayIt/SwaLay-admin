import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MainCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {/* Total Users */}
      <Card className="border-l-4 border-l-chart-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Skeleton className="h-4 w-20" />
          </CardTitle>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>

      {/* Verified Users */}
      <Card className="border-l-4 border-l-chart-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Skeleton className="h-4 w-28" />
          </CardTitle>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-2 w-full rounded-full" />
        </CardContent>
      </Card>

      {/* Active Subscriptions */}
      <Card className="border-l-4 border-l-chart-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Skeleton className="h-4 w-32" />
          </CardTitle>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-4 w-28" />
        </CardContent>
      </Card>

      {/* Top Plan */}
      <Card className="border-l-4 border-l-chart-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Skeleton className="h-4 w-20" />
          </CardTitle>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-28 mb-2" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
}