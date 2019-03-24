<template>
  <div class="col-sm-12 col-md-2">
    <!-- 左側選單 (List group) -->
    <!-- sticky-top有固定的功能 -->
    <div class="list-group sticky-top">
      <a
        class="list-group-item list-group-item-action"
        href="#"
        @click.prevent="searchText = item,clickSlide=true"
        :class="{ 'active': item === searchText}"
        v-for="item in categories"
        :key="item"
      >
        <i class="fa fa-street-view" aria-hidden="true"></i>
        {{ item }}
      </a>
      <a
        href="#"
        class="list-group-item list-group-item-action"
        @click.prevent="searchText = ''"
        :class="{ 'active': searchText === ''}"
      >全部顯示</a>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex"; // 去哪兒網也有使用到mapState取得全部的state{}
export default {
  data() {
    return {
      searchText: "",
      clickSlide: false
    };
  },
  methods: {
    ...mapActions("productsModules", ["getProducts"])
  },
  computed: {
    ...mapGetters("productsModules", ["categories"])
  },
  created() {
    this.getProducts();
  }
};
</script>
<style lang="scss">
.sticky-top {
  top: 97px;
}
</style>