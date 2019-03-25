import axios from 'axios'

export default {
  namespaced: true, // 將actions, mutations, getters改成模組區域變數
  // 加入此語法可在console提示語法錯誤
  strict: true,
  state: {
    products: [],
    categories: [],
    pagination: {},
    searchText: "",
    clickSlide: false
  },
  actions: {
    // 操作行爲:傳給mutations來操作資料狀態
    // 以及執行非同步行爲(ajax、setTimeout)

    // context:名稱固定。
    // status:名稱可選、參數可選,從外部透過dispatch()所傳進來
    // mapActions只能傳遞沒有帶參數的值。
    // --------------------------------------------------

    searchText(context, status) {
      context.commit('SEARCHTEXT', status)
    },
    clickSlide(context, status) {
      context.commit('CLICKSLIDE', status)
    },
    getProducts(context, page = 1) {
      // const api = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/products?page=${page}`;
      const api = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/products/all`;

      context.commit('cartModules/LOADING', true, {
        root: true
      })
      // 在非vue組件下無法直接使用this,所以只能使用傳統axios方式(要先import axios)
      axios.get(api).then(response => {
        // 因爲要傳送的PRODUCTS以及CATEGORIES的mutations就在此檔案,所以不用加上root以及Modules名稱
        context.commit('PRODUCTS', response.data.products)
        context.commit('CATEGORIES', response.data.products)
        context.commit('PAGINATION', response.data.pagination)
        context.commit('cartModules/LOADING', false, {
          root: true
        })
        // console.log("取得產品列表:", response);
      });
    },
  },
  mutations: {
    // state爲上方資料狀態的state
    // status(payload):名稱可選,由actions透過commit()所傳進來。
    // --------------------------------------------------
    SEARCHTEXT(state, payload) {
      state.searchText = payload
    },
    CLICKSLIDE(state, payload) {
      state.clickSlide = payload
    },

    PRODUCTS(state, payload) {
      state.products = payload.filter(e => e.is_enabled);
    },
    CATEGORIES(state, payload) {
      const categories = new Set();
      payload.forEach(item => {
        categories.add(item.category);
      });
      // 將側邊欄的列表資料唯一值存入state.categories
      state.categories = Array.from(categories);
    },
    PAGINATION(state, payload) {
      state.pagination = payload
    },
  },
  getters: {
    /*
    初級寫法
    categories(state) {
      return state.categories;
    },*/
    // 高級寫法
    // https://jeremysu0131.github.io/Vue-js-Vuex-%E5%AD%B8%E7%BF%92%E7%AD%86%E8%A8%98-6-mapState-%E8%88%87-mapGetters-%E5%90%88%E4%BD%B5%E4%BD%BF%E7%94%A8/

    // 簡易寫法
    products: state => state.products,
    categories: state => state.categories,
    pagination: state => state.pagination,
    searchText: state => state.searchText,
    clickSlide: state => state.clickSlide,
  }
}
