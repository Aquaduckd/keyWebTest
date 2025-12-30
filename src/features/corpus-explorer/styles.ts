// Styling for the corpus-explorer feature

export function applyContainerStyles(container: HTMLElement): void {
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';
  container.style.width = '100%';
  container.style.overflow = 'hidden';
  container.style.gap = '20px';
}

export function applySectionStyles(section: HTMLElement): void {
  section.style.padding = '20px';
  section.style.borderBottom = '1px solid #ddd';
}

export function applyTableStyles(table: HTMLTableElement): void {
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
}

// TODO: Add more styling functions as needed

