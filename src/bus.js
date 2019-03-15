import Vue from 'vue' // 跟main.js一樣

// 非父子組件間傳值(Bus/總線/發佈訂閱模式/觀察者模式)
// 在Vue.prototype上掛載了一個bus的屬性,這個屬性指向一個Vue的實例
// 之後調用了這個實例時,都會包含.bus這個屬性
Vue.prototype.$bus = new Vue()
