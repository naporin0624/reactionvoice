<template>
  <input type="text" :value="input" @input="catchEvent">
</template>

<script>
export default {
  name: "InputTextAtom",
  props: {
    input: String
  },
  methods: {
    catchEvent(e) {
      console.log("catchEvent");
      this.$emit("inputEvent", e.target.value);
    }
  }
};
</script>

<style scoped>
</style>
