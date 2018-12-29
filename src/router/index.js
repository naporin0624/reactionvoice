import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios';
// import HelloWorld from '@/components/HelloWorld'
import ReactionNatori from '@/components/ReactionNatori'
import discription from '@/components/discription'
import Main from '@/components/Page/Main'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'ReactionNatori',
        component: ReactionNatori
    }, {
        path: '/sana/discription',
        name: 'discription',
        component: discription
    }, {
        path: '/main',
        name: 'main',
        component: Main
    }]
})