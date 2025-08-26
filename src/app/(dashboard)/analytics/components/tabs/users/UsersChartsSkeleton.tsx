"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UsersChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-40" /> {/* Title */}
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-32 mt-2" /> {/* Description */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end justify-around">
          {/* Fake bars for Normal vs Super */}
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="w-10 h-40 rounded-md" /> {/* big bar */}
            <Skeleton className="w-12 h-4" /> {/* label */}
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="w-10 h-28 rounded-md" /> {/* shorter bar */}
            <Skeleton className="w-12 h-4" /> {/* label */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
