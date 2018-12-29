<template>
  <select @change="catchEvent">
    <option disabled value>何か1つ選んでね</option>
    <option v-for="item in selectItem" :key="item+Math.random()"></option>
  </select>
</template>
<script>
export default {
  name: "SelectorAtom",
  props: {
    selectItem: [Object, Array]
  },
  methods: {
    catchEvent(e) {
      this.$emit("selectEvent", e.target.value);
    }
  }
};
</script>

<style scoped>
</style>
