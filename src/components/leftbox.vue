<template>
  <div>
    <a
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      class="twitter-share-button"
      data-show-count="true"
    >Tweet</a>
    <p>喋った言葉をここに表示するよ</p>
    <div class="input-text">
      <p>{{showInputText}}</p>
    </div>
    <div class="disctiption">
      <label>使い方</label>
      <ol>
        <li>「反応させたい言葉」に単語を入れてね</li>
        <li>好きな「放送タイトル」を選択してね</li>
        <li>放送タイトルを選択してから「反応ボイス」を選んでね</li>
        <li>録音開始ボタンを押してね</li>
        <li>あとはその単語を喋れば遊べるよ！</li>
      </ol>
      <label>注意事項</label>
      <ul>
        <li>chromeのみしか動作しません；；ごめんね〜</li>
        <li>最大20個まで反応する言葉を作ることができるよ</li>
        <li>反応しなくなったらもう一度音声取得開始モードにしてね</li>
        <li>
          認識した言葉と同じ文字を入れてね
          例えば「楽しい」と「たのしい」は別の文字として認識されるよ
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "leftbox",
  props: ["showInputText"]
};
</script>

<style>
.disctiption {
  font-size: 18px;
}
.input-text {
  padding: 0.5em 1em;
  width: 70%;
  height: 8em;
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
