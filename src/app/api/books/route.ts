import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, author, rating, review, date = null, gender = "" } = await req.json();
  if (!title || !author || !rating || !review) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection(process.env.COLLECTION_BOOKS!).insertOne({
    title,
    author,
    rating,
    review,
    date,
    gender,
    createdAt: new Date(),
  });

  return NextResponse.json(
    { insertedId: String(result.insertedId) },
    { status: 201 }
  );
}
