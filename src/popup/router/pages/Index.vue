<template>
  <div class="bigContainer">
    <div class="container">
      <h1 class="title">Chatbot Evaluation</h1>
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
  .bigContainer {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
  }
  .container {
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: auto;
  }
  .title {
    text-align: center;
    font-weight: 900;
    margin-bottom: 1rem;
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
  button {
    width: 100%;
    padding: 10px;
    background-color: #e15500;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  button:hover {
    background-color: #ff6a00;
  }
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  hr {
    width: 100%;
    border: none;
    border-top: 1px solid #ffffff;
    margin: 15px 0;
  }
  label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  @media only screen and (max-width: 700px) {
    .container-1 {
      display: flex;
      flex-direction: column;
    }
    .column-2 {
      flex: 2;
    }
    .column-1 {
      flex: 1;
    }
  }
</style>