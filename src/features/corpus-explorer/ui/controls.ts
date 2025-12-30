// Controls panel UI (corpus selection and file upload)

import type { CorpusLoader } from '../corpus/types';

export function createControlsPanel(
  container: HTMLElement,
  corpusLoader: CorpusLoader,
  onCorpusLoad: (text: string, name: string, isCustom?: boolean) => void,
  onExportCSV?: () => void,
  canExport?: boolean,
  selectedPreset?: string
): void {
  container.innerHTML = '';

  // Create controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.style.display = 'flex';
  controlsContainer.style.gap = '20px';
  controlsContainer.style.alignItems = 'center';
  controlsContainer.style.justifyContent = 'space-between';
  controlsContainer.style.flexWrap = 'wrap';
  
  // Left section: preset and load buttons
  const leftSection = document.createElement('div');
  leftSection.style.display = 'flex';
  leftSection.style.gap = '20px';
  leftSection.style.alignItems = 'center';
  leftSection.style.flexWrap = 'wrap';

  // Preset corpus selection
  const presetLabel = document.createElement('label');
  presetLabel.textContent = 'Preset Corpus:';
  presetLabel.style.marginRight = '10px';
  leftSection.appendChild(presetLabel);

  const presetSelect = document.createElement('select');
  presetSelect.id = 'preset-corpus-select';
  presetSelect.style.padding = '8px';
  presetSelect.style.minWidth = '200px';
  
  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select a corpus --';
  presetSelect.appendChild(defaultOption);

  // Load preset list and populate dropdown
  corpusLoader.listPresets().then((presets) => {
    for (const preset of presets) {
      const option = document.createElement('option');
      option.value = preset;
      option.textContent = preset.replace('.txt', '');
      presetSelect.appendChild(option);
    }
    
    // Add "Custom" option only if selectedPreset indicates a custom file
    if (selectedPreset === '__custom__') {
      const customOption = document.createElement('option');
      customOption.value = '__custom__';
      customOption.textContent = 'Custom';
      presetSelect.appendChild(customOption);
    }
    
    // Set the selected value after options are populated
    if (selectedPreset) {
      presetSelect.value = selectedPreset;
    }
  });

  // Handle preset selection
  presetSelect.addEventListener('change', async () => {
    const selectedPreset = presetSelect.value;
    if (!selectedPreset || selectedPreset === '__custom__') return;

    try {
      presetSelect.disabled = true;
      presetSelect.style.opacity = '0.6';
      const text = await corpusLoader.loadPreset(selectedPreset);
      onCorpusLoad(text, selectedPreset, false);
      
      // Remove "Custom" option if it exists (switching from custom to preset)
      const customOption = presetSelect.querySelector('option[value="__custom__"]');
      if (customOption) {
        presetSelect.removeChild(customOption);
      }
    } catch (error) {
      alert(`Error loading corpus: ${error}`);
    } finally {
      presetSelect.disabled = false;
      presetSelect.style.opacity = '1';
    }
  });

  leftSection.appendChild(presetSelect);

  // Divider
  const divider = document.createElement('span');
  divider.textContent = 'or';
  divider.style.margin = '0 10px';
  divider.style.color = '#666';
  leftSection.appendChild(divider);

  // Custom file upload
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt';
  fileInput.style.display = 'none';
  fileInput.id = 'custom-corpus-input';

  const fileButton = document.createElement('button');
  fileButton.textContent = 'Load Custom Corpus';
  fileButton.style.padding = '8px 16px';
  fileButton.style.cursor = 'pointer';
  fileButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      fileButton.disabled = true;
      fileButton.style.opacity = '0.6';
      fileButton.textContent = 'Loading...';
      const text = await corpusLoader.loadCustom(file);
      onCorpusLoad(text, file.name, true);
      
      // Add "Custom" option if it doesn't exist
      const customOption = presetSelect.querySelector('option[value="__custom__"]');
      if (!customOption) {
        const newCustomOption = document.createElement('option');
        newCustomOption.value = '__custom__';
        newCustomOption.textContent = 'Custom';
        presetSelect.appendChild(newCustomOption);
      }
      presetSelect.value = '__custom__';
      
      // Reset file input
      fileInput.value = '';
    } catch (error) {
      alert(`Error loading file: ${error}`);
    } finally {
      fileButton.disabled = false;
      fileButton.style.opacity = '1';
      fileButton.textContent = 'Load Custom Corpus';
    }
  });

  leftSection.appendChild(fileInput);
  leftSection.appendChild(fileButton);
  
  controlsContainer.appendChild(leftSection);
  
  // Right section: export button (only show if corpus is loaded)
  if (onExportCSV && canExport) {
    const rightSection = document.createElement('div');
    
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Save to CSV';
    exportButton.style.padding = '8px 16px';
    exportButton.style.cursor = 'pointer';
    exportButton.addEventListener('click', () => {
      onExportCSV();
    });
    
    rightSection.appendChild(exportButton);
    controlsContainer.appendChild(rightSection);
  }

  container.appendChild(controlsContainer);
}

