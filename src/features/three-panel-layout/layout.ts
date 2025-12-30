// Internal DOM structure creation for the three-panel layout

import {
  applyLayoutStyles,
  applyHeaderStyles,
  applyBottomAreaStyles,
  applyRightAreaStyles,
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

  // Create bottom area (contains left panel and right area with main panel and bottom panel)
  const bottomArea = document.createElement('div');
  bottomArea.id = 'layout-bottom-area';
  applyBottomAreaStyles(bottomArea);

  // Create left panel (extends full height)
  const leftPanel = document.createElement('aside');
  leftPanel.id = 'layout-left-panel';
  applyLeftPanelStyles(leftPanel);

  // Create right area (contains main panel and bottom panel)
  const rightArea = document.createElement('div');
  rightArea.id = 'layout-right-area';
  applyRightAreaStyles(rightArea);

  // Create main panel
  const mainPanel = document.createElement('main');
  mainPanel.id = 'layout-main-panel';
  applyMainPanelStyles(mainPanel);

  // Create bottom panel
  const bottomPanel = document.createElement('footer');
  bottomPanel.id = 'layout-bottom-panel';
  applyBottomPanelStyles(bottomPanel);

  // Assemble the structure
  rightArea.appendChild(mainPanel);
  rightArea.appendChild(bottomPanel);

  bottomArea.appendChild(leftPanel);
  bottomArea.appendChild(rightArea);

  rootElement.appendChild(header);
  rootElement.appendChild(bottomArea);

  return {
    header,
    leftPanel,
    mainPanel,
    bottomPanel,
  };
}

