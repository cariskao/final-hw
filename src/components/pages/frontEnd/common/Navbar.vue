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
          v-model="searchText"
          placeholder="Search"
          aria-label="Search"
        >
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="searchReset">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
      <ul class="navbar-nav px-3 flex-row">
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/products" title="後台管理">
            <span class="nav-words">後台管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <!--  -->
          <div class="dropdown ml-auto">
            <button class="btn btn-sm btn-cart" data-toggle="dropdown" data-flip="false">
              <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
              <span class="cart-length">{{cart.carts.length}}</span>
              <span class="sr-only">unread messages</span>
            </button>
            <div
              class="dropdown-menu dropdown-menu-right p-3"
              style="min-width: 300px"
              data-offset="400"
            >
              <h6>已選擇商品</h6>
              <table class="table table-sm">
                <tbody>
                  <tr v-for="item in cart.carts" :key="item.id">
                    <td class="align-middle text-center">
                      <a href="#" class="text-muted" @click.prevent="removeCart(item.id)">
                        <i class="far fa-trash-alt"></i>
                      </a>
                    </td>
                    <td class="align-middle">{{ item.product.title }}</td>
                    <td class="align-middle">{{ item.qty }}{{item.product.unit}}</td>
                    <td class="align-middle text-right">{{item.total}}</td>
                  </tr>
                </tbody>
              </table>
              <button class="btn btn-primary btn-block">
                <i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
              </button>
            </div>
          </div>
          <!--  -->
          <!-- <router-link class="nav-link" to="/cart" title="我的購物車">
            <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
            <span class="cart-length">{{cart.carts.length}}</span>
          </router-link>-->
        </li>
        <li class="nav-item">
          <a @click.prevent="signout" class="nav-link" href="#" title="Sign out" name="Sign out">
            <i class="fas fa-sign-out-alt text-dark fa-2x"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Navbar",
  data() {
    return {};
  },
  methods: {
    // https://yugasun.com/post/you-may-not-know-vuejs-13.html
    // Computed property "searchText" was assigned to but it has no setter.
    // 上述網址有說明這個error原因
    // --------------------------------------------------------------------
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
    ...mapActions("cartModules", ["getCart"])
  },
  created() {
    this.getCart();
  },
  computed: {
    searchText: {
      get() {
        return this.$store.state.searchText;
      },
      set(value) {
        this.$store.dispatch("productsModules/searchText", value);
      }
    },
    ...mapGetters("cartModules", ["cart"]),
    ...mapGetters("productsModules", ["searchText", "clickSlide"])
  }
};
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  .cart-length {
    position: absolute;
    top: 0;
    right: 0;
    width: 25px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    background-color: #ff0000;
    color: white;
    border-radius: 22px;
  }
  .nav-words {
    font-size: 25px;
    font-weight: bold;
    color: #000000;
  }
  li,
  a {
    padding: 10px;
    position: relative;
  }
}

/* 購物車按鈕 */
.btn-cart {
  background-color: transparent;
  position: relative;
}

/* 購物車按鈕定位 */
.btn-cart .badge {
  position: absolute;
  top: 1px;
  right: 1px;
}

.dropdown-menu-right {
  right: 0;
  left: auto;
}
</style>