"use client";
import Link from 'next/link';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Plus, Inbox } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import TicketStatsDashboard from './TicketStatsDashboard';
import { SupportDataTable } from './SupportDataTable';
import SupportThread from './SupportThread';

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

  
const SupportPageClient = ({tickets}: {tickets: SupportTicket[]}) => {

  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const hasTickets = tickets && tickets.length > 0;

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

      {hasTickets ? (
        <SupportDataTable
          data={tickets || []}
          onViewThread={(ticketId) => setSelectedTicket(ticketId)}
        />
      ) : (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                There are no support tickets at the moment. When customers create tickets, they will appear here.
              </p>
              <Link href="/support/create-ticket">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

       {/* {selectedTicket && (
        <SupportThread
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={() => mutate("/api/support/getAllTickets")}
        />
      )}  */}
      
    </div>
  )
}

export default SupportPageClient