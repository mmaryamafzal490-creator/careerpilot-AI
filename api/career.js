import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interest, subject, skills, message } = req.body;

    // API Key resolution (Multiple fallbacks)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMUNI_API_KEY_6;

    if (!apiKey) {
      return res.status(200).json({ 
        reply: "Error: GEMINI_API_KEY Vercel Environment Variables mein missing hai." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Stable Gemini model string
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptText = message || `Student interests: ${interest}, Favourite subject: ${subject}, Current skills: ${skills}. Suggest 3 suitable career paths with brief details.`;

    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini Execution Error:", error);
    // Explicitly returning 'reply' field even on errors so frontend catches it
    return res.status(200).json({ 
      reply: `Gemini API Error: ${error.message || "Failed to fetch suggestions"}` 
    });
  }
}
