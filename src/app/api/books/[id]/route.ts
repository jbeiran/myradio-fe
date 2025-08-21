import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const db = await getDb();
  const coll = db.collection(process.env.COLLECTION_BOOKS!);

  const doc = await coll.findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        title: 1,
        author: 1,
        rating: 1,
        review: 1,
        date: 1,
        gender: 1,
        createdAt: 1,
      },
    }
  );

  if (!doc)
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json({ item: { ...doc, _id: String(doc._id) } });
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = ctx.params;
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  let payload: any = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const allowed = ["title", "author", "rating", "review", "date", "gender"];
  const update: any = {};
  for (const k of allowed) {
    if (k in payload) update[k] = payload[k];
  }
  if ("date" in update && update.date === "") update.date = null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "Nada para actualizar" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const coll = db.collection(process.env.COLLECTION_BOOKS!);
  const res = await coll.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...update } }
  );

  if (res.matchedCount === 0) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({ updated: true });
}

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
  const coll = db.collection(process.env.COLLECTION_BOOKS!);
  const res = await coll.deleteOne({ _id: new ObjectId(id) });

  if (res.deletedCount === 0) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
