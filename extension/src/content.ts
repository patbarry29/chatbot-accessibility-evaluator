// let responses: { [message: string]: string } = {};
// let sentMessage: string = '';

// function simulateInput(message: string) {
//   const inputField = document.querySelector('input[type="text"], textarea') as HTMLInputElement;
//   const textEditor = document.querySelector('div[contenteditable="true"]') as HTMLElement;

//   if (textEditor) {
//     sentMessage = message; // Store the sent message separately

//     textEditor.innerHTML = message;
//     textEditor.focus();

//     const event = new Event('input', { bubbles: true });
//     textEditor.dispatchEvent(event);

//     const keyboardEvent = new KeyboardEvent('keydown', {
//       bubbles: true,
//       cancelable: true,
//       key: 'Enter',
//       code: 'Enter',
//       keyCode: 13,
//     });
//     textEditor.dispatchEvent(keyboardEvent);
//   } else if (inputField) {
//     sentMessage = message;
    
//     inputField.focus();
//     inputField.value = message;

//     const event = new Event('input', { bubbles: true });
//     inputField.dispatchEvent(event);

//     const keyboardEvent = new KeyboardEvent('keydown', {
//       bubbles: true,
//       cancelable: true,
//       key: 'Enter',
//       code: 'Enter',
//       keyCode: 13,
//     });
//     inputField.dispatchEvent(keyboardEvent);
//   } else {
//     console.error("Input field or rich text editor not found.");
//   }
// }

// function getDomTextContent(): string[] {
//   const elements = document.querySelectorAll('div, span, p');
//   return Array.from(elements)
//     .map(el => (el as HTMLElement).innerText.trim())
//     .filter(text => text && text !== sentMessage);
// }
// async function captureResponse(message: string, maxWaitTime = 20000) {
//   const startTime = Date.now();

//   const currentURL = window.location.href;
//   const urlRoot = new URL(currentURL).origin;

//   let selector = '';
//   switch (urlRoot) {
//     case 'https://chatgpt.com':
//       selector = 'div.agent-turn';
//       break;
//     case 'https://claude.ai':
//       selector = 'div.font-claude-message';
//       break;
//     case 'https://gemini.google.com':
//       selector = 'message-content.model-response-text';
//       break;
//     default:
//       throw new Error('Invalid website specified');
//   }

//   const oldDivs = Array.from(document.querySelectorAll(selector));

//   let finalResponse = '';

//   const checkForResponse = async () => {
//     const now = Date.now();
//     const newDivs = Array.from(document.querySelectorAll(selector))
//       .filter(div => !div.textContent?.includes(sentMessage) && !oldDivs.includes(div));

//     if (newDivs.length > 0) {
//       const responseDiv = newDivs[newDivs.length - 1];
//       const currentResponse = responseDiv.textContent?.trim() || '';

//       if (currentResponse.length > finalResponse.length) {
//         finalResponse = currentResponse;
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         await checkForResponse();
//       } else {
//         console.log('Final response:', finalResponse);
//         if (finalResponse) {
//           responses[message] = finalResponse;
//         }
//       }
//     } else if (now - startTime < maxWaitTime) {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       await checkForResponse();
//     } else {
//       console.error('Response not found within the max wait time.');
//     }
//   };

//   await new Promise(resolve => setTimeout(resolve, 2000));
//   await checkForResponse();
//   return finalResponse; // Return the captured response
// }

// async function sendAndReceiveMessage(message: string) {
//   simulateInput(message);
//   return await captureResponse(message);
// }

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   if (request.action === 'typeMessages') {
//     let responses = [];
//     for (let i = 0; i < request.messages.length; i++) {
//       const message = request.messages[i];
//       const response = await sendAndReceiveMessage(message); // Wait for response
//       responses.push(response);
//       if (i < request.messages.length - 1) { // Don't wait for the last message
//         await new Promise(resolve => setTimeout(resolve, 2000)); // Wait a bit for the assistant to respond
//       }
//     }
//     console.log(responses)
//     sendResponse({ status: 'Messages typed and responses received', responses });
//   } else {
//     console.error("Unknown action:", request.action);
//   }
// });

let isSelecting: boolean = false;
let highlightedElement: HTMLElement | null = null;
let selectedElements: HTMLElement[] = [];
let overlay: HTMLDivElement | null = null;

// Main message listener
chrome.runtime.onMessage.addListener((request: { action: string }, sender, sendResponse) => {
  if (request.action === "startSelection") {
    isSelecting = true;
    createOverlay();
    document.body.style.setProperty('cursor', 'crosshair', 'important');
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    showMessage("Click on a part of the chatbot. You may need to click multiple times to identify the entire chatbot.");
  }
});

// Create overlay for highlighting
function createOverlay() {
  overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9999';
  overlay.style.border = '2px solid red';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  document.body.appendChild(overlay);
}

// Mouse move handler
function handleMouseMove(event: MouseEvent): void {
  if (isSelecting && overlay) {
    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    if (target && target !== highlightedElement) {
      highlightElement(target);
    }
  }
}

// Element highlighting
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

// Remove highlight
function removeHighlight(): void {
  if (highlightedElement) {
    highlightedElement.style.removeProperty('outline');
    highlightedElement.style.removeProperty('background-color');
    highlightedElement = null;
  }
}

// Click handler
function handleClick(event: MouseEvent): void {
  if (isSelecting) {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.target as HTMLElement;
    if (target) {
      selectedElements.push(target);
      
      // Try each approach
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

// Show message to user
function showMessage(message: string): void {
  const messageElement = document.createElement('div');
  messageElement.style.position = 'fixed';
  messageElement.style.top = '10px';
  messageElement.style.left = '50%';
  messageElement.style.transform = 'translateX(-50%)';
  messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  messageElement.style.color = 'white';
  messageElement.style.padding = '10px';
  messageElement.style.borderRadius = '5px';
  messageElement.style.zIndex = '10000';
  messageElement.textContent = message;
  document.body.appendChild(messageElement);
  
  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 3000);
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

// Finish selection process
function finishSelection(chatbotElement: HTMLElement): void {
  const chatbotHTML = chatbotElement.outerHTML;
  console.log(chatbotElement);
  flashGreen(chatbotElement);
  chrome.runtime.sendMessage({ action: "storeHTML", html: chatbotHTML }, () => {
    showMessage("Chatbot element identified and HTML stored!");
  });
  resetSelection();
}

// Reset selection state
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

// Flash element green using an overlay
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
