/**
 * Endpoint keep-alive para MongoDB Atlas
 * Mantiene el cluster M0 (free tier) activo ejecutando una operación mínima.
 * Llamado periódicamente por Vercel Cron para evitar la pausa por inactividad (60 días).
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    // Operación mínima: ping para mantener la conexión activa
    await db.admin().command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      message: "MongoDB keep-alive ejecutado",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error("Keep-alive error:", err.message);
    return NextResponse.json(
      {
        error: "Error al conectar con MongoDB",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
