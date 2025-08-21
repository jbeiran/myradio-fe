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

  const filter: any = {};
  const title = (searchParams.get("title") || "").trim();
  const tags = (searchParams.get("tags") || "").trim();
  const from = (searchParams.get("from") || "").trim();
  const to = (searchParams.get("to") || "").trim();

  if (title) filter.title = { $regex: title, $options: "i" };
  if (tags) filter.tags = { $regex: tags, $options: "i" };

  if (from || to) {
    const dateRange: any = {};
    if (from) {
      const d = new Date(from);
      if (!Number.isNaN(d.getTime())) dateRange.$gte = d;
    }
    if (to) {
      const d = new Date(to);
      if (!Number.isNaN(d.getTime())) dateRange.$lte = d;
    }
    if (Object.keys(dateRange).length) {
      filter.date = dateRange;
    }
  }

  const db = await getDb();
  const coll = db.collection(process.env.COLLECTION_DIARY || "diary");

  const total = await coll.countDocuments(filter);
  const itemsRaw = await coll
    .find(filter, {
      projection: { title: 1, content: 1, tags: 1, date: 1, createdAt: 1 },
    })
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
  const result = await db
    .collection(process.env.COLLECTION_DIARY || "diary")
    .insertOne({
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
