import { showMessage } from '../utils/helpers';
import { ElementSelector } from '../utils/types';

let isSelecting: boolean = false;
let highlightedElement: HTMLElement | null = null;
let selectedElements: HTMLElement[] = [];
let overlay: HTMLDivElement | null = null;

export function startSelection() {
  isSelecting = true;
  createOverlay();
  document.body.style.setProperty('cursor', 'crosshair', 'important');
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("click", handleClick);
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
      
      let chatbotElement = boundingBoxApproach(target) || 
                           traversalAlgorithm(target) || 
                           heuristicRules(target);
      
      if (chatbotElement) {
        finishSelection(chatbotElement);
      } else {
        if (selectedElements.length >= 3) {
          chatbotElement = interactiveSelectorTool();
          if (chatbotElement) {
            finishSelection(chatbotElement);
          } else {
            showMessage("Couldn't identify chatbot element. Please try clicking on different parts of the chatbot.");
          }
        } else {
          showMessage(`Element selected. Please click on ${3 - selectedElements.length} more part(s) of the chatbot.`);
        }
      }
    }
  }
}

// 1. Bounding Box Calculation
function boundingBoxApproach(element: HTMLElement): HTMLElement | null {
  // Get the bounding box of the clicked element
  const elementRect = element.getBoundingClientRect();
  
  // Find the parent that likely contains the entire chatbot
  let potentialParent = element.parentElement;
  while (potentialParent) {
    const parentRect = potentialParent.getBoundingClientRect();
    
    // Check if the parent's bounding box is significantly larger
    if (parentRect.width > elementRect.width * 1.5 && parentRect.height > elementRect.height * 1.5) {
      // Check if this parent contains other chatbot-like elements
      const inputField = potentialParent.querySelector('input[type="text"]');
      const messageContainer = potentialParent.querySelector('.messages, .chat-messages');
      
      if (inputField && messageContainer) {
        return potentialParent;
      }
    }
    
    potentialParent = potentialParent.parentElement;
  }
  
  return null;
}

// 2. Traversal Algorithm
function traversalAlgorithm(element: HTMLElement): HTMLElement | null {
  let currentElement: HTMLElement | null = element;
  
  while (currentElement && currentElement !== document.body) {
    // Check if current element contains expected chatbot components
    const hasInputField = !!currentElement.querySelector('input[type="text"]');
    const hasMessageContainer = !!currentElement.querySelector('.messages, .chat-messages');
    const hasSendButton = !!currentElement.querySelector('button[type="submit"], .send-button');
    
    if (hasInputField && hasMessageContainer && hasSendButton) {
      return currentElement;
    }
    
    currentElement = currentElement.parentElement;
  }
  
  return null;
}

// 3. Heuristic Rules
function heuristicRules(element: HTMLElement): HTMLElement | null {
  let currentElement: HTMLElement | null = element;
  
  while (currentElement && currentElement !== document.body) {
    // Check for common chatbot-related class names or IDs
    const classAndId = (currentElement.className + ' ' + currentElement.id).toLowerCase();
    if (classAndId.includes('chat') || classAndId.includes('bot') || classAndId.includes('message')) {
      // Additional checks for chatbot components
      const hasInputField = !!currentElement.querySelector('input[type="text"]');
      const hasMessageContainer = !!currentElement.querySelector('.messages, .chat-messages');
      
      if (hasInputField && hasMessageContainer) {
        return currentElement;
      }
    }
    
    currentElement = currentElement.parentElement;
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
  const chatbotHTML = chatbotElement.outerHTML;
  console.log(chatbotElement);
  flashGreen(chatbotElement);
  chrome.runtime.sendMessage({ action: "storeHTML", html: chatbotHTML }, () => {
    showMessage("Chatbot element identified and HTML stored!");
  });
  resetSelection();
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
    }, 500);
  }, 500);
}

export const elementSelector: ElementSelector = {
  startSelection,
  resetSelection
};