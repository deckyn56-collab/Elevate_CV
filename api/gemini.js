// api/gemini.js - Serverless Function untuk Vercel
export default async function handler(req, res) {
    // Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method Not Allowed' 
        });
    }

    const { prompt, systemPrompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ 
            error: 'Prompt is required' 
        });
    }

    try {
        const API_KEY = process.env.GEMINI_API_KEY;
        
        if (!API_KEY) {
            return res.status(500).json({ 
                error: 'API key not configured' 
            });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 4096
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return res.status(response.status).json({ 
                error: data.error?.message || 'Gemini API Error' 
            });
        }

        // Extract text from Gemini response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
            return res.status(500).json({ 
                error: 'No response from Gemini API' 
            });
        }

        return res.status(200).json({ 
            content: text 
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}
