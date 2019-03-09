// import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import util from './components/util'
import axios from 'axios';
import VueAxios from 'vue-axios';
import global from './../static/js/global'
Vue.prototype.GLOBAL = global;
Vue.use(VueAxios, axios);
import 'font-awesome/css/font-awesome.min.css'
import './components/directives.js';
import { HappyScroll } from 'vue-happy-scroll'
//自定义组件名
Vue.component('happy-scroll', HappyScroll)
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'
import VueCropper from 'vue-cropper'
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(util)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes,
    mode: 'hash'
})
router.beforeEach((to, from, next) => {

    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login' && to.path != '/reading_login') {
        next({path: '/login'})
    } else {
        next()
    }
})


Vue.prototype.vm=new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')
