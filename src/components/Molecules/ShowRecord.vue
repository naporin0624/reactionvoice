<template>
  <div class="row">
    <div class="col-sm-12 col-md-4">{{label.one}}</div>

    <div class="col-sm-12 col-md-4">{{label.two}}</div>

    <div class="col-sm-12 col-md-4">{{form.three}}</div>

    <div class="col-sm-12 col-md-4">
      <button-component v-on:buttonEvent="buttonEvent">編集</button-component>
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
</style>


