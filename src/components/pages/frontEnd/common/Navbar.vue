<template>
  <div>
    <nav class="navbar navbar-light bg-light fixed-top">
      <router-link to="/">
        <img src="@a/img/logo.png" alt>
      </router-link>
      <ul class="navbar-nav px-3 flex-row">
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/products" title="後台管理">
            <span class="nav-words">後台管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/cart" title="我的購物車">
            <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
            <span class="cart-length">{{cartVal}}</span>
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
export default {
  name: "Navbar",
  data() {
    return {
      cartVal: 0
    };
  },
  methods: {
    signout() {
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const api = `${SERVER_PATH}/logout`;
      const vm = this;

      this.$http.post(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/login");
        }
      });
    }
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