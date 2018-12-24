<template>
  <div class="start-button">
    <label>音声認識ボタンをおしてね！</label>
    <div>
      <button class="start small" @click="toggle" v-show="!flag.recog">音声取得開始</button>
      <button class="end small" @click="toggle" v-show="flag.recog">音声取得停止</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "startButton",
  props: { flag: Object },
  methods: {
    toggle() {
      this.$emit("toggle");
    }
  }
};
</script>

<style>
.start-button {
  text-align: center;
}
.start {
  background-color: #f8bad7;
}

.end {
  background-color: #f8bad7;
}

.end {
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
