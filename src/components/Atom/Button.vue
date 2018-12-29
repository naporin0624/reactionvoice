<template>
  <button @click="catchEvent">
    <slot>ボタン</slot>
  </button>
</template>

<script>
export default {
  name: "ButtonAtom",
  props: {
    buttonName: String
  },
  methods: {
    catchEvent() {
      this.$emit("buttonEvent");
    }
  }
};
</script>

<style scoped>
</style>


