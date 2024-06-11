function simulateInput(message: string) {
  const inputField = document.querySelector('input[type="text"], textarea') as HTMLInputElement;
  if (!inputField) {
    console.error("Input field not found.");
    return;
  }

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
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'typeMessage') {
    simulateInput(request.message);
    sendResponse({ status: 'Message typed and sent' });
  } else {
    console.error("Unknown action:", request.action);
  }
});
