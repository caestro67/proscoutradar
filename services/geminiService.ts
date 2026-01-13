
import { GoogleGenAI, Type } from "@google/genai";
import { ChartConfig, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = "gemini-3-flash-preview"; // Actualizado a la versión recomendada para tareas complejas

const calculateAge = (birthDate?: string) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

export const analyzePlayerStats = async (config: ChartConfig): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const activePlayers = config.players.filter(p => p.visible !== false);
  if (activePlayers.length === 0) throw new Error("No hay jugadores visibles.");

  const playersData = activePlayers.map(p => ({
    id: p.id,
    name: p.name,
    position: p.position,
    age: calculateAge(p.birthDate),
    stats: p.values
  }));

  const prompt = `
    Actúa como un scout de fútbol de clase mundial. Analiza a los siguientes jugadores basándote en sus estadísticas (0-100) y las categorías: ${config.categories.join(', ')}.

    DATOS DE LOS JUGADORES:
    ${JSON.stringify(playersData)}

    INSTRUCCIONES:
    Para CADA jugador, genera:
    1. Un análisis técnico detallado (puntos fuertes y áreas de mejora).
    2. Una frase de resumen ejecutivo (máximo 15 palabras) que defina su perfil.

    DEBES responder en este formato JSON exacto:
    {
      "players": [
        {
          "id": "ID_DEL_JUGADOR",
          "detailedAnalysis": "Markdown del análisis...",
          "executiveSummary": "Frase resumen impactante..."
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Error al generar el análisis.");
  }
};

export const sendChatMessage = async (
  message: string, 
  history: ChatMessage[], 
  config: ChartConfig
): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");

  const activePlayers = config.players.filter(p => p.visible !== false);
  const contextData = JSON.stringify({
    title: config.title,
    categories: config.categories,
    players: activePlayers.map(p => ({ 
        name: p.name, 
        age: calculateAge(p.birthDate),
        pos: p.position,
        val: p.marketValue,
        values: p.values 
    }))
  });

  const systemInstruction = `Eres un asistente experto en scouting. Datos actuales: ${contextData}. Responde en Español de forma profesional y concisa.`;

  try {
    const chat = ai.chats.create({
      model: modelName,
      config: { systemInstruction: systemInstruction },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    const result = await chat.sendMessage({ message: message });
    return result.text || "No pude generar una respuesta.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("Error al conectar con el asistente.");
  }
};
