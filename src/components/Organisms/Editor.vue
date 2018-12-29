<template>
  <div>
    <showrecord-component
      v-bind:label="{one:input, two:title, three:audio}"
      v-on:buttonEvent="startEvent"
    ></showrecord-component>
    <transition>
      <div v-if="flag">
        <inputform-component
          v-bind:input.sync="input"
          v-bind:title.sync="title"
          v-bind:audio.sync="audio"
          v-bind:selector="selector"
        ></inputform-component>
        <div class="edit-and-delete">
          <button @click="closeEvent" v-bind:disabled="canClose">閉じる</button>
          <button @click="deleteEvent">削除</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ShowRecordComponent from "../Molecules/ShowRecord";
import InputFromComponent from "../Molecules/InputForm";
import ButtonComponent from "../Atom/Button";
import AxiosTemplate from "../api/AxiosTemplate.js";

const apiURL = "http://192.168.1.125:5000/api/sana/";
export default {
  name: "Editor",
  props: {
    oneConfig: Object
  },
  components: {
    "showrecord-component": ShowRecordComponent,
    "inputform-component": InputFromComponent,
    "button-component": ButtonComponent
  },
  created() {
    console.log("created");
    console.log(this.oneConfig);
  },
  data() {
    return {
      flag: false,
      input: this.oneConfig.form.input,
      title: this.oneConfig.form.title,
      audio: this.oneConfig.form.audio,
      selector: this.oneConfig.selector,
      url: this.oneConfig.blind.url,
      label: {
        one: this.input,
        two: this.title,
        three: this.audio
      }
    };
  },
  computed: {
    canClose() {
      let inputCheck = !(this.input == "" || this.input == null);
      let titleCheck = !(this.title == "" || this.title == null);
      let audioCheck = !(this.audio == "" || this.audio == null);
      return !(inputCheck && titleCheck && audioCheck);
    }
  },
  watch: {
    title() {
      AxiosTemplate.get(apiURL + "names", {
        category: this.title
      }).then(res => {
        this.selector.audioList = res.voiceList;
      });
      this.audio = "";
    },
    audio() {
      if (this.audio != "") {
        AxiosTemplate.get(apiURL + "voiceurl", {
          category: this.title,
          name: this.audio
        }).then(res => {
          this.url = res.voiceURL;
        });
      }
    }
  },
  methods: {
    deepcopy(json) {
      return JSON.parse(JSON.stringify(json));
    },
    startEvent() {
      this.flag = true;
      this.$emit("startEdit");
    },
    closeEvent() {
      this.flag = false;
      let config = this.deepcopy(this.oneConfig);
      config.form = {
        input: this.input,
        title: this.title,
        audio: this.audio
      };
      config.selector.audioList = this.selector.audioList;
      config.blind = { url: this.url };
      this.$emit("endEdit", { config: config, id: this.oneConfig.id });
    },
    deleteEvent() {
      this.$emit("deleteEvent", this.oneConfig.id);
    }
  }
};
</script>

<style scoped>
.edit-and-delete {
  text-align: center;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.v-enter {
  opacity: 0;
  transform: translateY(-100px);
}
.v-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
