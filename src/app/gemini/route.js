import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Mengambil API Key dari Environment Variables (Rahasia di Vercel)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server Error: GEMINI_API_KEY belum dikonfigurasi di Vercel." },
        { status: 500 }
      );
    }

    // 2. Menerima data dari Frontend
    const body = await request.json();
    const { modelEndpoint, payload } = body;
it 
    if (!modelEndpoint || !payload) {
      return NextResponse.json(
        { error: "Permintaan tidak valid. Endpoint atau payload tidak ditemukan." },
        { status: 400 }
      );
    }

    // 3. Meneruskan request ke server asli Google Gemini (menyisipkan API Key di sini)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // 4. Mengembalikan respons dari Google kembali ke Frontend
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server internal." },
      { status: 500 }
    );
  }
}
