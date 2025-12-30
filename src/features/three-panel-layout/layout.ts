// Internal DOM structure creation for the three-panel layout

import {
  applyLayoutStyles,
  applyHeaderStyles,
  applyContentAreaStyles,
  applyLeftPanelStyles,
  applyMainPanelStyles,
  applyBottomPanelStyles,
} from './styles';
import type { LayoutPanels } from './types';

export function createLayoutStructure(rootElement: HTMLElement): LayoutPanels {
  // Clear any existing content
  rootElement.innerHTML = '';

  // Apply container styles
  applyLayoutStyles(rootElement);

  // Create header
  const header = document.createElement('header');
  header.id = 'layout-header';
  applyHeaderStyles(header);

  // Create content area (contains left panel and main panel)
  const contentArea = document.createElement('div');
  contentArea.id = 'layout-content-area';
  applyContentAreaStyles(contentArea);

  // Create left panel
  const leftPanel = document.createElement('aside');
  leftPanel.id = 'layout-left-panel';
  applyLeftPanelStyles(leftPanel);

  // Create main panel
  const mainPanel = document.createElement('main');
  mainPanel.id = 'layout-main-panel';
  applyMainPanelStyles(mainPanel);

  // Create bottom panel
  const bottomPanel = document.createElement('footer');
  bottomPanel.id = 'layout-bottom-panel';
  applyBottomPanelStyles(bottomPanel);

  // Assemble the structure
  contentArea.appendChild(leftPanel);
  contentArea.appendChild(mainPanel);

  rootElement.appendChild(header);
  rootElement.appendChild(contentArea);
  rootElement.appendChild(bottomPanel);

  return {
    header,
    leftPanel,
    mainPanel,
    bottomPanel,
  };
}

