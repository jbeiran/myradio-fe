/**
 * Endpoint keep-alive para MongoDB Atlas
 * Mantiene el cluster M0 (free tier) activo ejecutando una operación mínima.
 * Llamado periódicamente por Vercel Cron para evitar la pausa por inactividad (60 días).
 *
 * Configura CRON_SECRET en Vercel para proteger este endpoint de llamadas no autorizadas.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // Solo permitir llamadas desde el cron de Vercel (opcional pero recomendado)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
