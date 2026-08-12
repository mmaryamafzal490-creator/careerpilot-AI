import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interest, subject, skills, message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY ||"YOUR_ACTUAL_AQ_KEY_HERE";

    if (!apiKey) {
      return res.status(500).json({ reply: "API Key missing in Vercel settings." });
    }
const prompt = message ||'My interest is ${interest}, my favourite subject is ${subject}, and my skills are ${skills}. Please give me personalized career recommendations.';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Frontend expecting 'reply' or 'result' key
    return res.status(200).json({ 
      reply: text,
      result: text 
    });
  } catch (error) {
    return res.status(500).json({ reply: "Error: " + error.message });
  }
}
