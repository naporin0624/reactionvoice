<template>
  <div>
    <fieldset>
      <legend>反応ボイスを入力してね</legend>
      <inputform-component
        v-bind:form="oneConfigUpdate.form"
        v-bind:selector="oneConfigUpdate.selector"
        v-on:inputFormEvent="inputFormInputEvent"
        v-on:titleEvnt="inputFormTitleEvent"
        v-on:audioEvent="inputFormAudioEvent"
      ></inputform-component>
    </fieldset>
    <fieldset>
      <legend>コンフィグリスト</legend>
      <div v-for="config in listConfigUpdate" :key="config.id">
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
      // oneConfig: this.$store.state.oneConfig,
      // listConfig: [],
      API: {
        recognition: new webkitSpeechRecognition(),
        sudio: new Audio()
      }
    };
  },
  computed: {
    oneConfigUpdate() {
      return this.$store.getters.oneConfig;
    },
    listConfigUpdate() {
      return this.$store.getters.listConfig;
    }
  },
  methods: {
    editorStartEdit() {
      console.log("editorStartEdit");
    },
    editorEndEdit() {
      console.log("editorEndEdit");
    },
    editorDelete() {
      console.log("editorDelete");
    },
    inputFormInputEvent() {
      console.lof("inputFormInputEvent");
      this.$store.commit("setOneConfigInputText");
    },
    inputFormTitleEvent() {
      console.log("inputFormTitleEvent");
      this.$store.commit("setOneConfigTitleText");
    },
    inputFormAudioEvent() {
      console.log("inputFormAudioEvent");
      this.$store.commit("setOneConfigAudioText");
    }
  },
  created() {
    this.$store.commit(
      "setOneConfigTitleList",
      AxiosTemplate.get(apiURL + "category")
    );
  }
};
</script>

<style scoped>
</style>


