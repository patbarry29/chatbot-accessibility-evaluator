<template>
  <div class="container">
    <button @click="changeRule(rule)" class="listRule" v-for="rule in rules" :key="rule.code">
      <h2>{{rule.title}}</h2>
      <div v-if="rule.outcome ==='passed'">
        <i role="presentation" class="material-icons passed flexElement">check_circle_outline</i>
        <span class="flexElement">Passed</span>
      </div>
      <div v-if="rule.outcome ==='failed'">
        <i role="presentation" class="material-icons failed flexElement">highlight_off</i>
        <span class="flexElement">Failed</span>
      </div>
      <div v-if="rule.outcome ==='warning'">
        <i role="presentation" class="material-icons warning flexElement">warning</i>
        <span class="flexElement">Warning</span>
      </div>
      <div v-if="rule.outcome ==='inapplicable'">
        <i role="presentation" class="material-icons inapplicable flexElement">not_interested</i>
        <span class="flexElement">Inapplicable</span>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ListOfRules",
  methods: {
    ...mapActions(["setCurrentRule"]),
    ...mapGetters(["getCurrentRule"]),
    changeRule(rule) {
      this.setCurrentRule({ code: rule.code, module: rule.module });
      this.$emit("focusContent");
    }
  },
  computed: mapGetters({ rules: "getAllRuleCodeAndTitle" })
};
</script>

<style scoped>
.listRule {
  border-radius: 0.2rem;
  border: 0.01em solid #888585;
  background-color: #383838;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  text-align: left;
  margin-bottom: 0.2rem;
  margin-right: 0.2rem;
}
.container {
  background-color: #303030;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  border-right: 1px solid white;
}

.passed {
  color: #46f73f;
}
.failed {
  color: red;
}
.warning {
  color: #ffd600;
}
.inapplicable {
  color: #ffffff;
}
.center {
  text-align: center;
  margin: auto;
}
.flexElement {
  font-size: 1.3rem;
  display: inline-flex;
  vertical-align: middle;
}
</style>