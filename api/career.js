import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interest, subject, skills, message } = req.body;

    // Aapki Vercel API key variables check kar raha hai
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMUNI_API_KEY_6;

    if (!apiKey) {
      return res.status(500).json({ reply: "API Key missing in Vercel settings." });
    }

    // Input fields ko single prompt me combine kar raha hai
    const prompt = message || `My interest is ${interest}, my favourite subject is ${subject}, and my skills are ${skills}. Please provide personalized career recommendations and guidance.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Sahi model name format (bina 'models/' prefix ke)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
