<template>
  <div>
    <!-- 単語入力欄 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>反応させたい言葉</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <input type="text" v-model="localInput">
      </div>
    </div>
    <!-- 放送タイトル選択欄 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>放送タイトル</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <select v-model="localTitle">
          <option disabled value>何か一つ選んでね</option>
          <option v-for="title in selector.titleList" v-bind:key="title+Math.random()">{{title}}</option>
        </select>
      </div>
    </div>
    <!-- 発火ボイス登録 -->
    <div class="row">
      <div class="col-sm-12 col-md-4 input-contents-label">
        <label>反応ボイス</label>
      </div>
      <div class="col-sm-12 col-md-8 input-contents">
        <select v-model="localAudio">
          <option disabled value>何か一つ選んでね</option>
          <option v-for="audio in selector.audioList" v-bind:key="audio+Math.random()">{{audio}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputFormMolecules",
  props: {
    input: String,
    title: String,
    audio: String,
    selector: Object
  },
  computed: {
    localInput: {
      get() {
        return this.input;
      },
      set(text) {
        this.$emit("update:input", text);
      }
    },
    localTitle: {
      get() {
        return this.title;
      },
      set(text) {
        this.$emit("update:title", text);
      }
    },
    localAudio: {
      get() {
        return this.audio;
      },
      set(text) {
        this.$emit("update:audio", text);
      }
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
input,
select {
  width: 60%;
}
</style>
