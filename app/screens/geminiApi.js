// screens/geminiApi.js
const API_KEY = "AIzaSyBotKXqQlQhLpChjWgt04gM1P07YKTVYPQ"; // <-- Replace with your real key
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function askGemini(question, context) {
  try {
    const body = {
      contents: [
        { parts: [{ text: `${context}\n\nUser: ${question}` }] }
      ]
    };

    const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error('Gemini API returned an error:', res.status, res.statusText);
      return "I couldn't find an answer.";
    }

    const data = await res.json();
    console.log('Gemini response:', data); // Debug response

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find an answer.";
  } catch (error) {
    console.error('Gemini API error:', error);
    return "I couldn't find an answer.";
  }
}
