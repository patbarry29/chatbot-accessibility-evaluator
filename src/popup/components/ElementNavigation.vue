<template>
  <div class="menu" v-if="results.length>0">
    <NavigationBar
      v-on:offHighlight="offHighlightElement"
      v-on:highlight="highlightElement"
      v-on:change="updateResult"
      :size="results.length"
      ref="navBar"
    ></NavigationBar>
    <RuleResult :result="element"></RuleResult>
  </div>
</template>

<script>
import NavigationBar from "./NavigationBar.vue";
import RuleResult from "./RuleResult.vue";
import { mapGetters } from "vuex";

export default {
  name: "ElementNavigation",
  data() {
    return {
      element: null,
      lastHighlightElement: null
    };
  },
  beforeUpdate() {
    if (this.lastHighlightElement !== null) {
      let selector = this.lastHighlightElement.pointer;
      chrome.devtools.inspectedWindow.eval(
        `turnOffhighlightElement("${selector}")`,
        { useContentScriptContext: true }
      );
    }
  },
  computed: mapGetters({ results:"getCurrentRuleResults" }),
  methods: {
    ...mapGetters(["getCurrentRuleResults"]),
    updateResult(index) {
      this.element = this.results[index - 1];
    },
    highlightElement(index) {
      let element = this.results[index - 1];
      this.lastHighlightElement = element;
      let elements = element.elements;
      chrome.devtools.inspectedWindow.eval(
        "highlightElement(" + JSON.stringify(elements) + ")",
        { useContentScriptContext: true }
      );
    },
    offHighlightElement(index) {
      this.lastHighlightElement = null;
      let element = this.results[index - 1];
      let elements = element.elements;
      chrome.devtools.inspectedWindow.eval(
        "turnOffhighlightElement(" + JSON.stringify(elements) + ")",
        { useContentScriptContext: true }
      );
    }
  },
  components: {
    NavigationBar,
    RuleResult
  },
  watch: {
    results: function(newResults, oldQuestion) {
      if (this.results.length > 0) {
        this.element = this.results[0];
      }
    }
  },
  created() {
    if (this.results.length > 0) {
      this.element = this.results[0];
    }
  }
};
</script>

<style>
.menu {
  border-radius: 0.2rem;
  border: 0.01rem solid #888585;
}
</style>