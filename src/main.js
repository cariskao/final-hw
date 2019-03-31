// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 系統內設
import Vue from 'vue'
import App from './App'
import router from './router'

// 引用自定義檔案 @指src
import './bus' // 非父子組件間傳值
import currencyFilter from './filters/currency' //千分號
import timestampFilter from './filters/timestamp'; //轉成日期
import Pages from '@c/commons/Pagination' // 引入分頁組件
import Alert from '@c/commons/AlertMessage' // 引入Alert組件
import store from './store'

// 引入套件
import axios from 'axios'
import VueAxios from 'vue-axios' // 將axios的AJAX套件轉爲Vue的套件,就可直接用this.$http運行。
import Loading from 'vue-loading-overlay'; // Loading動畫套件
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap' // 要在這裡引入就必須安裝完整版本含jquery及popper
import VeeValidate from 'vee-validate' // 驗證套件
import zhTWvalidate from 'vee-validate/dist/locale/zh_TW' // 驗證套件中文化
import Vuex from 'vuex'
import Vtip from 'vtip'
import 'vtip/lib/index.min.css'

// 啓用套件(有的套件需要啓用才可以使用)
Vue.use(VueAxios, axios)
Vue.use(VeeValidate) // vue.use()之間不可合用,會error
Vue.use(Vuex)
VeeValidate.Validator.localize('zh_TW', zhTWvalidate) // 順序要在vue.use()之後,跟課程相反
Vue.use(Vtip.directive)
// 工具函数调用
Vue.prototype.$tip = Vtip.tip

// 全域使用自定義檔案
Vue.filter('timestamp', timestampFilter);
Vue.filter('currency', currencyFilter) //千分號
Vue.component('pagination', Pages); // 再把分頁全域啓用
Vue.component('Alert', Alert); // 再把Alert全域啓用

// 全域使用套件
Vue.component('Loading', Loading) // Loading動畫全局啓用(非fontawesome)

Vue.config.productionTip = false // 預設
axios.defaults.withCredentials = true;
// 跨域登入,後端會自動返回session值並存到瀏覽器的cookies,並且每次發送API時,也會自動帶往後端,這裡若沒寫,到時在講座91會無法新增產品

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // 注意不要放到components中
  components: {
    App,
  },
  template: '<App/>'
})

// !!!導航守衛在用戶在網址輸入強行切換頁面時觸發!!!
// PS:若已登入則可直接在網址列輸入網址來切換頁面
// https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB
router.beforeEach((to, from, next) => {
  // console.log('main.js導航守衛/to', to, 'main.js導航守衛/from', from, 'main.js導航守衛/next', next);
  // console.log('main.js導航守衛/meta:', to.meta);

  // 因在router/index.js中,在需要防止「強行切換頁面」的頁面設定meta,然後這裡if()裡條件是設to.meta,所以代表當任何一頁要直接輸入網址跳轉到該頁面時,就會進入這個條件式
  // PS：是代表當任何一頁要直接輸入網址跳轉到任一頁有設定meta.requiresAuth時,都會執行
  if (to.meta.requiresAuth) {
    // 這裡可以設定環境變數,請看講座82
    // const SERVER_PATH = "https://vue-course-api.hexschool.io";
    // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%99%BB%E5%85%A5%E5%8F%8A%E9%A9%97%E8%AD%89#%E6%AA%A2%E6%9F%A5%E7%94%A8%E6%88%B6%E6%98%AF%E5%90%A6%E4%BB%8D%E6%8C%81%E7%BA%8C%E7%99%BB%E5%85%A5
    // 檢查用戶是否仍持續登入
    const api = `${process.env.SERVER_API_PATH}/api/user/check`; // 登入時就會觸發這個api

    // 因爲現在的執行環境是在router.beforeEach()下,並不是在vue的組件裡,所以沒辦法直接呼叫this.$http,所以直接使用axios
    axios.post(api).then(response => {
      // console.log('main.js-requiresAuth', response);
      // console.log('main.js-requiresAuth-success', response.data.success);
      // 這裡若直接在網址輸入跳轉,則會回傳success=false

      if (response.data.success) {
        // 若正常流程下登入成功,就放行
        next()
      } else {
        // 否則就重新回到登入頁
        next({
          path: '/login'
        })
      }
    });
  } else {
    // 否則就跳轉
    next()
  }
})
