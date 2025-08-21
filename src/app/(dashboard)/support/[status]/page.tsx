"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import SupportThread from "../components/SupportThread";
import Link from "next/link";
import { apiGet } from "@/helpers/axiosRequest";
import { SupportDataTable } from "../components/SupportDataTable";

interface SupportTicket {
  _id: string;
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  isClosed: boolean;
  replies?: any[];
  replyCount?: number;
  unreadReplies?: number;
  createdAt: string;
  labelId: string;
  __v: number;
}

interface StatusPageProps {
  params: {
    status: string;
  };
}

// Create a fetcher function for SWR
const createFetcher = (status: string) => (url: string) =>
  apiGet(`${url}?status=${status}`).then((res: any) => {
    if (!res.success) throw new Error("Failed to fetch tickets");
    return res.data;
  });

// Status configuration
const statusConfig = {
  pending: {
    title: "Pending Tickets",
    description: "Tickets awaiting response",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  "in-progress": {
    title: "In Progress Tickets",
    description: "Tickets currently being worked on",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  resolved: {
    title: "Resolved Tickets",
    description: "Successfully resolved tickets",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  }
};

export default function StatusPage({ params }: StatusPageProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  const status = params.status as keyof typeof statusConfig;
  const config = statusConfig[status] || statusConfig.pending;

  // SWR data fetching with status filter
  const {
    data: tickets,
    error,
    isLoading,
  } = useSWR<SupportTicket[]>(
    `/api/support/getAllTickets`,
    createFetcher(status),
    {
      refreshInterval: 30000, // 30 seconds
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading {config.title.toLowerCase()}...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading {config.title.toLowerCase()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Link href="/support">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Tickets
              </Button>
            </Link>
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${config.color}`}>
              {config.title}
            </h1>
            <p className="text-muted-foreground">
              {config.description}
            </p>
          </div>
        </div>
        <Link href="/support/create-ticket">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Status-specific stats */}
      <div className={`mb-8 p-6 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${config.color}`}>
              {tickets?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total {status} tickets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {tickets?.filter((t) => t.priority === "high").length || 0}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tickets?.filter((t) => t.unreadReplies && t.unreadReplies > 0).length || 0}
            </div>
            <div className="text-sm text-gray-600">With Unread Replies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {tickets?.filter((t) => !t.isClosed).length || 0}
            </div>
            <div className="text-sm text-gray-600">Open Tickets</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <SupportDataTable
        data={tickets || []}
        onViewThread={(ticketId) => setSelectedTicket(ticketId)}
      />

      {/* Support Thread Modal */}
      {selectedTicket && (
        <SupportThread
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={() => mutate(`/api/support/getAllTickets?status=${status}`)}
        />
      )}
    </div>
  );
}
