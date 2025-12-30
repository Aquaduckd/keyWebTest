// Public API for the three-panel layout feature
// This is the only entry point for consumers

import { createLayoutStructure } from './layout';
import type { LayoutPanels } from './types';

/**
 * Initializes the three-panel layout structure in the provided root element.
 * 
 * @param rootElement - The DOM element that will contain the layout
 * @returns An object containing references to all panel elements
 */
export function initializeLayout(rootElement: HTMLElement): LayoutPanels {
  return createLayoutStructure(rootElement);
}

// Re-export the types that consumers need
export type { LayoutPanels };

