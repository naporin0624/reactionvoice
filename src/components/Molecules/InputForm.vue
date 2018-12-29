<template>
  <div>
    <!-- 単語入力欄 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>反応させたい言葉</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <inputtext-component v-bind:input="form.input" v-on:inputEvent="inputFormEvent"></inputtext-component>
      </div>
    </div>
    <!-- 放送タイトル選択欄 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>放送タイトル</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <selector-component v-bind:selectItem="selector.title" v-on:selectEvent="selectTitleEvent"></selector-component>
      </div>
    </div>
    <!-- 発火ボイス登録 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>反応ボイス</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <selector-component v-bind:selectItem="selector.audio" v-on:selectEvent="selectAudioEvent"></selector-component>
      </div>
    </div>
  </div>
</template>

<script>
import SelectorComponent from "../Atom/Selector";
import InputTextComponent from "../Atom/InputText";
export default {
  name: "InputFormMolecules",
  props: {
    form: Object,
    selector: Object
  },
  components: {
    "selector-component": SelectorComponent,
    "inputtext-component": InputTextComponent
  },
  method: {
    inputFormEvent(text) {
      this.$emit("inputFormEvent", text);
    },
    selectTitleEvent(text) {
      this.$emit("titleEvent", text);
    },
    selectAudioEvent(text) {
      this.$emit("audioEvent", text);
    }
  }
};
</script>

<style scoped>
.input-contents {
  text-align: left;
}
.input-contents-label {
  text-align: right;
}
.input-width {
  width: 100%;
}
</style>
