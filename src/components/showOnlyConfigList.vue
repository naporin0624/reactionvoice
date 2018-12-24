<template>
  <div>
    <div class="row">
      <div class="col-sm-4">反応する言葉</div>
      <div class="col-sm-4">タイトル</div>
      <div class="col-sm-4">再生されるボイス</div>
    </div>
    <div class="scroll">
      <div
        class="row hover"
        v-for="config in showConfigList"
        v-bind:key="config.input + Math.random()"
      >
        <div class="col-sm-4">{{config.input}}</div>
        <div class="col-sm-4">{{config.selectTitle}}</div>
        <div class="col-sm-4">{{config.selectButton}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "showConfiglist",
  data() {
    return {};
  },
  props: {
    showConfigList: Array
  }
};
</script>

<style>
.col-sm-4 {
  text-align: center;
}
.scroll {
  height: 400px;
  overflow-y: scroll;
  margin-bottom: 1px;
}
.hover:hover {
  background-color: #f5dbe7;
}
</style>
