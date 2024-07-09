<template>
  <button class="btn" aria-label="Highlight active element">
    <i @click="changeHighlightAll()"  :class="[ highlightActive ? 'material-icons-round': 'material-icons-outlined']">wb_iridescent</i>
  </button>
</template>

<script>
import { saveAs } from "file-saver";
import { mapGetters,mapActions } from "vuex";
export default {
  name: "HighlightAll",
  data() {
    return{
    }; 
  }, computed: mapGetters({
    highlightActive: "getHighlightActive",
  }),
  methods: {
    ...mapActions(["setHighlightActive"]),
    changeHighlightAll() {
      this.setHighlightActive(!this.highlightActive);
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
.material-icons.md-inactive { color: rgba(255, 255, 255, 0.26); }
.btn {
  background-color: #303030;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 100px;
}
</style>