import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";

/**
 * Ticket Status Type
 * @typedef {'pending' | 'in-progress' | 'resolved'} TicketStatus
 */

/**
 * Ticket Priority Type
 * @typedef {'low' | 'medium' | 'high'} TicketPriority
 */

/**
 * Ticket Interface
 * @interface
 * @property {string} ticketId - The unique identifier for the ticket
 * @property {string} subject - The subject/title of the ticket
 * @property {boolean} isClosed - Whether the ticket is closed or open
 * @property {number} [replyCount] - Optional count of replies in the thread
 * @property {number} [unreadReplies] - Optional count of unread replies
 * @property {string} labelId - Identifier for the label/category
 * @property {string} name - Name of the user who created the ticket
 * @property {string} email - Email of the user who created the ticket
 * @property {string} message - The main content/message of the ticket
 * @property {TicketStatus} status - Current status of the ticket
 * @property {TicketPriority} priority - Priority level of the ticket
 * @property {string} createdAt - ISO string of when the ticket was created
 */
export interface Ticket {
  ticketId: string;
  subject: string;
  isClosed: boolean;
  replyCount?: number;
  unreadReplies?: number;
  labelId: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

/**
 * TicketCard Component Props
 * @interface
 * @property {Ticket} ticket - The ticket object to display
 * @property {(ticketId: string, status: TicketStatus) => void} onStatusChange - Callback when status changes
 * @property {(ticketId: string, priority: TicketPriority) => void} onPriorityChange - Callback when priority changes
 * @property {(ticketId: string) => void} onCloseTicket - Callback when closing a ticket
 * @property {(ticketId: string) => void} onViewThread - Callback when viewing thread
 * @property {Record<string, boolean>} [updating] - Optional object tracking which tickets are being updated
 * @property {string} [className] - Optional additional CSS classes
 * @property {string} [userHrefTemplate] - Optional template for user href (default: `/labels/${btoa(ticket.labelId)}`)
 * @property {boolean} [showUserInfo=true] - Optional flag to show/hide user info section
 * @property {boolean} [showMessage=true] - Optional flag to show/hide message section
 * @property {boolean} [showControls=true] - Optional flag to show/hide controls section
 * @property {boolean} [showBadges=true] - Optional flag to show/hide status/priority badges
 * @property {boolean} [showCreatedDate=true] - Optional flag to show/hide creation date
 */
interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, status: Ticket["status"]) => void;
  onPriorityChange: (ticketId: string, priority: Ticket["priority"]) => void;
  onCloseTicket: (ticketId: string) => void;
  onViewThread: (ticketId: string) => void;
  updating?: Record<string, boolean>;
  className?: string;
  userHrefTemplate?: string;
  showUserInfo?: boolean;
  showMessage?: boolean;
  showControls?: boolean;
  showBadges?: boolean;
  showCreatedDate?: boolean;
}

/**
 * TicketCard Component
 * 
 * A reusable component for displaying support tickets with interactive controls.
 * 
 * @example
 * // Basic usage
 * <TicketCard
 *   ticket={ticketData}
 *   onStatusChange={(id, status) => updateStatus(id, status)}
 *   onPriorityChange={(id, priority) => updatePriority(id, priority)}
 *   onCloseTicket={(id) => closeTicket(id)}
 *   onViewThread={(id) => viewThread(id)}
 * />
 * 
 * @example
 * // Customized usage
 * <TicketCard
 *   ticket={ticketData}
 *   onStatusChange={handleStatusChange}
 *   onPriorityChange={handlePriorityChange}
 *   onCloseTicket={handleCloseTicket}
 *   onViewThread={handleViewThread}
 *   className="custom-class"
 *   userHrefTemplate={`/custom-path/${encodeURIComponent(ticket.labelId)}`}
 *   showControls={true}
 *   showBadges={false}
 * />
 * 
 * @param {TicketCardProps} props - Component properties
 * @returns {JSX.Element} Rendered ticket card component
 */
export function TicketCard({
  ticket,
  onStatusChange,
  onPriorityChange,
  onCloseTicket,
  onViewThread,
  updating = {},
  className = "",
  userHrefTemplate,
  showUserInfo = true,
  showMessage = true,
  showControls = true,
  showBadges = true,
  showCreatedDate = true
}: TicketCardProps): JSX.Element {
  const isUpdating = updating[ticket.ticketId];
  
  // Determine badge classes based on status and priority
  const statusBadgeClass = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800"
  }[ticket.status];

  const priorityBadgeClass = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  }[ticket.priority];

  // Generate user href based on template or default
  const getUserHref = () => {
    if (userHrefTemplate) {
      return userHrefTemplate.replace('{labelId}', ticket.labelId);
    }
    return `/labels/${btoa(ticket.labelId)}`;
  };

  return (
    <Card key={ticket.ticketId} className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold">{ticket.subject}</span>
            <Badge
              className={
                ticket.isClosed
                  ? "bg-gray-100 text-gray-800"
                  : "bg-green-100 text-green-800"
              }
            >
              {ticket.isClosed ? "Closed" : "Open"}
            </Badge>
            <Badge variant="outline" className="bg-gray-50">
              #{ticket.ticketId || "No ID"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewThread(ticket.ticketId)}
              className="relative"
              disabled={isUpdating}
              aria-label={`View thread for ticket ${ticket.ticketId} with ${ticket.replyCount || 0} replies`}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              View Thread ({ticket.replyCount || 0})
              {ticket.unreadReplies && ticket.unreadReplies > 0 && (
                <div 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label={`${ticket.unreadReplies} unread replies`}
                >
                  {ticket.unreadReplies > 9 ? "9+" : ticket.unreadReplies}
                </div>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User Info Section */}
          {showUserInfo && (
            <div>
              <h3 className="font-semibold mb-2">User Info:</h3>
              <p className="text-sm text-gray-600">
                <a
                  href={getUserHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600"
                >
                  {ticket.name}
                </a>
              </p>
              <p className="text-sm text-gray-600">{ticket.email}</p>
            </div>
          )}
          
          {/* Message Section */}
          {showMessage && (
            <div>
              <h3 className="font-semibold mb-2">Message:</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {ticket.message}
              </p>
            </div>
          )}
          
          {/* Controls Section */}
          {/* {showControls && (
            <div>
              <h3 className="font-semibold mb-2">Controls:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Select
                    value={ticket.status}
                    onValueChange={(value: Ticket["status"]) =>
                      onStatusChange(ticket.ticketId, value)
                    }
                    disabled={isUpdating || ticket.isClosed}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Priority:</span>
                  <Select
                    value={ticket.priority}
                    onValueChange={(value: Ticket["priority"]) =>
                      onPriorityChange(ticket.ticketId, value)
                    }
                    disabled={isUpdating || ticket.isClosed}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {!ticket.isClosed && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCloseTicket(ticket.ticketId)}
                    disabled={isUpdating}
                  >
                    Close Ticket
                  </Button>
                )}
              </div>
            </div>
          )} */}

            {/* Badges Section */}
        {showBadges && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={statusBadgeClass}>
              {ticket.status}
            </Badge>
            <Badge className={priorityBadgeClass}>
              {ticket.priority}
            </Badge>
            <Badge
              className={
                ticket.isClosed
                  ? "bg-gray-100 text-gray-800"
                  : "bg-green-100 text-green-800"
              }
            >
              {ticket.isClosed ? "Closed" : "Open"}
            </Badge>
          </div>
        )}
        
        {/* Created Date */}
        {showCreatedDate && (
          <div className="text-sm text-gray-400">
            Created: {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
        )}

        </div>
        
      
      </CardContent>
    </Card>
  );
}

export default TicketCard;