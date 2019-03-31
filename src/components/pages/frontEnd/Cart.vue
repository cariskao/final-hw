<template>
  <div class="row justify-content-center" style="margin-top:150px">
    <loading :active.sync="isLoading"></loading>
    <!-- 購物車清單列表 -->
    <p v-if="cart.carts.length > 0" style="font-size:30px">我的訂單</p>
    <p v-else style="font-size:30px;">您現在購物車中沒有訂單</p>
    <table v-if="cart.carts.length > 0" class="table col-md-12">
      <thead>
        <tr>
          <th></th>
          <th scope="col">品名</th>
          <th scope="col">數量</th>
          <th scope="col">單價</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in cart.carts" :key="item.id">
          <td style="text-align:center">
            <button
              @click="removeCartItem(item.id,item.product.title)"
              class="btn btn-outline-danger btn-sm"
            >
              <i class="far fa-trash-alt"></i>
            </button>
          </td>
          <td>
            {{item.product.title}}
            <div class="text-success" v-if="item.coupon">已套用優惠卷</div>
          </td>
          <td>{{item.qty}}/{{item.product.unit}}</td>
          <td>{{item.total}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-right">總計</td>
          <td class="text-right">{{cart.total}}</td>
        </tr>
        <tr v-if="cart.final_total !== cart.total">
          <td colspan="3" class="text-right text-success">折扣價</td>
          <td class="text-right text-success">{{cart.final_total}}</td>
        </tr>
      </tfoot>
    </table>
    <!-- 建立訂單及購物車頁面驗證 -->
    <!-- 清除它預設的submit行爲,只執行createOrder -->
    <form class="col-md-12" style="margin-bottom:40px" @submit.prevent="createOrder">
      <div class="form-group">
        <!-- email驗證格式參考官網 https://github.com/baianat/vee-validate -->
        <label for="useremail">Email</label>
        <!-- required屬性的error是chrome內建的 -->
        <!-- 沒加無法顯示email爲空 -->
        <input
          type="email"
          class="form-control"
          name="email"
          id="useremail"
          v-model="form.user.email"
          placeholder="請輸入 Email"
          v-validate="'required|email'"
          required
        >
        <span class="text-danger" v-if="errors.has('email')">
          <!-- 使用v-validate的email變數errors.first() -->
          {{errors.first('email')}}
        </span>
      </div>

      <div class="form-group">
        <label for="username">收件人姓名</label>
        <!-- :class在errors.has()返回true時,input外框會變紅色 -->
        <input
          type="text"
          class="form-control"
          :class="{'is-invalid': errors.has('u_name')}"
          name="u_name"
          id="username"
          v-model="form.user.name"
          placeholder="輸入姓名"
          v-validate="'required'"
        >
        <!-- errors.has()是由validate提供的變數 -->
        <!-- 而我們設定的v-validate="required"是不得爲空值,若爲空值返回true -->
        <span class="text-danger" v-if="errors.has('u_name')">姓名不可爲空</span>
      </div>

      <div class="form-group">
        <label for="usertel">收件人電話</label>
        <input
          type="tel"
          class="form-control"
          :class="{'is-invalid': errors.has('tel')}"
          name="tel"
          id="usertel"
          v-model="form.user.tel"
          placeholder="請輸入電話"
          v-validate="'required'"
        >
        <span class="text-danger" v-if="errors.has('tel')">電話號碼不可爲空</span>
      </div>

      <div class="form-group">
        <label for="useraddress">收件人地址</label>
        <input
          type="address"
          class="form-control"
          :class="{'is-invalid': errors.has('address')}"
          name="address"
          id="useraddress"
          v-model="form.user.address"
          placeholder="請輸入地址"
          v-validate="'required'"
        >
        <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
      </div>
      <div class="input-group mb-3 input-group-sm">
        <input v-model="coupon_code" type="text" class="form-control" placeholder="請輸入優惠碼">
        <div class="input-group-append">
          <button
            v-tip.keep="item.content"
            v-for="(item, index) in toolTip_data"
            :key="index"
            @click.prevent="choiceCoupon(item.percent)"
            type="button"
            class="btn btn-outline-secondary"
          >{{item.title}}</button>
          <button
            style="background:blue;color:white"
            @click.prevent="useCouponCode"
            type="button"
            class="btn btn-outline-secondary"
          >套用優惠碼</button>
        </div>
      </div>
      <div class="form-group">
        <label for="useraddress">留言</label>
        <textarea name id class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
      </div>
      <div class="text-right">
        <button class="btn btn-danger">送出訂單</button>
      </div>
    </form>
  </div>
</template>
<script>
// alert("也可以直接寫原生JS");
import $ from "jquery";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      // showCart: [], 移到store後改成 => cart: {carts: []},
      coupon_code: "",
      // 讓訂單的<input>欄位做v-model的對應
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      },
      toolTip_data: [
        {
          title: "選擇 5 折優惠卷",
          content: "滿50,000可享5折優惠",
          percent: "50%"
        },
        {
          title: "選擇 7 折優惠卷",
          content: "滿30,000可享7折優惠",
          percent: "70%"
        },
        {
          title: "選擇 9 折優惠卷",
          content: "滿20,000可享9折優惠",
          percent: "90%"
        }
      ]

      /*
      移到store
      total: {
        original: 0,
        final: 0
      }*/
    };
  },
  methods: {
    ...mapActions("cartModules", ["getCart"]),
    // 以下移到store
    /*
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
    },*/
    removeCartItem(id, title) {
      const vm = this;
      vm.$store.dispatch("cartModules/removeCartItem", { id, title }); // 透過dispatch()發送到actions
      /*
      以下移到store
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
      }*/
    },
    choiceCoupon(percent) {
      const vm = this;
      if (percent === "50%") {
        if (vm.cart.total >= 50000) {
          vm.coupon_code = "555";
        } else {
          alert("您的消費金額還不滿50,000元哦!");
        }
      } else if (percent === "70%") {
        if (vm.cart.total >= 30000) {
          vm.coupon_code = "777";
        } else {
          alert("您的消費金額還不滿30,000元哦!");
        }
      } else if (percent === "90%") {
        if (vm.cart.total >= 20000) {
          vm.coupon_code = "999";
        } else {
          alert("您的消費金額還不滿20,000元哦!");
        }
      }
    },
    useCouponCode() {
      const api = `${process.env.SERVER_API_PATH}/api/${
        process.env.USER_PATH
      }/coupon`;
      const vm = this;
      // 這是後端API接口的格式
      const coupon = {
        code: vm.coupon_code
      };
      vm.$store.dispatch("cartModules/updateLoading", true);
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-[%E5%85%8D%E9%A9%97%E8%AD%89]#%E5%A5%97%E7%94%A8%E5%84%AA%E6%83%A0%E5%88%B8
      // 用戶端套用優惠卷,將用戶輸入得優惠碼傳到coupon比對有無符合的優惠碼
      this.$http.post(api, { data: coupon }).then(response => {
        console.log("Cart-useCouponCode", response.data.success);
        if (response.data.success) {
          vm.$bus.$emit(
            "msg-from-cart-coupon",
            response.data.message,
            "primary"
          );
          vm.$store.dispatch("cartModules/getCart");
          vm.$store.dispatch("cartModules/updateLoading", false);
        } else {
          vm.$bus.$emit(
            "msg-from-cart-coupon",
            response.data.message,
            "danger"
          );
          vm.$store.dispatch("cartModules/updateLoading", false);
        }
      });
    },
    createOrder() {
      const api = `${process.env.SERVER_API_PATH}/api/${
        process.env.USER_PATH
      }/order`;
      const vm = this;
      const order = vm.form; // 驗證成功就將<form>中各個<input>跟v-model對應的欄位資料post上去
      this.$store.dispatch("cartModules/updateLoading", true);
      // 送出表單前,做一次總驗證
      this.$validator.validate().then(result => {
        // 驗證成功在傳送
        if (result) {
          // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-[%E5%85%8D%E9%A9%97%E8%AD%89]#%E7%B5%90%E5%B8%B3%E9%A0%81%E9%9D%A2
          // 用戶端套用結帳頁面,將資料傳送到order
          this.$http.post(api, { data: order }).then(response => {
            console.log("createOrder-訂單已建立", response);
            if (response.data.success) {
              // vm.showCart = []; // API說「建立訂單後(到customer_checkout)會把所選的購物車資訊刪除」,所以這行先註解掉
              this.$store.dispatch("cartModules/updateLoading", false);
              vm.$router.push(`/customer_checkout/${response.data.orderId}`);
            }
          });
        } else {
          this.$store.dispatch("cartModules/updateLoading", false);
          console.log("欄位不完整");
        }
      });
    }
  },
  created() {
    this.getCart();
  },
  computed: {
    ...mapGetters("cartModules", ["isLoading", "cart"])
  }
};
</script>
<style lang="scss" scope>
</style>