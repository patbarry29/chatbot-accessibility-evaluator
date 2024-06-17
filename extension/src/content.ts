let responses: { [message: string]: string } = {};
let sentMessage: string = '';

function simulateInput(message: string) {
  const inputField = document.querySelector('input[type="text"], textarea') as HTMLInputElement;
  const textEditor = document.querySelector('div[contenteditable="true"]') as HTMLElement;

  if (textEditor) {
    sentMessage = message; // Store the sent message separately

    textEditor.innerHTML = message;
    textEditor.focus();

    const event = new Event('input', { bubbles: true });
    textEditor.dispatchEvent(event);

    const keyboardEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });
    textEditor.dispatchEvent(keyboardEvent);
  } else if (inputField) {
    sentMessage = message; // Store the sent message separately
    
    inputField.focus();
    inputField.value = message;

    const event = new Event('input', { bubbles: true });
    inputField.dispatchEvent(event);

    const keyboardEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
    });
    inputField.dispatchEvent(keyboardEvent);
  } else {
    console.error("Input field or rich text editor not found.");
  }
}

function getDomTextContent(): string[] {
  const elements = document.querySelectorAll('div, span, p');
  return Array.from(elements)
    .map(el => (el as HTMLElement).innerText.trim())
    .filter(text => text && text !== sentMessage); // Filter out the sent message
}

async function captureResponse(message: string, maxWaitTime = 20000) {
  const startTime = Date.now();
  
  const currentURL = window.location.href;
  const urlRoot = new URL(currentURL).origin;

  let selector = '';
  switch (urlRoot) {
    case 'https://chatgpt.com':
      selector = 'div.agent-turn';
      break;
    case 'https://claude.ai':
      selector = 'div.font-claude-message';
      break;
    case 'https://gemini.google.com':
      selector = 'message-content.model-response-text';
      break;
    default:
      throw new Error('Invalid website specified');
  }
  
  const oldDivs = Array.from(document.querySelectorAll(selector));

  let finalResponse = '';

  const checkForResponse = async () => {
    const now = Date.now();
    const newDivs = Array.from(document.querySelectorAll(selector))
      .filter(div => !div.textContent?.includes(sentMessage) && !oldDivs.includes(div));

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

  await new Promise(resolve => setTimeout(resolve, 5000));
  await checkForResponse();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'typeMessage') {
    simulateInput(request.message);
    captureResponse(request.message);
    sendResponse({ status: 'Message typed and waiting for response' });
  } else {
    console.error("Unknown action:", request.action);
  }
});
