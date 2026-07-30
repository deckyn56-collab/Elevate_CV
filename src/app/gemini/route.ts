import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Mengambil API Key dari Environment Variables (Vercel)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server Error: GEMINI_API_KEY belum dikonfigurasi di Environment Variables Vercel." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { modelEndpoint, payload } = body;

    if (!modelEndpoint || !payload) {
      return NextResponse.json(
        { error: "Permintaan tidak valid. Endpoint atau payload tidak ditemukan." },
        { status: 400 }
      );
    }

    // --- PERBAIKAN DI SINI (1 BARIS) ---
    // Pisahkan nama model dari suffix ":generateContent"
    const baseModel = modelEndpoint.replace(":generateContent", "");
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${baseModel}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return NextResponse.json(
        { error: `Respon Google Gemini bukan JSON (Status ${response.status}): ${text.slice(0, 150)}` },
        { status: response.status || 500 }
      );
    }

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan pada server internal." },
      { status: 500 }
    );
  }
}