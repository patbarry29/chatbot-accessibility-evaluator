async function startEvaluation() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      }
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "startEvaluation"}, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log("startEvaluation response:", response);
            resolve(response);
          }
        });
      } else {
        reject(new Error("No active tab found"));
      }
    });
  });
}

async function evaluateACT() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "evaluateACT"}, (response) => {
        console.log("evaluateACT response:", response);
        resolve(response);
      });
    });
  });
}

async function evaluateWCAG() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "evaluateWCAG"}, (response) => {
        console.log("evaluateWCAG response:", response);
        resolve(response);
      });
    });
  });
}

function endingEvaluation() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "endingEvaluation"}, (response) => {
        console.log("endingEvaluation response:", response);
        resolve(response);
      });
    });
  });
}

async function getUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      resolve(tabs[0].url);
    });
  });
}