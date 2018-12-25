<template>
  <div>
    <div class="row">
      <div class="col-sm-3">反応する言葉</div>
      <div class="col-sm-3">タイトル</div>
      <div class="col-sm-3">再生されるボイス</div>
      <div class="col-sm-3">編集ボタン</div>
    </div>
    <div class="scroll">
      <div
        class="row hover"
        v-for="config in showConfigList"
        v-bind:key="config.input + Math.random()"
      >
        <div class="col-sm-3">{{config.input}}</div>
        <div class="col-sm-3">{{config.selectTitle}}</div>
        <div class="col-sm-3">{{config.selectButton}}</div>
        <div class="col-sm-3">
          <button
            class="small"
            v-if="config.id!==showConfig.id|!editStatus"
            v-bind:disabled="editStatus"
            @click="editStart(config)"
          >編集開始</button>
          <button
            class="small"
            v-if="config.id===showConfig.id&&editStatus"
            @click="editEnd(config)"
          >編集終了</button>
          <button class="small" v-bind:disabled="editStatus" @click="del(config.id)">削除</button>
        </div>
        <inputform-component
          v-if="config.id===showConfig.id&&editStatus"
          v-bind:showInputForm="config"
          v-bind:selectorTitle="selector.title"
          v-bind:selectorButton="selector.editButton"
          v-on:input="handleInput"
          v-on:selectTitle="handleSelectTitle"
          v-on:selectButton="handleSelectButton"
        ></inputform-component>
      </div>
    </div>
  </div>
</template>

<script>
import inputForm from "./inputForm";

export default {
  name: "showConfiglist",
  components: {
    "inputform-component": inputForm
  },
  data() {
    return {
      editStatus: false,
      showConfig: {
        id: null
      }
    };
  },
  props: {
    selector: Object,
    showConfigList: Array
  },
  methods: {
    deepcopy(json) {
      return JSON.parse(JSON.stringify(json));
    },
    editStart(config) {
      //console.log("editStart");
      this.editStatus = true;
      this.showConfig = this.deepcopy(config);
    },
    editEnd(config) {
      //console.log("editEnd");
      this.$emit("editResult", this.showConfig);
      // this.showConfig.id = null;
      this.editStatus = false;
    },
    del(id) {
      //console.log("del");
      this.$emit("del", id);
    },
    //inputFormからのinputデータをformContentsのinputに入れる
    handleInput(input) {
      //console.log("handleInput");
      this.showConfig.input = input;
    },
    //inputFormからのselectTitleデータをformContentsのselectTitleに入れる
    handleSelectTitle(title) {
      //console.log("handleSelectTitle");

      //idも一緒にあげて親のデータを変更しないとv-modelで前のデータにバインディングされる問題あり

      this.showConfig.selectTitle = title;
      this.$emit("editSelectTitle", title);
    },
    //inputFormからのselectButtonデータをformContentsのselectButtonに入れる
    handleSelectButton(button) {
      //console.log("handleSelectName");
      this.showConfig.selectButton = button;
    }
  }
};
</script>

<style>
.col-sm-3 {
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
