import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server Error: DEEPSEEK_API_KEY belum dikonfigurasi di Vercel." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, systemPrompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Permintaan tidak valid. Prompt tidak ditemukan." },
        { status: 400 }
      );
    }

    const apiUrl = "https://api.deepseek.com/v1/chat/completions";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4",
        messages: [
          {
            role: "system",
            content: systemPrompt || "Anda adalah asisten AI profesional yang membantu dalam penulisan CV dan surat lamaran.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DeepSeek API Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Gagal menghubungi DeepSeek API." },
        { status: response.status }
      );
    }

    // DeepSeek menggunakan format OpenAI: data.choices[0].message.content
    const resultText = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ content: resultText });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan pada server internal." },
      { status: 500 }
    );
  }
}
