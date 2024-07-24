export const getAllRulesFromModule = state => module => state[module]
export const getRuleWithCode = (state) => (code, module) => state[module][code]
export const getEvaluated = (state) => state["evaluated"]
export const getCurrentRule = (state) => {
    let currentRule = state.currentRule;
    if (!!currentRule) {
        let resultNumber = getResultNumber(state);
        state.resultFilter = { passed: resultNumber.passed > 0, failed: resultNumber.failed > 0, warning: resultNumber.warning > 0, inapplicable: resultNumber.inapplicable > 0 }
        return state[currentRule.module][currentRule.code];
    } else {
        return null;
    }

}
export const getCurrentRuleResults = (state) => {
    let currentRule = state.currentRule;
    let rule = state[currentRule.module][currentRule.code];
    let filter = state.resultFilter;
    let results = rule.results;
    let newResults = [];
    for (let result of results) {
        if (filter[result.verdict]) {
            newResults.push(result);
        }
    }
    return newResults;
}

export const getResultNumber = (state) => {
    let currentRule = state.currentRule;
    let results = state[currentRule.module][currentRule.code].results;
    let resultNumber = { passed: 0, failed: 0, warning: 0, inapplicable: 0 }
    for (let result of results) {
        resultNumber[result.verdict]++;
    }
    return resultNumber;
}
export const getAllRuleCodeAndTitle = (state) => {
    // Check evaluateChatbot state if true or false
    const evaluateChatbot = state.evaluateChatbot;

    let rules = [];

    if (evaluateChatbot) {
        const chatbotResults = {
            act: state.chatbotAct,
            html: state.chatbotHtml
        };

        const filter = state.filter;
        for (const [module, results] of Object.entries(chatbotResults)) {
            if (filter[module]) {
                for (const [key, value] of Object.entries(results)) {
                    const ruleOutcome = value.metadata.outcome;
                    if (filter[ruleOutcome]) {
                        rules.push({
                            title: value.name,
                            code: value.code,
                            outcome: ruleOutcome,
                            module: module
                        });
                    }
                }
            }
        }
    } else {
        // If false, continue as before
        let modules = Object.keys(state.evaluated);
        let evaluated = state.evaluated; // act/wcag modules
        let filter = state.filter;
        let keys, ruleOutcome;
        let value, moduleState;

        for (let module of modules) {
            if (evaluated[module] && filter[module]) {
                keys = Object.keys(state[module]);
                moduleState = state[module];
                for (let key of keys) {
                    value = moduleState[key];
                    ruleOutcome = value.metadata.outcome;
                    if (filter[ruleOutcome]) {
                        rules.push({
                            title: value.name,
                            code: value.code,
                            outcome: value.metadata.outcome,
                            module: module
                        });
                    }
                }
            }
        }
    }

    return rules;
}
export const getFirstRule = (state) => {
    let modules = Object.keys(state["evaluated"]);
    let evaluated = state["evaluated"];
    let filter = state["filter"];
    let keys;
    let value, moduleState, result;
    let done = false;
    let index, ruleOutcome;
    for (let module of modules) {
        index = 0;
        if (evaluated[module] && filter[module]) {
            keys = Object.keys(state[module]);
            moduleState = state[module];
            while (!done && index < keys.length) {
                value = moduleState[keys[index]];
                ruleOutcome = value["metadata"]["outcome"];
                if (filter[ruleOutcome]) {
                    result = { code: value["code"], module: module };
                    done = true;
                }
                index++;
            }
        }

    }

    return result;
}
export const getResultFilter = (state) => state.resultFilter
export const getFilter = (state) => state.filter
export const getHighlightActive = (state) => state.highlightActive
export const getSummary = (state) => state.summary
export const getChatbotSummary = (state) => state.chatbotSummary
export const getAllData = (state) => {
    return {
        summary: state.summary,
        chatbotSummary: state.chatbotSummary,
        act: state.act,
        chatbotAct: state.chatbotAct,
        bp: state.bp,
        html: state.html,
        chatbotHtml: state.chatbotHtml,
        css: state.css
    }
}

export const getEvaluateChatbot = (state) => state.evaluateChatbot