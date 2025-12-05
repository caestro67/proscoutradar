import { GoogleGenAI } from "@google/genai";
import { ChartConfig } from "../types";

// Initialize safely - if key is missing, methods will throw/fail gracefully
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePlayerStats = async (config: ChartConfig): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  const model = "gemini-2.5-flash";
  
  // Construct a prompt based on the chart data
  const playersText = config.players.map(p => 
    `${p.name}: [${p.values.join(', ')}]`
  ).join('\n');

  const categoriesText = config.categories.join(', ');

  const prompt = `
    Actúa como un scout de fútbol de clase mundial y analista de datos.
    
    Tengo un gráfico de radar titulado "${config.title}".
    Las categorías (ejes) son: ${categoriesText}.
    La escala es generalmente 0-100 (rango percentil o métrica normalizada).

    Aquí están los datos de los jugadores:
    ${playersText}

    Por favor, proporciona un análisis conciso pero perspicaz EN ESPAÑOL:
    1. Identifica el estilo de juego principal del jugador(es) basado en métricas altas/bajas.
    2. Destaca las fortalezas clave y las posibles debilidades.
    3. Si hay varios jugadores, compáralos brevemente.
    
    Formatea la salida en Markdown limpio. Manténlo por debajo de 250 palabras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Error al generar el análisis. Por favor verifica tu API key e intenta de nuevo.");
  }
};