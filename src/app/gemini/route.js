import { NextResponse } from "next/server";

// 1. Mencegah Next.js melakukan caching statis pada route API ini
//    (Sangat penting untuk API yang dinamis seperti AI)
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // 2. Ambil API Key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY tidak ditemukan di environment variable.");
      return NextResponse.json(
        { 
          error: "Konfigurasi server tidak lengkap. Pastikan GEMINI_API_KEY sudah diatur di Vercel." 
        },
        { status: 500 }
      );
    }

    // 3. Parsing body request dengan aman (menangkal JSON invalid)
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Format request bukan JSON yang valid." },
        { status: 400 }
      );
    }

    const { modelEndpoint, payload } = body;

    // 4. Validasi input
    if (!modelEndpoint || !payload) {
      return NextResponse.json(
        { error: "Permintaan tidak valid. 'modelEndpoint' dan 'payload' wajib diisi." },
        { status: 400 }
      );
    }

    // 5. Construct URL API Gemini
    //    (Pastikan endpoint sesuai dengan model yang valid, contoh: gemini-1.5-flash)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}?key=${apiKey}`;

    // 6. Lakukan request ke Google Gemini
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload),
      // OPSIONAL: Tambahkan timeout agar request tidak menggantung selamanya
      // signal: AbortSignal.timeout(15000) // 15 detik timeout
    });

    // 7. Handling Response (JSON vs Non-JSON)
    const contentType = response.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      // Jika respons JSON (Sukses atau Error dari Google)
      const data = await response.json();
      
      // Kembalikan respons dengan status HTTP yang sesuai
      return NextResponse.json(data, { status: response.status });
    } else {
      // Jika Google mengembalikan HTML/Text (misal API Key salah, atau model tidak tersedia)
      const text = await response.text();
      
      // Log error di server untuk debugging
      console.error("❌ Google mengembalikan non-JSON:", text.slice(0, 200));
      
      return NextResponse.json(
        { 
          error: `Layanan AI merespons dengan format tidak valid (Status ${response.status}).`,
          detail: text.slice(0, 150) 
        },
        { status: response.status || 502 } // 502 Bad Gateway
      );
    }

  } catch (error) {
    // 8. Handling Global Error (Network error, dll)
    console.error("🔥 Server API Error:", error);
    
    return NextResponse.json(
      { 
        error: "Terjadi kesalahan pada server internal.", 
        message: error?.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
}