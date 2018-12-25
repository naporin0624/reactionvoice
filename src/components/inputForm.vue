<template>
  <div>
    <!-- 単語入力欄 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>反応させたい言葉</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <input class="input-width" type="text" v-model="input" @input="sendInputSentence">
      </div>
    </div>
    <!-- 放送タイトル選択欄 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>放送タイトル</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <select class="input-width" v-model="selectTitleLocal" @change="sendSelectTitle">
          <option disabled value>何か一つ選んでね</option>
          <option v-for="title in selectorTitle" v-bind:key="title + Math.random()">{{title}}</option>
        </select>
      </div>
    </div>
    <!-- 発火ボイス登録 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>反応ボイス</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <select class="input-width" v-model="selectButtonLocal" @change="sendSelectButton">
          <option disabled value>{{selectDisabledValue}}</option>
          <!-- keyがダブることがあるのでrandomを使っている -->
          <option v-for="button in selectorButton" v-bind:key="button + Math.random()">{{button}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "inputForm",
  props: {
    selectorTitle: Array,
    selectorButton: Array,
    showInputForm: Object
  },
  data() {
    return {
      input: null,
      selectTitleLocal: null,
      selectButtonLocal: null
    };
  },
  mounted() {
    this.input = this.showInputForm.input;
    this.selectTitleLocal = this.showInputForm.selectTitle;
    this.selectButtonLocal = this.showInputForm.selectButton;
  },
  computed: {
    selectDisabledValue() {
      //console.log("selectDisabledValue");
      if (this.selectButton) return "何か一つ選んでね";
      else return "先に放送タイトルを選んでね";
    }
  },
  methods: {
    sendInputSentence() {
      //console.log("sendInputSentence");
      this.$emit("input", this.input);
    },
    sendSelectTitle() {
      //console.log("sendSelectTitle");
      this.$emit("selectTitle", this.selectTitleLocal);
    },
    sendSelectButton() {
      //console.log("sendSelectButton");
      this.$emit("selectButton", this.selectButtonLocal);
    }
  }
};
</script>

<style>
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
