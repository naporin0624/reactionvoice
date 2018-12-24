<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-md-3 template-label">
        <label>ボイスセット選択</label>
      </div>
      <div class="col-sm-12 col-md-6 template-selector">
        <select @change="selectTemplate">
          <option>使いたいボイスセットを選んでね</option>
          <option v-for="name in template" v-bind:key="name">{{name}}</option>
        </select>
      </div>
      <div class="col-sm-12 col-md-3 template-button">
        <button class="small" @click="update">更新</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "templateSelector",
  props: {
    template: Array
  },
  methods: {
    selectTemplate(e) {
      //console.log("selectTemplate");
      //console.log(e.target.value);
      if (
        e.target.value != "使いたいボイスセットを選んでね" &&
        e.target.value != "まだ作られてないよ"
      )
        this.$emit("selectTemplateName", e.target.value);
    },
    update() {
      //console.log("updateTemplate");
      this.$emit("updateTemplate");
    }
  }
};
</script>

<style>
.template-label {
  text-align: right;
}
.template-selector {
  text-align: center;
  width: 100%;
}
.template-button {
  text-align: center;
}
</style>
