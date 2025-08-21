import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    20,
    Math.max(1, Number(searchParams.get("limit")) || 5)
  );
  const skip = (page - 1) * limit;

  const db = await getDb();
  const coll = db.collection(process.env.COLLECTION_DIARY!);

  const total = await coll.countDocuments({});
  const itemsRaw = await coll
    .find(
      {},
      { projection: { title: 1, content: 1, tags: 1, date: 1, createdAt: 1 } }
    )
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const items = itemsRaw.map((doc: any) => ({
    _id: String(doc._id),
    title: doc.title,
    content: doc.content,
    tags: doc.tags ?? "",
    date: doc.date ?? null,
    createdAt: doc.createdAt ?? null,
  }));

  return NextResponse.json({ page, limit, total, items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, tags = "", date = null } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection(process.env.COLLECTION_DIARY!).insertOne({
    title,
    content,
    tags,
    date,
    createdAt: new Date(),
  });

  return NextResponse.json(
    { insertedId: String(result.insertedId) },
    { status: 201 }
  );
}
