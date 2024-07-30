<template>
  <div class="bigContainer">
    <div class="container">
      <h1 class="title">Chatbot Evaluation</h1>
      <div class="button-container">
        <button id="chatButton">Send and Receive Messages</button>
        <button id="identifyButton">Identify Chatbot</button>
        <button id="identifyMicButton">Identify Voice Input Button</button>
        <button id="voiceInputButton">Input Voice and Listen for Response</button>
      </div>
      <hr>
      <div class="evaluation-container">
        <Checkbox 
          idValue="actRulesCheckbox" 
          :label="'ACT Rules'" 
          :value="actValue" 
          @checkBoxChanged="updateEvaluated('act', $event)" 
          bgColor="#e15500" 
          checkColor="#ffffff"
        />
        <Checkbox 
          idValue="wcagTechniquesCheckbox" 
          :label="'WCAG Techniques'" 
          :value="htmlValue" 
          @checkBoxChanged="updateEvaluated('html', $event)" 
          bgColor="#e15500" 
          checkColor="#ffffff"
        />
        <Checkbox 
          idValue="bestPracticesCheckbox" 
          :label="'Best Practices'" 
          :value="bpValue" 
          @checkBoxChanged="updateEvaluated('bp', $event)" 
          bgColor="#e15500" 
          checkColor="#ffffff"
        />
        <button id="evaluateButton" @click="onEvaluateClick" :disabled="isDisabled">Evaluate Chatbot</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  import Checkbox from '../../components/Checkbox';

  export default {
    name: 'Index',
    components: {
      Checkbox
    },
    data() {
      return {
        actValue: false,
        htmlValue: false,
        bpValue: false,
      };
    },
    computed: {
      ...mapGetters({ evaluated: "getEvaluated" }),
      isDisabled() {
        return !(this.evaluated && (this.evaluated.act || this.evaluated.html || this.evaluated.bp));
      }
    },
    methods: {
      ...mapActions(["setEvaluated"]),
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
      if (this.evaluated) {
        this.actValue = this.evaluated.act || false;
        this.htmlValue = this.evaluated.html || false;
        this.bpValue = this.evaluated.bp || false;
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
    gap: 5px;
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