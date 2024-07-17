import { Summary, Rule, Report } from "./types";

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
    }
  }

  // Create a new report object with updated assertions and metadata
  return {
    ...result,
    assertions: filteredAssertions,
    metadata: newMetadata
  };
}

export { addValuesToSummary, filterResults };