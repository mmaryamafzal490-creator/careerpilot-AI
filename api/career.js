export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { interests, skills, message } = req.body;

  // Vercel environment variable check
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      message: "Server error: API key settings missing hai. Please GEMINI_API_KEY set karein." 
    });
  }

  // Prompt for Gemini
  const prompt = `Student Interests: ${interests}, Favourite subject: ${skills}, Current skills: ${skills}. Suggest 3 suitable career paths.`;

  // Stable model for 2026
  const modelsToTry = [
    "gemini-1.5-flash"
  ];

  let lastErrorMessage = "";

  for (const model of modelsToTry) {
    // KEY FIX: v1beta -> v1
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    try {
      const response = await fetch(googleApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (response.ok && data.candidates && data.candidates[0]) {
        const resultText = data.candidates[0].content.parts[0].text;
        
        // Return success
        if (response.ok && data.candidates && data.candidates[0]) {
  let resultText = data.candidates[0].content.parts[0].text;
  
  // 1. ```json ``` remove kar do
  resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

  // 2. Dono format me return karo taake frontend break na ho
  return res.status(200).json({ 
    recommendations: resultText, // frontend ke liye
    message: resultText // backup ke liye
  });
          
  // If all models failed
  return res.status(500).json({ 
    message: `AI se error: ${lastErrorMessage}` || "Models respond nahi kar rahe." 
  });

}
