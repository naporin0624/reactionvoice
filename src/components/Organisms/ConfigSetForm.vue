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
      <button @click="trialPlay" v-bind:disabled="canPushAddButton">{{message}}</button>
    </div>
  </fieldset>
</template>

<script>
import AxiosTemplate from "../api/AxiosTemplate.js";
const apiURL = "http://192.168.1.125:5000/api/sana/";
import InputForm from "../Molecules/InputForm";
export default {
  name: "ConfigSetForm",
  components: {
    "inputform-component": InputForm
  },
  props: {
    config: Object
  },
  created() {
    console.log("created: config", this.config);
    console.log("created: localConfig", this.localConfig.form);
  },
  data() {
    return {
      trialAudio: new Audio(),
      trialFlag: false
    };
  },
  methods: {
    trialPlay() {
      this.trialAudio.src = this.localConfig.blind.url;
      this.trialAudio.play();
      this.trialFlag = true;
    },
    trialStop() {
      this.trialAudio.pause();
      this.trialFlag = false;
    },
    pushEvent() {
      this.$emit("pushEvent", this.localConfig);
    },
    mainFillTitleEvent() {
      console.log("mainFillTitleEvent");
      AxiosTemplate.get(apiURL + "names", {
        category: this.oneConfig.form.title
      }).then(res => {
        this.oneConfig.selector.audioList = res.voiceList;
      });
    },
    mainFillAudioEvent() {
      console.log("mainFillAudioEvent");
      AxiosTemplate.get(apiURL + "voiceurl", {
        category: this.oneConfig.form.title,
        name: this.oneConfig.form.audio
      }).then(res => {
        this.oneConfig.blind = res.voiceURL;
      });
    }
  },
  computed: {
    localConfig: {
      get() {
        console.log(this.config);
        return this.config;
      },
      set(config) {
        this.$emit("update:config", config);
      }
    },
    message() {
      if (this.trialFlag) return "停止";
      else return "サンプル再生";
    },
    canPushAddButton() {
      console.log("canPushAddButton");
      let checkItems = this.oneConfig.form;
      let inputCheck = !(checkItems.input == null || checkItems.input == "");
      let titleCheck = !(checkItems.title == null || checkItems.title == "");
      if (titleCheck) this.mainFillTitleEvent();
      let audioCheck = !(checkItems.audio == null || checkItems.audio == "");
      if (audioCheck) this.mainFillAudioEvent();
      let result = inputCheck && titleCheck && audioCheck;
      return !result;
    }
  }
};
</script>

<style scoped>
</style>
