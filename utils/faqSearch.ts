import type { FaqItem } from "@/data/faq";

type NormalizedFaqItem = {
  item: FaqItem;
  originalIndex: number;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
};

type ScoredFaqItem = {
  item: FaqItem;
  originalIndex: number;
  matchedTermCount: number;
  score: number;
};

const MIN_SINGLE_TERM_SCORE = 10;
const MIN_MULTI_TERM_SCORE = 18;
const GENERIC_RANKING_TERMS = new Set(["animal", "animales", "fauna"]);

export const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

export const tokenizeFaqSearchQuery = (query: string): string[] => {
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean);

  return tokens.filter((token, index) => tokens.indexOf(token) === index);
};

const normalizeFaqItem = (
  item: FaqItem,
  originalIndex: number,
): NormalizedFaqItem => ({
  item,
  originalIndex,
  question: normalizeSearchText(item.question),
  answer: normalizeSearchText(item.answer),
  category: normalizeSearchText(item.category),
  keywords: (item.keywords ?? []).map(normalizeSearchText),
});

const hasKeywordPhraseMatch = (keywords: string[], phrase: string) =>
  keywords.some((keyword) => keyword === phrase || keyword.includes(phrase));

const scoreFaqItem = (
  normalizedItem: NormalizedFaqItem,
  terms: string[],
  phrase: string,
): ScoredFaqItem | null => {
  let score = 0;
  let matchedTermCount = 0;

  for (const term of terms) {
    const keywordExactMatch = normalizedItem.keywords.some(
      (keyword) => keyword === term,
    );
    const keywordPartialMatch = normalizedItem.keywords.some((keyword) =>
      keyword.includes(term),
    );
    const questionMatch = normalizedItem.question.includes(term);
    const categoryMatch = normalizedItem.category.includes(term);
    const answerMatch = normalizedItem.answer.includes(term);
    const termMatched =
      keywordPartialMatch || questionMatch || categoryMatch || answerMatch;

    if (!termMatched) {
      continue;
    }

    matchedTermCount += 1;

    if (keywordExactMatch) {
      score += 12;
    } else if (keywordPartialMatch) {
      score += 8;
    }

    if (questionMatch) score += 10;
    if (categoryMatch) score += 5;
    if (answerMatch) score += 2;
  }

  const allTermsMatch = matchedTermCount === terms.length;
  const meaningfulRankingTerms =
    terms.length > 1
      ? terms.filter((term) => !GENERIC_RANKING_TERMS.has(term))
      : terms;
  const termsForQuestionKeywordBonus =
    meaningfulRankingTerms.length > 0 ? meaningfulRankingTerms : terms;
  const allTermsInQuestionOrKeywords = termsForQuestionKeywordBonus.every(
    (term) =>
      normalizedItem.question.includes(term) ||
      normalizedItem.keywords.some((keyword) => keyword.includes(term)),
  );
  const phraseInQuestion = normalizedItem.question.includes(phrase);
  const phraseInKeyword = hasKeywordPhraseMatch(normalizedItem.keywords, phrase);

  if (allTermsMatch) score += 20;
  if (allTermsInQuestionOrKeywords) score += 15;
  if (phraseInQuestion) score += 25;
  if (phraseInKeyword) score += 20;

  const minimumScore =
    terms.length > 1 ? MIN_MULTI_TERM_SCORE : MIN_SINGLE_TERM_SCORE;
  const shouldInclude =
    allTermsMatch ||
    score >= minimumScore ||
    phraseInQuestion ||
    phraseInKeyword;

  if (!shouldInclude) {
    return null;
  }

  return {
    item: normalizedItem.item,
    originalIndex: normalizedItem.originalIndex,
    matchedTermCount,
    score,
  };
};

export function searchFaqItems(items: FaqItem[], query: string): FaqItem[] {
  const terms = tokenizeFaqSearchQuery(query);

  if (terms.length === 0) {
    return items;
  }

  const phrase = normalizeSearchText(query);

  return items
    .map(normalizeFaqItem)
    .map((item) => scoreFaqItem(item, terms, phrase))
    .filter((item): item is ScoredFaqItem => item !== null)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.matchedTermCount !== a.matchedTermCount) {
        return b.matchedTermCount - a.matchedTermCount;
      }

      return a.originalIndex - b.originalIndex;
    })
    .map(({ item }) => item);
}
