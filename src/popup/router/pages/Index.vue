<template>
  <div>
    <div class="button-container">
      <button id="chatButton">Send and Receive Messages</button>
      <button id="identifyButton">Identify Chatbot</button>
    </div>
    <hr>
    <div class="evaluation-container">
      <label>
        <input type="checkbox" id="actRulesCheckbox" checked> ACT Rules
      </label>
      <label>
        <input type="checkbox" id="wcagTechniquesCheckbox" checked> WCAG Techniques
      </label>
      <button id="evaluateButton">Evaluate Chatbot</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  mounted() {
    console.log('Index component mounted');
  }
}
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.evaluation-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
hr {
  width: 100%;
  border: none;
  border-top: 1px solid black;
  margin: 15px 0;
}
</style>