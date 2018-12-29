import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

//プラグイン登録
Vue.use(Vuex)

//ストア作成
const store = new Vuex.Store({
    //データを登録
    state: {
        listConfig: [],
    },
    //データの状態を取得
    getters: {
        listConfig(state) {
            return state.listConfig
        }
    },
    //データの更新
    mutations: {
        pushListConfig(state, config) {
            state.listConfig.push(config)
        }
    },

})

export default store