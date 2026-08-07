import { faqItems, type FaqItem } from "@/data/faq";

type NormalizedFaqItemData = {
  item: FaqItem;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
};

type NormalizedFaqItem = NormalizedFaqItemData & {
  originalIndex: number;
};

type ScoredFaqItem = {
  item: FaqItem;
  originalIndex: number;
  matchedTermCount: number;
  score: number;
};

type SearchPhraseMatcher = {
  phrase: string;
  matches: (text: string) => boolean;
};

const MIN_SINGLE_TERM_SCORE = 10;
const MIN_MULTI_TERM_SCORE = 18;
const GENERIC_RANKING_TERMS = new Set(["animal", "animales", "fauna"]);
const SEARCH_STOP_WORDS = new Set([
  "a",
  "al",
  "de",
  "del",
  "el",
  "en",
  "esta",
  "está",
  "he",
  "la",
  "lo",
  "que",
  "qué",
  "un",
  "una",
]);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const createSearchPhraseMatcher = (phrase: string): SearchPhraseMatcher => {
  const matcher = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(phrase)}($|[^\\p{L}\\p{N}])`,
    "u",
  );

  return {
    phrase,
    matches: (text: string) => matcher.test(text),
  };
};

export const tokenizeFaqSearchQuery = (query: string): string[] => {
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean);

  return tokens.filter(
    (token, index) =>
      !SEARCH_STOP_WORDS.has(token) && tokens.indexOf(token) === index,
  );
};

const normalizeFaqItem = (
  item: FaqItem,
): NormalizedFaqItemData => ({
  item,
  question: normalizeSearchText(item.question),
  answer: normalizeSearchText(item.answer),
  category: normalizeSearchText(item.category),
  keywords: (item.keywords ?? []).map(normalizeSearchText),
});

const normalizedFaqItemCache = new WeakMap<FaqItem, NormalizedFaqItemData>();

const getNormalizedFaqItem = (
  item: FaqItem,
  originalIndex: number,
): NormalizedFaqItem => {
  const cachedItem = normalizedFaqItemCache.get(item);

  if (cachedItem) {
    return {
      ...cachedItem,
      originalIndex,
    };
  }

  const normalizedItem = normalizeFaqItem(item);
  normalizedFaqItemCache.set(item, normalizedItem);

  return {
    ...normalizedItem,
    originalIndex,
  };
};

faqItems.forEach((item) => {
  normalizedFaqItemCache.set(item, normalizeFaqItem(item));
});

const hasKeywordPhraseMatch = (
  keywords: string[],
  phraseMatcher: SearchPhraseMatcher,
) =>
  keywords.some(
    (keyword) =>
      keyword === phraseMatcher.phrase || phraseMatcher.matches(keyword),
  );

const scoreFaqItem = (
  normalizedItem: NormalizedFaqItem,
  termMatchers: SearchPhraseMatcher[],
  phraseMatcher: SearchPhraseMatcher,
): ScoredFaqItem | null => {
  let score = 0;
  let matchedTermCount = 0;

  for (const termMatcher of termMatchers) {
    const keywordExactMatch = normalizedItem.keywords.some(
      (keyword) => keyword === termMatcher.phrase,
    );
    const keywordPartialMatch = normalizedItem.keywords.some((keyword) =>
      termMatcher.matches(keyword),
    );
    const questionMatch = termMatcher.matches(normalizedItem.question);
    const categoryMatch = termMatcher.matches(normalizedItem.category);
    const answerMatch = termMatcher.matches(normalizedItem.answer);
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

  const allTermsMatch = matchedTermCount === termMatchers.length;
  const meaningfulRankingTermMatchers =
    termMatchers.length > 1
      ? termMatchers.filter(
          (termMatcher) => !GENERIC_RANKING_TERMS.has(termMatcher.phrase),
        )
      : termMatchers;
  const termMatchersForQuestionKeywordBonus =
    meaningfulRankingTermMatchers.length > 0
      ? meaningfulRankingTermMatchers
      : termMatchers;
  const allTermsInQuestionOrKeywords =
    termMatchersForQuestionKeywordBonus.every(
      (termMatcher) =>
        termMatcher.matches(normalizedItem.question) ||
        normalizedItem.keywords.some((keyword) =>
          termMatcher.matches(keyword),
        ),
    );
  const phraseInQuestion = phraseMatcher.matches(normalizedItem.question);
  const phraseInKeyword = hasKeywordPhraseMatch(
    normalizedItem.keywords,
    phraseMatcher,
  );

  if (allTermsMatch) score += 20;
  if (allTermsInQuestionOrKeywords) score += 15;
  if (phraseInQuestion) score += 25;
  if (phraseInKeyword) score += 20;

  const minimumScore =
    termMatchers.length > 1 ? MIN_MULTI_TERM_SCORE : MIN_SINGLE_TERM_SCORE;
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
  const termMatchers = terms.map(createSearchPhraseMatcher);
  const phraseMatcher = createSearchPhraseMatcher(phrase);

  return items
    .map(getNormalizedFaqItem)
    .map((item) => scoreFaqItem(item, termMatchers, phraseMatcher))
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
