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
      <router-link class="nav-link b-end" to="/admin/products" title="後台管理">
        <span class="b-end-menerger">後台管理</span>
      </router-link>
      <div class="dropdown ml-auto">
        <button class="btn btn-sm btn-cart" data-toggle="dropdown" data-flip="false">
          <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
          <span class="cart-length">{{cart.carts.length}}</span>
          <span class="sr-only">unread messages</span>
        </button>
        <div
          class="dropdown-menu dropdown-menu-right p-3"
          style="min-width: 350px;"
          data-offset="400"
        >
          <h6>已選擇商品</h6>
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
          <router-link to="/cart" class="i-style">
            <button class="btn btn-primary">
              <i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
            </button>
          </router-link>
        </div>
      </div>
      <a @click.prevent="signout" class="nav-link" href="#" title="Sign out" name="Sign out">
        <i class="fas fa-sign-out-alt text-dark fa-2x"></i>
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
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/login");
        }
      });
    },
    removeCart(id, title) {
      this.$store.dispatch("cartModules/removeCartItem", { id, title });
    },
    ...mapActions("cartModules", ["getCart"])
  },
  created() {
    this.getCart();
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
    ...mapGetters("productsModules", ["searchText", "clickSlide"])
  }
};
</script>

<style lang="scss" scoped>
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
.b-end {
  margin-left: 133px;
  .b-end-menerger {
    font-size: 25px;
    font-weight: bold;
    color: #000000;
  }
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