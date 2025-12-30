// Internal tab creation and management logic

import {
  applyTabsContainerStyles,
  applyTabBarStyles,
  applyTabStyles,
  applyTabContentAreaStyles,
} from './styles';
import { setupDragAndDrop } from './reordering';
import type { Tab, TabState } from './types';

export function createTabsStructure(
  container: HTMLElement,
  tabs: Tab[],
  defaultTabId: string,
  onTabChange: (tabId: string) => void,
  onReorder: (fromIndex: number, toIndex: number) => void
): TabState {
  // Clear container and apply styles
  container.innerHTML = '';
  applyTabsContainerStyles(container);

  // Create tab bar
  const tabBar = document.createElement('ul');
  tabBar.id = 'tabs-bar';
  applyTabBarStyles(tabBar);

  // Create tab content area
  const contentArea = document.createElement('div');
  contentArea.id = 'tabs-content';
  applyTabContentAreaStyles(contentArea);

  // Create state
  const state: TabState = {
    tabs: [...tabs], // Copy to avoid mutating original
    activeTabId: defaultTabId,
  };

  // Create tab elements
  tabs.forEach((tab, index) => {
    const tabElement = document.createElement('li');
    tabElement.textContent = tab.label;
    tabElement.id = `tab-${tab.id}`;
    tabElement.setAttribute('data-tab-id', tab.id);
    
    const isActive = tab.id === defaultTabId;
    applyTabStyles(tabElement, isActive);

    // Click handler for tab switching
    tabElement.addEventListener('click', (e: MouseEvent) => {
      // Only switch if not dragging (simple check)
      if (!tabElement.style.opacity || tabElement.style.opacity === '1') {
        setActiveTab(tab.id, state, tabBar, contentArea, tabs);
        onTabChange(tab.id);
      }
    });

    // Setup drag and drop
    setupDragAndDrop(tabElement, tabBar, (from, to) => {
      // Reorder in state
      const [movedTab] = state.tabs.splice(from, 1);
      state.tabs.splice(to, 0, movedTab);
      
      onReorder(from, to);
    });

    tabBar.appendChild(tabElement);
  });

  // Set initial active tab content
  const activeTab = tabs.find(t => t.id === defaultTabId);
  if (activeTab) {
    contentArea.appendChild(activeTab.content);
  }

  container.appendChild(tabBar);
  container.appendChild(contentArea);

  return state;
}

export function setActiveTab(
  tabId: string,
  state: TabState,
  tabBar: HTMLElement,
  contentArea: HTMLElement,
  tabs: Tab[]
): void {
  state.activeTabId = tabId;

  // Update tab styles
  const tabElements = Array.from(tabBar.children) as HTMLElement[];
  tabElements.forEach((tabEl) => {
    const elTabId = tabEl.getAttribute('data-tab-id')!;
    const isActive = elTabId === tabId;
    applyTabStyles(tabEl, isActive);
  });

  // Update content
  contentArea.innerHTML = '';
  const activeTab = tabs.find(t => t.id === tabId);
  if (activeTab) {
    contentArea.appendChild(activeTab.content);
  }
}

