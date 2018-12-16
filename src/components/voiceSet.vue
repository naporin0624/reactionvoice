<template>
  <div>
    <div v-for="text in voiceLinkTexts" v-bind:key="text.unique">
      <input type="text" v-model="text.inputVoice">
      <select v-model="text.outputVoive">
        <option>aa</option>
        <option>bb</option>
        <option>cc</option>
        <option>dd</option>
        <option>ee</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "voiceSet",
  props: ["voiceLinkTexts"],
  data() {
    return {};
  }
};
</script>

<style>
</style>
