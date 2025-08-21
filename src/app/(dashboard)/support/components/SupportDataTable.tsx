"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Eye } from "lucide-react";

export type SupportTicket = {
    name: string;
    email: string;
    subject: string;
    message: string;
    labelId?: string; 
    _id: string;
    ticketId: string;
    __v: number;
    status: "pending" | "in-progress" | "resolved";
    priority: 'low' | 'medium' | 'high';
    isClosed: boolean;
    replies?: any[];
    replyCount?: number;
    unreadReplies?: number;
    createdAt: string;
};

interface SupportDataTableProps {
    data: SupportTicket[];
    onViewThread?: (ticketId: string) => void;
    className?: string;
}

export const supportColumns = (
    onViewThread?: (ticketId: string) => void
): ColumnDef<SupportTicket>[] => [
    {
        accessorKey: "srno",
        header: "Sr No",
        cell: (info) => info.row.index + 1,
    },
    {
        accessorKey: "ticketId",
        header: "Ticket ID",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="font-medium">
                    #{data.ticketId}
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="space-y-1">
                    <div className="font-medium">
                        {data.labelId ? (
                            <a 
                                href={`/labels/${btoa(data.labelId)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-blue-600"
                            >
                                {data.name}
                            </a>
                        ) : (
                            data.name
                        )}
                    </div>
                    <div className="text-sm text-gray-500">{data.email}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="max-w-[200px]">
                    <div className="font-medium truncate">{data.subject}</div>
                    <div className="text-sm text-gray-500 truncate">{data.message}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const data = row.original;
            const priorityColors = {
                low: "bg-green-100 text-green-800",
                medium: "bg-yellow-100 text-yellow-800",
                high: "bg-red-100 text-red-800"
            };
            return (
                <Badge className={priorityColors[data.priority]}>
                    {data.priority}
                </Badge>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const data = row.original;
            const statusColors: Record<string, string> = {
                pending: "bg-yellow-100 text-yellow-800",
                "in-progress": "bg-blue-100 text-blue-800",
                resolved: "bg-green-100 text-green-800"
            };
            return (
                <Badge className={statusColors[data.status] || "bg-gray-100 text-gray-800"}>
                    {data.status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "replyCount",
        header: "Replies",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex items-center gap-2">
                    <span className="text-sm">{data.replyCount || 0}</span>
                    {data.unreadReplies && data.unreadReplies > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                            {data.unreadReplies > 9 ? '9+' : data.unreadReplies}
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "isClosed",
        header: "State",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <Badge className={data.isClosed ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}>
                    {data.isClosed ? "Closed" : "Open"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="text-sm text-gray-500">
                    {new Date(data.createdAt).toLocaleDateString()}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center gap-2">
                    {onViewThread && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewThread(data.ticketId)}
                            className="relative"
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                            {data.unreadReplies && data.unreadReplies > 0 && (
                                <div 
                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                                >
                                    {data.unreadReplies > 9 ? "9+" : data.unreadReplies}
                                </div>
                            )}
                        </Button>
                    )}
                </div>
            );
        },
    },
];

export function SupportDataTable({ 
    data, 
    onViewThread,
    className = ""
}: SupportDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");

    const columns = supportColumns(onViewThread);

    // Filter data based on status filter
    const filteredData = React.useMemo(() => {
        if (statusFilter === "all") {
            return data;
        }
        return data.filter((ticket) => ticket.status === statusFilter);
    }, [data, statusFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase();
            const name = row.getValue("name")?.toString().toLowerCase() || "";
            const email = row.original.email?.toLowerCase() || "";
            const subject = row.getValue("subject")?.toString().toLowerCase() || "";
            const ticketId = row.getValue("ticketId")?.toString().toLowerCase() || "";
            
            return name.includes(searchValue) || 
                   email.includes(searchValue) || 
                   subject.includes(searchValue) || 
                   ticketId.includes(searchValue);
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 50,
            },
        },
    });

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search tickets..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                    Showing {table.getFilteredRowModel().rows.length} of {data.length} tickets
                </div>
            </div>
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow 
                                    key={row.id} 
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-gray-50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
