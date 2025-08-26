import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const counts = await Label.aggregate([
      {
        $match: { usertype: { $in: ["normal", "super"] } },
      },
      {
        $group: {
          _id: "$usertype",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert result into { normal: number, super: number }
    const userTypeCount: { normal: number; super: number } = {
      normal: 0,
      super: 0,
    };
    counts.forEach((item) => {
      userTypeCount[item._id as "normal" | "super"] = item.count;
    });

    const verifiedCount = await Label.countDocuments({ isVerified: true });

    const activeCount = await Subscription.countDocuments({ status: "active" });

    const topPlan = await Subscription.aggregate([
      {
        $group: {
          _id: "$planName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // highest first
      { $limit: 1 }, // only top 1
      { $project: { _id: 0, planName: "$_id", count: 1 } },
    ]);

    const totalSubscriptions = await Subscription.countDocuments()

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Data fetched successfully",
      data: {
        userTypeCount,
        verifiedCount,
        activeCount,
        topPlan : topPlan[0],
        totalSubscriptions
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
