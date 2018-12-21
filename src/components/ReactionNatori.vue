<template>
  <div>
    <h1 class="title">ResponSa-na</h1>

    <div class>
      <u>
        <b>さなちゃんからいつも元気貰ってます、ありがとう！
          <br>勝手に作っちゃってごめんなさい
        </b>
      </u>
    </div>
    <div class="start-button-contents">
      <label>音声認識ボタンをおしてね！</label>
      <button class="start" @click="toggle" v-show="!recogFlag">音声取得開始</button>
      <button class="end" @click="toggle" v-show="recogFlag">音声取得停止</button>
    </div>

    <div class="separate">
      <div class="left-box">
        <left-component v-bind:showInputText="showInputText"></left-component>
      </div>

      <div class="center-box">
        <div class="add">
          <button @click="listPush" v-bind:disabled="!canPush">追加する</button>
        </div>
        <div class="grid-contener">
          <div class="input-box-label">反応させたい言葉</div>
          <div class="select-category-label">放送タイトル</div>
          <div class="select-contents-label">反応ボイス</div>
        </div>

        <div class="form grid-contener" v-for="vlt in voiceLinkTexts" v-bind:key="vlt.unique">
          <!-- 単語入力欄 -->
          <input type="text" v-model="vlt.input" style="width: 90%;">
          <!-- 放送タイトル選択欄 -->
          <select v-model="vlt.select.category" @change="axiosGetNameList(vlt)" style="width: 90%">
            <option disabled value>何か一つ選んでね</option>
            <option v-for="title in broadcastCategory" v-bind:key="title + Math.random()">{{title}}</option>
          </select>

          <!-- 発火ボイス登録 -->
          <select v-model="vlt.select.name" @change="axiosGetURL(vlt)" style="width: 90%">
            <option disabled value v-show="vlt.select.category==''">何か一つ選んでね</option>
            <option disabled value v-show="vlt.select.category!=''">先に放送タイトルを選んでね</option>
            <!-- keyがダブることがあるのでrandomを使っている -->
            <!-- そのうち直さないとまずいことになりそうな予感がある -->
            <option v-for="name in vlt.nameList" v-bind:key="name + Math.random()">{{name}}</option>
          </select>

          <button @click="delInputBox(vlt)" v-bind:disabled="!canDelete">削除する</button>
        </div>
      </div>

      <div class="right-box">
        <natori-component></natori-component>
      </div>
    </div>
  </div>
</template>

<script>
import left from "./leftbox";
import natoriwidgets from "./natoriWidgets";
import axios from "axios";
export default {
  name: "Main",

  components: {
    "left-component": left,
    "natori-component": natoriwidgets
  },
  data() {
    return {
      //バックエンド接続先
      apiHost: "https://responsa-na.herokuapp.com/",
      //音声認識API
      recognition: new webkitSpeechRecognition(),
      //ユーザーが認識結果を見るための変数
      showInputText: "",
      //放送タイトルをセット
      broadcastCategory: null,
      //audioAPIをセット
      audioObj: new Audio(),
      //再生可能ならtrue, そうでないならfalse
      audioFlag: true,
      //録音開始ならtrue, そうでないならfalse
      recogFlag: false,
      //イベントに引っかかった音声をQueに積む
      playQue: [],
      //各入力フォームが持つ変数
      voiceLinkTexts: [
        {
          //ユニークコード
          unique: 0,
          //表示する音声リスト
          nameList: null,
          //選択したカテゴリの記憶
          select: {
            category: null,
            name: null
          },
          //反応させたい単語
          input: null,
          //再生するmp3のURL
          audio: null
        }
      ]
    };
  },
  methods: {
    toggle() {
      //console.log("toggle");
      this.recogFlag = !this.recogFlag;
      if (this.recogFlag) this.recognition.start();
      else this.recognition.stop();
    },
    listPush() {
      //console.log("listPush");
      this.voiceLinkTexts.push(this.independentObejct());
    },
    independentObejct() {
      //console.log("independentObject");
      return {
        unique: this.voiceLinkTexts.length,
        select: {
          category: null,
          name: null
        },
        nameList: null,
        input: null,
        audio: null
      };
    },
    axiosGetCategory() {
      //console.log("getCategory");
      axios
        .get(this.apiHost + "/api/sana/category")
        .then(res => {
          this.broadcastCategory = res.data.categorylist;
        })
        .catch(res => {
          console.log(res);
        })
        .then(console.log("getCategory finsish"));
    },
    axiosGetNameList(vlt) {
      //console.log("getNameList");
      axios
        .get(this.apiHost + "/api/sana/names", {
          params: {
            category: vlt.select.category
          }
        })
        .then(res => {
          this.voiceLinkTexts[vlt.unique].nameList = res.data.voicelist;
        })
        .catch(res => {
          console.log(res);
        })
        .then(console.log("getNameList finish"));
    },
    axiosGetURL(vlt) {
      //console.log("getURL");
      return axios
        .get(this.apiHost + "/api/sana/voiceurl", {
          params: {
            category: vlt.select.category,
            name: vlt.select.name
          }
        })
        .then(res => {
          this.voiceLinkTexts[vlt.unique].audio = res.data.voiceurl;
        })
        .catch(res => {
          console.log(res);
        })
        .then(console.log("getURL finish"));
    },
    delInputBox(vlt) {
      //console.log("del");
      this.voiceLinkTexts.splice(vlt.unique, 1);
      //ラベルの振り直し
      for (var i = 0; i < this.voiceLinkTexts.length; i++)
        this.voiceLinkTexts[i].unique = i;
    },
    audioSetQue(text) {
      for (var i = 0; i < this.voiceLinkTexts.length; i++) {
        var item = this.voiceLinkTexts[i];
        if (~text.indexOf(item.input)) {
          //console.log(item.audio);
          this.playQue.push(item.audio);
        }
      }
    }
  },
  computed: {
    canPush() {
      //console.log("canPush");
      return this.voiceLinkTexts.length < 20;
    },
    canDelete() {
      //console.log("canDelete");
      return this.voiceLinkTexts.length - 1;
    }
  },
  watch: {
    playQue() {
      //console.log("playAudio" + this.playQue.length);
      if (this.playQue.length > 0 && this.audioFlag) {
        this.audioObj.src = this.playQue[0];
        //console.log("nowPlay: " + this.playQue[0]);
        this.audioFlag = false;
        this.audioObj.play();
      }
    }
  },
  created() {
    //console.log("created");
    this.axiosGetCategory();
    //webkitの使用機能やイベントを設定
    //日本語を読み取る
    this.recognition.lang = "ja";
    //忘れた
    this.recognition.interimResults = true;

    this.recognition.maxAlternatives = 1;
    //連続で文章を読み取る
    this.recognition.continuous = true;
    //入力を開始した時のイベント
    // this.recognition.onstart = () => {};

    //認識API終了した時のイベント
    //1分黙りが続くと止まってしまうのでそれを回避するためのやつ
    this.recognition.onend = () => {
      if (this.recogFlag) this.recognition.start();
    };
    //読み取り結果のイベント
    this.recognition.onresult = event => {
      var results = event.results[event.resultIndex];
      this.showInputText = results[0].transcript;
      if (results.isFinal) this.audioSetQue(results[0].transcript);
    };

    //audioAPIの終了イベントを検知した時の動作
    this.audioObj.addEventListener("ended", () => {
      this.playQue.shift();
      this.audioFlag = true;
    });
  }
};
</script>

<style>
body {
  color: #7c7c7c; /*文字色*/
  font-family: "M PLUS 1p";
}
.title {
  text-align: center;
  font-family: "Fredoka One", cursive;
  font-size: 280%;
  color: #f4cfe2;
}

.start-button-contents {
  padding: 5px;
  text-align: center;
  font-family: "B612 Mono", monospace;
}

button {
  margin: 5px;
  font-size: 50%;
  color: #7c7c7c; /*文字色*/
  border-radius: 0.5em;
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

.separate {
  content: "";
  display: block;
  clear: both;
}

.left-box {
  float: left;
  width: 30%;
  font-size: 20px;
}

.center-box {
  float: left;
  width: 45%;
  font-size: 20px;
  text-align: center;
}

.right-box {
  float: left;
  width: 25%;
  font-size: 20px;
}

.add {
  text-align: left;
}

.grid-contener {
  display: grid; /* グリッドレイアウト */
  grid-template-columns: 25% 25% 25% 20%;
}

.form {
  margin: 2px;
}

.input-box-label {
  display: inline-block;
  width: 100%;
  font-size: 90%;
  text-align: center;
}

.select-category-label {
  display: inline-block;
  /* background-color: #fff; */
  width: 100%;
  font-size: 90%;
  text-align: center;
}

.select-contents-label {
  display: inline-block;
  /* background-color: #fff; */
  width: 100%;
  font-size: 90%;
  text-align: center;
}
</style>
