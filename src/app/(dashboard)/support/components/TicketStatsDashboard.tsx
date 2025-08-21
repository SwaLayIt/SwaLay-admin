import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import Link from "next/link";


interface TicketStatsDashboardProps {
  total?: number;
  pending?: number;
  inProgress?: number;
  resolved?: number;
  className?: string;
}

const TicketStatsDashboard: React.FC<TicketStatsDashboardProps> = ({
  total = 0,
  pending = 0,
  inProgress = 0,
  resolved = 0,
  className = "",
}) => {
  // Calculate percentages
  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className={className}>
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tickets */}
        <Card className="border-l-4 border-l-blue-500">
            <Link href="/support/all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
          </Link>
        </Card>

        {/* Pending Tickets */}
        <Card className="border-l-4 border-l-yellow-500">
        <Link href="/support/pending">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pending}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {getPercentage(pending)}% of total
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="h-6 w-6 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
          </Link>
        </Card>

        {/* In Progress Tickets */}
        <Card className="border-l-4 border-l-orange-500">
        <Link href="/support/in-progress">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{inProgress}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {getPercentage(inProgress)}% of total
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="h-6 w-6 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
          </Link>
        </Card>

        {/* Resolved Tickets */}
        <Card className="border-l-4 border-l-green-500">
        <Link href="/support/resolved">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-gray-900">{resolved}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {getPercentage(resolved)}% of total
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="h-6 w-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
          </Link>
        </Card>
      </div>

   
    </div>
  );
};

export default TicketStatsDashboard;
