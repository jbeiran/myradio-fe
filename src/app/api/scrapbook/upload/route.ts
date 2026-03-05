import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const folder = process.env.CLOUDINARY_FOLDER
    ? `${process.env.CLOUDINARY_FOLDER}/scrapbook`
    : "myradio/scrapbook";

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        public_id: file.name.split(".")[0] + "-" + Date.now(),
      },
      (err, res) => {
        if (err || !res) return reject(err || new Error("Upload failed"));
        resolve(res);
      }
    );
    stream.end(buffer);
  });

  return NextResponse.json(
    {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    },
    { status: 201 }
  );
}
