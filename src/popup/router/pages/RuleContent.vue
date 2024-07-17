<template>
  <div>
    <div class="arrow-container">
      <button @click="goToEvaluation" class="arrow-button">
        <i class="material-icons">arrow_back</i>
      </button>
    </div>
    <div v-if="rule" class="text" tabindex="-1">
      <h1 class="center">{{rule.name}}</h1>
      <p v-if="rule.mapping">
        <span class="strong">Rule ID:</span>
        <a target="_blank" :href="rule.metadata.url">{{rule.mapping}}</a>
      </p>
      <p v-if="rule.url">
        <span class="strong">Url:</span>
        {{rule.metadata.url}}
      </p>
      <p>
        <span class="strong">Description:</span>
        {{rule.description}}
      </p>
      <p>
        <span class="strong">Outcome:</span>
        {{rule.metadata.outcome}}
      </p>
      <p v-if="rule.results.length !== 0">
        <span class="strong">Filter:</span>
      </p>
      <ColapsibleResultFilter></ColapsibleResultFilter>
      <p v-if="results.length !== 0">
        <span class="strong">Results:</span>
      </p>
      <ElementNavigation v-if="results.length !== 0"></ElementNavigation>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RuleResult from "../../components/RuleResult.vue";
import ElementNavigation from "../../components/ElementNavigation.vue";
import ColapsibleResultFilter from "../../components/ColapsibleResultFilter.vue";

export default {
  name: "ListContent",
  components: {
    RuleResult,
    ElementNavigation,
    ColapsibleResultFilter
  },
  computed: mapGetters({ 
    rule: "getCurrentRule",
    results: "getCurrentRuleResults" 
  }),
  methods: {
    goToEvaluation() {
      this.$router.push({ name: 'evaluation' });
    }
  }
};
</script>

<style scoped>
a {
  color: white;
}
.center {
  text-align: center;
}
.text {
  padding: 1rem 1rem;
  margin: 1em;
}
.arrow-container {
  padding: 1rem;
}
.arrow-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  text-align: left;
  transition: background-color 0.3s ease;
}
.arrow-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.strong {
  font-weight: bold;
}
</style>