<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <button class="btn btn-outline-info mt-3" @click="openModel(true)">建立優惠券</button>

    <table class="table table-hover mt-4">
      <thead>
        <tr>
          <th scope="col">優惠標題</th>
          <th scope="col">編碼</th>
          <th scope="col">折扣 % 數</th>
          <th scope="col">使用期限</th>
          <th scope="col">是否啟用</th>
          <th scope="col">修改 / 刪除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id" class="item-hover">
          <th scope="row">{{ item.title }}</th>
          <td>{{ item.code }}</td>
          <td>{{ item.percent }}</td>
          <!-- 使用filters資料夾下的timestamp將存在due_date的時間戳記轉成日期, 要先在main.js引入 -->
          <td>{{ item.due_date | timestamp }}</td>
          <td>
            <b class="text-success" v-if="item.is_enabled">啟用</b>
            <b class="text-danger" v-else>未啟用</b>
          </td>
          <td>
            <button class="btn btn-outline-primary mr-1" @click="openModel(false, item)">編輯</button>
            <!-- id有後端產生 -->
            <button class="btn btn-outline-secondary" @click="deletCoupon(item.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 「建立優惠卷」的彈跳視窗模板 -->
    <div class="modal fade" id="modal-add" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <form class="modal-content" @submit.prevent="updateCoupon()">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">建立優惠券</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mt-2">
                <label>優惠標題</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="請輸入優惠標題"
                  v-model="tempData.title"
                  v-validate="'required'"
                  name="coupon_name"
                >
                <span class="text-danger" v-if="errors.has('coupon_name')">標題不可爲空</span>
              </div>
              <div class="col-md-6 mt-2">
                <label>折扣(%)</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="填寫 80 即為打八折"
                  v-model="tempData.percent"
                  v-validate="'required'"
                  name="coupon_percent"
                >
                <span class="text-danger" v-if="errors.has('coupon_percent')">折扣不可爲空</span>
              </div>
              <div class="col-md-6 mt-2">
                <div class="form-group">
                  <label>截止日期</label>
                  <input
                    type="date"
                    class="form-control"
                    :class="{'is-invalid': errors.has('end-date')}"
                    name="end-date"
                    v-model="due_date"
                    v-validate="'required'"
                  >
                  <span class="text-danger" v-if="errors.has('end-date')">請選擇日期</span>
                </div>
              </div>
              <div class="col-md-12 mt-2">
                <div class="form-group">
                  <label for="coupon-code">優惠券編碼</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': errors.has('coupon-code')}"
                    name="coupon-code"
                    id="coupon-code"
                    placeholder="優惠券編碼"
                    v-model="tempData.code"
                    v-validate="'required'"
                  >
                  <span class="text-danger" v-if="errors.has('coupon-code')">此欄位不可爲空</span>
                </div>
              </div>
              <div class="col-md-12 mt-3">
                <label>
                  <input type="checkbox" value="0" v-model="tempData.is_enabled"> 啟用/關閉
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="submit" class="btn btn-primary">確認</button>
          </div>
        </form>
      </div>
    </div>
    <!-- 使用自定義分頁組件 -->
    <!-- <pagination>對應main.js的Vue.component('pagination', Pages) -->
    <!-- 父傳子 -->
    <!-- :page-data="pagination"對應Pagination.vue的pageData屬性以及pagination{} -->
    <pagination :page-data="pagination" @changepage="getCoupon"></pagination>
    <!-- 父接收子傳來的$emit("changepage", page) -->
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      coupons: [],
      pagination: {},
      // 會被編輯(put)、刪除(delete)所共同使用並藉由this.tempData = Object.assign({}, item);來將item的值寫到一個{}中,並且避免item & tempData有傳參考的特性。
      tempData: {
        title: "",
        percent: 100,
        code: ""
      },
      due_date: "",
      isLoading: false,
      isNew: false
    };
  },
  watch: {
    // 監聽due_data這個變數,一有變動就執行同名函數
    due_date() {
      const vm = this;
      // 將日期轉成時間戳記(可當成公式來記)
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      // 在tempData變數下新增一個due_date欄位存放時間戳記
      vm.tempData.due_date = timestamp;
    }
  },
  methods: {
    getCoupon(page = 1) {
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E5%8F%96%E5%BE%97%E5%84%AA%E6%83%A0%E5%88%B8%E5%88%97%E8%A1%A8
      // 取得優惠券列表
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      const api = `${SERVER_PATH}/api/${API_PATH}/admin/coupons?page=${page}`;
      const vm = this;

      vm.isLoading = true;

      this.$http.get(api).then(response => {
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
        console.log("getCoupon", response);
      });
    },
    openModel(isNew, item) {
      const vm = this;
      if (isNew) {
        this.tempData = {}; // 如果是新增功能，清空欄位
        this.due_date = "";
        this.isNew = true; // isNew=true (新增功能)
      } else {
        // 將時間戳記轉成日期
        vm.due_date = new Date(item.due_date * 1000)
          .toISOString()
          .split("T")[0];
        // 因爲會被T分割成前面的date & 後面的time,共二個索引

        // console.log(
        //   "before split",
        //   new Date(item.due_date * 1000).toISOString()
        // );
        // console.log("after split", vm.due_date);

        // https://jigsawye.com/2015/10/06/javascript-object-assign/
        this.tempData = Object.assign({}, item); // 如果是編輯功能，將值透過非參考方式傳入欄位
        // 因爲傳參考的特性,這個tempData會與isNew==true的tempData值相同,所以我們使用ES6的語法解決
        // 將item的值寫到一個新{}中再放入this.tempData,並且避免item & tempData有傳參考的特性
        this.isNew = false; // isNew=false (編輯功能)
      }
      $("#modal-add").modal("show");
    },
    updateCoupon() {
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E6%96%B0%E5%A2%9E%E5%84%AA%E6%83%A0%E5%88%B8
      // 新增優惠卷
      let SERVER_PATH = "https://vue-course-api.hexschool.io";
      let API_PATH = "caris";
      let api = `${SERVER_PATH}/api/${API_PATH}/admin/coupon`;
      let httpMethods = "post";
      const vm = this;

      // 如果不是新增功能，修改api和傳送方式(修改優惠卷)
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E4%BF%AE%E6%94%B9%E5%84%AA%E6%83%A0%E5%88%B8
      if (!vm.isNew) {
        //若api使用const宣告這行會error,var or let不會
        api = `${SERVER_PATH}/api/${API_PATH}/admin/coupon/${vm.tempData.id}`;
        httpMethods = "put";
      }

      vm.isLoading = true;
      // console.log("updateCoupon-vm.tempData", vm.tempData); //欄位的顯示取決於openModel資料欄位是否填入完整

      // 送出表單前,做一次總驗證
      this.$validator.validate().then(result => {
        // 驗證成功在傳送(id是後端產生)
        if (result) {
          // 因爲資料中的新增優惠卷,參數是{}再包著一個data:{},所以要加上data:{}再上傳
          // 將vm.tempData中先前填入的欄位資料傳到/admin/coupon/data下(新增)
          // 或是：/admin/coupon/:id/data下(修改)
          this.$http[httpMethods](api, { data: vm.tempData }).then(response => {
            if (response.data.success) {
              // 如果新增成功
              $("#modal-add").modal("hide");
              vm.getCoupon();
              // console.log("$validator-success", response);
            } else {
              $("#modal-add").modal("hide");
              vm.getCoupon();
              console.log("新增失敗", response.data);
            }
            vm.isLoading = false;
          });
        } else {
          console.log("欄位不完整");
          vm.isLoading = false;
        }
      });
    },
    deletCoupon(coupon_id) {
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E5%88%AA%E9%99%A4%E5%84%AA%E6%83%A0%E5%88%B8
      // 刪除優惠卷
      let SERVER_PATH = "https://vue-course-api.hexschool.io";
      let API_PATH = "caris";
      let api = `${SERVER_PATH}/api/${API_PATH}/admin/coupon/${coupon_id}`;
      const vm = this;
      const d = confirm("確定要刪除?");

      if (d) {
        this.$http.delete(api).then(response => {
          vm.getCoupon();
          console.log("deletCoupon", response.data);
        });
      }
    }
  },
  created() {
    this.getCoupon();
  }
};
</script>
<style lang="scss" scoped>
.item-hover:hover {
  background-color: darken(white, 10%);
}
</style>