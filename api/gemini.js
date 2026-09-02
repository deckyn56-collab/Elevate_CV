// api/gemini.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt, systemPrompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const API_KEY = process.env.GEMINI_API_KEY;
        
        if (!API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Daftar model yang dicoba otomatis
        const models = [
            'gemini-3.6-flash',      
            'gemini-3.5-flash',      
            'gemini-3.1-flash-lite'  
        ];

        let lastError = null;

        for (const model of models) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt }] }],
                            generationConfig: {
                                temperature: 0.7,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: 4096
                            }
                        })
                    }
                );

                // Jika 503 (high demand), lanjut ke model berikutnya
                if (response.status === 503 || response.status === 429) {
                    lastError = new Error('Model is experiencing high demand');
                    continue;
                }

                const data = await response.json();

                if (!response.ok) {
                    lastError = new Error(data.error?.message || 'Gemini API Error');
                    continue;
                }

                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!text) {
                    lastError = new Error('No response from Gemini API');
                    continue;
                }

                return res.status(200).json({ content: text });
            } catch (error) {
                lastError = error;
            }
        }

        // Jika semua model gagal, kirim pesan error yang jelas
        return res.status(500).json({ 
            error: lastError?.message || 'All models failed' 
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}