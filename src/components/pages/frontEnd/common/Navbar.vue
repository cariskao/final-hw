<template>
  <div>
    <nav class="navbar navbar-light bg-light fixed-top">
      <router-link to="/">
        <img src="@a/img/logo.png" alt>
      </router-link>
      <div class="input-group col-md-6">
        <input
          @keyup.esc="searchReset"
          class="form-control"
          type="text"
          v-model="searchModel"
          placeholder="Search"
          aria-label="Search"
        >
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="searchReset">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
      <div class="input-group-append navbar-style">
        <router-link class="nav-link" to="/favorite" title="我的最愛">
          <i class="far fa-star"></i>我的最愛
        </router-link>
        <router-link class="nav-link" to="/admin/products" title="後台管理">後台管理</router-link>
      </div>
      <div class="dropdown ml-auto">
        <button class="btn btn-sm btn-cart" data-toggle="dropdown" data-flip="false">
          <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
          <span class="cart-length">{{cart.carts.length}}</span>
          <span class="sr-only">unread messages</span>
        </button>
        <div
          class="dropdown-menu dropdown-menu-right p-3"
          style="min-width: 400px;"
          data-offset="400"
        >
          <h6 v-if="cart.carts.length > 0">已選擇商品</h6>
          <div v-else style="text-align:center">
            <h6>尚無商品</h6>
            <img
              style="width:300px"
              src="https://cdngarenanow-a.akamaihd.net/shopee/shopee-pcmall-live-tw/assets/f3540f6657bbdc1120e3f8cc90bdba97.png"
              alt
            >
          </div>
          <table class="table table-sm">
            <tbody>
              <tr v-for="item in cart.carts" :key="item.id">
                <td class="align-middle text-center">
                  <a
                    href="#"
                    class="text-muted"
                    @click.prevent="removeCart(item.id,item.product.title)"
                  >
                    <i class="far fa-trash-alt"></i>
                  </a>
                </td>
                <td class="align-middle">{{ item.product.title }}</td>
                <td class="align-middle">{{ item.qty }}{{item.product.unit}}</td>
                <td class="align-middle text-right">{{item.total}}</td>
              </tr>
            </tbody>
          </table>
          <router-link to="/cart" class="i-style" v-if="cart.carts.length > 0">
            <button class="btn btn-primary">
              <i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
            </button>
          </router-link>
        </div>
      </div>
      <a @click.prevent="signout" class="nav-link" href="#" title="Sign out" name="Sign out">
        <i v-if="loginSuccess" class="fas fa-sign-out-alt text-dark fa-2x"></i>
        <span v-else class="navbar-hover">登入</span>
      </a>
    </nav>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Navbar",
  data() {
    return {
      searchModel: ""
    };
  },
  methods: {
    searchReset() {
      const vm = this;
      vm.$store.dispatch("productsModules/searchText", "");
      vm.$store.dispatch("productsModules/clickSlide", false);
    },
    signout() {
      const api = `${process.env.SERVER_API_PATH}/logout`;
      const vm = this;

      this.$http.post(api).then(response => {
        // console.log("已登出", response.data);
        if (response.data.success) {
          vm.getLoginSuccess();
          vm.$router.push("/login");
        }
      });
    },
    removeCart(id, title) {
      this.$store.dispatch("cartModules/removeCartItem", { id, title });
    },
    ...mapActions(["getLoginSuccess"]),
    ...mapActions("cartModules", ["getCart"])
  },
  created() {
    this.getCart();
    this.getLoginSuccess();
  },
  watch: {
    searchModel() {
      this.$store.dispatch("productsModules/searchText", this.searchModel);
    },
    searchText() {
      this.searchModel = this.searchText;
    }
  },
  computed: {
    // computed 是監控特定「變數的變化、並輸出資料於畫面上而不是用來輸入資料的（不會將 computed 放在 v-model 上）
    ...mapGetters("cartModules", ["cart"]),
    ...mapGetters("productsModules", ["searchText", "clickSlide"]),
    ...mapGetters(["loginSuccess"])
  }
};
</script>

<style lang="scss" scoped>
$pad: 10px;
$border-original: 1px solid transparent;
$border-hover: 1px solid black;
.navbar-style {
  margin-left: 50px;
  a {
    padding: $pad;
    color: black;
    border: $border-original;
    &:hover {
      border: $border-hover;
    }
  }
}
.navbar-hover {
  color: black;
  padding: $pad;
  border: $border-original;
  &:hover {
    border: $border-hover;
  }
}
.i-style {
  text-decoration: none;
  button {
    width: 100%;
  }
}
.cart-length {
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  background-color: #ff0000;
  color: white;
  border-radius: 22px;
}
li,
a {
  padding: 10px;
  position: relative;
}

/* 購物車按鈕 */
.btn-cart {
  background-color: transparent;
  position: relative;
  margin-right: 20px;
}

.dropdown-menu-right {
  right: 0;
  left: auto;
}
</style>