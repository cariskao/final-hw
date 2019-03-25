<template>
  <div>
    <nav class="navbar navbar-light bg-light fixed-top">
      <router-link to="/">
        <img src="@a/img/logo.png" alt>
      </router-link>
      <div class="input-group col-md-6">
        <input
          @keyup.esc="navbarReset"
          class="form-control"
          type="text"
          v-model="searchText"
          placeholder="Search"
          aria-label="Search"
        >
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="navbarReset">
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
          <router-link class="nav-link" to="/cart" title="我的購物車">
            <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
            <span class="cart-length">{{cart.carts.length}}</span>
          </router-link>
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
    navbarReset() {
      const vm = this;
      vm.searchText = "";
      vm.clickSlide = false;
      vm.$bus.$emit("searchText-clickSlide", vm.searchText, vm.clickSlide);
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
  watch: {
    searchText() {
      const vm = this;
      vm.$bus.$emit("search-text", vm.searchText);
    }
  },
  created() {
    this.getCart();
  },
  computed: {
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
</style>