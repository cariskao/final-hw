// import Vue from 'vue';
import axios from 'axios'

export default {
  namespaced: true, // 將actions, mutations, getters改成模組區域變數
  // 加入此語法可在console提示語法錯誤
  strict: true,
  state: {
    products: [], // 前端Home.vue
    categories: [],
    products_pagination: [], // 後端的產品列表
    pagination: {},
    searchText: "",
    clickSlide: false,
  },
  actions: {
    // 操作行爲:傳給mutations來操作資料狀態
    // 以及執行非同步行爲(ajax、setTimeout)

    // context:名稱固定。
    // status:名稱可選、參數可選,從外部透過dispatch()所傳進來
    // mapActions只能傳遞沒有帶參數的值。
    // --------------------------------------------------
    addFavorite(context, payload) {
      context.commit('ADDFAVORITE', payload)
    },
    searchText(context, status) {
      context.commit('SEARCHTEXT', status)
    },
    clickSlide(context, status) {
      context.commit('CLICKSLIDE', status)
    },
    getProducts(context, page) {
      context.commit('cartModules/LOADING', true, {
        root: true
      })
      if (page !== undefined) {
        const api_pagination = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/products?page=${page}`;
        axios.get(api_pagination).then(response => {
          context.commit('PRODUCTS_PAGINATION', response.data.products)
          context.commit('PAGINATION', response.data.pagination)
          context.commit('cartModules/LOADING', false, {
            root: true
          })
        });
      }
      const api = `${process.env.SERVER_API_PATH}/api/${process.env.USER_PATH}/products/all`;

      // 在非vue組件下無法直接使用this.$http,所以只能使用傳統axios方式(要先import axios)
      axios.get(api).then(response => {
        /*直接寫入就可以,不用先設定
        let productsSet = payload.forEach(ele => {
          // 在非vue組件下無法直接使用this.$set(),所以要寫成一下(要先import vue)
          Vue.set(ele, 'isStar', false)
        });*/
        const data = localStorage.getItem("myFavorite") ?
          JSON.parse(localStorage.getItem("myFavorite")) : {
            items: []
          };

        if (data.items.length > 0) {
          response.data.products.forEach(res => {
            const val = data.items.some((storage) => {
              return storage.id === res.id
            })

            val ? res.isStar = true : res.isStar = false

            // 使用雙forEach在比對沒加入我的最愛的商品是正常的,但在比對有加入我的最愛的商品時,會有原本爲true又變成false的情況。
            // console.log('res.isStar-before', res.isStar, res.title, storage.title);
            // console.log('res.isStar', res.isStar, res.title, storage.title);
          });
        } else {
          // 注意這裡直接用response來新增isStar屬性,沒有先放到別的陣列中
          response.data.products.forEach(ele => {
            // 這裡沒有set進localStorage,所以當data去get到localStorage時,是還沒有isStar屬性的
            // 這是爲了在尚未加入我的最愛前,讓home.vue的愛心顯示爲空心
            ele.isStar = false
          });
        }
        // 因爲要傳送的PRODUCTS以及CATEGORIES的mutations就在此檔案,所以不用加上root以及Modules名稱
        context.commit('PRODUCTS', response.data.products)
        context.commit('CATEGORIES', response.data.products)
        context.commit('cartModules/LOADING', false, {
          root: true
        })
        // console.log("取得產品列表:", response.data.products);
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
    PRODUCTS_PAGINATION(state, payload) {
      state.products_pagination = payload
    },
    PRODUCTS(state, payload) {
      state.products = payload.filter(e => e.is_enabled);
      // console.log('確認isStar屬性', payload);

    },
    CATEGORIES(state, payload) {
      // 取得唯一值
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
    ADDFAVORITE(state, payload) {
      const data = localStorage.getItem("myFavorite") ?
        JSON.parse(localStorage.getItem("myFavorite")) : {
          items: []
        };

      let checkItem = data.items.some((item) => {
        return item.id === payload.id
      })

      if (!checkItem) {
        payload.isStar = true
        data.items.push(payload)
      } else {
        let r = confirm("是否要從「我的最愛」中移除?");
        if (r) {
          data.items.forEach((item, index) => {
            if (item.id === payload.id) {
              data.items.splice(index, 1);
            }
          });
          payload.isStar = false;
        }
      }
      localStorage.setItem("myFavorite", JSON.stringify(data));
    }
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
    products_pagination: state => state.products_pagination,
    categories: state => state.categories,
    pagination: state => state.pagination,
    searchText: state => state.searchText,
    clickSlide: state => state.clickSlide,
  }
}
