<template>
  <div class="bigContainerSummary">
    <div class="titleButtons">
      <div class="buttons">
        <RunAgain class="runAgain"></RunAgain>
        <Export class="export"></Export>
        <HighlightAll class="export"></HighlightAll>
      </div>
      <div class="text">
        <h1 class="title">{{ currentSummary.title }}</h1>
      </div>
    </div>
    <div class="center">
      <h2 class="text">
        {{ currentSummary.failed + currentSummary.passed + currentSummary.warning + currentSummary.inapplicable }}
        tested rules and techniques
      </h2>
    </div>
    <div class="flex-container2">
      <div>
        <i aria-label="Passed" class="material-icons passed flexElement">check_circle_outline</i>
        <span class="flexElement">{{ currentSummary.passed }}</span>
      </div>
      <div>
        <i aria-label="Failed" class="material-icons failed flexElement">highlight_off</i>
        <span class="flexElement">{{ currentSummary.failed }}</span>
      </div>
      <div>
        <i aria-label="Warning" class="material-icons warning flexElement">warning</i>
        <span class="flexElement">{{ currentSummary.warning }}</span>
      </div>
      <div>
        <i aria-label="Inapplicable" class="material-icons inapplicable flexElement">not_interested</i>
        <span class="flexElement">{{ currentSummary.inapplicable }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RunAgain from "./RunAgain.vue";
import Export from "./Export.vue";
import HighlightAll from "./HighlightAll.vue";

export default {
  name: "Summary",
  computed: {
  ...mapGetters({
    summary: "getSummary",
    chatbotSummary: "getChatbotSummary",
    evaluateChatbot: "getEvaluateChatbot"
  }),
  currentSummary() {
    console.log(this.summary, this.chatbotSummary, this.evaluateChatbot);
    return this.evaluateChatbot ? this.chatbotSummary : this.summary;
  },
  data() {
    return {
      title: "failed"
    };
  },
  components: {
    RunAgain,
    Export,
    HighlightAll
  }
}
};
</script>

<style scoped>
.title {
  overflow: hidden;
}
.text {
  font-family: "Roboto", sans-serif;
  text-transform: lowercase;
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
  font-size: 1.5rem;
  display: inline-flex;
  vertical-align: middle;
}
.text {
  text-align: center;
}

.flex-container2 {
  display: grid;
  justify-content: center;
  grid-template-columns: auto auto auto auto;
  grid-column-gap: 3rem;
  align-content: center;
}
.buttons {
  align-content: center;
  padding: 2% 0 0 2%;
}

.heading1 {
  flex: 1;
}
.bigContainerSummary {
  margin-bottom: 0.5rem;
}
.titleButtons {
  display: grid;
  grid-template-columns: 2fr 5fr 2fr;
}
</style>