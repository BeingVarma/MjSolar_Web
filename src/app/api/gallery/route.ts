import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

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

export async function POST(request: Request) {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary environment variables are missing.");
      return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files").concat(formData.getAll("file"));

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No image files provided." }, { status: 400 });
    }

    const uploaded = [];

    for (const fileEntry of files) {
      if (fileEntry instanceof File) {
        // Validate MIME type
        if (!fileEntry.type.startsWith("image/")) {
          return NextResponse.json(
            { error: `File "${fileEntry.name}" is not a valid image format.` },
            { status: 400 }
          );
        }

        // Validate File Size (Max 10MB)
        if (fileEntry.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { error: `File "${fileEntry.name}" exceeds the maximum allowed size (10MB).` },
            { status: 400 }
          );
        }

        const bytes = await fileEntry.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const dataUri = `data:${fileEntry.type};base64,${buffer.toString("base64")}`;

        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          folder: "MjSolar",
          resource_type: "image",
        });

        uploaded.push({
          id: uploadRes.asset_id,
          public_id: uploadRes.public_id,
          secure_url: uploadRes.secure_url,
          width: uploadRes.width,
          height: uploadRes.height,
          created_at: uploadRes.created_at,
          format: uploadRes.format,
        });
      }
    }

    // Invalidate ISR cache
    revalidatePath("/api/gallery");
    revalidatePath("/[lang]", "page");

    return NextResponse.json({ success: true, uploaded }, { status: 200 });
  } catch (error) {
    console.error("Failed to upload image(s) to Cloudinary:", error);
    return NextResponse.json({ error: "Failed to upload image(s)." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary environment variables are missing.");
      return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 500 });
    }

    const body = await request.json();
    const { public_id } = body;

    if (!public_id || typeof public_id !== "string") {
      return NextResponse.json({ error: "Invalid or missing public_id." }, { status: 400 });
    }

    // Security guard: Ensure target public_id is within MjSolar namespace
    if (!public_id.startsWith("MjSolar/") && !public_id.includes("MjSolar")) {
      return NextResponse.json({ error: "Unauthorized image deletion outside MjSolar folder." }, { status: 403 });
    }

    const deleteResult = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });

    if (deleteResult.result !== "ok" && deleteResult.result !== "not found") {
      console.warn("Cloudinary delete result:", deleteResult);
    }

    // Invalidate ISR cache
    revalidatePath("/api/gallery");
    revalidatePath("/[lang]", "page");

    return NextResponse.json({ success: true, result: deleteResult, public_id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    return NextResponse.json({ error: "Failed to delete image." }, { status: 500 });
  }
}
