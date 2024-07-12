<template>
  <div class="centered-content">
    <div class="button-container">
      <button id="chatButton">Send and Receive Messages</button>
      <button id="identifyButton">Identify Chatbot</button>
    </div>
    <hr>
    <div class="evaluation-container">
      <label>
        <input type="checkbox" id="actRulesCheckbox" v-model="actValue" @change="updateEvaluated('act', actValue)"> ACT Rules
      </label>
      <label>
        <input type="checkbox" id="wcagTechniquesCheckbox" v-model="htmlValue" @change="updateEvaluated('html', htmlValue)"> WCAG Techniques
      </label>
      <button id="evaluateButton" @click="onEvaluateClick" :disabled="isDisabled">Evaluate Chatbot</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: 'Index',
  data() {
    return {
      actValue: false,
      htmlValue: false,
    };
  },
  computed: {
    ...mapGetters({ evaluated: "getEvaluated" }),
    isDisabled() {
      return !(this.evaluated && (this.evaluated.act || this.evaluated.html));
    }
  },
  methods: {
    ...mapActions(["setEvaluated"]),
    onClick(buttonNumber) {
      console.log(`Button ${buttonNumber} clicked`);
    },
    onEvaluateClick() {
      this.$router.push('/loading');
    },
    async updateEvaluated(idValue, value) {
      await this.setEvaluated({
        module: idValue,
        value: value
      });
    }
  },
  mounted() {
    // Initialize checkbox values from Vuex store
    if (this.evaluated) {
      this.actValue = this.evaluated.act || false;
      this.htmlValue = this.evaluated.html || false;
    }
  }
}
</script>

<style scoped>
.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  margin-top: 20px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 250px;
}

.evaluation-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 250px;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid black;
  margin: 15px 0;
}

button {
  width: 100%;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

label {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>