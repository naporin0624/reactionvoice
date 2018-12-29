<template>
  <div class="row">
    <div class="col-sm-12 col-md-3">{{label.one}}</div>

    <div class="col-sm-12 col-md-3">{{label.two}}</div>

    <div class="col-sm-12 col-md-3">{{label.three}}</div>

    <div class="col-sm-12 col-md-3">
      <button @click="buttonEvent">編集</button>
    </div>
  </div>
</template>

<script>
import ButtonComponent from "../Atom/Button";
export default {
  name: "ShowRecordMolecules",
  props: { label: Object },
  methods: {
    buttonEvent() {
      this.$emit("buttonEvent");
    }
  }
};
</script>

<style scoped>
div {
  text-align: center;
}
</style>



