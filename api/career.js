export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interest, subject, skills, message } = req.body;

    // Vercel Environment Variable se API Key lena
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMUNI_API_KEY_6;

    if (!apiKey) {
      return res.status(200).json({ 
        reply: "Error: API Key Vercel settings mein missing hai." 
      });
    }

    const promptText = message || `Student interests: ${interest}, Favourite subject: ${subject}, Current skills: ${skills}. Suggest 3 suitable career paths.`;

    // Direct Google Gemini REST API Call (Bina SDK Dependency Ke)
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(googleApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      }),
    });

    const data = await apiResponse.json();

    // Agar Google API koi error bhejti hai
    if (data.error) {
      return res.status(200).json({ 
        reply: `Google API Error: ${data.error.message}` 
      });
    }

    // Direct reply extract karna
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      return res.status(200).json({ 
        reply: "Sorry, no career suggestion was received from Google API." 
      });
    }

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(200).json({ 
      reply: `Server Error: ${error.message || "Failed to connect to API"}` 
    });
  }
}
