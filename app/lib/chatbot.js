// lib/chatbot.js
import { geminiClient } from './gemini';

export async function askGemini(userMessage, context = '') {
  try {
    const prompt = `
      You are a helpful assistant for the "Feed My People" organization.
      ${context}
      User asked: "${userMessage}"
      Provide a helpful and friendly response.
    `;

    const response = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } } // Disable thinking for faster responses
    });

    return response.text || "Sorry, I couldn't answer that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "There was an error connecting to the chatbot.";
  }
}
