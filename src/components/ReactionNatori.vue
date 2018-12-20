<template>
  <div>
    <h1 class="title">ResponSa-na</h1>

    <div class="start-button-contents">
      <label>音声認識ボタンをおしてね！</label>
      <button class="start" @click="toggle" v-show="!recogFlag">音声取得開始</button>
      <button class="end" @click="toggle" v-show="recogFlag">音声取得停止</button>
    </div>

    <div class="separate">
      <div class="left-box">
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          class="twitter-share-button"
          data-show-count="true"
        >Tweet</a>
        <p>喋った言葉をここに表示するよ</p>
        <div class="input-text">
          <p>{{showInputText}}</p>
        </div>
        <discription-component></discription-component>
      </div>

      <div class="center-box">
        <button class="add-form" @click="listPush" v-bind:disabled="!canPush">追加する</button>
        <div>
          <span class="input-box-label">反応させたい言葉</span>
          <span class="select-category-label">放送カテゴリ</span>
          <span class="select-contents-label">反応ボイス</span>
        </div>
        <div class="form" v-for="vlt in voiceLinkTexts" v-bind:key="vlt.unique">
          <input type="text" v-model="vlt.input" style="width: 150px">
          <select
            v-model="vlt.select.category"
            @change="axiosGetNameList(vlt)"
            style="width: 200px"
          >
            <option disabled value>Please select one</option>
            <option v-for="title in broadcastCategory" v-bind:key="title + Math.random()">{{title}}</option>
          </select>
          <select v-model="vlt.select.name" @change="axiosGetURL(vlt)" style="width: 100px">
            <option disabled value>Please select one</option>
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
import discription from "./discription";
import natoriwidgets from "./natoriWidgets";
import axios from "axios";
export default {
  name: "Main",

  components: {
    "discription-component": discription,
    "natori-component": natoriwidgets
  },
  data() {
    return {
      apiHost: "https://responsa-na.herokuapp.com/",
      recognition: new webkitSpeechRecognition(),
      showInputText: "",
      broadcastCategory: null,
      audioObj: new Audio(),
      audioFlag: true,
      recogFlag: false,
      playQue: [],
      voiceLinkTexts: [
        {
          unique: 0,
          select: {
            category: null,
            name: null
          },
          nameList: null,
          input: null,
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
    //文章が終わった時のイベント
    this.recognition.onend = () => {
      if (this.recogFlag) this.recognition.start();
    };
    //読み取り結果のイベント
    this.recognition.onresult = event => {
      var results = event.results[event.resultIndex];
      this.showInputText = results[0].transcript;
      if (results.isFinal) this.audioSetQue(results[0].transcript);
    };

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
}
.title {
  text-align: center;
  font-family: "M PLUS 1p";
  color: #f4cfe2;
}

.start-button-contents {
  padding: 5px;
  text-align: center;
  font-family: "B612 Mono", monospace;
  font-size: 150%;
}
.button label {
  padding: 5px;
}

button {
  margin: 5px;
  font-size: 50%;
  color: #7c7c7c; /*文字色*/
  border-radius: 0.5em;
}

.input-text {
  padding: 0.5em 1em;
  width: 85%;
  height: 8em;
  /* margin: 2em 0; */
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
  font-family: "M PLUS 1p";
  font-size: 20px;
}

.center-box {
  float: left;
  width: 45%;
  font-family: "M PLUS 1p";
  font-size: 20px;
}
.right-box {
  float: left;
  width: 25%;
  height: 1vh;
}

.form {
  margin: 2px;
}

.input-box-label {
  display: inline-block; /* インラインブロック要素にする */
  /* background-color: #ccc; 背景色指定 */
  padding: 1px;
  width: 150px;
  font-size: 90%;
  text-align: center;
}

.select-category-label {
  display: inline-block; /* インラインブロック要素にする */
  /* background-color: #ccc; 背景色指定 */
  padding: 1px;
  width: 200px;
  font-size: 90%;
  text-align: center;
}

.select-contents-label {
  display: inline-block; /* インラインブロック要素にする */
  /* background-color: #ccc; 背景色指定 */
  padding: 1px;
  width: 100px;
  font-size: 90%;
  text-align: center;
}
</style>
