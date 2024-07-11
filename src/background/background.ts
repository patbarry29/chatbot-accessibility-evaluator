chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startEvaluation") {
    // Perform your evaluation logic here
    // Then send a response
    console.log('startEvaluation received');
    sendResponse({status: "Evaluation complete", results: 'bla'});
    return true; // Indicates that the response is sent asynchronously
  }
  // ... other message handling
});