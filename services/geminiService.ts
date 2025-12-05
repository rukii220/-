import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PersonaSettings, GeneratedOption } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Define the response schema for structured JSON output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ["Standard", "Intense", "Short"],
            description: "The category of the response style."
          },
          label: {
            type: Type.STRING,
            description: "A short label description in Chinese (e.g., 完美符合人设, 情绪更强烈, 简短敷衍)."
          },
          content: {
            type: Type.STRING,
            description: "The actual message content to send."
          },
          explanation: {
            type: Type.STRING,
            description: "A very brief inner thought or explanation (OS)."
          }
        },
        required: ["type", "label", "content"],
      },
    },
  },
  required: ["options"],
};

export const generateReplies = async (
  settings: PersonaSettings,
  incomingMessage: string,
  intent: string = ""
): Promise<GeneratedOption[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Construct the user prompt based on the dynamic configuration
    const userPrompt = `
【设定人设】
1. 我的人设：${settings.myPersona}
2. 对方是谁：${settings.targetPersona}
3. 双方关系：${settings.relationship}

对方发来的消息：
"${incomingMessage}"

${intent ? `我的回复思路/意图：(${intent})` : ""}

请生成3个不同风格的回复选项。
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.0, // Higher temperature for more creative/human-like variation
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
    });

    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text);
    return data.options || [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
