import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const result = await Subscription.aggregate([
      // Convert userId string -> ObjectId for lookup
      {
        $addFields: {
          userObjectId: { $toObjectId: "$userId" },
        },
      },
      // Join with Label collection
      {
        $lookup: {
          from: "labels", // collection name (always lowercase + plural usually)
          localField: "userObjectId",
          foreignField: "_id",
          as: "label",
        },
      },
      { $unwind: "$label" }, // flatten array

      // Group by state + usertype + subscription status
      {
        $group: {
          _id: {
            state: "$label.state",
            usertype: "$label.usertype",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // ---- Transform aggregation result into desired structure ----
    const data: any = { all: {} };

    result.forEach((item) => {
      const { state, usertype, status } = item._id;
      const count = item.count;

      // Ensure state object exists
      if (!data[state]) data[state] = {};
      if (!data[state][usertype]) {
        data[state][usertype] = {
          count: 0,
          active: 0,
          expired: 0,
          cancelled: 0,
        };
      }

      // Ensure all object for usertype exists
      if (!data.all[usertype]) {
        data.all[usertype] = { count: 0, active: 0, expired: 0, cancelled: 0 };
      }

      // Add counts
      data[state][usertype][status] += count;
      data[state][usertype].count += count;

      data.all[usertype][status] += count;
      data.all[usertype].count += count;
    });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Data fetched Successfully",
      data,
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
