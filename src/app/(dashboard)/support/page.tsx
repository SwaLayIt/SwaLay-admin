import React from "react";
import { api } from "@/lib/apiRequest";
import SupportPageClient from "./components/SupportPageClient";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export const dynamic = "force-dynamic";

const TicketPage = async () => {
  
  try {
    const apiResponse = await api.get<{ data: SupportTicket[] }>(
      "/api/support/getAllTickets?status=pending"
    );

    const tickets = apiResponse.data || [];

    return <SupportPageClient tickets={tickets} />;
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    
    return (
      <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
        <div className="flex justify-center items-center h-full">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Failed to Load Support Tickets</h3>
                  <p className="text-sm text-muted-foreground">
                    There was an error loading the support tickets. Please try again.
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="mt-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
};

export default TicketPage;
