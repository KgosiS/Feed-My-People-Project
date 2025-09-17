// lib/gemini.js
import { GoogleGenAI } from "@google/genai";

// Client will automatically use GEMINI_API_KEY from environment variable
export const geminiClient = new GoogleGenAI({});

