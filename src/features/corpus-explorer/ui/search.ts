// Search box and filters UI

import type { SearchSettings, FilterSettings } from '../types';

/**
 * Create the search panel UI with search input and regex toggle.
 */
export function createSearchPanel(
  container: HTMLElement,
  currentSettings: SearchSettings,
  onSearchChange: (settings: SearchSettings) => void
): void {
  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '10px';

  // Search input container
  const searchInputContainer = document.createElement('div');
  searchInputContainer.id = 'search-input-container';
  searchInputContainer.style.display = 'flex';
  searchInputContainer.style.alignItems = 'center';
  searchInputContainer.style.justifyContent = 'space-between';
  searchInputContainer.style.gap = '10px';

  // Left section: limit, search, regex
  const leftSection = document.createElement('div');
  leftSection.style.display = 'flex';
  leftSection.style.alignItems = 'center';
  leftSection.style.gap = '10px';

  // Limit input
  const limitLabel = document.createElement('label');
  limitLabel.textContent = 'Limit:';
  limitLabel.style.fontWeight = 'bold';
  leftSection.appendChild(limitLabel);

  const limitInput = document.createElement('input');
  limitInput.type = 'number';
  limitInput.id = 'limit-input';
  limitInput.min = '0';
  limitInput.placeholder = 'all';
  limitInput.value = currentSettings.limit > 0 ? currentSettings.limit.toString() : '';
  limitInput.style.width = '80px';
  limitInput.style.padding = '6px 12px';
  limitInput.style.border = '1px solid #ccc';
  limitInput.style.borderRadius = '4px';
  leftSection.appendChild(limitInput);

  // Search input
  const searchLabel = document.createElement('label');
  searchLabel.textContent = 'Search:';
  searchLabel.style.fontWeight = 'bold';
  leftSection.appendChild(searchLabel);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'search-input';
  searchInput.placeholder = 'Enter search query...';
  searchInput.value = currentSettings.query;
  searchInput.style.width = '200px';
  searchInput.style.padding = '6px 12px';
  searchInput.style.border = '1px solid #ccc';
  searchInput.style.borderRadius = '4px';
  leftSection.appendChild(searchInput);

  // Regex checkbox
  const regexCheckbox = document.createElement('input');
  regexCheckbox.type = 'checkbox';
  regexCheckbox.id = 'regex-toggle';
  regexCheckbox.checked = currentSettings.useRegex;
  leftSection.appendChild(regexCheckbox);

  const regexLabel = document.createElement('label');
  regexLabel.htmlFor = 'regex-toggle';
  regexLabel.textContent = 'Use Regex';
  leftSection.appendChild(regexLabel);

  searchInputContainer.appendChild(leftSection);
  container.appendChild(searchInputContainer);

  // Function to notify parent of search changes
  const notifyChange = () => {
    const limitValue = parseInt(limitInput.value, 10);
    const settings: SearchSettings = {
      query: searchInput.value,
      useRegex: regexCheckbox.checked,
      filters: currentSettings.filters, // Preserve existing filters
      limit: isNaN(limitValue) || limitValue <= 0 ? 0 : limitValue,
    };
    onSearchChange(settings);
  };

  // Add event listeners
  limitInput.addEventListener('input', notifyChange);
  searchInput.addEventListener('input', notifyChange);
  regexCheckbox.addEventListener('change', notifyChange);
}
