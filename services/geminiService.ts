import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAccessibility = async (htmlContent: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Проанализируй следующий фрагмент HTML-кода с точки зрения доступности (Accessibility/WCAG).
      Укажи на основные проблемы, отсутствующие атрибуты (например, aria-labels, alt) и семантические ошибки.
      Дай краткие рекомендации по исправлению на русском языке. Сделай ответ структурированным и кратким.
      
      HTML код:
      \`\`\`html
      ${htmlContent}
      \`\`\`
      `,
      config: {
        temperature: 0.3,
      }
    });

    return response.text || "Не удалось получить анализ.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Произошла ошибка при анализе доступности. Пожалуйста, проверьте ваш API ключ или повторите попытку позже.";
  }
};
