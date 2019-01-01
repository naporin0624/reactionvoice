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
        saveLocalListConfig: [],
    },
    //データの状態を取得
    getters: {
        listConfig(state) {
            return state.listConfig.filter(element => element.id > 0)
        },
        itemFindListConfig(state) {
            return id => state.listConfig.find(el => el.id === id)
        },
        dustItenFind(state) {
            return state.listConfig.filter(element => element < 0)
        },
        saveList(state) {
            return state.saveLocalListConfig
        },
        nameFindSaveList(state) {
            return name => state.saveLocalListConfig.find(el => el.name === name)
        }
    },
    //データの更新
    mutations: {
        pushListConfig(state, payload) {
            console.log("pushListConfig", payload)
            state.listConfig.push(payload)
        },
        updateListConfig(state, payload) {
            console.log("updateListConfig", payload)
            let id = payload.id
            let index = state.listConfig.findIndex(el => el.id === id)
            state.listConfig[index] = payload
        },
        deleteListConfig(state, payload) {
            console.log("deleteListConfig", payload)
            let id = payload.id
            let index = state.listConfig.findIndex(el => el.id === id)
            console.log("index", index)
            state.listConfig[index]["id"] *= -1
        }
    },

})

export default store