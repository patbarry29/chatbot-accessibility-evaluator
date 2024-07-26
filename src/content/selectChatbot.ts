import { showMessage } from '../utils/helpers';
import { ElementSelector } from '../utils/types';

let isSelecting: boolean = false;
let highlightedElement: HTMLElement | null = null;
let selectedElements: HTMLElement[] = [];
let overlay: HTMLDivElement | null = null;
let storedChatbotElement: HTMLElement | null = null;

export function startSelection() {
  isSelecting = true;
  createOverlay();
  document.body.style.setProperty('cursor', 'crosshair', 'important');
  
  // Add event listeners to the main document
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("click", handleClick, true);
  
  // Search for iframes and add event listeners to them
  const iframes = document.getElementsByTagName('iframe');
  for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      if (iframe.contentDocument) {
        iframe.contentDocument.addEventListener("mousemove", handleMouseMove);
        iframe.contentDocument.addEventListener("click", handleClick, true);
      } else {
        console.warn("Cannot access iframe content. It may be cross-origin.");
      }
  }

  showMessage("Click on a part of the chatbot. You may need to click multiple times to identify the entire chatbot.");
}

function createOverlay() {
  overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9999';
  overlay.style.border = '2px solid red';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  document.body.appendChild(overlay);
}

function handleMouseMove(event: MouseEvent): void {
  if (isSelecting && overlay) {
    event.preventDefault();
    event.stopPropagation();
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
  }
}

function handleClick(event: MouseEvent): void {
  if (isSelecting) {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.target as HTMLElement;
    if (target) {
      selectedElements.push(target);
      
      const chatbotElement = identifyChatbotElement(target);
      
      if (chatbotElement) {
        finishSelection(chatbotElement);
      } else {
        if (selectedElements.length >= 3) {
          const interactiveElement = interactiveSelectorTool();
          if (interactiveElement) {
            finishSelection(interactiveElement);
          } else {
            showMessage("Couldn't identify chatbot element. Please try clicking on a different part of the chatbot.");
          }
        } else {
          showMessage("Couldn't identify chatbot element yet. Please try clicking on a different part of the chatbot.");
        }
      }
    }
  }
}

function identifyChatbotElement(target: HTMLElement): HTMLElement | null {
  const methods = [boundingBoxApproach, traversalAlgorithm, heuristicRules];
  const results = methods.map(method => method(target));
  
  const validResults = results.filter(result => result !== null) as HTMLElement[];
  
  if (validResults.length >= 2) {
    // At least two methods agree
    return validResults[0];
  }
  
  return null;
}

// 1. Bounding Box Approach
function boundingBoxApproach(element: HTMLElement): HTMLElement | null {
  const elementRect = element.getBoundingClientRect();
  let potentialParent = element.parentElement;
  
  while (potentialParent) {
    const parentRect = potentialParent.getBoundingClientRect();
    const areaRatio = (parentRect.width * parentRect.height) / (elementRect.width * elementRect.height);
    
    if (areaRatio > 2) { // Parent is significantly larger
      const childElements = potentialParent.children;
      let chatbotComponents = 0;
      
      for (const child of Array.from(childElements)) {
        if (child.matches('input[type="text"], textarea, .messages, .chat-messages, button[type="submit"], .send-button')) {
          chatbotComponents++;
        }
      }
      
      if (chatbotComponents >= 2) {
        return potentialParent;
      }
    }
    
    potentialParent = potentialParent.parentElement;
  }
  
  return null;
}

// 2. Traversal Algorithm with Component Scoring
function traversalAlgorithm(element: HTMLElement): HTMLElement | null {
  let currentElement: HTMLElement | null = element;
  const componentSelectors: string[] = [
    'input[type="text"]',
    'textarea',
    '.messages, .chat-messages',
    'button[type="submit"], .send-button',
    '.chat-header, .chat-title',
    '.user-avatar, .chat-avatar',
    '.typing-indicator, .typing-dots'
  ];
  
  while (currentElement && currentElement !== document.body) {
    let matchCount = 0;
    
    for (const selector of componentSelectors) {
      if (currentElement.querySelector(selector)) {
        matchCount++;
      }
    }
   
    if (matchCount >= 2) {
      return currentElement;
    }
    
    currentElement = currentElement.parentElement;
  }
  
  return null;
}

// 3. Heuristic Rules with Depth Analysis
function heuristicRules(element: HTMLElement): HTMLElement | null {
  let currentElement: HTMLElement | null = element;
  let depth = 0;
  const maxDepth = 5;
  
  while (currentElement && currentElement !== document.body && depth < maxDepth) {
    const classAndId = (currentElement.className + ' ' + currentElement.id).toLowerCase();
    const chatbotKeywords = ['chat', 'bot', 'message', 'conversation', 'dialogue'];
    
    if (chatbotKeywords.some(keyword => classAndId.includes(keyword))) {
      const childrenCount = currentElement.children.length;
      const textContent = currentElement.textContent || '';
      const hasMultipleChildren = childrenCount > 3;
      const hasSubstantialText = textContent.length > 100;
      
      if (hasMultipleChildren && hasSubstantialText) {
        return currentElement;
      }
    }
    
    currentElement = currentElement.parentElement;
    depth++;
  }
  
  return null;
}

// 4. Interactive Selector Tool
function interactiveSelectorTool(): HTMLElement | null {
  if (selectedElements.length < 2) {
    return null;
  }
  
  // Find the lowest common ancestor
  let commonAncestor = selectedElements[0];
  
  for (let i = 1; i < selectedElements.length; i++) {
    commonAncestor = findCommonAncestor(commonAncestor, selectedElements[i]);
  }
  
  return commonAncestor;
}

// Helper function to find common ancestor
function findCommonAncestor(el1: HTMLElement, el2: HTMLElement): HTMLElement {
  const parents1 = getParents(el1);
  const parents2 = getParents(el2);
  
  for (const parent of parents1) {
    if (parents2.includes(parent)) {
      return parent;
    }
  }
  
  return document.body; // Fallback to body if no common ancestor found
}

// Helper function to get all parents of an element
function getParents(element: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let currentElement: HTMLElement | null = element;
  
  while (currentElement && currentElement !== document.body) {
    parents.push(currentElement);
    currentElement = currentElement.parentElement;
  }
  
  return parents;
}

function finishSelection(chatbotElement: HTMLElement): void {
  storedChatbotElement = chatbotElement;
  const chatbotHTML = chatbotElement.outerHTML;
  flashGreen(chatbotElement);
  chrome.runtime.sendMessage({ action: "storeHTML", html: chatbotHTML }, () => {
    showMessage("Chatbot element identified and HTML stored!");
  });
  resetSelection();
}

export function getStoredChatbotElement(): HTMLElement | null {
  return storedChatbotElement;
}

function resetSelection(): void {
  isSelecting = false;
  document.body.style.removeProperty('cursor');
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("click", handleClick);
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
  }
  highlightedElement = null;
  selectedElements = [];
}

function flashGreen(element: HTMLElement): void {
  const rect = element.getBoundingClientRect();
  
  const flashOverlay = document.createElement('div');
  flashOverlay.style.position = 'fixed';
  flashOverlay.style.pointerEvents = 'none';
  flashOverlay.style.zIndex = '10000';
  flashOverlay.style.left = `${rect.left}px`;
  flashOverlay.style.top = `${rect.top}px`;
  flashOverlay.style.width = `${rect.width}px`;
  flashOverlay.style.height = `${rect.height}px`;
  flashOverlay.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
  flashOverlay.style.transition = 'opacity 0.5s ease-in-out';
  flashOverlay.style.opacity = '1';

  document.body.appendChild(flashOverlay);

  setTimeout(() => {
    flashOverlay.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(flashOverlay);
    }, 1000);
  }, 1000);
}

export const elementSelector: ElementSelector = {
  startSelection,
  resetSelection
};