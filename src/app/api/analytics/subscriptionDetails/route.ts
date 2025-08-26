import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const normalCount = await Label.countDocuments({ usertype: "normal" });
    const superCount = await Label.countDocuments({ usertype: "super" });

    const activeSubscriptions = await Subscription.countDocuments({
      status: "active",
    });
    const expiredSubscriptions = await Subscription.countDocuments({
      status: "expired",
    });
    const cancelledSubscriptions = await Subscription.countDocuments({
      status: "cancelled",
    });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Data Fetched Successfully",
      data: {
        userCountBySubscription: {
          normalCount,
          superCount,
        },
        subscriptionStatusTotals: {
          activeSubscriptions,
          expiredSubscriptions,
          cancelledSubscriptions,
        },
      },
    });
  } catch (error) {
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
