<template>
  <div class="result">
    <p v-if="result.verdict">
      <span class="strong">Verdict:</span>
      {{result.verdict}}
    </p>
    <p v-if="result.description">
      <span class="strong">Description:</span>
      {{result.description}}
    </p>
    <div v-for="element in result.elements" :key="element.pointer">
      <p v-if="element.htmlCode">
        <span class="strong">Code:</span>
        <highlight-code lang="html">{{element.htmlCode}}</highlight-code>
      </p>
      <p v-if="element.pointer">
        <span class="strong">Pointer:</span>
        <highlight-code lang="css">{{element.pointer}}</highlight-code>
      </p>
    </div>
  </div>
</template>

<script>
import { component as VueCodeHighlight } from "vue-code-highlight";
import "vue-code-highlight/themes/prism-dark.css";
export default {
  name: "RuleResult",
  props: ["result"],
  components: {
    VueCodeHighlight
  },
  methods: {}
};
</script>

<style>
.result {
  padding: 0.8rem;
}
</style>