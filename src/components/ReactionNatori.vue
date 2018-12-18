<template>
  <div>
    <div class="title-bar">
      <h1 class="title">ResponSa-na</h1>
    </div>

    <div class="button">
      <label>音声認識ボタンをおしていけ〜？？</label>
      <button class="start" @click="toggle" v-show="!recogFlag">録音開始</button>
      <button class="end" @click="toggle" v-show="recogFlag">録音停止</button>
    </div>

    <div class="separate">
      <div class="left-box">
        <p>喋った言葉をここに表示するよ</p>
        <p>{{showInputText}}</p>
        <!-- <textarea v-model="showInputText"></textarea> -->
        <br>
        <br>
        <animetion-component></animetion-component>
      </div>

      <div class="right-box">
        <button class="add-form" @click="listPush" v-bind:disabled="!canPush">追加する</button>

        <div v-for="vlt in voiceLinkTexts" v-bind:key="vlt.unique">
          <input type="text" v-model="vlt.input" style="width: 200px">
          <select
            v-model="vlt.select.category"
            @change="axiosGetNameList(vlt)"
            style="width: 300px"
          >
            <option disabled value>Please select one</option>
            <option v-for="title in broadcastCategory" v-bind:key="title + vlt.unique">{{title}}</option>
          </select>
          <select
            v-if="vlt.nameList"
            v-model="vlt.select.name"
            @change="axiosGetURL(vlt)"
            style="width: 100px"
          >
            <option disabled value>Please select one</option>
            <option v-for="name in vlt.nameList" v-bind:key="name + Math.random()">{{name}}</option>
          </select>
          <button @click="del(vlt)" v-bind:disabled="!canDelete">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import animetion from "./Animetion";
import axios from "axios";
export default {
  name: "Main",

  components: {
    "animetion-component": animetion
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
    del(vlt) {
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
      return this.voiceLinkTexts.length < 10;
    },
    canDelete() {
      //console.log("canDelete");
      return this.voiceLinkTexts.length - 1;
    }
  },
  watch: {
    // showInputText() {
    //   console.log("test");
    //   for (var i = 0; i < this.voiceLinkTexts.length; i++) {
    //     var item = this.voiceLinkTexts[i];
    //     if (~this.showInputText.indexOf(item.input)) {
    //       console.log(item.audio);
    //       this.playQue.push(item.audio);
    //     }
    //   }
    // },
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
    //連続で文章を読み取る
    this.recognition.continuous = true;
    //入力を開始した時のイベント
    // this.recognition.onstart = () => {};
    //文章が終わった時のイベント
    // this.recognition.onend = () => {};
    //読み取り結果のイベント
    this.recognition.onresult = event => {
      var results = event.results;
      //console.log(results);
      this.audioSetQue(results[event.resultIndex][0].transcript);
      this.showInputText = results[event.resultIndex][0].transcript;
      //読み取った文章をリアルタイムにユーザーに表示
      // for (var i = event.resultIndex; i < results.length; i++) {

      // }
    };

    this.audioObj.addEventListener("ended", () => {
      this.playQue.shift();
      this.audioFlag = true;
    });
  }
};
</script>

<style>
.title-bar {
  text-align: center;
  font-family: "M PLUS 1p";
  color: hotpink;
  font-size: 150%;
}

.button {
  padding: 5px;
  text-align: center;
  color: black;
  font-family: "M PLUS 1p";
}

.button label {
  font-size: 150%;
  padding: 5px;
}

.separate {
  content: "";
  display: block;
  clear: both;
}

.left-box {
  padding: 5px;
  float: left;
  width: 20%;
  font-family: "M PLUS 1p";
  font-size: 20px;
}

.right-box {
  padding: 5px;
  float: left;
  width: 60%;
  font-family: "M PLUS 1p";
  font-size: 20px;
}
</style>
