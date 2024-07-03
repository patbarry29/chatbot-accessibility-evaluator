import { getSentMessage, responses, setSentMessage } from './content';
import { ChatPlatformSelectors } from '../utils/selectors';
import { ChatResponse } from '../utils/types';
import { commonChatbotPhrases } from '../utils/commonPhrases';

export function simulateInput(message: string, chatbotElement?: HTMLElement) {
  const container = chatbotElement || document;
  const inputField = container.querySelector('input[type="text"], textarea') as HTMLInputElement;
  const textEditor = container.querySelector('div[contenteditable="true"]') as HTMLElement;

  if (textEditor) {
    setSentMessage(message);
    textEditor.innerHTML = message;
    textEditor.focus();
    dispatchEvents(textEditor);
  } else if (inputField) {
    setSentMessage(message);
    inputField.focus();
    inputField.value = message;
    dispatchEvents(inputField);
  } else {
    console.error("Input field or rich text editor not found.");
  }
}

function dispatchEvents(element: HTMLElement) {
  const inputEvent = new Event('input', { bubbles: true });
  element.dispatchEvent(inputEvent);

  const keyboardEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
  });
  element.dispatchEvent(keyboardEvent);
}

export async function captureResponse(message: string, chatbotElement?: HTMLElement, maxWaitTime = 20000): Promise<ChatResponse> {
  const startTime = Date.now();
  const currentURL = window.location.href;
  const urlRoot = new URL(currentURL).origin;
  const selector = ChatPlatformSelectors[urlRoot as keyof typeof ChatPlatformSelectors];

  if (!chatbotElement && !selector) {
    throw new Error('Invalid website specified and no chatbot element provided');
  }

  const container = chatbotElement || document;
  const oldDivs = Array.from(container.querySelectorAll(selector || '*'));
  let finalResponse = '';
  let lastUpdateTime = Date.now();

  const checkForResponse = async (): Promise<void> => {
    const now = Date.now();
    const newDivs = Array.from(container.querySelectorAll(selector || '*'))
      .filter(div => !div.textContent?.includes(getSentMessage()) && !oldDivs.includes(div));

    const potentialResponses = newDivs
      .map(div => div.textContent?.trim() || '')
      .filter(text => isLikelyChatbotResponse(text));

    if (potentialResponses.length > 0) {
      const currentResponse = potentialResponses[potentialResponses.length - 1];

      if (currentResponse.length > finalResponse.length) {
        finalResponse = currentResponse;
        lastUpdateTime = now;
        await new Promise(resolve => setTimeout(resolve, 500));
        await checkForResponse();
      } else if (now - lastUpdateTime < 5000) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await checkForResponse();
      } else {
        console.log('Final response:', finalResponse);
        if (finalResponse) {
          responses[message] = finalResponse;
        }
      }
    } else if (now - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await checkForResponse();
    } else {
      console.error('Response not found within the max wait time.');
    }
  };

  await new Promise(resolve => setTimeout(resolve, 2000));
  await checkForResponse();
  return { message, response: finalResponse };
}

export async function sendAndReceiveMessage(message: string, chatbotElement?: HTMLElement): Promise<ChatResponse> {
  simulateInput(message, chatbotElement);
  return await captureResponse(message, chatbotElement);
}

function isLikelyChatbotResponse(text: string): boolean {
  // Check if the text contains any common chatbot phrases
  return commonChatbotPhrases.some(phrase => text.includes(phrase)) ||
    // Check for other patterns that might indicate a chatbot response
    /^[A-Z]/.test(text) || // Starts with a capital letter
    text.endsWith('?') || text.endsWith('.') // Ends with a question mark or period
}