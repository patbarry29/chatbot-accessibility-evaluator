declare global {
  class ACTRules {
    constructor(options: { translate: any, fallback: any });
    configure(options: { rules: string[] }): void;
    executeAtomicRules(): void;
    executeCompositeRules(): void;
    getReport(): ACTReport;
  }

  interface Window {
    act: ACTRules;
  }
}

interface ACTReport {
  assertions: any; // Replace 'any' with a more specific type if possible
  metadata: {
    passed: number;
    failed: number;
    warning: number;
    inapplicable: number;
  };
}

export {};