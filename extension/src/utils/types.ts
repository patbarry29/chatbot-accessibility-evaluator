export interface ChatResponse {
  message: string;
  response: string;
}

export interface ElementSelector {
  startSelection: () => void;
  resetSelection: () => void;
}

export interface ResponseStore {
  [message: string]: string;
}