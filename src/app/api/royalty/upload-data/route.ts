import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
  await connect();

  try {
    // Parse the incoming form data from the request
    const formData = await request.formData();

    // Extract fields
    const platform = formData.get("platform");
    const month = formData.get("month");
    const file = formData.get("file") as File;

    // Read file as ArrayBuffer
    const buffer = await file.arrayBuffer();

    // Parse Excel file using xlsx
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(sheet);

    // Log extracted data
    console.log("Platform:", platform);
    console.log("Month:", month);
    console.log("Excel Data:", excelData);

    // Respond with the saved payment data
    return NextResponse.json({
      message: "Payment created successfully",
      success: true,
      status: 200,
      platform,
      month,
      excelData,
    });
  } catch (error: any) {
    // Handle any errors that occur during processing
    return NextResponse.json({
      status: 500,
      success: false,
      message:
        "An error occurred while creating the payment : " + error.message,
    });
  }
}

// amazonmusic: {
//     territory_code: string,
//     total: number,
//     isrc: string,
//     song_name: string,
//     album_name: string,
//     artist_name: string,
//     label: string,
//     track_quality: string,
//     royality: number;
// }


// appleMusic: {
//     isrc: string,
//     vendor_identifier: string,
//     total: number,
//     item_artist: string,
//     song_name: string,
//     label: string,
//     royality: number,
// }


// facebook: {
//     country: string,
//     product: string,
//     total: number,
//     isrc: string,
//     track_artist: string,
//     song_name: string,
//     royality: number,
// }



// ganna: {
//     song_name: string,
//     album_name: string,
//     artist: string,
//     isrc: string,
//     label: string,
//     total: number,
//     royality: number,
// }

// jiosavan: {
//     song_name: string,
//     album_name: string,
//     artist_name: string,
//     isrc: string,
//     label: string,
//     total: number,
//     royality: number,
// }


// spotify: {
//     isrc: string,
//     song_name: string,
//     artist_name: string,
//     composer_name: string,
//     album_name: string,
//     total: number,
//    file_name: string,
//    royality: number,
// }


// tiktok: {
//     label: string,
//     territory: string,
//     content_type: string,
//     total: number,
//     royality: number,
// }


// yt: {
//     country: string,
//     asset_title: string,
//     asset_labels: string,
//     asset_type: string,
//     isrc: string,
//     artist: string,
//     album: string,
//     total: number,
//     file_name: string,
//     royality: number,
// }




