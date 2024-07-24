declare global {
  class ACTRules {
    constructor(options: { translate: any, fallback: any });
    configure(options: { rules?: string[], exclude?: string[] }): void;
    executeAtomicRules(): void;
    executeCompositeRules(): void;
    getReport(): ACTReport;
  }

  class WCAGTechniques {
    constructor(locale: any, options?: any);
    execute(newTabWasOpen: boolean, validation?: any): any;
    configure(options: { techniques?: string[], exclude?: string[] }): void;
  }

  class BestPractices {
    constructor(locale: Translate, options?: BPOptions);
    configure(options: BPOptions): void;
    resetConfiguration(): void;
    execute(): BestPracticesReport;
  }

  interface Window {
    wcag: WCAGTechniques;
    act: ACTRules;
    bp: BestPractices;
  }
}

interface ACTReport {
  assertions: Record<string, ACTRule>; // Specify the type of assertions
  metadata: {
    passed: number;
    failed: number;
    warning: number;
    inapplicable: number;
  };
}

export {};