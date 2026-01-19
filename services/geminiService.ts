
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const refinePrompt = async (userPrompt: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tu es un expert en prompt engineering pour IA génératrice d'images (Midjourney, DALL-E). 
      Prends le prompt suivant et transforme-le en un prompt ultra-détaillé et artistique en anglais pour obtenir un résultat professionnel. 
      Réponds UNIQUEMENT avec le nouveau prompt.
      Prompt : ${userPrompt}`,
    });
    return response.text || userPrompt;
  } catch (error) {
    console.error("Erreur optimisation prompt:", error);
    return userPrompt;
  }
};

export const generateImageWithGemini = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } },
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return imageUrl;
  } catch (error) {
    console.error("Erreur Gemini Image:", error);
    throw error;
  }
};
