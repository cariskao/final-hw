<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <router-link to="/" class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</router-link>
      <ul class="navbar-nav px-3 flex-row">
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
    return {};
  },
  methods: {
    signout() {
      const api = `${process.env.SERVER_API_PATH}/logout`;
      const vm = this;

      this.$http.post(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          vm.$store.dispatch("loginSuccess", false);
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