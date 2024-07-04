<template>
  <div class="filter">
    <div class="content">
        <ul class="outcome">
          <li>
            <Checkbox
              :idValue="passedIdValue"
              :label="passedLabel+resultNumber.passed+' results'"
              :bgColor="passedColor"
              :checkColor="checkColor"
              @checkBoxChanged="updateFilterResults"
              :value="filter.passed"
            ></Checkbox>
          </li>
          <li>
            <Checkbox
              :idValue="failedIdValue"
              :label="failedLabel+resultNumber.failed+' results'"
              :bgColor="failedColor"
              :checkColor="checkColor"
              @checkBoxChanged="updateFilterResults"
              :value="filter.failed"
            ></Checkbox>
          </li>
          <li>
            <Checkbox
              :idValue="warningIdValue"
              :label="warningLabel+resultNumber.warning+' results'"
              :bgColor="warningColor"
              :checkColor="checkColor"
              @checkBoxChanged="updateFilterResults"
              :value="filter.warning"
            ></Checkbox>
          </li>
          <li>
            <Checkbox
              :idValue="inapplicableIdValue"
              :label="inapplicableLabel+resultNumber.inapplicable+' results'"
              :bgColor="bgColor"
              :checkColor="checkColor"
              @checkBoxChanged="updateFilterResults"
              :value="filter.inapplicable"
            ></Checkbox>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import Checkbox from "./Checkbox.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ColapsibleResultFilter",
  data() {
    return {
      isOpen: false,
      passedIdValue: "PASSED",
      passedLabel: "Passed - ",
      failedIdValue: "FAILED",
      failedLabel: "Failed - ",
      warningIdValue: "WARNING",
      warningLabel: "Warning - ",
      inapplicableIdValue: "INAPPLICABLE",
      inapplicableLabel: " Inapplicable - ",
      passedColor: "#46f73f",
      failedColor: "#ff3535",
      warningColor: "#ffd600",
      checkColor: "black",
      bgColor: "white"
    };
  },
  computed: mapGetters({
    filter: "getResultFilter",
    resultNumber: "getResultNumber"
  }),
  methods: {
    ...mapActions(["setResultFilter"]),
    changeState() {
      this.isOpen = !this.isOpen;
    },
    async updateFilterResults(idValue, value) {
      //console.log({ idValue, value });
      await this.setResultFilter({
        key: idValue.toLowerCase(),
        value: value
      });
      //console.log(this.filter);
    }
  },
  components: {
    Checkbox
  }
};
/* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) 
.active,
.collapsible:hover {
  background-color: #858586;
}*/
</script>

<style scoped>
.outcome {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
}
.filter {
  padding: 0rem 1rem;
}

</style>
