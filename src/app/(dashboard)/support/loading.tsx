import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SupportLoading = () => {
  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            
            {/* Table Rows */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 py-3 border-b">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportLoading;
