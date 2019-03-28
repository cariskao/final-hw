import axios from 'axios'

export default {
  namespaced: true, // 將actions, mutations, getters改成模組區域變數
  // 加入此語法可在console提示語法錯誤
  strict: true,
  state: {
    isLoading: false, //載入ajax時會產生全域的讀取動畫,預設停止
    // 課程提供的API接口格式
    cart: {
      carts: []
    },
  },
  actions: {
    // context:名稱固定。
    // status:名稱可選、參數可選,從外部透過dispatch()所傳進來
    // mapActions只能傳遞沒有帶參數的值。

    // 給Cart.vue的useCouponCode跟createOrder使用
    updateLoading(context, status) {
      // 使用commit('函數名稱',要傳遞的參數)傳給mutations
      context.commit('LOADING', status)
      // 因爲LOADING的mutations就在這個檔案中,所以不用加入root參數
    },
    getCart(context) {
      const api = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/cart`;

      context.commit('LOADING', true)

      axios.get(api).then(response => {
        if (response.data.data.carts) {
          context.commit('CART', response.data.data)
          console.log("取得購物車", response.data.data);
        }
        context.commit('LOADING', false)
      });
    },
    addtoCart(context, {
      id,
      qty
    }) {
      const api = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/cart`;
      const addItem = {
        product_id: id,
        qty
      };

      context.commit('LOADING', true)

      axios.post(api, {
        data: addItem
      }).then(response => {
        // 因爲要傳送的LOADING的mutations就在此檔案,所以不用加上root以及Modules名稱
        context.commit('LOADING', false)
        //加入購物車後,刷新上方navbar的購物車數量。注意:不是this.$store.dispatch()
        context.dispatch('getCart')
        console.log("加入購物車:", response);
      });
    },
    removeCartItem(context, {
      id,
      title
    }) {
      const api = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/cart/${id}`;
      var r = confirm(`確認刪除「${title}」嗎?`);

      context.commit('LOADING', true)

      if (r) {
        axios.delete(api).then(response => {
          console.log("removeCartItem", response);
          context.dispatch('getCart')
          context.commit('LOADING', false)
        });
      } else {
        context.commit('LOADING', false)
      }
    },
  },
  mutations: {
    // state爲上方資料狀態的state
    // status(payload):名稱可選,由actions透過commit()所傳進來。
    LOADING(state, status) {
      state.isLoading = status
    },
    CART(state, payload) {
      state.cart = payload
    },
  },
  getters: {
    /*
    isLoading(state) {
      return state.isLoading;
    },
    */
    isLoading: state => state.isLoading,
    cart: state => state.cart,
  }
}
