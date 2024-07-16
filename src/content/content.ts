import { sendAndReceiveMessage } from './chatInteraction';
import { elementSelector, getStoredChatbotElement } from './domManipulation';
import { ResponseStore, ChatResponse } from '../utils/types';
import { locale_en } from '../locales/en';

export let responses: ResponseStore = {};
let sentMessage: string = '';
let summary: Summary;

interface Summary {
  passed: number;
  failed: number;
  warning: number;
  inapplicable: number;
  title: string;
}

interface SuccessCriteria {
  name: string;
  level: string;
  principle: string;
  url: string;
}

interface RuleMetadata {
  target: {
    element: string | string[];
  };
  "success-criteria": SuccessCriteria[];
  related: string[];
  url: string;
  passed: number;
  warning: number;
  failed: number;
  inapplicable: number;
  outcome: string;
  description: string;
}

interface Rule {
  name: string;
  code: string;
  mapping: string;
  description: string;
  metadata: RuleMetadata;
  results: any[]; // You might want to define a more specific type for results
}

interface Report {
  assertions: {
    [rule: string]: Rule;
  };
  metadata: {
    passed: number;
    failed: number;
    warning: number;
    inapplicable: number;
  };
}

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
      sendResponse(summary);
      break;
    case "evaluateACT":
      const actResult = evaluateACT(chatbotElement);
      sendResponse(actResult);
      break;
    case "evaluateWCAG":
      const wcagResult = evaluateWCAG(chatbotElement);
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

function evaluateACT(chatbotElement: HTMLElement|null) {
  let actResult, result;
  const excludedRules = [
    'QW-ACT-R1', 'QW-ACT-R2', 'QW-ACT-R3', 'QW-ACT-R4', 'QW-ACT-R5', 'QW-ACT-R6', 'QW-ACT-R7', 'QW-ACT-R8'
  ];
  window.act = new ACTRules({ translate: locale_en, fallback: locale_en });
  // window.act.configure({ exclude: excludedRules })
  //window.act.validateFirstFocusableElementIsLinkToNonRepeatedContent();
  window.act.executeAtomicRules();
  window.act.executeCompositeRules();
  actResult = window.act.getReport();
  if (chatbotElement) {
    filterResults(actResult, chatbotElement);
  };
  addValuesToSummary(summary, actResult);
  //window.console.log("evaluate ACT summary:", summary);
  result = actResult.assertions;
  return result;
}

function evaluateWCAG(chatbotElement: HTMLElement|null) {
  let htmlResult, result;
  const excludedTechniques = [
    'QW-WCAG-T14', 'QW-WCAG-T15', 'QW-WCAG-T16', 'QW-WCAG-T17', 'QW-WCAG-T18', 'QW-WCAG-T19', 'QW-WCAG-T20', 'QW-WCAG-T21', 'QW-WCAG-T22'
  ];
  window.wcag = new WCAGTechniques({ translate: locale_en, fallback: locale_en });
  // window.wcag.configure({ exclude: excludedTechniques })
  htmlResult = window.wcag.execute(false);
  if (chatbotElement) {
    htmlResult = filterResults(htmlResult, chatbotElement);
  };
  addValuesToSummary(summary, htmlResult);
  result = htmlResult.assertions;
  return result;
}

function evaluateChatbot() {
  // evaluate custom chatbot rules
}

function addValuesToSummary(summary: Summary, report: Report) {
  summary.passed += report.metadata.passed;
  summary.failed += report.metadata.failed;
  summary.warning += report.metadata.warning;
  summary.inapplicable += report.metadata.inapplicable;
}

function filterResults(result: Report, chatbotElement: HTMLElement): Report {
  const filteredAssertions: { [rule: string]: Rule } = {};
  let newMetadata = { passed: 0, failed: 0, warning: 0, inapplicable: 0 };

  for (const [ruleCode, rule] of Object.entries(result.assertions)) {
    const targetElement = rule.metadata.target.element;
    const targetElements = Array.isArray(targetElement) ? targetElement : [targetElement];

    const isRelevant = targetElements.some(element => 
      chatbotElement.querySelector(element) !== null
    );

    if (isRelevant) {
      filteredAssertions[ruleCode] = rule;
      
      // Update the new metadata
      newMetadata.passed += (rule.metadata.passed > 0) ? 1:0;
      newMetadata.failed += (rule.metadata.failed > 0) ? 1:0;
      newMetadata.warning += (rule.metadata.warning > 0) ? 1:0;
      newMetadata.inapplicable += (rule.metadata.inapplicable > 0) ? 1:0;
      
      console.log(`Rule ${ruleCode} is relevant for this chatbot`);
    } else {
      console.log(`Rule ${ruleCode} is not relevant for this chatbot`);
    }
  }

  // Create a new report object with updated assertions and metadata
  return {
    ...result,
    assertions: filteredAssertions,
    metadata: newMetadata
  };
}