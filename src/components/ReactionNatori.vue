<template>
  <div>
    <div class="title-bar">
      <h1 class="siimple-h1 siimple--color-red">ResponSa-na</h1>
    </div>

    <div class="button">
      <label class="button-label siimple--color-blue">音声認識ボタンをおしていけ〜？？</label>
      <br>
      <button class="siimple-btn siimple-btn--blue" @click="toggle" v-show="!flag">録音開始</button>
      <button class="siimple-btn siimple-btn--red" @click="toggle" v-show="flag">録音停止</button>
    </div>

    <div class="separate">
      <div class="left-box">
        <p>喋った言葉をここに表示するよ</p>
        <p>{{voiceMessage}}</p>
        <br>
        <br>
        <animetion-component></animetion-component>
      </div>

      <div class="right-box">
        <button
          class="siimple-btn siimple-btn--orange"
          @click="listPush"
          v-bind:disabled="!canPush"
        >追加する</button>

        <div v-for="Vtext in voiceLinkTexts" v-bind:key="Vtext.unique">
          <input type="text" v-model="Vtext.iVoice" style="width: 150px">
          <select v-model="Vtext.selectCategory" @change="getMp3(Vtext)" style="width: 250px">
            <option disabled value>Please select one</option>
            <option v-for="item in category" v-bind:key="item + Vtext.unique">{{item}}</option>
          </select>
          <select
            v-if="Vtext.mp3list"
            v-model="Vtext.selectVoice"
            @change="audioPlaySet(Vtext)"
            style="width: 200px"
          >
            <option disabled value>Please select one</option>
            <option
              v-for="mp3 in Vtext.mp3list"
              v-bind:key="mp3.url + mp3.name + Vtext.unique"
            >{{mp3.name}}</option>
          </select>
          <button @click="del(Vtext)" v-bind:disabled="!(voiceLinkTexts.length-1)">削除</button>
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
      flag: false,
      apiHost: "https://responsa-na.herokuapp.com/",
      recognition: new webkitSpeechRecognition(),
      voiceMessage: "",
      category: null,
      nowPlay: null,
      playList: [],
      voiceLinkTexts: [
        {
          unique: 0,
          selectCategory: null,
          selectVoice: null,
          mp3list: null,
          iVoice: null,
          oVoice: null,
          audio: new Audio()
        }
      ]
    };
  },
  methods: {
    toggle() {
      ////console.log("toggle");
      this.flag = !this.flag;
      if (this.flag) this.recognition.start();
      else this.recognition.stop();
    },
    listPush() {
      ////console.log("listPush");
      this.voiceLinkTexts.push(this.independentObejct());
    },
    independentObejct() {
      ////console.log("independentObject");
      return {
        // unique: this.voiceLinkTexts[this.voiceLinkTexts.length - 1].unique + 1,
        unique: this.voiceLinkTexts.length,
        selectCategory: null,
        selectVoice: null,
        mp3list: null,
        iVoice: null,
        oVoice: null,
        audio: new Audio()
      };
    },
    getCategory() {
      //console.log("getCategory");
      axios
        .get(this.apiHost + "/api/sana/category")
        .then(res => {
          this.category = res.data.categorylist;
        })
        .catch(res => {
          console.log(res);
        });
    },
    getMp3(Vtext) {
      //console.log("getMp3");
      axios
        .get(this.apiHost + "/api/sana/contents", {
          params: {
            category: Vtext.selectCategory
          }
        })
        .then(res => {
          // //console.log(res.data.voicelist);
          this.voiceLinkTexts[Vtext.unique].mp3list = res.data.voicelist;
        })
        .catch(res => {
          console.log(res);
        });
      //console.log(this.voiceLinkTexts[Vtext.unique]);
    },
    audioPlaySet(Vtext) {
      //console.log("audioPlaySet");
      Vtext.mp3list.forEach(element => {
        if (element.name == Vtext.selectVoice) {
          this.voiceLinkTexts[Vtext.unique].oVoice = element.url;
          this.voiceLinkTexts[Vtext.unique].audio.src = element.url;
          return;
        }
      });
    },
    del(Vtext) {
      //console.log("del");
      this.voiceLinkTexts.splice(Vtext.unique, 1);
      for (var i = 0; i < this.voiceLinkTexts.length; i++)
        this.voiceLinkTexts[i].unique = i;
    },
    audioEvent(text) {
      //console.log("audioEvent");
      this.voiceLinkTexts.forEach(element => {
        if (~text.indexOf(element.iVoice)) {
          //console.log(element.oVoice);
          // this.playList.push(element.audio)
          if (this.nowPlay != null)
            this.voiceLinkTexts[this.nowPlay].audio.pause();
          this.nowPlay = element.unique;
          element.audio.play();
          //console.log("Audio end");
          return;
        }
      });
    }
  },
  // watch: {
  //   voiceLinkTexts() {
  //     for (var i = 0; i < this.voiceLinkTexts.length - 1; i++)
  // console.log(this.voiceLinkTexts[i]);
  //   }
  // },
  computed: {
    canPush() {
      //console.log("canPush");
      return this.voiceLinkTexts.length < 10;
    },
    canShowSelector(Vtext) {
      //console.log("canShowSelector" + Vtext.unique);

      return this.voiceLinkTexts[Vtext.unique].mp3list == null;
    }
  },
  created: function() {
    //console.log("created");
    this.getCategory();
    //webkitの使用機能やイベントを設定

    //日本語を読み取る
    this.recognition.lang = "ja";
    //忘れた
    this.recognition.interimResults = true;
    //連続で文章を読み取る
    this.recognition.continuous = true;

    //入力を開始した時のイベント
    this.recognition.onstart = () => {};
    //文章が終わった時のイベント
    this.recognition.onend = () => {};
    //読み取り結果のイベント
    this.recognition.onresult = event => {
      var results = event.results;

      //読み取った文章をリアルタイムにユーザーに表示
      for (var i = event.resultIndex; i < results.length; i++) {
        this.voiceMessage = results[i][0].transcript;
        //最終結果をログ出力
        //今後はここに機能を追加していく
        if (results[i].isFinal) {
          var text = results[i][0].transcript;
          //console.log(text);
          this.audioEvent(text);
        }
      }
    };
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
  padding: 1%;
  text-align: center;
  color: black;
  font-family: "M PLUS 1p";
}

.button-label {
  font-size: 150%;
}

.separate {
  content: "";
  display: block;
  clear: both;
}

.left-box {
  padding: 1%;
  float: left;
  width: 20%;
  font-family: "M PLUS 1p";
  font-size: 20px;
}

.right-box {
  padding: 1%;
  float: left;
  width: 60%;
  font-family: "M PLUS 1p";
  font-size: 20px;
}
</style>
