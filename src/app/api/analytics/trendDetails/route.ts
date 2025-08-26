import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const months = Array.from({ length: currentMonth - 1 }, (_, i) => i + 1);

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
          startDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear}-${currentMonth}-01`), // exclude current month
          },
        },
      },
      {
        $group: {
          _id: {
            state: "$user.state",
            month: { $month: "$startDate" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Prepare result structure
    const result: Record<string, Record<number, number>> = {};

    stats.forEach((item) => {
      const { state, month } = item._id;
      if (!result[state]) {
        result[state] = {};
        months.forEach((m) => {
          result[state][m] = 0; // initialize months
        });
      }
      result[state][month] = item.count;
    });

    // --- Add "all" key ---
    const allTotals: Record<number, number> = {};
    months.forEach((m) => {
      allTotals[m] = 0; // initialize
    });

    Object.values(result).forEach((stateData) => {
      months.forEach((m) => {
        allTotals[m] += stateData[m] || 0;
      });
    });

    result["all"] = allTotals;

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
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
