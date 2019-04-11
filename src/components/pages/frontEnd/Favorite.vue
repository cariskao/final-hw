<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row" style="margin-top:200px">
      <p class="col-sm-12" style="font-size:30px;margin-left:15px">我的最愛</p>
      <p v-if="checkEmpty" class="col-sm-12" style="font-size:20px;margin-left:15px">您還沒加入任何喜愛的商品哦!</p>
      <!-- card 的結構應在 col 內，而不是同一層,取消這個div中class的card到下一個div的class -->
      <div
        v-for="(item) in getFavorites.items"
        :key="item.id"
        class="col-sm-12 col-md-4 border-0 item-hover mb-4"
        style="overflow:hidden;"
      >
        <!-- card 的結構應在 col 內，而不是同一層,從上一個div中class的card移到這一個div的class -->
        <div
          style="width:90%;margin:0 auto"
          @click="getProduct(item.id)"
          :style="{ backgroundImage: `url(${item.imageUrl})` }"
          class="photo-scale product-style card"
        ></div>
        <div class="card-body">
          <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
          <h5 class="card-title word-size">
            <a @click="getProduct(item.id)" href="#" class="text-dark">{{ item.title }}</a>
          </h5>
          <a
            @click.prevent="removeFavorite(item)"
            href="#"
            class="float-right"
            style="margin-top:-20px;margin-right:5px"
          >
            <i class="fas fa-star"></i>
          </a>
          <p class="card-text">{{ item.description }}</p>
          <p class="card-text">{{ item.content }}</p>
          <div class="justify-content-between align-items-baseline">
            <div class="h5" v-if="!item.price">{{ item.origin_price | currency }} 元</div>
            <del class="h6" v-if="item.price">原價 {{ item.origin_price | currency }} 元</del>
            <div class="h5" v-if="item.price">特價 {{ item.price | currency }} 元</div>
          </div>
        </div>
        <div class="card-footer d-flex" style="padding:10px;border:1px solid gray">
          <button
            @click="getProduct(item.id)"
            type="button"
            class="btn btn-outline-secondary btn-sm"
            style="margin-right:5px"
          >
            <i class="fas fa-info-circle"></i>
            查看更多
          </button>
          <button
            @click="addtoCart(item.id)"
            type="button"
            class="btn btn-outline-danger btn-sm ml-auto"
          >
            <i class="fas fa-cart-plus"></i>
            加到購物車
          </button>
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
      getFavorites: { items: [] },
      checkEmpty: false
    };
  },
  methods: {
    ...mapActions("cartModules", ["getCart"]),
    getProduct(id) {
      this.$router.push(`/detail/${id}`);
    },
    addtoCart(id, qty = 1) {
      this.$store.dispatch("cartModules/addtoCart", { id, qty });
    },
    removeFavorite(d) {
      let r = confirm("是否要從「我的最愛」中移除?");
      if (r) {
        if (this.getFavorites.items.length === 1) {
        }
        this.getFavorites.items.forEach((item, index) => {
          if (item.id === d.id) {
            this.getFavorites.items.splice(index, 1); // 無法用item.splice()
          }
        });
        localStorage.setItem("myFavorite", JSON.stringify(this.getFavorites));
        // location.reload(); // 刷新當前頁面,等同F5效果,體驗不佳
        this.reload(); // 刷新當前頁面,需要先到App.vue寫入相關語法並在上方inject
      }
    }
  },
  computed: {
    ...mapGetters("cartModules", ["isLoading"])
  },
  created() {
    const data = localStorage.getItem("myFavorite")
      ? JSON.parse(localStorage.getItem("myFavorite"))
      : console.log("nothing in localStorage");

    if (data) {
      if (data.items.length > 0) {
        this.getFavorites.items = data.items;
        this.checkEmpty = false;
      } else {
        this.checkEmpty = true;
      }
    } else {
      this.checkEmpty = true;
    }
    // 書籤有
    // localStorage.removeItem("myFavorite"); // 刪除單一項目,有時候會導致格式錯誤
    // localStorage.clear(); // 整個reset,若出現格式錯誤(Unexpected token u in JSON at position 0)就執行clear()
    console.log("length = " + localStorage.length);
  }
};
</script>
<style lang="scss" scope>
.item-hover:hover {
  background-color: darken(white, 10%);
  .photo-scale {
    animation-name: photo_scale;
    animation-duration: 1s;
  }
}
.product-style {
  height: 230px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
}
.word-size {
  white-space: nowrap; // 文本强制不换行；
  text-overflow: ellipsis; //文本溢出显示省略号；
  overflow: hidden; // 溢出的部分隐藏；
}
@keyframes photo_scale {
  from {
    transform: scale(1, 1);
  }
  to {
    transform: scale(1.1, 1.1);
  }
}
</style>