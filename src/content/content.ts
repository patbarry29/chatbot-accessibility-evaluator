import { sendAndReceiveMessage } from './chatInteraction';
import { elementSelector, getStoredChatbotElement } from './domManipulation';
import { ResponseStore, ChatResponse, Summary } from '../utils/types';
import { locale_en } from '../locales/en';
import { addValuesToSummary, filterResults } from '../utils/evaluationHelpers';

export let responses: ResponseStore = {};
let sentMessage: string = '';
let summary: Summary;
let chatbotSummary: Summary;

export function getSentMessage(): string {
  return sentMessage;
}

export function setSentMessage(message: string): void {
  sentMessage = message;
}

// Main message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const chatbotElement = getStoredChatbotElement();
  switch (request.action) {
    case 'typeMessages':
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
      // only assign chatbotsummary is chatbot element is not null
      if (chatbotElement) {
        chatbotSummary = { passed: 0, failed: 0, warning: 0, inapplicable: 0, title: document.title };
      }
      sendResponse([summary, chatbotSummary]);
      break;
    case "evaluateACT":
      const actResult = evaluateACT(chatbotElement);
      sendResponse(actResult);
      break;
    case "evaluateWCAG":
      const wcagResult = evaluateWCAG(chatbotElement);
      sendResponse(wcagResult);
      break;
    case "evaluateBP":
      console.log(1)
      const bpResult = evaluateBP(chatbotElement);
      sendResponse(bpResult);
      break;
    case "endingEvaluation":
      sendResponse([summary, chatbotSummary]);
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

function evaluateACT(chatbotElement: HTMLElement|null) {
  let actResult, chatbotActResult, result, chatbotResult;
  const excludedRules = [
    'QW-ACT-R1', 'QW-ACT-R2', 'QW-ACT-R3', 'QW-ACT-R4', 'QW-ACT-R5', 'QW-ACT-R6', 'QW-ACT-R7', 'QW-ACT-R8'
  ];
  window.act = new ACTRules({ translate: locale_en, fallback: locale_en });
  // window.act.configure({ exclude: excludedRules })
  //window.act.validateFirstFocusableElementIsLinkToNonRepeatedContent();
  window.act.executeAtomicRules();
  window.act.executeCompositeRules();
  actResult = window.act.getReport();
  addValuesToSummary(summary, actResult);
  //window.console.log("evaluate ACT summary:", summary);
  result = actResult.assertions;
  if (chatbotElement) {
    chatbotActResult = filterResults(actResult, chatbotElement);
    addValuesToSummary(chatbotSummary, chatbotActResult);
    chatbotResult = chatbotActResult.assertions;
  };
  return [result, chatbotResult];
}

function evaluateWCAG(chatbotElement: HTMLElement|null) {
  let htmlResult, chatbotHtmlResult, result, chatbotResult;
  const excludedTechniques = [
    'QW-WCAG-T14', 'QW-WCAG-T15', 'QW-WCAG-T16', 'QW-WCAG-T17', 'QW-WCAG-T18', 'QW-WCAG-T19', 'QW-WCAG-T20', 'QW-WCAG-T21', 'QW-WCAG-T22'
  ];
  window.wcag = new WCAGTechniques({ translate: locale_en, fallback: locale_en });
  // window.wcag.configure({ exclude: excludedTechniques })
  htmlResult = window.wcag.execute(false);
  addValuesToSummary(summary, htmlResult);
  result = htmlResult.assertions;
  if (chatbotElement) {
    chatbotHtmlResult = filterResults(htmlResult, chatbotElement);
    addValuesToSummary(chatbotSummary, chatbotHtmlResult);
    chatbotResult = chatbotHtmlResult.assertions;
  };
  return [result, chatbotResult];
}

function evaluateBP(chatbotElement: HTMLElement|null) {
  let bpResult, chatbotBpResult, result, chatbotResult;
  const includedRules = [
    'QW-BP30', 'QW-BP31'
  ];
  window.bp = new BestPractices({ translate: locale_en, fallback: locale_en });
  window.bp.configure({ bestPractices: includedRules });
  bpResult = window.bp.execute();
  addValuesToSummary(summary, bpResult);
  result = bpResult.assertions;
  if (chatbotElement) {
    chatbotBpResult = filterResults(bpResult, chatbotElement);
    addValuesToSummary(chatbotSummary, chatbotBpResult);
    chatbotResult = chatbotBpResult.assertions;
  };
  return [result, chatbotResult];
}