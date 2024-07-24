<template>
  <div class="container">
    <div>
      <div class="loader"></div>
      <p class="state">{{state}}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Loading",
  props: ["act", "html", "bp", "css"],
  methods: {
    ...mapActions([
      "setACT",
      "setChatbotACT",
      "setHTML",
      "setChatbotHTML",
      "setBP",
      "setChatbotBP",
      "setCSS",
      "setSummary",
      "setChatbotSummary",
      "setCurrentRule",
      "setStartingFilter",
      "setEvaluateChatbot"
    ]),
    ...mapGetters(["getEvaluated", "getFirstRule","getResultFilter"])
  },
  data() {
    return {
      state: "Starting evaluation"
    };
  },
  async mounted() {
    let modules = this.getEvaluated();
    let actResult, chatbotActResult, bpResult, chatbotBpResult, htmlResult, chatbotHtmlResult, cssResult, summary, chatbotSummary;
    await startEvaluation();
    if (modules.act) {
      this.state = "Evaluating ACT module";
      [actResult, chatbotActResult] = await evaluateACT();
      this.setACT(actResult);
      chatbotActResult && this.setChatbotACT(chatbotActResult);
    }
    if (modules.html) {
      this.state = "Evaluating WCAG module";
      [htmlResult, chatbotHtmlResult] = await evaluateWCAG();
      this.setHTML(htmlResult);
      chatbotHtmlResult && this.setChatbotHTML(chatbotHtmlResult);
    }
    // if (modules.bp) {
    //   this.state = "Evaluating BP module";
    //   console.log(1)
    //   // [bpResult, chatbotBpResult] = await evaluateBP();
    //   // console.log(2)
    //   // this.setBP(bpResult);
    //   // chatbotBpResult && this.setChatbotBP(chatbotBpResult);
    // }
    this.state = "Ending evaluation";
    [summary, chatbotSummary] = await endingEvaluation();
    this.setSummary(summary);
    chatbotSummary && this.setChatbotSummary(chatbotSummary);
    chatbotSummary && this.setEvaluateChatbot(true);
    this.setStartingFilter(modules);
    this.setCurrentRule(this.getFirstRule());
    this.$router.push("/evaluation");
  }
};
</script>

<style scoped>
.state {
  text-align: center;
}
.container {
  min-height: 50vh;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: auto;
}
.loader {
  border: 16px solid transparent; /* Light grey */
  border-top: 16px solid #e15500; /* Blue */
  border-radius: 50%;
  width: 140px;
  height: 140px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>