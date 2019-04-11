<template>
  <div>
    <!-- https://github.com/ankurk91/vue-loading-overlay 參考Usage -->
    <!-- 畫面載入時的讀取動畫效果,當isLoading==true時啓用(要自行宣告) -->
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <!-- https://getbootstrap.com/docs/4.2/components/modal/ -->
      <!-- 查看「Live demo」將 data-toggle="modal" data-target="#exampleModal"套用到我們原先的button,以及將範例中Modal的部分貼在下面 -->
      <!-- Button trigger modal -->
      <!--<button
      type="button"
      class="btn btn-primary mt-4"
      data-toggle="modal"
      data-target="#productModal"
      >新增</button>-->
      <!-- 將原本BS4的彈跳視窗data-toggle="modal"改成用vuejs的$("#productModal").modal("show");來觸發       -->
      <button type="button" class="btn btn-primary mt-4" @click="openModal(true)">新增</button>
    </div>
    <!-- 製作table小技巧,先完成<td>的部分後再補上<th>的部分比較順暢 -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="120">是否啓用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <!-- https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E5%8F%96%E5%BE%97%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8 -->
        <!-- 可以先看「取得商品列表」有哪些欄位 -->
        <tr v-for="(item, index) in products_pagination" :key="index" class="item-hover">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <!-- currency爲千分號,檔案在filters下 -->
          <td>{{item.origin_price | currency}}</td>
          <td>{{item.price | currency}}</td>
          <td>
            <!-- 產品如果爲啓用:is_enabled == 1 -->
            <span v-if="item.is_enabled" class="text-success">啓用</span>
            <span v-else>未啓用</span>
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="delModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 會將Pagination.vue的page值帶入getProducts -->
    <pagination :page-data="pagination" @changepage="getProducts"></pagination>

    <!-- 下方分頁以及模板提供(非使用引入組件) -->
    <!-- https://getbootstrap.com/docs/4.2/components/pagination/ -->
    <!-- 分頁改成使用使用組件 -->
    <!--
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li :class="{ 'disabled':!products_pagination.has_pre }" class="page-item">
          <a
            @click.prevent="getProducts(products_pagination.current_page-1)"
            class="page-link"
            href="#"
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
    </li>-->
    <!-- 看console中的 products_pagination.total_pages PS:此時已可照項目多寡增加下方的頁數(預設一頁10筆資料)-->
    <!-- 因爲我們是從後端做的API接口來獲取JSON,所以在pagination的資料會依項目數動態變化也是因爲後端的關係,我們只要操作獲取到的資料即可 -->
    <!--
        <li
          class="page-item"
          v-for="(page) in products_pagination.total_pages"
          :key="page"
          :class="{ 'active':products_pagination.current_page === page }"
        >
          <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a>
        </li>
        <li :class="{ 'disabled':!products_pagination.has_next }" class="page-item">
          <a
            @click.prevent="getProducts(products_pagination.current_page+1)"
            class="page-link"
            href="#"
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>-->

    <!-- Modal,新增或編輯模板 -->
    <!-- https://github.com/hexschool/vue-course-api-wiki/wiki/%E8%AA%B2%E7%A8%8B%E9%83%A8%E5%88%86%E6%A8%A1%E6%9D%BF -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增或編輯產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    v-model="tempProduct.imageUrl"
                    type="text"
                    class="form-control"
                    id="image"
                    placeholder="請輸入圖片連結"
                  >
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUpLoading"></i>
                  </label>
                  <!-- 講座92增加上傳圖片 -->
                  <input
                    @change="uploadFile"
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                  >
                </div>
                <img
                  img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid"
                  alt
                  :src="tempProduct.imageUrl"
                >
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    v-model="tempProduct.title"
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                  >
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      v-model="tempProduct.category"
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸入分類"
                    >
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      v-model="tempProduct.unit"
                      type="unit"
                      class="form-control"
                      id="unit"
                      placeholder="請輸入單位"
                    >
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      v-model="tempProduct.origin_price"
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入原價"
                    >
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      v-model="tempProduct.price"
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="請輸入售價"
                    >
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    v-model="tempProduct.description"
                    type="text"
                    class="form-control"
                    id="description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    v-model="tempProduct.content"
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                    >
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button @click="updateProduct" type="button" class="btn btn-primary">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 刪除模板 -->
    <div
      class="modal fade"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button @click="delProduct" type="button" class="btn btn-danger">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// vscode跟chrome console都會對「$」報錯,加入這行解決
import $ from "jquery";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      // products: [], // 一開始要撈的資料(get),或是當時用戶新增、編輯、刪除完,就重新取得商品列表
      tempProduct: {}, // 會被編輯(put)、刪除(delete)所共同使用並藉由this.tempProduct = Object.assign({}, item);來將item的值寫到一個{}中,並且避免item & tempProduct有傳參考的特性。
      isNew: false, // 判斷是要新增或是修改
      // isLoading: false,
      status: {
        fileUpLoading: false //上傳圖片時的Loading局部效果用,若要連續測試要使用二張不同的圖片
      }
    };
  },
  methods: {
    // 當一進入頁面或是當時用戶新增、編輯、刪除完,就重新取得商品列表(get),路徑不在admin
    // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E5%8F%96%E5%BE%97%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8
    getProducts(page = 1) {
      // 移到store/products.js
      this.$store.dispatch("productsModules/getProducts", page);
      /*
      // 講座95加上了(page = 1 )
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      const api = `${SERVER_PATH}/api/${API_PATH}/admin/products?page=${page}`; // 講座95加上了「?page=${page}」
      const vm = this;

      vm.isLoading = true; //進入獲取AJAX階段就執行Loading畫面

      this.$http.get(api).then(response => {
        // console.log("getProducts", response.data);
        vm.products = response.data.products;
        vm.isLoading = false; //獲取完就取消Loading
        vm.pagination = response.data.pagination;
      });*/
    },
    // 將原本BS4的彈跳視窗data-toggle="modal"改成用vuejs的$("#productModal").modal("show");來觸發。
    // 因爲我們資料是透過ajax獲取,所以會有延遲的問題,如果使用BS4預設的方式開啓,會在還來不及獲取資料就觸發而導致異常,所以我們用vuejs的函數寫入當符合適當的條件再觸發。
    // 因爲新增跟編輯的模板是一樣的,所以將功能做在一起。
    openModal(addNew, item) {
      if (addNew) {
        // 新增功能
        this.tempProduct = {};
        this.isNew = true;
      } else {
        // 編輯功能
        // 因爲傳參考的特性,這個tempProduct會與addNew==true的tempProduct值相同,所以我們使用ES6的語法解決
        // 將item的值寫到一個新{}中再放入this.tempProduct,並且避免item & tempProduct有傳參考的特性
        this.tempProduct = Object.assign({}, item);
        // https://jigsawye.com/2015/10/06/javascript-object-assign/

        this.isNew = false;
        // console.log("openModal-false", this.tempProduct); // 記得點選欄位完整的
      }

      // https://getbootstrap.com/docs/4.2/components/modal/#modalshow
      $("#productModal").modal("show");
    },
    // 將用戶新增(post)或編輯(put),路徑在admin
    updateProduct() {
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-[%E9%9C%80%E9%A9%97%E8%AD%89]#%E5%95%86%E5%93%81%E5%BB%BA%E7%AB%8B
      // 商品建立
      let SERVER_PATH = "https://vue-course-api.hexschool.io";
      let API_PATH = "caris";
      let api = `${SERVER_PATH}/api/${API_PATH}/admin/product`;
      let httpMethod = "post";
      const vm = this;

      // 如果不是新增功能，修改api和傳送方式
      if (!vm.isNew) {
        // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E4%BF%AE%E6%94%B9%E7%94%A2%E5%93%81
        // 修改產品,爲動態id,而且方法爲put,還有id資料
        api = `${SERVER_PATH}/api/${API_PATH}/admin/product/${
          vm.tempProduct.id
        }`;
        httpMethod = "put";
      }
      /**
      $.post(URL,data,callback);
      必需的 URL 参数规定您希望请求的 URL。
      可选的 data 参数规定连同请求发送的数据(這裡應該是這個)。
      可选的 callback 参数是请求成功后所执行的函数名。
      */
      // 因爲資料中的商品建立,參數是{}再包著一個data:{},所以要加上data:{}再上傳
      // 將vm.tempProduct中先前填入的欄位資料傳到/admin/product/data下(新增)
      // 或是：admin/product/:id/data下(修改)
      this.$http[httpMethod](api, { data: vm.tempProduct }).then(response => {
        // 在講座91將this.$http.post()改成用[]來選擇method
        // console.log("products-post", response.data);
        if (response.data.success) {
          // 如果新增成功就把視窗關掉
          $("#productModal").modal("hide");
          // 並重新取得遠端資料
          vm.getProducts();
        } else {
          $("#productModal").modal("hide");
          vm.getProducts();
          console.log("新增失敗");
        }
      });
    },
    delModal(item) {
      this.tempProduct = Object.assign({}, item);
      $("#delProductModal").modal("show");
    },
    // 刪除(delete),路徑在admin,methods爲delete
    delProduct() {
      let SERVER_PATH = "https://vue-course-api.hexschool.io";
      let API_PATH = "caris";
      const vm = this;
      let api = `${SERVER_PATH}/api/${API_PATH}/admin/product/${
        vm.tempProduct.id
      }`;

      this.$http.delete(api).then(response => {
        // console.log("products-delete", response.data);
        if (response.data.success) {
          $("#delProductModal").modal("hide");
          vm.getProducts();
        } else {
          $("#delProductModal").modal("hide");
          vm.getProducts();
          console.log("刪除失敗");
        }
      });
    },
    // 路徑在admin,methods爲post
    uploadFile() {
      // console.log("uploadFile-this", this);
      // VueComponent/$refs/$files/files => 可看到此圖片的JSON資料
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const api = `${SERVER_PATH}/api/caris/admin/upload`;

      vm.status.fileUpLoading = true;

      // https://openhome.cc/Gossip/ECMAScript/FormData.html
      const formData = new FormData(); //模擬傳統表單送出形式
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E4%B8%8A%E5%82%B3%E5%9C%96%E7%89%87
      // 新增一個「file-to-upload」欄位(在上傳圖片/上傳表單<input type="file" name="file-to-upload">),就是php獲取form data的欄位,以及要上傳的檔案
      formData.append("file-to-upload", uploadedFile);

      // 上傳圖片
      // 改成formdata的格式後再送出(在上傳圖片/上傳表單的enctype屬性)
      // http://www.cnblogs.com/wenzheshen/p/5753693.html
      this.$http
        .post(api, formData, {
          header: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          // console.log("uploadFile-response.data", response.data);
          vm.status.fileUpLoading = false;
          if (response.data.success) {
            //寫法1,圖片拉進來時連結跟圖片沒有即時產生,表示資料沒有雙向綁定,用vue devtool看都有顯示,但畫面沒有出現
            // vm.tempProduct.imageUrl = response.data.imageUrl;
            // console.log("uploadFile-response-tempProduct", vm.tempProduct);
            //會看到id、num、title等資料都是呈現(...),表示有雙向綁定,但imageUrl沒有。

            // 解決方案:動態添加新的屬性(這裡爲強制將imageUrl改成動態屬性)
            // vm.$set(object, key, value),就可確保有雙向綁定的功能
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl);
            // console.log("uploadFile-$set", vm.tempProduct); //imageUrl顯示(...)即爲動態屬性
          } else {
            // 要先在main.js import './bus'
            // 可先放在created()中測試
            // 非父子層的事件發送使用$emit(),並送出2個參數,然後在AlertMessage.vue接收端接收同名$on事件
            this.$bus.$emit(
              "msg-from-products",
              response.data.message,
              "danger"
            );
          }
        });
    }
  },
  computed: {
    ...mapGetters("productsModules", ["products_pagination", "pagination"]),
    ...mapGetters("cartModules", ["isLoading"])
  },
  created() {
    // 取得AJAX都是在created這個生命週期取得
    this.getProducts();
  }
};
</script>
<style lang="scss" scoped>
table.table {
  text-align: center;
}
.item-hover:hover {
  background-color: darken(white, 10%);
}
</style>