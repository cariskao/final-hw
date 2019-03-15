<template>
  <div>
    <!-- 全局的loading,有在main.js中import -->
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-2 mb-4" v-for="(item) in filterProducts" :key="item.id">
        <div class="card border-0 shadow-sm item-hover" style="overflow:hidden">
          <!-- PS:使用動態樣式把圖片載入進來 注意：這個tag不是<img> -->
          <div
            @click="getProduct(item.id)"
            :style="{ backgroundImage: `url(${item.imageUrl})` }"
            class="photo-scale"
            style="height: 230px; background-size: cover; background-position: top;cursor: pointer"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title word-size">
              <a @click="getProduct(item.id)" href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.description }}</p>
            <p class="card-text">{{ item.content }}</p>
            <div class="justify-content-between align-items-baseline">
              <!-- 如果沒有優惠價,就只顯示原價 -->
              <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
              <!-- 若有優惠價就連原價一起顯示 -->
              <!-- <del>定义文档中已被删除的文本。 -->
              <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
              <div class="h5" v-if="item.price">特價 {{ item.price }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              @click="getProduct(item.id)"
              type="button"
              class="btn btn-outline-secondary btn-sm"
            >
              <!-- 局部的loading,使用fontawesome PS:二個icon同時運作是正常的 -->
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
              查看更多
            </button>
            <!-- 這裡addtoCart()不用帶入2nd參數,這樣就會使用預設值1 -->
            <button
              @click="addtoCart(item.id)"
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <pagination :page-data="pagination" @changepage="getProducts"></pagination>

    <!-- 「查看更多」的模板 -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" alt class="img-fluid">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
          </div>
          <div class="d-flex justify-content-between align-items-baseline">
            <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
            <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
            <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
          </div>
          <!-- 依照後端API接口傳來的num參數做爲預設數量 -->
          <select name id class="form-control mt-3" v-model="product.num">
            <!-- 原本寫法 -->
            <!-- <option value="1">選購 1 件</option> -->
            <!-- 講座100改這樣 -->
            <option :value="num" v-for="(num) in 10" :key="num">選購 {{num}} {{product.unit}}</option>
          </select>
          <div class="text-muted text-nowrap mr-3">
            小計
            <strong>{{ product.num * product.price }}</strong> 元
          </div>
          <div @click="addtoCart(product.id,product.num)" class="btn btn-primary">加到購物車</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      products: [],
      showCart: [],
      coupons: [], // test
      product: {},
      pagination: {},
      isLoading: false,
      coupon_code: "",
      status: {
        loadingItem: "" //存放被點擊產品的id,來判斷那個產品正在讀取中
      },
      total: {
        original: 0,
        final: 0
      },
      // 讓訂單的<input>欄位做v-model的對應
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      }
    };
  },
  methods: {
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
    },
    // 取得單一產品資訊
    getProduct(id) {
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
        $("#productModal").modal("show");
        vm.status.loadingItem = "";
      });
    },
    addtoCart(id, qty = 1) {
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
        $("#productModal").modal("hide");
      });
    },
    // 用來顯示在下方的客戶購物車清單列表
    getCart() {
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
        vm.total.original = response.data.data.total;
        vm.total.final = response.data.data.final_total;
        vm.isLoading = false;
      });
    },
    removeCartItem(id) {
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";

      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-%5B%E5%85%8D%E9%A9%97%E8%AD%89%5D#%E5%88%AA%E9%99%A4%E6%9F%90%E4%B8%80%E7%AD%86%E8%B3%BC%E7%89%A9%E8%BB%8A%E8%B3%87%E6%96%99
      // 免驗證,用戶端刪除某一筆購物車資料
      const api = `${SERVER_PATH}/api/${API_PATH}/cart/${id}`;
      const vm = this;
      var r = confirm("確認刪除嗎?");

      vm.isLoading = true;

      if (r) {
        this.$http.delete(api).then(response => {
          // console.log("removeCartItem", response);
          this.getCart();
          vm.isLoading = false;
        });
      } else {
        vm.isLoading = false;
      }
    },
    getCoupon() {
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      const vm = this;
      let coupon_total_pages = "";

      vm.isLoading = true;

      // 獲取優惠卷列表總頁數
      const api_total_pages = `${SERVER_PATH}/api/${API_PATH}/admin/coupons/all`;
      this.$http.get(api_total_pages).then(response => {
        //優惠卷列表總頁數
        // coupon_total_pages = response.data.pagination.total_pages;
        // console.log("getCoupon-total-pages", coupon_total_pages);
        // vm.coupons=response.data.
        console.log("getCoupon-all", response);
      });

      // 獲取全部的優惠卷爲啓用的列表
      // for (let index = 1; index <= coupon_total_pages; index++) {
      //   let api = `${SERVER_PATH}/api/${API_PATH}/admin/coupons?page=${index}`;
      //   this.$http.get(api).then(response => {
      //     if (response.data.coupons.is_enabled) {
      //     }
      //     vm.coupons[index - 1] = response.data.coupons;
      //     vm.isLoading = false;
      //     console.log("getCoupon-allList", vm.coupons);
      //   });
      // }
    },
    useCouponCode() {
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      const api = `${SERVER_PATH}/api/${API_PATH}/coupon`;
      const vm = this;
      const coupon = {
        code: vm.coupon_code
      };

      vm.isLoading = true;

      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-[%E5%85%8D%E9%A9%97%E8%AD%89]#%E5%A5%97%E7%94%A8%E5%84%AA%E6%83%A0%E5%88%B8
      // 用戶端套用優惠卷,將用戶輸入得優惠碼傳到coupon比對有無符合的優惠碼
      this.$http.post(api, { data: coupon }).then(response => {
        vm.getCart();
        vm.isLoading = false;
        console.log("useCouponCode", response);
      });
    },
    createOrder() {
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      const api = `${SERVER_PATH}/api/${API_PATH}/order`;
      const vm = this;
      const order = vm.form; // 驗證成功就將<form>中各個<input>跟v-model對應的欄位資料post上去

      vm.isLoading = true;

      // 送出表單前,做一次總驗證
      this.$validator.validate().then(result => {
        // 驗證成功在傳送
        if (result) {
          // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-[%E5%85%8D%E9%A9%97%E8%AD%89]#%E7%B5%90%E5%B8%B3%E9%A0%81%E9%9D%A2
          // 用戶端套用結帳頁面,將資料傳送到order
          this.$http.post(api, { data: order }).then(response => {
            // console.log("createOrder-訂單已建立", response);
            if (response.data.success) {
              vm.showCart = [];
              // vm.getCart();
              vm.isLoading = false;
              vm.$router.push(`/customer_checkout/${response.data.orderId}`);
            }
          });
        } else {
          vm.isLoading = false;
          console.log("欄位不完整");
        }
      });
    }
  },
  computed: {
    filterProducts() {
      return this.products.filter(e => e.is_enabled);
    }
  },
  created() {
    this.getProducts();
    this.getCart();
    // this.getCoupon();
  }
};
</script>
<style lang="scss" scoped>
.item-hover:hover {
  background-color: darken(white, 10%);
  .photo-scale {
    animation-name: photo_scale;
    animation-duration: 1s;
  }
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
