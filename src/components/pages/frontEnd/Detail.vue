<template>
  <div class="row" style="margin-top:120px">
    <div class="col-sm-12">
      <div class="row">
        <div class="col-sm-12 col-md-4 text-center flex">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_LZivj8_7-KY3IoOTC3d3ePFc8hbIQv-UjSiwtJfCHa0aAqulpA"
            alt
          >
        </div>
        <div class="col-sm-12 col-md-8">
          <div
            class="row no-gutters rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"
          >
            <div class="col p-4 d-flex flex-column position-static">
              <h3 class="mb-0">
                title{{ product.title }}
                <span
                  style="font-size:12px"
                  class="badge badge-secondary ml-2"
                >category</span>
              </h3>
              <div>
                <div
                  class="h4 text-primary"
                  v-if="!product.price"
                >origin_price{{ product.origin_price }} 元</div>
                <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                <div class="h4 text-primary" v-if="product.price">現在只要 {{ product.price }} 元</div>
              </div>
              <select name id class="form-control mt-3" v-model="product.num">
                <!-- 原本寫法 -->
                <!-- <option value="1">選購 1 件</option> -->
                <!-- 講座100改這樣 -->
                <option :value="num" v-for="(num) in 10" :key="num">選購 {{num}} {{product.unit}}</option>
              </select>
              <div style="font-size:30px" class="text-nowrap mt-3 mb-3">
                小計
                <strong class="text-danger">{{ product.num * product.price }}</strong> 元
              </div>
              <div @click="addtoCart(product.id,product.num)" class="btn btn-primary">加到購物車</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div class="mb-1 text-info">description{{ product.description }}</div>
            <p
              class="card-text mb-auto"
            >{{ product.content }}This is a wider card with supporting text below as a natural lead-in to additional content.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"; // 去哪兒網也有使用到mapState取得全部的state{}

export default {
  data() {
    return {
      // product: {} //使用vuex,移到store
    };
  },
  methods: {
    getProduct(id) {
      const vm = this;
      vm.$store.dispatch("productsModules/getProduct", id); // 透過dispatch()發送到actions
    },
    addtoCart(id, qty = 1) {
      this.$store.dispatch("cartModules/addtoCart", { id, qty }); // 透過dispatch()發送到actions
    }
  },
  computed: {
    ...mapGetters("productsModules", ["product"])
  },
  created() {
    const vm = this;

    vm.$bus.$on("detail", id => {
      vm.getProduct(id);
      console.log("detail-created", id);
    });

    /*
    使用vuex之前的寫法
    const vm = this;
    vm.$bus.$on("detail", myProduct => {
      console.log("detail-myProduct", myProduct);
      vm.product = myProduct;
      console.log("detail-vm.product", vm.product);
    });*/
  }
};
</script>
<style lang="scss">
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>