<template>
  <div class="bigContainer">
    <Summary></Summary>
    <ColapsibleFilter></ColapsibleFilter>
    <div class="container-1">
      <div class="column-1">
        <ListOfRules v-on:focusContent="focusListContent()"></ListOfRules>
      </div>
      <div class="column-2">
        <ListContent ref="content"></ListContent>
      </div>
    </div>
  </div>
</template>

<script>
// <FilterByResult :items="['All outcomes','Passed','Failed','Warning','Inapplicable']" ></FilterByResult>
import ColapsibleFilter from "../../components/ColapsibleFilter.vue";
import Summary from "../../components/Summary.vue";
import ListOfRules from "../../components/ListOfRules.vue";
import ListContent from "../../components/ListContent.vue";
import FilterByResult from "../../components/FilterByResult.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    ColapsibleFilter,
    Summary,
    ListOfRules,
    ListContent,
    FilterByResult
  },
  methods: {
    focusListContent() {
     try{
      this.$refs.content.$el.focus();}
      catch(e){}
    }
  }
};
</script>

<style lang="scss" scoped>

.column-1 {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  margin-left: 0.2rem;

  
}
.bigContainer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #303030;
}
.container-1 {
  display: grid;
  grid-template-columns: 1fr 2fr;
  overflow: auto;
  background-color: #393939;
  height: 82vh;
  /*
      grid-column-gap:1rem;
      grid-row-gap:1rem;
      */
}
.title {
  text-align: center;
  font-weight: 900;
}
.summary {
  font-size: 1rem;
  border-right: 1px solid white;
  border-left: 1px solid white;
  border-top: 1px solid white;
  color: white;
  padding: 1rem;
}
.column-2 {
  overflow-y: auto;
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
