import mongoose, { Schema, Document } from "mongoose";

// Common platform types
export type Platform =
  | "amazonmusic"
  | "appleMusic"
  | "facebook"
  | "ganna"
  | "jiosavan"
  | "spotify"
  | "tiktok"
  | "youtube";

// Platform-specific enums
export type TrackQuality = "HI_RES" | "SHUFFLE" | "STATION" | "ON_DEMAND";
export type SpotifyFileName = "Streaming" | "Discovery";
export type TikTokContentType = "PGC" | "UGC";
export type YouTubeAssetType = "Sound Recording" | "Art Track";
export type YouTubeFileName = "Content ID" | "Youtube Music";

// Facebook product type (simplified)
export type FacebookProduct =
  | "FB_MUSIC_STICKER"
  | "FB_REELS"
  | "FB_UGC"
  | "FB_PROFILE"
  | "IG_MUSIC_STICKER"
  | "IG_REELS"
  | "IG_UGC"
  | "IG_MUSIC_ON_PROFILE"
  | "CROSSPOST"
  | "OTHER";

// Interface for MongoDB document
interface IPlatformRoyalty extends Document {
  platform: Platform;
  isrc: string;
  songName: string;
  artistName: string;
  label: string;
  totalPlays: number;
  royalty: number;
  countryCode: string;

  platformData: {
    amazonmusic?: {
      trackQuality: TrackQuality;
    };
    facebook?: {
      product: FacebookProduct;
    };
    spotify?: {
      composerName: string;
      fileName: SpotifyFileName;
    };
    tiktok?: {
      contentType: TikTokContentType;
    };
    youtube?: {
      assetType: YouTubeAssetType;
      fileName: YouTubeFileName;
    };
  };

  sourceFile: string;
  processed: boolean;
  date: Date;
}

const PlatformRoyaltySchema: Schema<IPlatformRoyalty> =
  new Schema<IPlatformRoyalty>({
    platform: {
      type: String,
      required: true,
      enum: [
        "amazonmusic",
        "appleMusic",
        "facebook",
        "ganna",
        "jiosavan",
        "spotify",
        "tiktok",
        "youtube",
      ],
    },
    isrc: { type: String, required: true, index: true },
    songName: { type: String, required: true },
    artistName: { type: String, required: true, index: true },
    label: String,
    totalPlays: { type: Number, required: true, min: 0 },
    royalty: { type: Number, min: 0 , required: true},
    countryCode: { type: String, required: true, index: true },

    platformData: {
      amazonmusic: {
        trackQuality: {
          type: String,
          enum: ["HI_RES", "SHUFFLE", "STATION", "ON_DEMAND"],
        },
      },
      facebook: {
        product: {
          type: String,
          enum: [
            "FB_MUSIC_STICKER",
            "FB_REELS",
            "FB_UGC",
            "FB_PROFILE",
            "IG_MUSIC_STICKER",
            "IG_REELS",
            "IG_UGC",
            "IG_MUSIC_ON_PROFILE",
            "CROSSPOST",
            "OTHER",
          ],
        },
      },
      spotify: {
        composerName: String,
        fileName: {
          type: String,
          enum: ["Streaming", "Discovery"],
        },
      },
      tiktok: {
        contentType: {
          type: String,
          enum: ["PGC", "UGC"],
        },
      },
      youtube: {
        assetType: {
          type: String,
          enum: ["Sound Recording", "Art Track"],
        },
        fileName: {
          type: String,
          enum: ["Content ID", "Youtube Music"],
        },
      },
    },
    sourceFile: { type: String, required: true },
    processed: { type: Boolean, default: false },
    date: { type: Date, required: true, index: true }

  });

// Indexes for better query performance
PlatformRoyaltySchema.index({ platform: 1, date: 1 });
PlatformRoyaltySchema.index({ artistName: 1, date: 1 });
PlatformRoyaltySchema.index({ countryCode: 1, date: 1 });



export const PlatformRoyalty = mongoose.models.PlatformRoyalty || mongoose.model('PlatformRoyalty', PlatformRoyaltySchema);