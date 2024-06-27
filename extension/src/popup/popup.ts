document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('myButton');
  if (button) {
    button.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id!, { action: 'typeMessages', messages }, (response) => {
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
  const identifyButton = document.getElementById('identifyButton');
  if (identifyButton) {
    identifyButton.addEventListener('click', () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, {action: "startSelection"});
          window.close(); // Close the popup
        }
      });
    });
  }
});

const message1 = `Hello, I am a disabled user. 
I would like to use your services but I am having trouble navigating your website. 
Can you please assist me with a short helpful paragraph?`;
const message2 = `Thank you for your help. What can I use you for?`;

const messages = [message1, message2];