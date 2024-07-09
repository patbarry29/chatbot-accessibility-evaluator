<template>
  <button class="btn" aria-label="Export report">
    <i @click="exportFile()" class="material-icons">get_app</i>
  </button>
</template>

<script>
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";
export default {
  name: "Export",
  methods: {
    ...mapGetters(["getAllData"]),
    exportFile() {
      let data = this.getAllData();
      let stringData = JSON.stringify(data, null, 2);
      let blob = new Blob([stringData], {
        type: "application/json;charset=utf-8"
      });
      saveAs(blob, "evaluation.json");
    }
  }
};
</script>

<style scoped>
.export {
  vertical-align: top;
  display: inline-flex;
  font-size: 1.5rem;
}
.btn {
  background-color: #303030;
  border: none;
  color: white;
  cursor: pointer;
  border-radius:100px;
}
</style>