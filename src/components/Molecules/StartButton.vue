<template>
  <div>
    <label>録音開始ボタンだよ</label>
    <button
      :class="{waiting:!localFlag.recog, playing:localFlag.recog}"
      @click="localFlag.recog=!localFlag.recog"
    >{{message}}</button>
  </div>
</template>

<script>
export default {
  name: "StartButton",
  props: {
    flag: Object
  },
  computed: {
    localFlag: {
      get() {
        return this.flag;
      },
      set(updateFlag) {
        this.$emit("update:flag", updateFlag);
      }
    },
    message() {
      if (this.localFlag.recog) return "お話し中・・・・";
      else return "お話する！";
    }
  }
};
</script>

<style scoped>
div {
  text-align: center;
}
.waiting {
  background-color: #f8bad7;
}

.playing {
  background-color: #f8bad7;
  -webkit-animation: blink 1s ease-in-out infinite alternate;
  -moz-animation: blink 1s ease-in-out infinite alternate;
  animation: blink 1s ease-in-out infinite alternate;
}
@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-moz-keyframes blink {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
