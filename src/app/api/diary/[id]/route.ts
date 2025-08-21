import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const db = await getDb();
  const coll = db.collection(process.env.COLLECTION_DIARY!);

  const doc = await coll.findOne(
    { _id: new ObjectId(id) },
    { projection: { title: 1, content: 1, tags: 1, date: 1, createdAt: 1 } }
  );

  if (!doc)
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json({ item: { ...doc, _id: String(doc._id) } });
}
