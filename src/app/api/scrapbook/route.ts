import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const COLL = "scrapbook";

export async function GET() {
  const db = await getDb();
  const coll = db.collection(COLL);

  let docs = await coll
    .find({}, { projection: { _id: 1, label: 1, elements: 1, position: 1, updatedAt: 1 } })
    .sort({ position: 1 })
    .toArray();

  if (docs.length === 0) {
    const seed = {
      label: "Página 1",
      elements: [],
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await coll.insertOne(seed);
    docs = [{ ...seed, _id: result.insertedId }];
  }

  const pages = docs.map((d: any) => ({
    _id: String(d._id),
    label: d.label ?? "Sin título",
    elements: d.elements ?? [],
    position: d.position ?? 0,
  }));

  return NextResponse.json({ pages });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const label = body.label || "Nueva página";

  const db = await getDb();
  const coll = db.collection(COLL);

  const lastDoc = await coll.find().sort({ position: -1 }).limit(1).toArray();
  const position = lastDoc.length > 0 ? (lastDoc[0].position ?? 0) + 1 : 0;

  const result = await coll.insertOne({
    label,
    elements: [],
    position,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json(
    {
      _id: String(result.insertedId),
      label,
      elements: [],
      position,
    },
    { status: 201 }
  );
}
