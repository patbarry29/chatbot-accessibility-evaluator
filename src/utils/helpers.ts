export function showMessage(message: string): void {
  const existingMessageElement = document.getElementById('selection-message');
  if (existingMessageElement) {
    existingMessageElement.remove();
  }
  const messageElement = document.createElement('div');
  messageElement.id = 'selection-message';
  messageElement.style.pointerEvents = 'none'; // Make it non-interactable

  messageElement.style.position = 'fixed';
  messageElement.style.top = '10%';
  messageElement.style.left = '50%';
  messageElement.style.transform = 'translate(-50%, -50%)';
  messageElement.style.backgroundColor = 'rgba(225, 85, 0, 0.7)';
  messageElement.style.color = 'white';
  messageElement.style.padding = '10px';
  messageElement.style.fontSize = '1.2em';
  messageElement.style.fontWeight = '900';
  messageElement.style.textAlign = 'center';
  messageElement.style.borderRadius = '5px';
  messageElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  messageElement.style.zIndex = '10000';

  messageElement.textContent = message;
  document.body.appendChild(messageElement);

  setTimeout(() => {
    if (messageElement) {
      document.body.removeChild(messageElement);
    }
  }, 5000);
}


