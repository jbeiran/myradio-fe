import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
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

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = ctx.params;
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const db = await getDb();
  const coll = db.collection(process.env.COLLECTION_GALLERY || "gallery");

  const doc = await coll.findOne(
    { _id: new ObjectId(id) },
    { projection: { publicId: 1 } }
  );
  if (!doc) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  if (doc.publicId) {
    try {
      await cloudinary.uploader.destroy(doc.publicId, {
        resource_type: "image",
      });
    } catch (_e) {}
  }

  const res = await coll.deleteOne({ _id: new ObjectId(id) });
  if (res.deletedCount === 0) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
