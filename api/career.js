export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interest, subject, skills, message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMUNI_API_KEY_6;

    if (!apiKey) {
      return res.status(200).json({ 
        reply: "Error: API Key Vercel settings mein missing hai." 
      });
    }

    const promptText = message || `Student interests: ${interest}, Favourite subject: ${subject}, Current skills: ${skills}. Suggest 3 suitable career paths.`;

    // Active Models List (v1 API)
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-2.5-flash"
    ];

    let lastError = "";

    for (const modelName of modelsToTry) {
      // Endpoint version 'v1' set kiya gaya hai
      const googleApiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

      const apiResponse = await fetch(googleApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        }),
      });

      const data = await apiResponse.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({ 
          reply: data.candidates[0].content.parts[0].text 
        });
      }

      if (data.error) {
        lastError = data.error.message;
      }
    }

    return res.status(200).json({ 
      reply: `Google API Error: ${lastError || "Could not generate content"}` 
    });

  } catch (error) {
    return res.status(200).json({ 
      reply: `Server Error: ${error.message}` 
    });
  }
}
