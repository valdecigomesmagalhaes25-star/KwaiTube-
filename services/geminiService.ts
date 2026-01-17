
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI with { apiKey: process.env.API_KEY } directly
export const getEnhancedVideoMetadata = async (youtubeUrl: string) => {
  if (!process.env.API_KEY) {
    console.warn("Chave de API Gemini não configurada.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise este vídeo do YouTube e crie metadados para um clone do Kwai: um título viral em português, uma descrição curta e 3 hashtags. Link: ${youtubeUrl}`,
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

    // Access .text property directly (not as a method)
    const textOutput = response.text;
    if (textOutput) {
      return JSON.parse(textOutput.trim());
    }
    return null;
  } catch (error) {
    console.error("Erro ao enriquecer metadados com Gemini:", error);
    return null;
  }
};
