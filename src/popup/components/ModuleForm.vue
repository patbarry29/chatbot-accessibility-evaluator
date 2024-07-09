<template>
  <div class="formComponent">
    <h1>Module Form</h1>
    <p>This is a test message from ModuleForm component.</p>
    <form @submit="sendFormData" class="formClass">
      <div class="checkboxContainer">
        <Checkbox
          @checkBoxChanged="updateEvaluated"
          :idValue="actIdValue"
          :label="actLabel"
          :bgColor="bgColor"
          :checkColor="checkColor"
          :value="actValue"
        ></Checkbox>
        <Checkbox
          @checkBoxChanged="updateEvaluated"
          :idValue="htmlIdValue"
          :label="htmlLabel"
          :bgColor="bgColor"
          :checkColor="checkColor"
          :value="htmlValue"
        ></Checkbox>
      </div>
      <input :disabled="isDisabled" type="submit" value="Evaluate" class="submit button" />
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Checkbox from "./Checkbox.vue";

export default {
  name: "ModuleForm",
  data() {
    return {
      actIdValue: "act",
      actLabel: "ACT Rules",
      actValue: false,
      htmlIdValue: "html",
      htmlLabel: "WCAG 2.1 Techniques",
      htmlValue: false,
      bgColor: "white",
      checkColor: "black"
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
    async sendFormData(e) {
      e.preventDefault();
      this.$router.push("/loading");
    },
    async updateEvaluated(idValue, value) {
      await this.setEvaluated({
        module: idValue,
        value: value
      });
    }
  },
  components: { Checkbox }
};
</script>

<style scoped>
.formComponent {
  padding: 1rem;
}
.checkboxContainer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}
.submit {
  font-size: 18pt;
  background-color: #e15500;
  width: 100%;
  cursor: pointer;
}
.button {
  display: block;
  padding: 0.4em 0.8rem;
  border: none;
  text-align: center;
  text-decoration: none;
  border-radius: 0.2rem;
  color: white;
  font-family: "Oswald", sans-serif;
  text-transform: uppercase;
}
:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>