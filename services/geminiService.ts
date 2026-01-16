
import { GoogleGenAI, Type } from "@google/genai";

// Proteção para evitar erro se process.env.API_KEY estiver indefinido
const API_KEY = (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : "";

export const getEnhancedVideoMetadata = async (youtubeUrl: string) => {
  if (!API_KEY) {
    console.warn("Chave de API não encontrada. Usando metadados padrão.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise este link do YouTube (como se fosse um reel/short) e sugira um título chamativo em português, 3 hashtags relevantes e uma breve descrição de marketing para atrair visualizações. Link: ${youtubeUrl}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "tags"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error enhancing metadata:", error);
    return null;
  }
};
