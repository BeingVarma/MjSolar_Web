import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using server-side environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const revalidate = 60; // Cache for 60 seconds (ISR)

export async function GET() {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary environment variables are missing.");
      return NextResponse.json({ error: "Configuration error." }, { status: 500 });
    }

    // Fetch images from the 'MjSolar' folder, sorted by newest first
    const result = await cloudinary.search
      .expression('folder:MjSolar AND resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    // Map to a clean, stripped-down JSON structure
    const images = result.resources.map((res: { asset_id: string, public_id: string, secure_url: string, width: number, height: number, created_at: string, format: string }) => ({
      id: res.asset_id,
      public_id: res.public_id,
      secure_url: res.secure_url,
      width: res.width,
      height: res.height,
      created_at: res.created_at,
      format: res.format,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Failed to fetch images from Cloudinary:", error);
    return NextResponse.json({ error: "Failed to load gallery." }, { status: 500 });
  }
}
