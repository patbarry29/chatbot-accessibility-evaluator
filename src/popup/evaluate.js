async function starEvaluation() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "starEvaluation"}, (response) => {
        console.log("startEvaluation response:", response);
        resolve(response);
      });
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