<template>
  <div class="main">
    <startbutto-component v-bind:flag="flag"></startbutto-component>
    <!-- <fieldset class="input-voice" v-show="!flag.recog">
      <legend>反応ボイスを入力してね</legend>
      <inputform-component
        v-bind:input.sync="oneConfig.form.input"
        v-bind:title.sync="oneConfig.form.title"
        v-bind:audio.sync="oneConfig.form.audio"
        v-bind:selector="oneConfig.selector"
      ></inputform-component>
      <div class="add-button">
        <button @click="mainAddConfig" v-bind:disabled="canPushAddButton">この設定で追加</button>
        <button @click v-bind:disable="canPushAddButton">{{}}</button>
      </div>
    </fieldset>-->
    <configsetform-component v-bind:config="oneConfig" v-on:pushEvent="mainAddConfig"></configsetform-component>
    <fieldset class="talking" v-show="flag.recog">
      <legend>喋ったことを表示するよ</legend>
      <talkingbox-component v-bind:voiceText="takingLog"></talkingbox-component>
    </fieldset>
    <fieldset class="show-voice">
      <legend>コンフィグリスト</legend>
      <div v-for="config in listConfigUpdate" v-bind:key="config.id+Math.random()">
        <editor-component
          v-bind:oneConfig="config"
          v-on:startEdit="editorStartEdit"
          v-on:endEdit="editorEndEdit"
          v-on:deleteEvent="editorDelete"
        ></editor-component>
      </div>
    </fieldset>
  </div>
</template>

<script>
import StartButton from "../Molecules/StartButton";
import InputForm from "../Molecules/InputForm";
import TalkingBox from "../Molecules/talingLog";
import editor from "../Organisms/Editor";
import ConfigSetForm from "../Organisms/ConfigSetForm";

import AxiosTemplate from "../api/AxiosTemplate.js";
const apiURL = "http://192.168.1.125:5000/api/sana/";
export default {
  name: "Main",
  components: {
    "inputform-component": InputForm,
    "editor-component": editor,
    "startbutto-component": StartButton,
    "talkingbox-component": TalkingBox,
    "configsetform-component": ConfigSetForm
  },
  data() {
    return {
      takingLog: "",
      trialAudio: new Audio(),
      audioPlayingQue: [],
      flag: {
        recog: false,
        audioPlaying: false,
        trialPlaying: false
      },
      API: {
        recognition: new webkitSpeechRecognition(),
        audio: new Audio()
      },
      oneConfig: {
        id: 1,
        selector: {
          titleList: [],
          audioList: []
        },
        form: {
          input: "",
          title: "",
          audio: ""
        },
        blind: {
          url: ""
        }
      }
    };
  },
  computed: {
    listConfigUpdate() {
      let listConfig = this.$store.getters.listConfig;
      console.log("listConfigUpdate", listConfig);
      return listConfig;
    }
  },
  methods: {
    deepcopy(json) {
      return JSON.parse(JSON.stringify(json));
    },
    editorStartEdit() {
      console.log("editorStartEdit");
    },
    editorEndEdit(payload) {
      console.log("editorEndEdit", payload);
      this.$store.commit("updateListConfig", payload);
    },
    editorDelete(payload) {
      console.log("editorDelete", payload);
      this.$store.commit("deleteListConfig", payload);
    },

    mainAddConfig() {
      console.log("mainAddConfig", this.oneConfig);
      this.$store.commit("pushListConfig", this.deepcopy(this.oneConfig));
    }
  },
  created() {
    AxiosTemplate.get(apiURL + "category").then(res => {
      this.oneConfig.selector.titleList = res.categoryList;
    });

    this.API.recognition.lang = "ja";
    this.API.recognition.interimResults = true;
    this.API.recognition.onend = () => {
      if (this.flag.recog) this.API.recognition.start();
    };
    this.API.recognition.result = event => {
      let results = event.results[event.resultIndex];
      this.takingLog = results[0].transcript;
      if (results.isFinal) {
        let resultMessage = results[0].transcript;
        console.log("final result", resultMessage);
      }
    };
  }
};
</script>

<style scoped>
.main {
  width: 90%;
  margin: 0 auto;
}
.talk-button {
  text-align: center;
}
.talk-button button {
  width: 100px;
}
.add-button {
  text-align: center;
}
.input-voice,
.talking {
  /* height: calc(500px / 50vw); */
  height: 250px;
}
.show-voice {
  height: 50vh;
  overflow-y: scroll;
  margin-bottom: 1px;
}
</style>
