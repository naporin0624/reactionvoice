<template>
  <div>
    <fieldset>
      <legend>反応ボイスを入力してね</legend>
      <inputform-component
        v-bind:input.sync="oneConfig.form.input"
        v-bind:title.sync="oneConfig.form.title"
        v-bind:audio.sync="oneConfig.form.audio"
        v-bind:selector="oneConfig.selector"
      ></inputform-component>
      <div class="add-button">
        <button @click="mainAddConfig" v-bind:disabled="canPushAddButton">この設定で追加</button>
      </div>
    </fieldset>
    <fieldset>
      <legend>コンフィグリスト</legend>
      <div v-for="config in listConfigUpdate" :key="config.id+Math.random()">
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
import InputForm from "../Molecules/InputForm";
import editor from "../Organisms/Editor";
import AxiosTemplate from "../api/AxiosTemplate.js";
const apiURL = "http://192.168.1.125:5000/api/sana/";
export default {
  name: "Main",
  components: {
    "inputform-component": InputForm,
    "editor-component": editor
  },
  data() {
    return {
      oneConfig: {
        id: 0,
        selector: {
          titleList: [],
          audioList: []
        },
        form: {
          input: null,
          title: null,
          audio: null
        },
        blind: {
          url: ""
        }
      },
      API: {
        recognition: new webkitSpeechRecognition(),
        sudio: new Audio()
      }
    };
  },
  computed: {
    listConfigUpdate() {
      console.log("listConfigUpdate");
      let listConfig = this.$store.getters.listConfig;
      return listConfig;
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
  },
  methods: {
    deepcopy(json) {
      return JSON.parse(JSON.stringify(json));
    },
    editorStartEdit() {
      console.log("editorStartEdit");
    },
    editorEndEdit() {
      console.log("editorEndEdit");
    },
    editorDelete() {
      console.log("editorDelete");
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
    },
    mainAddConfig() {
      console.log("mainAddConfig");
      console.log(this.oneConfig);
      this.$store.commit("pushListConfig", this.deepcopy(this.oneConfig));
      this.mainClearConfig();
    },
    mainClearConfig() {
      console.log("mainClearConfig");
      this.oneConfig.form = {
        input: null,
        title: null,
        audio: null
      };
      this.oneConfig.selector.audioList = [];
      this.oneConfig.blind = { url: "" };
      this.oneConfig.id++;
    }
  },
  created() {
    AxiosTemplate.get(apiURL + "category").then(res => {
      this.oneConfig.selector.titleList = res.categoryList;
    });
  }
};
</script>

<style scoped>
.add-button {
  text-align: center;
}
</style>


