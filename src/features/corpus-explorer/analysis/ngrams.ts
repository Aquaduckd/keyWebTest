// N-gram analysis (monograms, bigrams, trigrams, and words)

import type { NGramData, FilterSettings, WordData } from '../types';

interface RawNGramCounts {
  monograms: Map<string, number>;
  bigrams: Map<string, number>;
  trigrams: Map<string, number>;
  words: Map<string, number>;
}

/**
 * Extended Map structure that includes the total count.
 * This allows totals to be calculated once during filtering/reaggregation.
 */
interface CountMap {
  map: Map<string, number>;
  total: number;
}

/**
 * Check if a character is whitespace (word boundary).
 */
function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

/**
 * Calculate all n-grams and words in a single pass through the text.
 * Returns raw counts before filtering.
 */
export function calculateNGrams(text: string): RawNGramCounts {
  const monogramCounts = new Map<string, number>();
  const bigramCounts = new Map<string, number>();
  const trigramCounts = new Map<string, number>();
  const wordCounts = new Map<string, number>();

  let currentWord = '';

  // Single pass through the text
  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Count monogram
    monogramCounts.set(char, (monogramCounts.get(char) || 0) + 1);

    // Count bigram if available
    if (i + 1 < text.length) {
      const bigram = text[i] + text[i + 1];
      bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
    }

    // Count trigram if available
    if (i + 2 < text.length) {
      const trigram = text[i] + text[i + 1] + text[i + 2];
      trigramCounts.set(trigram, (trigramCounts.get(trigram) || 0) + 1);
    }

    // Extract words: split by whitespace (words can contain punctuation)
    if (isWhitespace(char)) {
      // Hit whitespace, add current word if it's not empty
      if (currentWord.length > 0) {
        wordCounts.set(currentWord, (wordCounts.get(currentWord) || 0) + 1);
        currentWord = '';
      }
    } else {
      // Add any non-whitespace character to current word
      currentWord += char;
    }
  }

  // Add final word if text doesn't end with whitespace
  if (currentWord.length > 0) {
    wordCounts.set(currentWord, (wordCounts.get(currentWord) || 0) + 1);
  }

  return {
    monograms: monogramCounts,
    bigrams: bigramCounts,
    trigrams: trigramCounts,
    words: wordCounts,
  };
}

/**
 * Filter n-grams based on filter settings and reaggregate.
 * More efficient than filtering text first for large corpora.
 */
function shouldFilterSequence(sequence: string, filters: FilterSettings): boolean {
  // Check if sequence contains characters that should be filtered
  for (const char of sequence) {
    if (filters.filterWhitespace && /\s/.test(char)) {
      return true;
    }
    if (filters.filterPunctuation && /[^\w\s]/.test(char)) {
      return true;
    }
  }
  return false;
}

/**
 * Apply case sensitivity normalization if needed.
 */
function normalizeSequence(sequence: string, caseSensitive: boolean): string {
  return caseSensitive ? sequence : sequence.toLowerCase();
}

/**
 * Filter and reaggregate n-gram counts.
 * Returns a CountMap with both the filtered map and the total count.
 */
function filterAndReaggregate(
  counts: Map<string, number>,
  filters: FilterSettings
): CountMap {
  const filtered = new Map<string, number>();
  let total = 0;

  for (const [sequence, frequency] of counts.entries()) {
    // Skip sequences that should be filtered
    if (shouldFilterSequence(sequence, filters)) {
      continue;
    }

    // Normalize case if needed
    const normalized = normalizeSequence(sequence, filters.caseSensitive);

    // Reaggregate (combine counts for sequences that normalize to the same value)
    const existingCount = filtered.get(normalized) || 0;
    filtered.set(normalized, existingCount + frequency);
    total += frequency;
  }

  return { map: filtered, total };
}

/**
 * Convert CountMap to sorted array with ranks.
 */
function mapToRankedArray(countMap: CountMap): NGramData[] {
  const entries = Array.from(countMap.map.entries());
  
  // Sort by frequency (descending), then by sequence (ascending) for ties
  entries.sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1]; // Higher frequency first
    }
    return a[0].localeCompare(b[0]); // Alphabetical for ties
  });

  // Add ranks
  return entries.map(([sequence, frequency], index) => ({
    sequence,
    frequency,
    rank: index + 1,
  }));
}

/**
 * Convert word counts CountMap to sorted array (WordData format).
 */
function mapToRankedWordArray(countMap: CountMap): WordData[] {
  const entries = Array.from(countMap.map.entries());
  
  // Sort by frequency (descending), then by word (ascending) for ties
  entries.sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1]; // Higher frequency first
    }
    return a[0].localeCompare(b[0]); // Alphabetical for ties
  });

  // Return as WordData (no rank field, but we'll add it when converting to NGramData for display)
  return entries.map(([word, frequency]) => ({
    word,
    frequency,
  }));
}

/**
 * Filter and reaggregate word counts.
 * Returns a CountMap with both the filtered map and the total count.
 */
function filterAndReaggregateWords(
  counts: Map<string, number>,
  filters: FilterSettings
): CountMap {
  const filtered = new Map<string, number>();
  let total = 0;

  for (const [word, frequency] of counts.entries()) {
    // Words are split by whitespace (can contain punctuation like "don't", "it's")
    // Just normalize case if needed
    const normalized = normalizeSequence(word, filters.caseSensitive);

    // Reaggregate (combine counts for words that normalize to the same value)
    const existingCount = filtered.get(normalized) || 0;
    filtered.set(normalized, existingCount + frequency);
    total += frequency;
  }

  return { map: filtered, total };
}

/**
 * Calculate all n-grams and words, apply filters, and return ranked results.
 */
export function calculateFilteredNGrams(
  text: string,
  filters: FilterSettings
): {
  monograms: NGramData[];
  bigrams: NGramData[];
  trigrams: NGramData[];
  words: WordData[];
  totals: {
    monograms: number;
    bigrams: number;
    trigrams: number;
    words: number;
  };
} {
  // First, calculate all n-grams and words in one pass
  const rawCounts = calculateNGrams(text);

  // Then filter and reaggregate (returns CountMap with totals)
  const filteredMonograms = filterAndReaggregate(rawCounts.monograms, filters);
  const filteredBigrams = filterAndReaggregate(rawCounts.bigrams, filters);
  const filteredTrigrams = filterAndReaggregate(rawCounts.trigrams, filters);
  const filteredWords = filterAndReaggregateWords(rawCounts.words, filters);

  // Extract totals from CountMap structures
  const totals = {
    monograms: filteredMonograms.total,
    bigrams: filteredBigrams.total,
    trigrams: filteredTrigrams.total,
    words: filteredWords.total,
  };

  // Convert to ranked arrays
  return {
    monograms: mapToRankedArray(filteredMonograms),
    bigrams: mapToRankedArray(filteredBigrams),
    trigrams: mapToRankedArray(filteredTrigrams),
    words: mapToRankedWordArray(filteredWords),
    totals,
  };
}

