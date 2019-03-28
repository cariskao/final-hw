<template>
  <div class="col-sm-12 col-md-2">
    <!-- 左側選單 (List group) -->
    <!-- sticky-top有固定的功能 -->
    <div class="list-group sticky-top">
      <a
        class="list-group-item list-group-item-action"
        href="#"
        @click.prevent="slideSend(item)"
        :class="{ 'active': item === searchText}"
        v-for="item in categories"
        :key="item"
      >
        <i class="fa fa-street-view" aria-hidden="true"></i>
        {{ item }}({{filterCategoryLength(item)}})
      </a>
      <a
        href="#"
        class="list-group-item list-group-item-action"
        @click.prevent="slideSend('')"
        :class="{ 'active': searchText === ''}"
      >全部顯示({{products.length}})</a>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    slideSend(item) {
      const vm = this;

      vm.$store.dispatch("productsModules/searchText", item);

      if (item) {
        vm.$store.dispatch("productsModules/clickSlide", true);
      } else {
        vm.$store.dispatch("productsModules/clickSlide", false);
      }
    },
    filterCategoryLength(item) {
      let products = this.products;
      // console.log("filterCategoryLength", products);

      return products.filter(list => {
        return list.category === item;
      }).length;
    }
  },
  computed: {
    /*
    categories要跟著迴圈跑,所以要寫入()中的參數,而帶了參數就不能在computed中執行
    filterCategoryLength() {
      let products = this.products;

      return products.filter(list => {
        return list.category === this.categories;//無法這樣寫
      }).length;
    },*/
    ...mapGetters("productsModules", ["categories", "searchText", "products"])
  },
  created() {}
};
</script>
<style lang="scss">
.sticky-top {
  top: 97px;
}
</style>