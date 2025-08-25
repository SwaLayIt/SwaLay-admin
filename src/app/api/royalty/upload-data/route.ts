import { connect } from "@/dbConfig/dbConfig";
import {
  PlatformRoyalty,
  Platform,
  TrackQuality,
  SpotifyFileName,
  TikTokContentType,
  YouTubeAssetType,
  YouTubeFileName,
  FacebookProduct,
} from "@/models/PlatformRoyalty";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

// Platform mapping functions
const platformMappers: Record<Platform, (row: any) => any> = {
  amazonmusic: (row) => ({
    platform: "amazonmusic" as Platform,
    isrc: row.isrc,
    songName: row.song_name,
    // albumName: row.album_name,
    artistName: row.artist_name,
    label: row.label,
    totalPlays: row.total,
    royalty: row.royality,
    countryCode: row.territory_code,
    platformData: {
      amazonmusic: {
        trackQuality: row.track_quality as TrackQuality,
      },
    },
  }),

  appleMusic: (row) => ({
    platform: "appleMusic" as Platform,
    isrc: row.isrc,
    songName: row.song_name,
    artistName: row.item_artist,
    label: row.label,
    totalPlays: row.total,
    royalty: row.royality,
    countryCode: row.vendor_identifier,
  }),

  facebook: (row) => ({
    platform: "facebook" as Platform,
    isrc: row.isrc,
    songName: row.song_name,
    artistName: row.track_artist,
    label: row.Sub_Label,
    totalPlays: row.total,
    royalty: row.royality,
    countryCode: row.country,
    platformData: {
      facebook: {
        product: mapFacebookProduct(row.product) as FacebookProduct,
      },
    },
  }),

  ganna: (row) => ({
    platform: "ganna" as Platform,
    isrc: row.isrc,
    songName: row.song_name,
    // albumName: row.album_name,
    artistName: row.artist,
    label: row.label,
    totalPlays: row.total,
    royalty: row.royality,
  }),

  jiosavan: (row) => ({
    platform: "jiosavan" as Platform,
    isrc: row.isrc,
    songName: row.song_name,
    // albumName: row.album_name,
    artistName: row.artist_name,
    label: row.label,
    totalPlays: row.total,
    royalty: row.royality,
  }),

  spotify: (row) => ({
    platform: "spotify" as Platform,
    isrc: row.isrc,
    songName: row.song_name,
    // albumName: row.album_name,
    artistName: row.artist_name,
    totalPlays: row.total,
    royalty: row.royality,
    countryCode: row.country,
    platformData: {
      spotify: {
        composerName: row.composer_name,
        fileName: row.file_name as SpotifyFileName,
      },
    },
  }),

  tiktok: (row) => ({
    platform: "tiktok" as Platform,
    isrc: row.isrc,
    songName: row.song_name,
    // albumName: row.album,
    artistName: row.artist,
    label: row.label,
    totalPlays: row.total,
    royalty: row.royality,
    countryCode: row.territory,
    platformData: {
      tiktok: {
        contentType: row.content_type as TikTokContentType,
      },
    },
  }),

  youtube: (row) => ({
    platform: "youtube" as Platform,
    isrc: row.isrc,
    songName: row.asset_title,
    // albumName: row.album,
    artistName: row.artist,
    label: row.asset_labels,
    totalPlays: row.total,
    royalty: row.royality,
    countryCode: row.country,
    platformData: {
      youtube: {
        assetType: row.asset_type as YouTubeAssetType,
        fileName: row.file_name as YouTubeFileName,
      },
    },
  }),
};

// Helper function to map Facebook product types to simplified enum
function mapFacebookProduct(product: string): FacebookProduct {
  if (!product) return "OTHER";

  const productMap: Record<string, FacebookProduct> = {
    FB_MUSIC_STICKER: "FB_MUSIC_STICKER",
    FB_REELS: "FB_REELS",
    FB_REELS_SFV: "FB_REELS",
    FB_REELS_LFV: "FB_REELS",
    FB_UGC: "FB_UGC",
    FB_UGC_LIVE: "FB_UGC",
    FB_PROFILE: "FB_PROFILE",
    FB_COMPOSER: "FB_PROFILE",
    IG_MUSIC_STICKER: "IG_MUSIC_STICKER",
    IG_REELS: "IG_REELS",
    IG_UGC: "IG_UGC",
    IG_UGC_LIVE: "IG_UGC",
    IG_MUSIC_ON_PROFILE: "IG_MUSIC_ON_PROFILE",
    IG_MUSIC_ON_FEED: "IG_MUSIC_ON_PROFILE",
    FB_FROM_IG_CROSSPOST: "CROSSPOST",
    FB_FROM_IG_CROSSPOST_REELS: "CROSSPOST",
    IG_FROM_FB_CROSSPOST_REELS: "CROSSPOST",
    IG_FROM_FB_CROSSPOST_STORY: "CROSSPOST",
    TH_FROM_IG_CROSSPOST_REELS: "CROSSPOST",
  };

  return productMap[product] || "OTHER";
}

// Helper function to parse date from month string (e.g., "2024-01")
function parseMonthDate(month: string): Date {
  const [year, monthNum] = month.split("-").map(Number);
  return new Date(year, monthNum - 1, 15); // Use middle of month for date
}

export async function POST(request: NextRequest) {
  await connect();

  try {
    // Parse the incoming form data from the request
    const formData = await request.formData();

    // Extract fields
    const platform = formData.get("platform") as Platform;
    const month = formData.get("month") as string;
    const file = formData.get("file") as File;

    // Validate required fields
    if (!platform || !month || !file) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Missing required fields: platform, month, or file",
      });
    }

    // Validate platform
    const validPlatforms: Platform[] = [
      "amazonmusic",
      "appleMusic",
      "facebook",
      "ganna",
      "jiosavan",
      "spotify",
      "tiktok",
      "youtube",
    ];

    if (!validPlatforms.includes(platform as Platform)) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: `Invalid platform. Must be one of: ${validPlatforms.join(
          ", "
        )}`,
      });
    }

    // Read file as ArrayBuffer
    const buffer = await file.arrayBuffer();

    // Parse Excel file using xlsx
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(sheet);

    // Process data based on platform
    const mapper = platformMappers[platform];
    const date = parseMonthDate(month);
    const records = [];
    const errors = [];

    console.log("excelData.length :", excelData.length);

    for (let i = 0; i < excelData.length; i++) {
      try {
        const row = excelData[i];
        const mappedData = mapper(row);

        // Add common fields
        const recordData = {
          ...mappedData,
          date,
          sourceFile: file.name,
          processed: false,
        };

        // Create and save record
        const record = new PlatformRoyalty(recordData);
        await record.save();
        records.push(record);
      
      } catch (error: any) {
        errors.push({
          row: i + 2, // +2 because Excel rows start at 1 and header is row 1
          error: error.message,
          data: excelData[i],
        });
      }
    }

    // If there are mapping errors and no valid records, return early
    if (errors.length > 0 && records.length === 0) {
      return NextResponse.json({
        message: "All rows failed to process",
        success: false,
        status: 400,
        errors,
      });
    }

    // Save all valid records to database
    const savedRecords = [];
    for (const recordData of records) {
      try {
        const record = new PlatformRoyalty(recordData);
        await record.save();
        savedRecords.push(record);
      } catch (error: any) {
        console.log("Error saving record:", error);
        errors.push({
          row: "Unknown (during save)",
          error: error.message,
          data: recordData,
        });
      }
    }

    // Return response after processing all records
    return NextResponse.json({
      message: `Processed ${savedRecords.length} records successfully${
        errors.length > 0 ? ` with ${errors.length} errors` : ""
      }`,
      success: true,
      status: 200,
      processedCount: savedRecords.length,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
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
