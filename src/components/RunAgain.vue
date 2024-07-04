<template>
  <button class="btn" aria-label="Repeat evaluation">
    <i @click="runAgain" class="material-icons">cached</i>
  </button>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "RunAgain",
  methods: {
    ...mapActions(["reset"]),
    ...mapGetters(["getEvaluated", "getFirstRule"]),
    runAgain() {
      this.reset();
      this.$router.push("/");
    }
  }
};
</script>

<style>
.runagain {
  vertical-align: top;
  display: inline-flex;
  font-size: 1.5rem;
}
.btn {
  background-color: #303030;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 100px;
}
</style>