import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/Support';
import SupportReply from '@/models/SupportReply';

export async function GET(request: Request) {
  try {
    await connect();

    // Get the URL and search params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build the aggregation pipeline
    const aggregationPipeline: any[] = [
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "in-progress"] }, then: 2 },
                { case: { $eq: ["$status", "resolved"] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      }
    ];

    // Add status filter if provided
    if (status && status !== 'all') {
      aggregationPipeline.unshift({
        $match: { status: status }
      });
    }

    // Add sorting
    aggregationPipeline.push({ $sort: { statusOrder: 1, createdAt: -1 } });

    const tickets = await Support.aggregate(aggregationPipeline);

    // Get replies for each ticket
    const ticketsWithReplies = await Promise.all(
      tickets.map(async (ticket) => {
        const replies = await SupportReply.find({ supportId: ticket._id })
          .sort({ createdAt: 1 });
        
        // Calculate unread replies (user replies that are not read)
        const unreadReplies = replies.filter(reply => 
          reply.senderType === 'user' && !reply.isRead
        ).length;
        
        return {
          ...ticket,
          replies,
          replyCount: replies.length,
          unreadReplies
        };
      })
    );

    return NextResponse.json({
      success: true,
      status: 200,
      data: ticketsWithReplies,
      filters: {
        status: status || 'all'
      }
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
} 