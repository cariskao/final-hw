<template>
  <div>
    <nav class="navbar navbar-light bg-light fixed-top">
      <router-link style="height:50px" class="navbar-brand" to="/home">
        <img style="line-height:50px" src="@a/img/logo.png" alt>
      </router-link>
      <ul class="navbar-nav px-3 flex-row">
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/products" title="後台管理">後台管理</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/cart" title="我的購物車">
            <i class="fas fa-shopping-cart"></i>
            <span>{{cartVal}}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <a @click.prevent="signout" class="nav-link" href="#" title="Sign out" name="Sign out">
            <i class="fas fa-sign-out-alt"></i>
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
  span {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 30px;
    margin-top: -10px;
    margin-right: -5px;
  }
  li,
  a {
    padding: 10px;
    position: relative;
  }
}
</style>