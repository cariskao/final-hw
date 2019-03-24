import axios from 'axios'

export default {
  namespaced: true, // 將actions, mutations, getters改成模組區域變數
  // 加入此語法可在console提示語法錯誤
  strict: true,
  state: {
    products: [],
    categories: [],
    product: {},
    pagination: {},
  },
  actions: {
    // 操作行爲:傳給mutations來操作資料狀態
    // 以及執行非同步行爲(ajax、setTimeout)

    // context:名稱固定。
    // status:名稱可選、參數可選,從外部透過dispatch()所傳進來
    // mapActions只能傳遞沒有帶參數的值。
    getProducts(context, page = 1) {
      const api = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/products?page=${page}`;

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
        console.log("取得產品列表:", response);
      });
    },
    getProduct(context, id) {
      const api = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/product/${id}`;
      context.commit('cartModules/LOADING', true, {
        root: true
      })
      axios.get(api).then(response => {
        context.commit('PRODUCT', response.data.product)
        console.log("getProduct-id", response.data.product); //先檢查從來源獲取的資料正不正確

        context.commit('cartModules/LOADING', false, {
          root: true
        })
      });
    },
  },
  mutations: {
    // state爲上方資料狀態的state
    // status(payload):名稱可選,由actions透過commit()所傳進來。
    PRODUCTS(state, payload) {
      state.products = payload
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
    PRODUCT(state, payload) {
      state.product = payload;
    },
  },
  getters: {
    /*
    categories(state) {
      return state.categories;
    },*/
    products: state => state.products,
    categories: state => state.categories,
    product: state => state.product,
    pagination: state => state.pagination,
  }
}
