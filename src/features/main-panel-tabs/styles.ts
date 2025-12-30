// Internal styling logic for the main-panel-tabs feature

export function applyTabsContainerStyles(container: HTMLElement): void {
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';
  container.style.width = '100%';
  container.style.overflow = 'hidden';
}

export function applyTabBarStyles(tabBar: HTMLElement): void {
  tabBar.style.display = 'flex';
  tabBar.style.flexDirection = 'row';
  tabBar.style.flexShrink = '0';
  tabBar.style.borderBottom = '2px solid #ccc';
  tabBar.style.backgroundColor = '#f8f8f8';
  tabBar.style.padding = '0';
  tabBar.style.margin = '0';
  tabBar.style.listStyle = 'none';
  tabBar.style.cursor = 'default';
}

export function applyTabStyles(tab: HTMLElement, isActive: boolean): void {
  tab.style.padding = '12px 20px';
  tab.style.cursor = 'grab';
  tab.style.userSelect = 'none';
  tab.style.borderRight = '1px solid #ddd';
  tab.style.backgroundColor = isActive ? '#ffffff' : '#f8f8f8';
  tab.style.color = isActive ? '#333' : '#666';
  tab.style.borderBottom = isActive ? '2px solid #007bff' : '2px solid transparent';
  tab.style.marginBottom = isActive ? '-2px' : '0';
  tab.style.transition = 'background-color 0.2s, color 0.2s';
  
  tab.addEventListener('mouseenter', () => {
    if (!isActive) {
      tab.style.backgroundColor = '#f0f0f0';
    }
  });
  
  tab.addEventListener('mouseleave', () => {
    if (!isActive) {
      tab.style.backgroundColor = '#f8f8f8';
    }
  });
}

export function applyTabContentAreaStyles(contentArea: HTMLElement): void {
  contentArea.style.flex = '1';
  contentArea.style.overflow = 'auto';
  contentArea.style.padding = '20px';
  contentArea.style.backgroundColor = '#ffffff';
}

export function applyDraggingStyles(tab: HTMLElement): void {
  tab.style.opacity = '0.5';
  tab.style.cursor = 'grabbing';
}

export function removeDraggingStyles(tab: HTMLElement): void {
  tab.style.opacity = '1';
  tab.style.cursor = 'grab';
}

