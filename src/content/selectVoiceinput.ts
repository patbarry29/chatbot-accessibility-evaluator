import { showMessage } from '../utils/helpers';

let isSelecting: boolean = false;
let highlightedElement: HTMLElement | null = null;
let storedMicrophoneButton: HTMLElement | null = null;
let overlay: HTMLDivElement | null = null;

export function startMicrophoneSelection() {
  isSelecting = true;
  createOverlay();
  document.body.style.setProperty('cursor', 'crosshair', 'important');
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("click", handleClick, true);
  showMessage("Hover over and click on or near the microphone button.");
}

function createOverlay() {
  overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9999';
  overlay.style.border = '2px solid red';
  overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
  document.body.appendChild(overlay);
}

function handleMouseMove(event: MouseEvent): void {
  if (isSelecting && overlay) {
    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    if (target && target !== highlightedElement) {
      highlightElement(target);
    }
  }
}

function highlightElement(element: HTMLElement): void {
  highlightedElement = element;
  if (overlay) {
    const rect = element.getBoundingClientRect();
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.zIndex = '2147483647';  // Maximum z-index value
  }
}

function handleClick(event: MouseEvent): void {
  if (isSelecting) {
    event.preventDefault();
    event.stopPropagation();

    const clickedElement = event.target as HTMLElement;
    const microphoneButton = findMicrophoneButton(clickedElement);

    if (microphoneButton) {
      finishSelection(microphoneButton);
    } else {
      showMessage("Couldn't identify a microphone button. Please try clicking closer to it.");
    }
  }
}
function findMicrophoneButton(element: HTMLElement): HTMLElement | null {
  // Check the clicked element and its siblings
  const potentialElements = [
    element,
    ...Array.from(element.parentElement?.children || [])
  ];

  for (const el of potentialElements) {
    if (isMicrophoneButton(el as HTMLElement)) {
      return el as HTMLElement;
    }
  }

  // If not found, check the parent and its children
  let checkedParents = 0;
  let currentElement = element.parentElement;
  while (currentElement && currentElement !== document.body && checkedParents < 5) {
    for (const child of Array.from(currentElement.children)) {
      if (isMicrophoneButton(child as HTMLElement)) {
        return child as HTMLElement;
      }
    }
    currentElement = currentElement.parentElement;
    checkedParents++;
  }

  return null;
}

function isMicrophoneButton(element: HTMLElement): boolean {
  const micKeywords = ['voice', 'mic', 'microphone', 'audio', 'speak'];
  const elementText = element.innerText?.toLowerCase() || '';
  const elementClasses = (typeof element.className === 'string') ? element.className.toLowerCase() : '';
  const elementId = element.id?.toLowerCase() || '';
  const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';

  // Check for microphone-related keywords
  const hasMicKeyword = micKeywords.some(keyword =>
    elementText.includes(keyword) ||
    elementClasses.includes(keyword) ||
    elementId.includes(keyword) ||
    ariaLabel.includes(keyword)
  );

  // Check if the element is clickable
  const isClickable =
    element.tagName === 'BUTTON' ||
    element.tagName === 'A' ||
    element.getAttribute('role') === 'button' ||
    element.getAttribute('tabindex') === '0' ||
    element.onclick !== null ||
    elementClasses.includes('button') ||
    elementClasses.includes('btn');

  return hasMicKeyword && isClickable;
}

function finishSelection(microphoneButton: HTMLElement): void {
  storedMicrophoneButton = microphoneButton;
  flashGreen(microphoneButton);
  showMessage("Microphone button identified!");
  resetSelection();
}

function resetSelection(): void {
  isSelecting = false;
  document.body.style.removeProperty('cursor');
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("click", handleClick, true);  // Remove with capture
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
  }
  highlightedElement = null;
}

function flashGreen(element: HTMLElement): void {
  const originalBackground = element.style.backgroundColor;
  element.style.backgroundColor = 'green';
  setTimeout(() => {
    element.style.backgroundColor = originalBackground;
  }, 1000);
}

export function getStoredMicrophoneButton(): HTMLElement | null {
  return storedMicrophoneButton;
}

export const microphoneSelector = {
  startMicrophoneSelection,
  resetSelection,
  getStoredMicrophoneButton
};