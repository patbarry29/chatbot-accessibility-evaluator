import { sendAndReceiveMessage } from './chatInteraction';
import { elementSelector, getStoredChatbotElement } from './domManipulation';
import { ResponseStore, ChatResponse } from '../utils/types';
import { locale_en } from '../locales/en';

export let responses: ResponseStore = {};
let sentMessage: string = '';

export function getSentMessage(): string {
  return sentMessage;
}

export function setSentMessage(message: string): void {
  sentMessage = message;
}

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

// Main message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'typeMessages') {
    const chatbotElement = getStoredChatbotElement();
    handleTypeMessages(request, chatbotElement).then(chatResponses => {
      console.log(chatResponses);
      sendResponse({ status: 'Messages typed and responses received', responses: chatResponses });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "startSelection") {
    elementSelector.startSelection();
  } else if (request.action === "evaluate") {
    startEvaluation(request.actRules, request.wcagTechniques);
  } else {
    console.error("Unknown action:", request.action);
  }
});


// let selectorToStyle = {};
let summary: Summary, currentPage: string;

function startEvaluation(actRules: boolean, wcagTechniques: boolean) {
  summary = { passed: 0, failed: 0, warning: 0, inapplicable: 0, title: document.title };
  
  if (actRules) {
    evaluateACT();
  }
  
  if (wcagTechniques) {
    // evaluateWCAG();
  }
  
  return summary;
}

function evaluateACT() {
  // let actResult, result;
  // const includedRules: string[] = [
  //   'QW-ACT-R1', 'QW-ACT-R2', 'QW-ACT-R3', 'QW-ACT-R4', 
  //   'QW-ACT-R5', 'QW-ACT-R6', 'QW-ACT-R7', 'QW-ACT-R8'
  // ];
  window.act = new ACTRules({ translate: locale_en, fallback: locale_en });
  // window.act.configure({ rules: includedRules })
  // console.log('configured ACT')
  // //window.act.validateFirstFocusableElementIsLinkToNonRepeatedContent();
  // window.act.executeAtomicRules();
  // console.log('executed atomic rules')
  // window.act.executeCompositeRules();
  // console.log('executed composite rules')
  // actResult = window.act.getReport();
  // addValuesToSummary(summary, actResult);
  // //window.console.log("evaluate ACT summary:", summary);
  // result = actResult.assertions;
  // return result;
}

// function evaluateWCAG() {
//   let htmlResult, result;

//   const includedTechniques = [
//     'QW-WCAG-T1', 'QW-WCAG-T2', 'QW-WCAG-T3', 'QW-WCAG-T4', 'QW-WCAG-T5', 'QW-WCAG-T6', 'QW-WCAG-T7', 'QW-WCAG-T8'
//   ];

//   window.wcag = new WCAGTechniques({ translate: locale_en, fallback: locale_en, techniques: includedTechniques });
//   htmlResult = window.wcag.execute(false);
//   addValuesToSummary(summary, htmlResult);
//   result = htmlResult.assertions;
//   return result;
// }

// function evaluateCustomRules() {
//   // invoke function to call custom rules for LLM requirements in this function
// }

// function endingEvaluation() {
//   //window.console.log("ending evaluation summary:", summary);
//   return summary;
// }

interface Summary {
  passed: number;
  failed: number;
  warning: number;
  inapplicable: number;
  title: string; // Added this line
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
  //window.console.log("report:", report);
  summary.passed += report.metadata.passed;
  summary.failed += report.metadata.failed;
  summary.warning += report.metadata.warning;
  summary.inapplicable += report.metadata.inapplicable;
  //window.console.log("add values to summary:", summary);
}


// function highlightElement(elements) {
//   for (let elementResult of elements) {
//     let selector = elementResult.pointer;
//     let element = document.querySelector(selector);
//     element.scrollIntoView();
//     let style = { border: element.style.border, outline: element.style.outline, borderRadius: element.style.borderRadius }
//     selectorToStyle[selector] = style;
//     element.style.border = "1px dashed white";
//     element.style.borderRadius = "0px";
//     element.style.outline = "1px dashed black";
//   }

// }

// function turnOffhighlightElement(elements) {
//   for (let elementResult of elements) {
//     let selector = elementResult.pointer;
//     let element = document.querySelector(selector);
//     let style = selectorToStyle[selector];
//     element.style.border = style.border;
//     element.style.borderRadius = style.borderRadius;
//     element.style.outline = style.outline;
//     selectorToStyle[selector] = {};
//   }
// }