import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Roadmap } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

// We use the Pro model for complex legal reasoning and search
const MODEL_NAME = "gemini-3-pro-preview";

export const createExpungementChat = (state: string): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      temperature: 0.4, // Keep it relatively factual
      systemInstruction: `You are CleanSlate, a helpful, empathetic, and simplified legal guide specializing in criminal record expungement for the state of ${state}. 
      
      Your goal is to interview the user to determine if they might be eligible for expungement (or record sealing) and explain the process in simple, 5th-grade English.
      
      Rules:
      1. ALWAYS start by stating you are an AI, not a lawyer, and this is information, not legal advice.
      2. Ask ONE question at a time to gather necessary info (e.g., "Was the offense a felony or misdemeanor?", "Have you completed your sentence?", "How much time has passed?").
      3. Use the 'googleSearch' tool to look up specific recent statutes for ${state} if you are unsure about specific timeframes or forms.
      4. Be encouraging but realistic.
      5. Keep responses concise. 
      `,
      tools: [{ googleSearch: {} }] // Enable grounding for up-to-date laws
    },
  });
};

export const generateRoadmapFromHistory = async (state: string, chatHistoryText: string): Promise<Roadmap> => {
  // We perform a one-off generation to summarize the conversation into a JSON roadmap
  const prompt = `
    Based on the following conversation about expungement in ${state}, create a structured roadmap.
    
    Conversation History:
    ${chatHistoryText}

    Return a JSON object with:
    1. eligibilityStatus: "Likely Eligible", "Likely Ineligible", or "Complex/Uncertain"
    2. summary: A 2-3 sentence summary of their situation in simple terms.
    3. steps: An array of steps (title, description, estimatedCost (optional), requiredDocuments (array of strings)).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eligibilityStatus: { type: Type.STRING, enum: ["Likely Eligible", "Likely Ineligible", "Complex/Uncertain"] },
            summary: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Roadmap;
    }
    throw new Error("No JSON generated");
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return {
      eligibilityStatus: "Complex/Uncertain",
      summary: "We couldn't auto-generate the plan due to an error. Please consult a local attorney.",
      steps: []
    };
  }
};