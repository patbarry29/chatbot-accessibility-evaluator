document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('myButton');
  if (button) {
    button.addEventListener('click', () => {
      const message = `Hello, I am a disabled user. 
      I would like to use your services but I am having trouble navigating your website. 
      Can you please assist me with a short helpful paragraph?`;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id!, { action: 'typeMessage', message }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError.message);
            } else {
              console.log(response?.status);
            }
          });
        } else {
          console.error("No active tab found.");
        }
      });
    });
  } else {
    console.error("Button not found.");
  }
});
