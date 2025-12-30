// Search matching (plain text and regex)

import type { SearchSettings } from '../types';

/**
 * Check if a text string matches the search query.
 * Supports both plain text matching and regex.
 */
export function matchesSearch(text: string, settings: SearchSettings): boolean {
  const { query, useRegex } = settings;

  // Empty query matches everything
  if (!query) {
    return true;
  }

  try {
    if (useRegex) {
      // Use regex matching
      const flags = settings.filters.caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(query, flags);
      return regex.test(text);
    } else {
      // Plain text matching
      const searchText = settings.filters.caseSensitive 
        ? text 
        : text.toLowerCase();
      const searchQuery = settings.filters.caseSensitive 
        ? query 
        : query.toLowerCase();
      return searchText.includes(searchQuery);
    }
  } catch (error) {
    // Invalid regex - don't match anything
    return false;
  }
}

