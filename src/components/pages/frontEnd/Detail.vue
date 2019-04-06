<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row" style="margin-top:120px">
      <div class="col-sm-12">
        <div class="row">
          <div class="col-sm-12 col-md-4 text-center flex" style="position:relative">
            <!-- 傳入data裡的product -->
            <a
              @click.prevent="addFavorite(product)"
              href="#"
              style="position:absolute;top:0;right:0;font-size:30px"
            >
              <!-- <i class="far fa-star" v-if="!chcekFavortie"></i> -->
              <!-- <i class="fas fa-star" v-if="chcekFavortie"></i> -->
              <i class="fa-star" :class="{ 'fas' : chcekFavortie, 'far' : !chcekFavortie }"></i>
            </a>
            <img :src="product.imageUrl" alt>
          </div>
          <div class="col-sm-12 col-md-8">
            <div
              class="row no-gutters rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"
            >
              <div class="col p-4 d-flex flex-column position-static">
                <h3 class="mb-0">
                  {{ product.title }}
                  <span
                    style="font-size:12px"
                    class="badge badge-secondary ml-2"
                  >{{ product.category }}</span>
                </h3>
                <div>
                  <div
                    class="h4 text-primary"
                    v-if="!product.price"
                  >售價 {{ product.origin_price | currency }} 元</div>
                  <del class="h6" v-if="product.price">原價 {{ product.origin_price | currency }} 元</del>
                  <div
                    class="h4 text-primary"
                    v-if="product.price"
                  >現在只要 {{ product.price | currency }} 元</div>
                </div>
                <select name id class="form-control mt-3" v-model="qty.num">
                  <!-- 原本寫法 -->
                  <!-- <option value="1">選購 1 件</option> -->
                  <!-- 講座100改這樣 -->
                  <!-- <option value="選擇數量" selected>選擇數量</option> -->
                  <option :value="num" v-for="(num) in 10" :key="num">選購 {{num}} {{product.unit}}</option>
                </select>
                <div style="font-size:30px" class="text-nowrap mt-3 mb-3">
                  小計
                  <strong
                    v-if="qty.num && qty.num > 0 && product.price !== ''"
                    class="text-danger"
                  >{{ qty.num * product.price | currency }}</strong>
                  <strong
                    v-else-if="qty.num && qty.num > 0 && product.price === ''"
                    class="text-danger"
                  >{{ qty.num * product.origin_price | currency }}</strong>
                  <strong v-else>0</strong>
                  元
                </div>
                <div @click="addtoCart(product.id,qty.num)" class="btn btn-primary">加到購物車</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="mb-1 text-info">{{ product.description }}</div>
              <p class="card-text mb-auto">{{ product.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  inject: ["reload"],
  data() {
    return {
      detailId: "",
      product: {},
      qty: {
        num: 1
      }
    };
  },
  methods: {
    addFavorite(item) {
      this.$store.dispatch("productsModules/addFavorite", item);
      // location.reload(); // 刷新當前頁面,等同F5效果,體驗不佳
      this.reload(); // 刷新當前頁面,需要先到App.vue寫入相關語法並在上方inject
    },
    getDetail() {
      // 這個需要抓detailId(網址)的,好像不能放進vuex中
      const vm = this;
      const api = `${process.env.SERVER_API_PATH}/api/${
        process.env.USER_PATH
      }/product/${vm.detailId}`;

      vm.$store.dispatch("cartModules/updateLoading", true);
      this.$http.get(api).then(response => {
        // console.log("getProduct-id", response.data.product);
        vm.product = response.data.product;
        vm.$store.dispatch("cartModules/updateLoading", false);
      });
    },
    addtoCart(id, qty = 1) {
      this.$store.dispatch("cartModules/addtoCart", { id, qty }); // 透過dispatch()發送到actions
    }
  },
  computed: {
    ...mapGetters("cartModules", ["isLoading"]),
    chcekFavortie() {
      const data = localStorage.getItem("myFavorite")
        ? JSON.parse(localStorage.getItem("myFavorite"))
        : console.log("nothing in localStorage");

      const result = data.items.some(item => {
        return item.id === this.detailId;
      });
      return result;
    }
  },
  created() {
    // console.log(this.$route.params.detailId);
    this.detailId = this.$route.params.detailId;
    this.getDetail();
  }
};
</script>
<style lang="scss" scope>
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>