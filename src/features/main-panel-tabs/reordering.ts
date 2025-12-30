// Internal drag-and-drop reordering logic for tabs

export function setupDragAndDrop(
  tabElement: HTMLElement,
  tabBar: HTMLElement,
  onReorder: (fromIndex: number, toIndex: number) => void
): void {
  let isDragging = false;
  let originalIndex = 0;
  let currentSwapTarget: HTMLElement | null = null;

  const handleMouseDown = (e: MouseEvent) => {
    isDragging = true;
    originalIndex = Array.from(tabBar.children).indexOf(tabElement);
    tabElement.style.cursor = 'grabbing';
    tabElement.style.opacity = '0.5';
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    // Find which tab we're currently over (if any)
    const tabs = Array.from(tabBar.children) as HTMLElement[];
    let hoveredTab: HTMLElement | null = null;

    for (const tab of tabs) {
      if (tab === tabElement) continue; // Skip the dragged tab itself
      
      const rect = tab.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        hoveredTab = tab;
        break;
      }
    }

    // Only show visual feedback, don't swap until mouse up
    if (hoveredTab && hoveredTab !== currentSwapTarget) {
      // Remove previous swap target highlight if any
      if (currentSwapTarget) {
        currentSwapTarget.style.backgroundColor = '';
      }

      // Visual feedback: highlight the tab we're hovering over
      hoveredTab.style.backgroundColor = '#e8f4f8';
      currentSwapTarget = hoveredTab;
    } else if (!hoveredTab && currentSwapTarget) {
      // No longer over any tab, remove highlight
      currentSwapTarget.style.backgroundColor = '';
      currentSwapTarget = null;
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      isDragging = false;
      tabElement.style.cursor = 'grab';
      tabElement.style.opacity = '1';
      
      // Perform the swap if we're over a tab
      if (currentSwapTarget) {
        const draggedIndex = Array.from(tabBar.children).indexOf(tabElement);
        const targetIndex = Array.from(tabBar.children).indexOf(currentSwapTarget);
        
        // Only swap if we're over a different tab
        if (draggedIndex !== targetIndex) {
          // Remove both elements
          tabBar.removeChild(tabElement);
          tabBar.removeChild(currentSwapTarget);
          
          // Determine insertion order based on which was first
          if (draggedIndex < targetIndex) {
            // Dragging forward: insert target first, then dragged
            const remainingChildren = Array.from(tabBar.children);
            tabBar.insertBefore(currentSwapTarget, remainingChildren[draggedIndex] || null);
            const remainingChildren2 = Array.from(tabBar.children);
            tabBar.insertBefore(tabElement, remainingChildren2[targetIndex] || null);
          } else {
            // Dragging backward: insert dragged first, then target
            const remainingChildren = Array.from(tabBar.children);
            tabBar.insertBefore(tabElement, remainingChildren[targetIndex] || null);
            const remainingChildren2 = Array.from(tabBar.children);
            tabBar.insertBefore(currentSwapTarget, remainingChildren2[draggedIndex] || null);
          }
          
          const finalIndex = Array.from(tabBar.children).indexOf(tabElement);
          onReorder(originalIndex, finalIndex);
        }
        
        // Remove highlight
        currentSwapTarget.style.backgroundColor = '';
        currentSwapTarget = null;
      }
    }
  };

  tabElement.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

