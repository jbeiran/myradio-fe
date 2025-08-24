import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

type UploadedInfo = {
  url: string;
  secureUrl: string;
  publicId: string;
  bytes: number;
  format: string;
  width: number;
  height: number;
};

async function uploadBufferToCloudinary(
  buf: Buffer,
  filename?: string
): Promise<UploadedInfo> {
  const folder = process.env.CLOUDINARY_FOLDER || "myradio";
  const resource_type = "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type, public_id: filename?.split(".")[0] },
      (err, result) => {
        if (err || !result) return reject(err || new Error("Upload failed"));
        resolve({
          url: result.url!,
          secureUrl: result.secure_url!,
          publicId: result.public_id!,
          bytes: result.bytes!,
          format: result.format!,
          width: result.width!,
          height: result.height!,
        });
      }
    );
    stream.end(buf);
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit")) || 12)
  );
  const skip = (page - 1) * limit;

  const db = await getDb();
  const coll = db.collection(process.env.COLLECTION_GALLERY || "gallery");

  const total = await coll.countDocuments({});
  const itemsRaw = await coll
    .find(
      {},
      {
        projection: {
          url: 1,
          secureUrl: 1,
          publicId: 1,
          width: 1,
          height: 1,
          format: 1,
          bytes: 1,
          createdAt: 1,
          alt: 1,
          title: 1,
        },
      }
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const items = itemsRaw.map((doc: any) => ({
    _id: String(doc._id),
    url: doc.secureUrl || doc.url,
    width: doc.width,
    height: doc.height,
    format: doc.format,
    bytes: doc.bytes,
    alt: doc.alt || "",
    title: doc.title || "",
    createdAt: doc.createdAt ?? null,
  }));

  return NextResponse.json({ page, limit, total, items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const files = form.getAll("files") as File[];

  if (!files?.length) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }

  const uploads: UploadedInfo[] = [];
  for (const f of files) {
    const ab = await f.arrayBuffer();
    const buf = Buffer.from(ab);
    const meta = await uploadBufferToCloudinary(buf, f.name);
    uploads.push(meta);
  }

  const db = await getDb();
  const coll = db.collection(process.env.COLLECTION_GALLERY || "gallery");

  const docs = uploads.map((u) => ({
    url: u.url,
    secureUrl: u.secureUrl,
    publicId: u.publicId,
    width: u.width,
    height: u.height,
    format: u.format,
    bytes: u.bytes,
    createdAt: new Date(),
  }));

  await coll.insertMany(docs);

  return NextResponse.json(
    {
      inserted: docs.length,
      items: docs.map((d) => ({ url: d.secureUrl || d.url })),
    },
    { status: 201 }
  );
}
