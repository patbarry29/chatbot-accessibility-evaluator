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
    sentMessage = message;
    
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
    .filter(text => text && text !== sentMessage);
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

  await new Promise(resolve => setTimeout(resolve, 2000));
  await checkForResponse();
  return finalResponse; // Return the captured response
}

async function sendAndReceiveMessage(message: string) {
  simulateInput(message);
  return await captureResponse(message);
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'typeMessages') {
    let responses = [];
    for (let i = 0; i < request.messages.length; i++) {
      const message = request.messages[i];
      const response = await sendAndReceiveMessage(message); // Wait for response
      responses.push(response);
      if (i < request.messages.length - 1) { // Don't wait for the last message
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait a bit for the assistant to respond
      }
    }
    sendResponse({ status: 'Messages typed and responses received', responses });
  } else {
    console.error("Unknown action:", request.action);
  }
});