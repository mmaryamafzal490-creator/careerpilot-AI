export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interest, subject, skills, message } = req.body;
    
    // Vercel Environment Variables Check
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMUNI_API_KEY_6;

    if (!apiKey) {
      return res.status(200).json({ 
        reply: "Error: API Key Vercel settings mein missing hai. Please GEMINI_API_KEY set karein." 
      });
    }

    const promptText = message || `Student interests: ${interest}, Favourite subject: ${subject}, Current skills: ${skills}. Suggest 3 suitable career paths.`;

    // Active Standard Models
    const modelsToTry = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-1.5-pro-latest"
    ];

    let lastErrorMessage = "";

    for (const modelName of modelsToTry) {
      const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

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
        lastErrorMessage = data.error.message;
      }
    }

    return res.status(200).json({ 
      reply: `Google API Error: ${lastErrorMessage || "Models respond nahi kar rahe."}` 
    });

  } catch (error) {
    return res.status(200).json({ 
      reply: `Server Error: ${error.message}` 
    });
  }
}
