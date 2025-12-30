// Main entry point for the application
// This file coordinates features but does not contain feature logic

import { initializeLayout } from './features/three-panel-layout';
import { initializeTabs } from './features/main-panel-tabs';
import { initializeCorpusExplorer } from './features/corpus-explorer';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Initialize the three-panel layout
const panels = initializeLayout(app);

// Populate the panels with initial content
panels.header.textContent = 'KeySharp';
panels.leftPanel.textContent = 'Left Panel';
panels.bottomPanel.textContent = 'Bottom Panel';

// Create tab content elements
const layoutContent = document.createElement('div');
layoutContent.innerHTML = '<h2>Layout</h2><p>Layout configuration will go here.</p>';

const statsContent = document.createElement('div');
statsContent.innerHTML = '<h2>Stats</h2><p>Statistics will go here.</p>';

const corpusContent = document.createElement('div');
initializeCorpusExplorer(corpusContent);

const settingsContent = document.createElement('div');
settingsContent.innerHTML = '<h2>Settings</h2><p>Settings will go here.</p>';

// Initialize tabs in the main panel
const tabsController = initializeTabs(panels.mainPanel, [
  { id: 'layout', label: 'Layout', content: layoutContent },
  { id: 'stats', label: 'Stats', content: statsContent },
  { id: 'corpus', label: 'Corpus', content: corpusContent },
  { id: 'settings', label: 'Settings', content: settingsContent },
], 'corpus'); // Corpus is the default tab

// Export to make this a module (required for isolatedModules)
export {};

