<template>
  <div>
    <header>
      <a href="#" @click="homeClick" class="title">ResponSa-na</a>
      <a href="#" @click="homeClick" class="home">Home</a>
      <a href="#" @click="localConfigClick" class="localtemplate">コンフィグ</a>
      <a href="#" @click="globalConfigClick" class="template">みんなののコンフィグ集</a>
      <a href="#" @click="rankingClick" class="ranking">
        <s>コンフィグ使用ランキング</s>
      </a>
      <a href="#" @click="howtouseClick" class="howtouse">このアプリについて</a>
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

    <div class="main-content-box">
      <transition appear>
        <!-- Home -->
        <div class="home" v-if="flag.pageStatus=='home'">
          <startbutton-component v-bind:flag="flag" v-on:toggle="toggle"></startbutton-component>
          <fieldset v-if="flag.recog">
            <legend>喋った言葉をここに表示するよ</legend>
            <talkinglog-component class="talking-component" v-bind:voiceText="showInputText"></talkinglog-component>
          </fieldset>

          <fieldset v-else>
            <legend>反応ボイスを入力してね</legend>

            <inputform-component
              class="input-form-component"
              v-bind:selector="selector"
              v-bind:showInputForm="formContents"
              v-on:input="handleInput"
              v-on:selectTitle="handleSelectTitle"
              v-on:selectButton="handleSelectButton"
            ></inputform-component>

            <div class="add-button">
              <button class="small" @click="listPush" v-bind:disabled="!checkFillData">この設定で追加する</button>
            </div>
          </fieldset>

          <fieldset>
            <legend>コンフィグリスト</legend>
            <div class="template-save">
              <label>コンフィグ名</label>
              <input type="text" v-model="saveToLocalData.name">
              <button
                class="small"
                v-bind:disabled="!canSaveToLocal"
                @click="saveConfigTempraryData"
              >コンフィグ保存</button>
            </div>

            <showconfig-component
              class="show-config-component"
              v-bind:showConfigList="retentionData"
              v-bind:selector="selector"
              v-on:del="pushDeleteButton"
              v-on:editResult="pushEditButton"
            ></showconfig-component>
          </fieldset>
        </div>

        <div class="local-config" v-else-if="flag.pageStatus=='localConfig'">
          <startbutton-component v-bind:flag="flag" v-on:toggle="toggle"></startbutton-component>

          <fieldset v-if="flag.recog">
            <legend>喋った言葉をここに表示するよ</legend>
            <talkinglog-component class="talking-component" v-bind:voiceText="showInputText"></talkinglog-component>
          </fieldset>

          <fieldset v-else>
            <legend>ローカルコンフィグだよ〜</legend>
            <templateselector-component
              v-bind:template="Object.keys(configTemporaryData)"
              v-on:selectTemplateName="setConfigToRetentionData"
            ></templateselector-component>
          </fieldset>

          <fieldset>
            <legend>コンフィグリスト</legend>
            <div class="template-save">
              <label>公開する名前</label>
              <input type="text" v-model="saveToGlobalData.name">
              <button @click="axiosNewSaveToGlobal" v-bind:disabled="saveToGlobalData.name==''">公開</button>
            </div>
            <showOnly-component class="show-config-component" v-bind:showConfigList="localShowData"></showOnly-component>
          </fieldset>
        </div>

        <div class="global-config" v-else-if="flag.pageStatus=='globalConfig'">
          <startbutton-component v-bind:flag="flag" v-on:toggle="toggle"></startbutton-component>

          <fieldset v-if="flag.recog">
            <legend>喋った言葉をここに表示するよ</legend>
            <talkinglog-component class="talking-component" v-bind:voiceText="showInputText"></talkinglog-component>
          </fieldset>

          <fieldset v-else>
            <legend>グローバルコンフィグだよ〜</legend>
            <templateselector-component
              class="config-select-component"
              v-bind:template="global.selectList"
              v-on:selectTemplateName="handleUseTemplate"
              v-on:updateTemplate="updateTemplate"
            ></templateselector-component>
          </fieldset>

          <fieldset>
            <legend>コンフィグリスト</legend>
            <showOnly-component
              class="show-config-component"
              v-bind:showConfigList="globalShowData"
            ></showOnly-component>
          </fieldset>
        </div>

        <div class="ranking" v-else-if="flag.pageStatus=='ranking'">
          <ranking-component></ranking-component>
        </div>

        <div class="how-to-use" v-else>
          <discription-component></discription-component>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import startButton from "./startButton";
import discription from "./discription";
import widget from "./widget";
import inputForm from "./inputForm";
import showConfigList from "./showConfigList";
import talkingLog from "./talingLog";
import templateSelector from "./templateSelector";
import showOnlyConfigList from "./showOnlyConfigList";
import ranking from "./ranking";

export default {
  name: "reactionNatori",
  components: {
    "startbutton-component": startButton,
    "discription-component": discription,
    "widget-component": widget,
    "inputform-component": inputForm,
    "showconfig-component": showConfigList,
    "showOnly-component": showOnlyConfigList,
    "talkinglog-component": talkingLog,
    "templateselector-component": templateSelector,
    "ranking-component": ranking
  },
  data() {
    return {
      //バックエンド接続先
      // apiHost: "https://responsa-na.herokuapp.com/api/sana/",
      apiHost: "http://localhost:5000/api/sana/",
      //ユーザーが認識結果を見るための変数
      showInputText: "",
      //イベントに引っかかった音声URLをQueに積む
      playQue: [],
      //保存しておくデータ群
      retentionData: [],
      //ローカルコンフィグで表示するデータ
      localShowData: [],
      //グローバルコンフィグで表示するデータ
      globalShowData: [],
      //コンフィグ一時保存データ
      //データ構造
      /*{
       *  保存した名前1:[
       *    {
       *      configData...
       *    },
       *    {
       *      configData...
       *    },
       *  ],
       *  保存した名前2:[
       *    {
       *      configData...
       *    },
       *    {
       *      configData...
       *    },
       *  ]
       *}
       */
      configTemporaryData: {},

      API: {
        //音声認識API
        recognition: new webkitSpeechRecognition(),
        //オーディオ再生API
        audio: new Audio()
      },
      /*
       * flag.audioStatus
       * 再生の待機状態を表すフラグ
       * trueなら再生待機中
       * falseからビジー状態
       *
       * flag.recog
       * 音声認識の状態を表すフラグ
       * trueなら音声録音開始
       * falseなら停止
       */
      flag: {
        audioStatus: true,
        recog: false,
        pageStatus: "home",
        password: false
      },
      selector: {
        title: null,
        button: null
      },
      global: {
        selectList: null,
        name: null
      },
      saveToLocalData: {
        name: ""
      },
      saveToGlobalData: {
        name: ""
      },
      //各入力フォームが持つ変数
      formContents: {
        //ユニークコード
        //listPushで設定される
        id: null,
        //選択したカテゴリの記憶
        //handleSelectTitleで設定される
        selectTitle: null,
        //ボタン名
        //handleSelectButtonで設定される
        selectButton: null,
        //反応させたい単語
        //handleInputで設定される
        input: null,
        //再生するmp3のURL
        //axiosGetURLで設定される
        audio: null
      }
    };
  },
  methods: {
    toggle(e) {
      //console.log("toggle");
      this.flag.recog = !this.flag.recog;
      if (this.flag.recog) {
        this.showInputText = "";
        this.API.recognition.start();
      } else this.API.recognition.stop();
    },
    listPush(e) {
      //console.log("listPush");
      if (this.retentionData.length >= 20)
        alert("20アイテム以上は登録できないよ");
      else {
        var pushData = this.deepcopy(this.formContents);
        var data = this.retentionData;
        //retentionDataに何も入っていないときはidを0にして登録
        if (data.length == 0) pushData.id = data.length;
        //retentionDataにオブジェクトが入っているときは最後のid+1を登録する
        else pushData.id = data[data.length - 1].id + 1;
        this.retentionData.push(pushData);
      }
    },
    //jsonデータをディープコピー
    deepcopy(json) {
      return JSON.parse(JSON.stringify(json));
    },
    /*v-onハンドラ系*/

    //inputFormからのinputデータをformContentsのinputに入れる
    handleInput(input) {
      //console.log("handleInput");
      this.formContents.input = input;
    },
    //inputFormからのselectTitleデータをformContentsのselectTitleに入れる
    handleSelectTitle(title) {
      //console.log("handleSelectTitle");
      this.formContents.selectTitle = title;
      this.axiosGetButtonList(title);
    },
    //inputFormからのselectButtonデータをformContentsのselectButtonに入れる
    handleSelectButton(button) {
      //console.log("handleSelectName");
      this.formContents.selectButton = button;
      this.axiosGetURL(button);
    },
    //テンプレート選択時の挙動
    handleUseTemplate(selectTemplateName) {
      //console.log("handleUseTemplate");
      this.global.name = selectTemplateName;
      this.axiosGetGlobalConfig(this.global.name);
    },
    //showConfigListからのボタンイベントで発火
    pushEditButton(config) {
      //console.log("pushEditButton");
      var index = this.retentionData.findIndex(item => item.id === config.id);
      this.retentionData[index] = this.deepcopy(config);
    },
    //showConfigListからの削除ボタンイベントで発火
    //削除を押されたコンフィグを削除します
    pushDeleteButton(id) {
      //console.log("pushDeleteButton");
      var newArray = this.retentionData.filter(item => item.id !== id);
      this.retentionData = newArray;
    },
    //テンプレートを更新する
    updateTemplate(e) {
      //console.log("updateTemplate");
      this.axiosGetGlobalNameList();
    },

    /*ResponSa-naの根幹となる機能*/
    //キューに音声URLをセット
    audioSetQue(text) {
      console.log("audioSetQue");

      if (this.flag.pageStatus == "home") var config = this.retentionData;
      else if (this.flag.pageStatus == "localConfig")
        var config = this.localShowData;
      else if (this.flag.pageStatus == "globalConfig")
        var config = this.globalShowData;
      else return;
      console.log(config);
      for (var item in config) {
        if (~text.indexOf(config[item].input))
          this.playQue.push(config[item].audio);
      }
    },
    //放送タイトルリストを取得
    axiosGetTitle() {
      //console.log("getCategory");
      axios
        .get(this.apiHost + "category")
        .then(res => {
          this.selector.title = res.data.categoryList;
        })
        .catch(res => {
          console.log(res);
        })
        .then(console.log("getCategory finsish"));
    },
    //選択された生放送のさなボタンを取得
    axiosGetButtonList(title) {
      //console.log("axiosetNameList");
      axios
        .get(this.apiHost + "names", {
          params: {
            category: title
          }
        })
        .then(res => {
          this.selector.button = res.data.voiceList;
        })
        .catch(res => {
          console.log(res);
        })
        .then(console.log("axiosGetNameList finish"));
    },
    //選択されたさなボタンからURLを取得
    axiosGetURL(button) {
      //console.log("axiosGetURL");
      axios
        .get(this.apiHost + "voiceurl", {
          params: {
            category: this.formContents.selectTitle,
            name: this.formContents.selectButton
          }
        })
        .then(res => {
          this.formContents.audio = res.data.voiceURL;
        })
        .catch(res => {
          console.log(res);
        })
        .then(console.log("axiosGetURL finish"));
    },

    /*ローカルテンプレート機能*/
    setConfigToRetentionData(configName) {
      //console.log("setConfigToRetentionData");
      this.localShowData = this.deepcopy(this.configTemporaryData[configName]);
    },
    //ローカルコンフィグリストに保存
    saveConfigTempraryData() {
      //console.log("saveConfigTempraryData");
      this.configTemporaryData[this.saveToLocalData.name] = this.deepcopy(
        this.retentionData
      );
      //console.log(this.configTemporaryData);
      this.retentionData = [];
      this.saveToLocalData.name = "";
    },

    /*グローバルテンプレート機能*/
    //テンプレリストをDBから取得
    axiosGetGlobalNameList() {
      //console.log("axiosGetGlobalNameList");
      axios
        .get(this.apiHost + "template/show")
        .then(res => {
          this.global.selectList = res.data.templateNameList;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //選択されたテンプレから内部データを取得
    axiosGetGlobalConfig(name) {
      //console.log("axiosGetGlobalConfig");
      axios
        .get(this.apiHost + "template/data", {
          params: {
            name: name
          }
        })
        .then(res => {
          var temp = res.data.retentionData;
          if (temp.length > 0)
            this.globalShowData = temp.map(x => JSON.parse(x));
        });
    },

    axiosNewSaveToGlobal() {
      //console.log("axiosNewSaveToGlobal");
      axios
        .post(this.apiHost + "template/data", {
          name: this.saveToGlobalData.name,
          template: this.localShowData.map(x => JSON.stringify(x))
        })
        .then(res => {
          alert(res.data.msg);
        })
        .catch(res => {
          console.log(res);
          alert("保存に失敗しました");
        });
    },

    /*ページ変更っぽいやつ*/
    homeClick() {
      //console.log("homeClick");
      this.pageChangeFunc();
      this.flag.pageStatus = "home";
    },
    localConfigClick() {
      //console.log("localConfigClick");
      this.flag.pageStatus = "localConfig";
    },
    globalConfigClick() {
      //console.log("globalConfigClick");
      this.pageChangeFunc();
      this.flag.pageStatus = "globalConfig";
    },
    rankingClick() {
      //console.log("rankingClick");
      this.pageChangeFunc();
      this.flag.pageStatus = "ranking";
    },
    howtouseClick() {
      //console.log("howtouseClick");
      this.pageChangeFunc();
      this.flag.pageStatus = "how";
    },
    pageChangeFunc() {
      this.flag.recog = false;
      this.API.recognition.stop();
    }
  },
  computed: {
    canSave() {
      return this.templateName.length;
    },
    countRetentionData() {
      return this.retentionData.length;
    },
    inputCheck() {
      //console.log("inputCheck");
      var nullCheck = this.formContents.input != null;
      if (nullCheck)
        nullCheck = nullCheck && this.formContents.input.length > 0;
      return nullCheck;
    },
    titleCheck() {
      //console.log("titleCheck");
      var nullCheck = this.formContents.selectTitle != null;
      if (nullCheck)
        nullCheck = nullCheck && this.formContents.selectTitle.length > 0;
      return nullCheck;
    },
    buttonCheck() {
      //console.log("selectButton");
      var nullCheck = this.formContents.selectButton != null;
      if (nullCheck)
        nullCheck = nullCheck && this.formContents.selectButton.length > 0;
      return nullCheck;
    },
    checkFillData() {
      //console.log("checkFillData");
      return this.inputCheck && this.titleCheck && this.buttonCheck;
    },
    canSaveToLocal() {
      return this.saveToLocalData.name.length > 0;
    }
  },
  watch: {
    playQue() {
      //console.log("playAudio");
      if (this.playQue.length > 0 && this.flag.audioStatus) {
        this.API.audio.src = this.playQue[0];
        this.flag.audioStatus = false;
        this.API.audio.play();
      }
    }
  },
  created() {
    //console.log("created");
    this.axiosGetTitle();
    this.axiosGetGlobalNameList();

    //webkitの使用機能やイベントを設定
    //日本語を読み取る
    this.API.recognition.lang = "ja";
    //途中経過をみる
    this.API.recognition.interimResults = true;
    //予測結果を返す数
    this.API.recognition.maxAlternatives = 1;
    //連続で文章を読み取る
    // this.API.recognition.continuous = true;
    //入力を開始した時のイベント
    // this.API.recognition.onstart = () => {};

    //認識API終了した時のイベント
    //連続認識するために音声認識APIが終了した時に音声認識フラグが立っていたら続けて認識
    this.API.recognition.onend = () => {
      if (this.flag.recog) this.API.recognition.start();
    };
    //読み取り結果のイベント
    this.API.recognition.onresult = event => {
      var results = event.results[event.resultIndex];
      this.showInputText = results[0].transcript;
      if (results.isFinal) this.audioSetQue(results[0].transcript);
    };

    //audioAPIの終了イベントを検知した時の動作
    this.API.audio.addEventListener("ended", () => {
      //キューの先頭を削除して再生待機モードにする
      this.playQue.shift();
      this.flag.audioStatus = true;
    });
  }
};
</script>

<style>
body {
  color: #7c7c7c;
  /*文字色*/
  font-family: "M PLUS 1p";
  font-size: 120%;
}

.title {
  font-family: "Fredoka One", cursive;
  font-size: 200%;
}

a.title:visited {
  color: #f4cfe2;
}

a:visited {
  color: #7c7c7c;
}
header a {
  margin: 5px;
}

.add-button {
  text-align: center;
}

.main-content-box {
  width: 80%;
  margin: 0 auto;
  max-width: 1000px;
}

.talknig-conponent,
.config-select-component,
.input-form-component {
  height: 40%;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1500ms;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

.show-config-component {
}
.template-save {
  text-align: right;
}
</style>
