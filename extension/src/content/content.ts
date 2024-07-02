import { sendAndReceiveMessage } from './chatInteraction';
import { elementSelector, getStoredChatbotElement } from './domManipulation';
import { ResponseStore, ChatResponse } from '../utils/types';

export let responses: ResponseStore = {};
let sentMessage: string = '';

export function getSentMessage(): string {
  return sentMessage;
}

export function setSentMessage(message: string): void {
  sentMessage = message;
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'typeMessages') {
    const chatbotElement = getStoredChatbotElement();
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

    console.log(chatResponses);
    sendResponse({ status: 'Messages typed and responses received', responses: chatResponses });
  } else if (request.action === "startSelection") {
    elementSelector.startSelection();
  } else {
    console.error("Unknown action:", request.action);
  }
});