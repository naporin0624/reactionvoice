<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>
    <a
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      class="twitter-share-button"
      data-show-count="true"
    >Tweet</a>
    <div>
      <u>
        <b>さなちゃんからいつも元気貰ってます、ありがとう！
          <br>勝手に作っちゃってごめんなさい
        </b>
      </u>
    </div>
  </div>
</template>

<script>
export default {
  name: "header"
};
</script>

<style scoped>
</style>

