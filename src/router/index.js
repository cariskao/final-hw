import Vue from 'vue'
import Router from 'vue-router'

// 前台
import Login from '@c/pages/frontEnd/Login'
import Home from '@c/pages/frontEnd/Home'
import Cart from '@c/pages/frontEnd/Cart'
import CustomerCheckout from '@c/pages/frontEnd/CustomerCheckout'
import FrontTemp from '@c/pages/FrontEnd/common/Front_Temp'

// 後台
import Orders from '@c/pages/backEnd/Orders'
import Products from '@c/pages/backEnd/Products'
import Coupons from '@c/pages/backEnd/Coupons'
import BackTemp from '@c/pages/backEnd/common/Back_Temp'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '*', // 假設進入的路徑不是我們所設定的,就會被重新導向到login
      redirect: 'login'
    },
    {
      path: '/',
      name: 'root',
      component: FrontTemp,
      children: [{
        path: 'login',
        name: 'Login',
        component: Login,
      }, {
        path: 'home',
        name: 'Home',
        component: Home,
      }, {
        path: 'cart',
        name: 'Cart',
        component: Cart,
      }, {
        path: 'customer_checkout/:orderId',
        name: 'CustomerCheckout',
        component: CustomerCheckout,
      }, ]
    },
    {
      // admin下都需驗證
      path: '/admin',
      name: 'admin',
      component: BackTemp,
      // 注意在children下的path不用加上/
      children: [{
        path: 'products',
        name: 'Products',
        component: Products,
        // https://router.vuejs.org/zh/guide/advanced/meta.html
        meta: {
          // 當用戶想要直接輸入網址強行到這個頁面時,/products就會被驗證(在main.js導航守衛)
          // console會看到此訊息,沒設定的話,meta={} PS:(main.js的router.beforeEach()要開)
          // 不管是從這頁切換到別頁,或是從別頁切換到這頁,這頁都會在meta中show出此訊息
          requiresAuth: true
        },
      }, {
        path: 'orders',
        name: 'Orders',
        component: Orders,
        meta: {
          requiresAuth: true
        },
      }, {
        path: 'coupons',
        name: 'Coupons',
        component: Coupons,
        meta: {
          requiresAuth: true
        },
      }]
    },
  ]
})
