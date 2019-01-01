<template>
  <fieldset>
    <legend>反応ボイスを入力してね</legend>
    <inputform-component
      v-bind:input.sync="localConfig.form.input"
      v-bind:title.sync="localConfig.form.title"
      v-bind:audio.sync="localConfig.form.audio"
      v-bind:selector="localConfig.selector"
    ></inputform-component>
    <div>
      <button @click="pushEvent" v-bind:disabled="canPushAddButton">この設定で追加</button>
      <button @click="trialPlayAudio" v-bind:disabled="canPushAddButton">{{audioMessage}}</button>
    </div>
  </fieldset>
</template>

<script>
import InputForm from "../Molecules/InputForm";
export default {
  name: "ConfigSetForm",
  components: {
    "inputform-component": InputForm
  },
  props: {
    config: Object
  },
  data() {
    return {
      audioMessage: ""
    };
  },
  computed: {
    localConfig: {
      get() {
        return this.config;
      },
      set(config) {
        this.$emit("update:config", config);
      }
    }
  }
};
</script>

<style scoped>
</style>
