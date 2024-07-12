import { sendAndReceiveMessage } from './chatInteraction';
import { elementSelector, getStoredChatbotElement } from './domManipulation';
import { ResponseStore, ChatResponse } from '../utils/types';
import { locale_en } from '../locales/en';

export let responses: ResponseStore = {};
let sentMessage: string = '';
let summary: Summary;

export function getSentMessage(): string {
  return sentMessage;
}

export function setSentMessage(message: string): void {
  sentMessage = message;
}

// Main message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'typeMessages':
      const chatbotElement = getStoredChatbotElement();
      handleTypeMessages(request, chatbotElement).then(chatResponses => {
        console.log(chatResponses);
        sendResponse({ status: 'Messages typed and responses received', responses: chatResponses });
      });
      return true; // Indicates that the response is sent asynchronously
    case "startSelection":
      elementSelector.startSelection();
      break;
    case "startEvaluation":
      summary = { passed: 0, failed: 0, warning: 0, inapplicable: 0, title: document.title };
      sendResponse(summary);
      break;
    case "evaluateACT":
      const actResult = evaluateACT();
      sendResponse(actResult);
      break;
    case "evaluateWCAG":
      const wcagResult = evaluateWCAG();
      sendResponse(wcagResult);
      break;
    case "endingEvaluation":
      sendResponse(summary);
      break;
    default:
      console.error("Unknown action:", request.action);
  }
});

// Function to handle typing messages
async function handleTypeMessages(request: { messages: string[] }, chatbotElement: HTMLElement | null): Promise<ChatResponse[]> {
  let chatResponses: ChatResponse[] = [];

  for (let i = 0; i < request.messages.length; i++) {
    const message = request.messages[i];
    let response: ChatResponse;

    if (chatbotElement) {
      response = await sendAndReceiveMessage(message, chatbotElement);
    } else {
      response = await sendAndReceiveMessage(message);
    }

    chatResponses.push(response);
    if (i < request.messages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return chatResponses;
}
function evaluateACT() {
  let actResult, result;
  const includedRules: string[] = [
    'QW-ACT-R1', 'QW-ACT-R2', 'QW-ACT-R3', 'QW-ACT-R4', 
    'QW-ACT-R5', 'QW-ACT-R6', 'QW-ACT-R7', 'QW-ACT-R8'
  ];
  window.act = new ACTRules({ translate: locale_en, fallback: locale_en });
  window.act.configure({ rules: includedRules })
  console.log('configured ACT')
  //window.act.validateFirstFocusableElementIsLinkToNonRepeatedContent();
  window.act.executeAtomicRules();
  console.log('executed atomic rules')
  window.act.executeCompositeRules();
  console.log('executed composite rules')
  actResult = window.act.getReport();
  addValuesToSummary(summary, actResult);
  window.console.log("evaluate ACT summary:", summary);
  result = actResult.assertions;
  return result;
}

function evaluateWCAG() {
  let htmlResult, result;
  window.wcag = new WCAGTechniques({ translate: locale_en, fallback: locale_en });
  htmlResult = window.wcag.execute(false);

  addValuesToSummary(summary, htmlResult);
  result = htmlResult.assertions;
  return result;
}

interface Summary {
  passed: number;
  failed: number;
  warning: number;
  inapplicable: number;
  title: string;
}

interface Report {
  metadata: {
    passed: number;
    failed: number;
    warning: number;
    inapplicable: number;
  };
}

function addValuesToSummary(summary: Summary, report: Report) {
  summary.passed += report.metadata.passed;
  summary.failed += report.metadata.failed;
  summary.warning += report.metadata.warning;
  summary.inapplicable += report.metadata.inapplicable;
}