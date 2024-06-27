import { getSentMessage, responses, setSentMessage } from './content';
import { ChatPlatformSelectors } from '../utils/selectors';
import { ChatResponse } from '../utils/types';

export function simulateInput(message: string) {
  const inputField = document.querySelector('input[type="text"], textarea') as HTMLInputElement;
  const textEditor = document.querySelector('div[contenteditable="true"]') as HTMLElement;

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

export async function captureResponse(message: string, maxWaitTime = 20000): Promise<ChatResponse> {
  const startTime = Date.now();
  const currentURL = window.location.href;
  const urlRoot = new URL(currentURL).origin;
  const selector = ChatPlatformSelectors[urlRoot as keyof typeof ChatPlatformSelectors];

  if (!selector) {
    throw new Error('Invalid website specified');
  }

  const oldDivs = Array.from(document.querySelectorAll(selector));
  let finalResponse = '';

  const checkForResponse = async (): Promise<void> => {
    const now = Date.now();
    const newDivs = Array.from(document.querySelectorAll(selector))
      .filter(div => !div.textContent?.includes(getSentMessage()) && !oldDivs.includes(div));

    if (newDivs.length > 0) {
      const responseDiv = newDivs[newDivs.length - 1];
      const currentResponse = responseDiv.textContent?.trim() || '';

      if (currentResponse.length > finalResponse.length) {
        finalResponse = currentResponse;
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkForResponse();
      } else {
        console.log('Final response:', finalResponse);
        if (finalResponse) {
          responses[message] = finalResponse;
        }
      }
    } else if (now - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await checkForResponse();
    } else {
      console.error('Response not found within the max wait time.');
    }
  };

  await new Promise(resolve => setTimeout(resolve, 2000));
  await checkForResponse();
  return { message, response: finalResponse };
}

export async function sendAndReceiveMessage(message: string): Promise<ChatResponse> {
  simulateInput(message);
  return await captureResponse(message);
}