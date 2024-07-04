<template>
  <div class="formComponent">
    <div class="imageContainer">
      <img src="/icons/logoQW.png" alt="QualWeb Logo" class="center" />
    </div>
    <form @submit="sendFormData" class="formClass">
      <div class="bigContainer">
        <div class="smallContainer">
          <fieldset>
            <legend class="legend">Select the modules to evaluate:</legend>
            <ul class="formContainer">
              <li>
                <Checkbox
                  @checkBoxChanged="updateEvaluated"
                  :idValue="actIdValue"
                  :label="actLabel"
                  :bgColor="bgColor"
                  :checkColor="checkColor"
                  :value="actValue"
                ></Checkbox>
              </li>
              <li>
                <Checkbox
                  @checkBoxChanged="updateEvaluated"
                  :idValue="htmlIdValue"
                  :label="htmlLabel"
                  :bgColor="bgColor"
                  :checkColor="checkColor"
                  :value="htmlValue"
                ></Checkbox>
              </li>
            </ul>
          </fieldset>
        </div>
      </div>

      <input :disabled="isDisabled" type="submit" value="Evaluate" class="submit button center" />
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Checkbox from "./Checkbox.vue";
import { mapGetters } from "vuex";

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
      return !(
        this.evaluated &&
        (this.evaluated.act ||
          this.evaluated.bp ||
          this.evaluated.html ||
          this.evaluated.css)
      );
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
:disabled {
  opacity: 0.7;
}
fieldset {
  border-radius: 0.2rem;
  border: 0.01rem solid #888585;
}
.formComponent {
  height: 100%;
  overflow: auto;
}
.smallContainer {
  display: grid;
  flex-direction: column;
  background-color: #393939;
  padding: 0.8rem;
  border-radius: 0.2rem;
}
.formContainer {
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  grid-row-gap: 1rem;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 22rem;
}

.submit {
  font-size: 18pt;
  margin-top: 2rem;
  background-color: #e15500;
  width: 100%;
  cursor: pointer;
}
.formClass {
  padding-right: 1rem;
  padding-left: 1rem;
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

.legend {
  text-align: center;
  font-size: 1.2rem;
}

@media only screen and (max-height: 450px) {
  .bigContainer {
    margin-top: 1.2rem;
  }
  .formComponent {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
  .center {
    width: 20rem;
  }
  .imageContainer {
    display: grid;
    align-content: center;
  }
}

@media only screen and (max-height: 320px) {
  .bigContainer {
    margin-top: 1.2rem;
  }
  .formContainer {
    display: flex;
    justify-content: space-around;
  }
  .imageContainer {
    display: none;
  }
  .formComponent {
    display: flex;
    flex-direction: column;
    margin-right: 1rem;
    margin-left: 1rem;
  }
  .smallContainer {
    margin-left: 0rem;
  }
}

@media only screen and (max-width: 500px) {
  .formContainer {
    display: flex;
    flex-flow: column;
    margin-left: 1rem;
  }
}
</style>