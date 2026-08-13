import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interest, subject, skills, message } = req.body;

    // Vercel Environment Variables Check
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMUNI_API_KEY_6;

    if (!apiKey) {
      return res.status(500).json({ 
        reply: "API Key missing in Vercel settings.",
        suggestion: "API Key missing in Vercel settings.",
        recommendation: "API Key missing in Vercel settings."
      });
    }

    // Input string create karna
    const prompt = message || `My interest is ${interest || 'general'}, my favourite subject is ${subject || 'general'}, and my skills are ${skills || 'general'}. Please provide personalized career recommendations and guidance.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Stable Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Multiple keys return kar rahe hain taake frontend jis name se bhi demand kare data mil jaye
    return res.status(200).json({ 
      reply: text,
      suggestion: text,
      suggestions: text,
      recommendation: text,
      recommendations: text,
      careerSuggestions: text
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: error.message || "Internal Server Error",
      reply: "Error: " + (error.message || "Failed to fetch suggestions"),
      suggestion: "Error: " + (error.message || "Failed to fetch suggestions")
    });
  }
}
