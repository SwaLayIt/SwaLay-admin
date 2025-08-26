import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const today = new Date();
    const keys = [1, 3, 6, 9, 12];

    // Pre-build result structure
    const result: any = {};
    keys.forEach((k) => {
      result[k] = {
        active: { normal: [], super: [] },
        cancelled: { normal: [], super: [] },
        expired: { normal: [], super: [] },
      };
    });

    // Fetch all subs from last 12 months only
    const last12Months = new Date();
    last12Months.setMonth(today.getMonth() - 12);

    const stats = await Subscription.aggregate([
      {
        $addFields: {
          userObjectId: { $toObjectId: "$userId" },
        },
      },
      {
        $lookup: {
          from: "labels",
          localField: "userObjectId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          startDate: { $gte: last12Months },
          status: { $in: ["active", "cancelled", "expired"] },
        },
      },
      {
        $project: {
          startDate: 1,
          status: 1,
          planName: 1,
          "user.usertype": 1,
          monthsAgo: {
            $dateDiff: {
              startDate: "$startDate",
              endDate: today,
              unit: "month",
            },
          },
        },
      },
    ]);

    // Place stats into appropriate buckets
    stats.forEach((item) => {
      const { status, planName } = item;
      const usertype = item.user.usertype;
      const monthsAgo = item.monthsAgo;

      keys.forEach((k) => {
        if (monthsAgo < k) {
          // falls within this bucket
          const existing = result[k][status][usertype].find(
            (p: any) => p.planName === planName
          );
          if (existing) {
            existing.count += 1;
          } else {
            result[k][status][usertype].push({ planName, count: 1 });
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Data fetched Successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
