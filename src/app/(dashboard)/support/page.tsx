"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SupportThread from "./components/SupportThread";
import Link from "next/link";
import { apiGet } from "@/helpers/axiosRequest";
import TicketStatsDashboard from "./components/TicketStatsDashboard";
import { SupportDataTable } from "./components/SupportDataTable";

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

// Create a fetcher function for SWR
const fetcher = (url: string) =>
  apiGet(url).then((res: any) => {
    if (!res.success) throw new Error("Failed to fetch tickets");
    return res.data;
  });

export default function MyTickets() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // SWR data fetching
  const {
    data: tickets,
    error,
    isLoading,
  } = useSWR<SupportTicket[]>("/api/support/getAllTickets?status=pending", fetcher, {
    refreshInterval: 30000, // 30 seconds
    revalidateOnFocus: true,
    shouldRetryOnError: true,
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading tickets</div>;
  }

  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage and respond to support tickets
          </p>
        </div>
        <Link href="/support/create-ticket">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </Link>
      </div>

      <TicketStatsDashboard 
        total={tickets?.length || 0}
        pending={tickets?.filter((t) => t.status === "pending").length || 0}
        inProgress={tickets?.filter((t) => t.status === "in-progress").length || 0}
        resolved={tickets?.filter((t) => t.status === "resolved").length || 0}
      />


      <SupportDataTable
        data={tickets || []}
        onViewThread={(ticketId) => setSelectedTicket(ticketId)}
      />

      {selectedTicket && (
        <SupportThread
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={() => mutate("/api/support/getAllTickets")}
        />
      )}
      
    </div>
  );
}
