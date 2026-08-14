export default async function handler(req, res) {
  // CORS allow
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method!== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { interests, skills, education } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: "Error: GEMINI_API_KEY Vercel me set nahi hai" });
    }

    const prompt = `You are a career counselor for Pakistan. 
    User Profile: Interests: ${interests}, Skills: ${skills}, Education: ${education}
    Suggest 3 career paths. Return ONLY JSON array: [{"title":"","why":"","skills":[],"salary":""}]`;

    const googleApiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(googleApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ message: `Google API Error: ${errorData}` });
    }

    const data = await response.json();
    let resultText = data.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

    return res.status(200).json({ recommendations: resultText });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error: " + error.message });
  }
}
