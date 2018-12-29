import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

//プラグイン登録
Vue.use(Vuex)

//ストア作成
const store = new Vuex.Store({
    //データを登録
    state: {
        oneConfig: {
            selector: {
                titleList: [],
                audioList: []
            },
            form: {
                input: '',
                title: '',
                audio: ''
            },
            blind: {
                url: ''
            }
        },
        listConfig: [],
    },
    //データの状態を取得
    getters: {
        oneConfig(state) {
            return state.oneConfig
        },
        listConfig(state) {
            return state.listConfig
        }
    },
    //データの更新
    mutations: {
        setOneConfigTitleList(state, titleList) {
            state.oneConfig.selector.titleList = titleList
        },
        setOneConfigAudioList(state, audioList) {
            state.oneConfig.selector.audioList = audioList
        },
        setOneConfigInputText(state, text) {
            state.oneConfig.form.input = text
        },
        setOneConfigTitleText(state, text) {
            state.oneConfig.form.title = text
        },
        setOneConfigAudioText(state, text) {
            state.oneConfig.form.audio = text
        }
    },

})

export default store