// Internal types for the main-panel-tabs feature

export interface Tab {
  id: string;
  label: string;
  content: HTMLElement;
}

export interface TabsController {
  getTabs(): Tab[];
  setActiveTab(tabId: string): void;
  reorderTab(fromIndex: number, toIndex: number): void;
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string;
}

