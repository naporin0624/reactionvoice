<template>
  <div>
    <showrecord-component v-bind:label="label" v-on:buttonEvent="startEvent"></showrecord-component>
    <transition>
      <div v-if="flag">
        <inputform-component
          v-bind:form="componentHoldConfig.form"
          v-bind:selector="componentHoldConfig.selector"
          v-on:inputFormEvent="inputEditorEvent"
          v-on:titleEvent="selectTitleEvent"
          v-on:audioEvent="selectAudioEvent"
        ></inputform-component>
        <div class="edit-and-delete">
          <button-component v-on:buttonEvent="closeEvent">閉じる</button-component>
          <button-component v-on:buttonEvent="deleteEvent">削除</button-component>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ShowRecordComponent from "../Molecules/ShowRecord";
import InputFromComponent from "../Molecules/InputForm";
import ButtonComponent from "../Atom/Button";
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
  data() {
    return {
      flag: false,
      componentHoldConfig: this.oneConfig,
      label: {
        one: this.oneConfig.form.input,
        two: this.oneConfig.form.title,
        three: this.oneConfig.form.audio
      }
    };
  },
  methods: {
    deepcopy(json) {
      return JSON.parse(JSON.stringify(json));
    },
    startEvent() {
      this.flag = true;
      this.$emit("startEdit");
      this.componentHoldConfig = this.deepcopy(this.oneConfig);
    },
    closeEvent() {
      this.flag = false;
      this.$emit("endEdit", this.componentHoldConfig);
    },
    deleteEvent() {
      this.$emit("deleteEvent", this.componentHoldConfig.id);
    },
    inputEditorEvent(text) {
      this.componentHoldConfig.form.input = text;
    },
    selectTitleEvent(text) {
      this.componentHoldConfig.form.title = text;
    },
    selectAudioEvent(text) {
      this.componentHoldConfig.form.audio = text;
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
  transition: opacity 1s, transform 1s;
}
.v-enter {
  opacity: 0;
  transform: translateY(100px);
}
.v-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
