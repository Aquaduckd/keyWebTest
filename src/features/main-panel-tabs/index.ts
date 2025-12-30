// Public API for the main-panel-tabs feature
// This is the only entry point for consumers

import { createTabsStructure, setActiveTab } from './tabs';
import type { Tab, TabState, TabsController } from './types';

let currentState: TabState | null = null;
let currentTabBar: HTMLElement | null = null;
let currentContentArea: HTMLElement | null = null;
let currentTabs: Tab[] = [];

/**
 * Initializes tabs in the provided container element.
 * 
 * @param container - The DOM element that will contain the tabs
 * @param tabs - Array of tab definitions
 * @param defaultTabId - ID of the tab to show by default
 * @returns A controller for programmatic tab management
 */
export function initializeTabs(
  container: HTMLElement,
  tabs: Tab[],
  defaultTabId?: string
): TabsController {
  // Use first tab as default if not specified
  const activeTabId = defaultTabId || tabs[0]?.id || '';
  
  currentTabs = tabs;
  
  const state = createTabsStructure(
    container,
    tabs,
    activeTabId,
    (tabId) => {
      // Tab change callback (can be extended later)
    },
    (from, to) => {
      // Reorder callback (can be extended later)
    }
  );

  currentState = state;
  currentTabBar = container.querySelector('#tabs-bar') as HTMLElement;
  currentContentArea = container.querySelector('#tabs-content') as HTMLElement;

  return {
    getTabs(): Tab[] {
      return currentState ? [...currentState.tabs] : [];
    },
    
    setActiveTab(tabId: string): void {
      if (currentState && currentTabBar && currentContentArea) {
        setActiveTab(tabId, currentState, currentTabBar, currentContentArea, currentTabs);
      }
    },
    
    reorderTab(fromIndex: number, toIndex: number): void {
      if (currentState && currentTabBar) {
        // Reorder in state
        const [movedTab] = currentState.tabs.splice(fromIndex, 1);
        currentState.tabs.splice(toIndex, 0, movedTab);
        
        // Reorder in DOM
        const tabElements = Array.from(currentTabBar.children) as HTMLElement[];
        const [movedElement] = tabElements.splice(fromIndex, 1);
        currentTabBar.insertBefore(movedElement, tabElements[toIndex] || null);
      }
    },
  };
}

// Re-export the types that consumers need
export type { Tab, TabsController };

