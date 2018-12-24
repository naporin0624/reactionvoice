<template>
  <div class="input-text">
    <p>{{voiceText}}</p>
  </div>
</template>

<script>
export default {
  name: "talkingDialog",
  props: {
    voiceText: String
  }
};
</script>

<style>
.input-text {
  padding: 0.5em 1em;
  height: 10em;
  font-weight: bold;
  color: #7c7c7c; /*文字色*/
  background: #fff;
  border: solid 3px #f8bad7; /*線*/
  border-radius: 10px; /*角の丸み*/
}
.input-text p {
  margin: 0;
  padding: 0;
  font-family: "B612 Mono", monospace;
}
</style>
