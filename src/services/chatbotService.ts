import { knowledgeBase } from './knowledgeBase';

/**
 * Busca coincidencias en la base de conocimiento
 * usando análisis de similitud de palabras clave
 */
export async function getAssistantResponse(userQuestion: string): Promise<string> {
  const normalizedQuestion = userQuestion.toLowerCase().trim();

  // Búsqueda por palabras clave exactas
  const exactMatch = findExactMatch(normalizedQuestion);
  if (exactMatch) {
    return exactMatch;
  }

  // Búsqueda por similitud de palabras clave
  const similarMatch = findSimilarMatch(normalizedQuestion);
  if (similarMatch) {
    return similarMatch;
  }

  // Si no hay coincidencia, devuelve respuesta por defecto
  return getDefaultResponse(userQuestion);
}

/**
 * Busca coincidencias exactas con las palabras clave
 */
function findExactMatch(question: string): string | null {
  for (const item of knowledgeBase) {
    for (const keyword of item.keywords) {
      if (question.includes(keyword)) {
        return item.answer;
      }
    }
  }
  return null;
}

/**
 * Busca similitud entre palabras
 * Devuelve la respuesta con mayor porcentaje de coincidencia
 */
function findSimilarMatch(question: string): string | null {
  let bestMatch = {
    item: null as typeof knowledgeBase[0] | null,
    score: 0,
  };

  const questionWords = question.split(/\s+/);

  for (const item of knowledgeBase) {
    for (const keyword of item.keywords) {
      const keywordWords = keyword.split(/\s+/);
      const score = calculateSimilarity(questionWords, keywordWords);

      if (score > bestMatch.score && score >= 0.5) {
        bestMatch = { item, score };
      }
    }
  }

  return bestMatch.item ? bestMatch.item.answer : null;
}

/**
 * Calcula similitud entre dos conjuntos de palabras (Jaccard Index)
 */
function calculateSimilarity(words1: string[], words2: string[]): number {
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Respuesta por defecto cuando no hay coincidencia
 */
function getDefaultResponse(userQuestion: string): string {
  const responses = [
    `Entendí tu pregunta: "${userQuestion}"\n\nLamentablemente, no encontré una respuesta específica en nuestra base de conocimiento. Sin embargo, puedo ayudarte de otras formas:\n\n📧 Contacta a nuestro equipo: soporte@nexoargentina.app\n💬 Usa el chat en vivo (lunes-viernes 9-18 hs)\n📚 Revisa nuestra documentación completa\n\n¿Hay algo más que pueda ayudarte?`,

    `No tengo una respuesta exacta para "${userQuestion}".\n\nPero puedo sugerirte:\n✓ Consulta el Centro de Ayuda\n✓ Explora los tutoriales en video\n✓ Contacta al equipo de soporte\n\n¿Quizás podrías formular tu pregunta de otra manera?`,

    `Hmm, esa es una pregunta interesante que no tengo en mi base de datos.\n\nTe recomiendo:\n1. Revisar la documentación de ayuda\n2. Contactar a soporte@nexoargentina.app\n3. Llamar a nuestro equipo\n\n¿Hay algo más específico en lo que pueda ayudarte?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Obtiene categorías disponibles
 */
export function getCategories(): string[] {
  const categories = new Set(knowledgeBase.map((item) => item.category));
  return Array.from(categories).sort();
}

/**
 * Obtiene preguntas por categoría
 */
export function getQuestionsByCategory(category: string) {
  return knowledgeBase.filter((item) => item.category === category);
}

/**
 * Busca en toda la base de conocimiento
 */
export function searchKnowledgeBase(query: string) {
  const normalizedQuery = query.toLowerCase();
  return knowledgeBase.filter(
    (item) =>
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery) ||
      item.keywords.some((kw) => kw.includes(normalizedQuery))
  );
}
