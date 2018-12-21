import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios';
import HelloWorld from '@/components/HelloWorld'
import ReactionNatori from '@/components/ReactionNatori'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'ReactionNatori',
        component: ReactionNatori
    }, ]
})