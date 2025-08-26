import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 3);

    const topPlans = await Subscription.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lte: now },
        },
      },
      {
        $group: {
          _id: "$planId",
          count: { $sum: 1 },
          planName: { $first: "$planName" },
          price: { $first: "$price" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 3, // only the top plan
      },
    ]);

    console.log(topPlans);

    return NextResponse.json({
      status : 200,
      success: true,
      data: topPlans,
      message: "Top subscription plans fetched successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Error fetching top subscription plans",
      error: error instanceof Error ? error.message : "Unknown error",
    },{
      status : 500
    });
  }
}
