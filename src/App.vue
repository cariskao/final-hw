<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
  // 這裡的ajax獲取只是範例,在講座89移除
};
</script>

<style lang="scss">
@import "./assets/all.scss";
// @import "~susy/sass/susy";
// @import "~susy/sass/plugins/svg-grid";
</style>
