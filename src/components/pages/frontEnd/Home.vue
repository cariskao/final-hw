<template>
  <div style="margin-top:150px">
    <!-- 全局的loading,有在main.js中import -->
    <loading :active.sync="isLoading"></loading>
    <!-- slider -->
    <carousel :data="data" style="margin-bottom:100px"></carousel>
    <div class="row">
      <Slide/>
      <div class="col-sm-12 col-md-10">
        <div class="row">
          <div
            v-for="(item) in filterProductsSearch"
            :key="item.id"
            class="col-sm-12 col-md-4 card border-0 item-hover mb-4"
            style="overflow:hidden"
          >
            <!-- PS:使用動態樣式把圖片載入進來 注意：這個tag不是<img> -->
            <div
              @click="getProduct(item.id)"
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
              class="photo-scale product-style"
            ></div>
            <div class="card-body">
              <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
              <h5 class="card-title word-size">
                <a @click.prevent="getProduct(item.id)" href="#" class="text-dark">{{ item.title }}</a>
              </h5>
              <a
                @click.prevent="addFavorite(item)"
                href="#"
                class="float-right"
                style="margin-top:-20px;margin-right:5px"
              >
                <!-- <i class="far fa-star"></i> -->
                <i class="far fa-star" v-if="!item.isStar"></i>
                <i class="fas fa-star" v-if="item.isStar"></i>
              </a>
              <p class="card-text">{{ item.description }}</p>
              <p class="card-text">{{ item.content }}</p>
              <div class="justify-content-between align-items-baseline">
                <!-- 如果沒有優惠價,就只顯示原價 -->
                <div class="h5" v-if="!item.price">售價 {{ item.origin_price | currency }} 元</div>
                <!-- 若有優惠價就連原價一起顯示 -->
                <!-- <del>定义文档中已被删除的文本。 -->
                <del class="h6" v-if="item.price">原價 {{ item.origin_price | currency }} 元</del>
                <div class="h5" v-if="item.price">特價 {{ item.price | currency }} 元</div>
              </div>
            </div>
            <div class="card-footer d-flex" style="padding:10px;border:1px solid gray">
              <button
                @click="getProduct(item.id)"
                type="button"
                class="btn btn-outline-secondary btn-sm"
                style="margin-right:5px"
              >
                <!-- 局部的loading,使用fontawesome PS:二個icon同時運作是正常的 -->
                <!-- 已將「查看更多」的彈跳視窗移到Detail.vue,所以取消fontawsome的loading圖示 -->
                <!-- <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
                -->
                <i class="fas fa-info-circle"></i>
                查看更多
              </button>
              <!-- 這裡addtoCart()不用帶入2nd參數,這樣就會使用預設值1 -->
              <button
                @click="addtoCart(item.id)"
                type="button"
                class="btn btn-outline-danger btn-sm ml-auto"
              >
                <!-- 這裡也將局部的fontawesome loading改成全局的 -->
                <!-- <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i> -->
                <i class="fas fa-cart-plus"></i>
                加到購物車
              </button>
            </div>
          </div>
        </div>
        <!-- <pagination :page-data="pagination" @changepage="getProducts"></pagination> -->
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Slide from "@c/pages/frontEnd/common/Slide";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  components: {
    Slide
  },
  data() {
    return {
      // slider
      data: [
        '<div class="example-slide"><img src="https://i.pinimg.com/originals/9e/91/2f/9e912fc996b37ada8f11a695e8307a40.jpg"></div>',
        '<div class="example-slide"><img src="https://goo.gl/XYij8s"></div>',
        '<div class="example-slide"><img src="https://i.pinimg.com/originals/79/96/4d/79964d1c3fa9b69b152e375364c5586e.jpg"></div>'
      ]
      // searchText: "", // 改成vuex,移到store
      // clickSlide: false // 改成vuex,移到store
      // products: [], // 改成vuex,移到store
      // isLoading: false, // 改成vuex,移到store
      // product: {}, // 改成vuex,移到store
      // showCart: [], // 改成vuex,移到store
      // pagination: {} // 改成vuex,移到store
      // coupon_code: "" // 移到Cart.vue
      /*
      已將「查看更多」的彈跳視窗移到Detail.vue,所以取消fontawsome的loading圖示
      status: {
        loadingItem: "" //存放被點擊產品的id,來判斷那個產品正在讀取中
      }*/
    };
  },
  methods: {
    addFavorite(item) {
      this.$store.dispatch("productsModules/addFavorite", item);
    },
    // 移到store/products.js
    /*
    getProducts(page = 1) {
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-[%E5%85%8D%E9%A9%97%E8%AD%89]#%E5%8F%96%E5%BE%97%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8
      // 免驗證,無admin的商品列表
      const api = `${SERVER_PATH}/api/${API_PATH}/products?page=${page}`;
      const vm = this;

      vm.isLoading = true;

      this.$http.get(api).then(response => {
        vm.products = response.data.products;
        vm.isLoading = false;
        vm.pagination = response.data.pagination;
        // console.log("getProducts", response);
      });
    },*/
    ...mapActions("productsModules", ["getProducts"]),
    // 取得單一產品資訊
    getProduct(id) {
      this.$router.push(`/detail/${id}`);

      // 以下移到store/products.js
      /*
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%96%AE%E4%B8%80%E5%95%86%E5%93%81%E7%B4%B0%E7%AF%80
      // 免驗證,無admin的單一商品細節
      const api = `${SERVER_PATH}/api/${API_PATH}/product/${id}`;
      const vm = this;

      vm.status.loadingItem = id;

      this.$http.get(api).then(response => {
        // console.log(response.data); //先檢查從來源獲取的資料正不正確
        vm.product = response.data.product;
        vm.status.loadingItem = "";
        console.log("getProduct", vm.product);

        vm.$bus.$emit("detail", vm.product);
        vm.$router.push(`/detail`);
      });
      */
    },
    addtoCart(id, qty = 1) {
      this.$store.dispatch("cartModules/addtoCart", { id, qty });

      /*
      以下移到store
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%8A%A0%E5%85%A5%E8%B3%BC%E7%89%A9%E8%BB%8A
      // 免驗證,從前台客戶端加入購物車
      const api = `${SERVER_PATH}/api/${API_PATH}/cart`;
      const vm = this;

      vm.status.loadingItem = id;
      // 注意:這個變數沒在data return{}中
      const cart = {
        product_id: id,
        qty
      };

      // 語法參考Products.vue的post(URL,data,callback)
      // 方法爲post,看API資料cart是包在data{}裡,把cart的資料傳入遠端的API的data中
      this.$http.post(api, { data: cart }).then(response => {
        // console.log("addtoCart", response.data);
        vm.status.loadingItem = "";
        vm.getCart(); // 重新取得購物車,刷新頁面的意思
      });
      */
    },
    // 用來顯示在下方的客戶購物車清單列表
    ...mapActions("cartModules", ["getCart"])
    /*
    getCart() {
      以下移到store
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";

      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%8F%96%E5%BE%97%E8%B3%BC%E7%89%A9%E8%BB%8A%E5%88%97%E8%A1%A8
      // 免驗證,前端取得購物車列表
      const api = `${SERVER_PATH}/api/${API_PATH}/cart`;
      const vm = this;
      vm.isLoading = true;

      this.$http.get(api).then(response => {
        // console.log("getCart(showCart)", response);
        vm.showCart = response.data.data.carts;
        vm.isLoading = false;
      });
    },*/
  },
  computed: {
    // 判斷content要顯示的項目(移至vuex)
    filterProductsSearch() {
      const vm = this;

      // 搜尋欄的部分
      if (vm.searchText && !vm.clickSlide) {
        // vm.products對應下方的mapGetters
        return vm.products.filter(item => {
          // 先比對出有啓用的產品,再將search欄跟products都轉成小寫後,比對出符合的產品
          // [1, 2, 3].includes(2); // true
          // 詳細說明請參考vuex專案
          const results = item.title
            .toLowerCase()
            .includes(vm.searchText.toLowerCase());
          return results;
        });
      }

      // slider的部分
      if (vm.searchText && vm.clickSlide) {
        return vm.products.filter(item => {
          // const check = item.category == vm.clickSlide; // 除錯用
          // console.log("clickSlide", check);
          // console.log("clickSlide2", item.category);
          return item.category === vm.searchText;
        });
      }

      return vm.products; // 若皆無符合條件,就回傳全部商品列表
    },
    ...mapGetters("productsModules", [
      "products",
      "pagination",
      "searchText",
      "clickSlide"
    ]),
    ...mapGetters("cartModules", ["isLoading", "cart"])
  },
  created() {
    const vm = this;
    vm.getProducts();
    // console.log("localStorage", localStorage.getItem("myFavorite"));
  }
};
</script>
<style lang="scss" scoped>
// slider
.example-slide {
  align-items: center;
  background-color: #666;
  color: #999;
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  min-height: 10rem;
}
.item-hover:hover {
  background-color: darken(white, 10%);
  .photo-scale {
    animation-name: photo_scale;
    animation-duration: 1s;
  }
}
.product-style {
  height: 230px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
}
.word-size {
  white-space: nowrap; // 文本强制不换行；
  text-overflow: ellipsis; //文本溢出显示省略号；
  overflow: hidden; // 溢出的部分隐藏；
}
@keyframes photo_scale {
  from {
    transform: scale(1, 1);
  }
  to {
    transform: scale(1.1, 1.1);
  }
}
</style>
