import Vue from 'vue';
import router from './router';
import App from './App.vue';
import { messages } from '../utils/messagesToSend';
import store from './store';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

document.addEventListener('DOMContentLoaded', () => {
  const chatButton = document.getElementById('chatButton');
  if (chatButton) {
    chatButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
          chrome.tabs.sendMessage(activeTab.id!, { action: 'typeMessages', messages }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError.message);
            } else {
              console.log(response?.status);
            }
          });
        }
      });
    });
  }

  const identifyButton = document.getElementById('identifyButton');
  if (identifyButton) {
    identifyButton.addEventListener('click', () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.id) {
          // THE ERROR NEVER HAPPENS HERE
          chrome.tabs.sendMessage(activeTab.id, {action: "startSelection"});
          window.close();
        }
      });
    });
  }

  const evaluateButton = document.getElementById('evaluateButton');
  const evaluatingDiv = document.getElementById('evaluating');

  if (evaluateButton && evaluatingDiv) {
    evaluateButton.addEventListener('click', () => {
      evaluatingDiv.style.display = 'block';

      const actRulesCheckbox = document.getElementById('actRulesCheckbox') as HTMLInputElement;
      const wcagTechniquesCheckbox = document.getElementById('wcagTechniquesCheckbox') as HTMLInputElement;

      const actRules = actRulesCheckbox?.checked ?? false;
      const wcagTechniques = wcagTechniquesCheckbox?.checked ?? false;
      // communicate with content.js
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, {
            action: "evaluate",
            actRules: actRules,
            wcagTechniques: wcagTechniques
          });
        }
      });
    });
  }
});