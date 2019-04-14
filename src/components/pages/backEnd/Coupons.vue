<template>
  <div>
    <!-- v-model會忽略表單元素(form)中的 value, checked, selected。所以直接用v-model="變數名稱爲true"來設定比如checked -->
    <loading :active.sync="isLoading"></loading>
    <button class="btn btn-outline-info mt-3" @click="openModel('建立')">建立優惠券</button>
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
            <button class="btn btn-outline-primary mr-1" @click="openModel('編輯', item)">編輯</button>
            <!-- id有後端產生 -->
            <button class="btn btn-outline-secondary" @click="deletCoupon(item.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 「建立/編輯優惠卷」的彈跳視窗模板 -->
    <div class="modal fade" id="modal-add" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <form class="modal-content" @submit.prevent="updateCoupon()">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{openChoice}}優惠券</h5>
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
                  <input
                    type="text"
                    name="tt"
                    id
                    v-validate="'required|date_format:YYYY/MM/DD|after:2015/01/01'"
                  >
                  <span class="text-danger" v-if="errors.has('tt')">ttt</span>
                  <label>截止日期</label>
                  <!-- :class會使外框顯示紅色。:disabled當使用者勾選「不啓用」讓期限過期並讓使用者無法選擇日期 -->
                  <input
                    type="date"
                    class="form-control"
                    :class="{'is-invalid': errors.has('end-date')}"
                    :disabled="!tempData.is_enabled && openChoice==='編輯'"
                    name="end-date"
                    v-model="due_date"
                    v-validate="'required|date_format:YYYY/MM/DD|after:2015/01/01'"
                  >
                  <span
                    v-if="!tempData.is_enabled && openChoice==='編輯'"
                    class="text-primary"
                  >若要設定日期，請勾選啓用</span>
                  <span class="text-danger" v-if="errors.has('end-date')">請選擇超過二天以上當作截止日期</span>
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
                  <input
                    v-if="openChoice==='建立'"
                    :disabled="checked"
                    v-model="checked"
                    type="checkbox"
                    value="建立"
                  >
                  <input v-else type="checkbox" value="編輯" v-model="tempData.is_enabled">
                  <span v-if="openChoice==='建立'">啟用(建立時只能選啓用)</span>
                  <span v-else>啟用/關閉</span>
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
      checked: true, // 建立優惠卷預設打勾用
      due_date: "", // 時間戳記
      isLoading: false,
      openChoice: "建立", // 在updateCoupon中判定要上傳的API和method
      coupons: [],
      pagination: {},
      // 會被編輯(put)、刪除(delete)所共同使用並藉由this.tempData = Object.assign({}, item);來將item的值寫到一個{}中,並且避免item & tempData有傳參考的特性。
      // 上傳到後端優惠卷API的物件
      tempData: {
        title: "",
        percent: 100,
        code: ""
      }
    };
  },
  methods: {
    onchange() {
      // 等於js的onchange,用法:在html上綁定@change="onchange",目前沒用到
    },
    getCoupon(page = 1) {
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E5%8F%96%E5%BE%97%E5%84%AA%E6%83%A0%E5%88%B8%E5%88%97%E8%A1%A8
      // 取得優惠券列表
      const api = `${process.env.SERVER_API_PATH}/api/${
        process.env.USER_PATH
      }/admin/coupons?page=${page}`;
      const vm = this;

      vm.isLoading = true;

      this.$http.get(api).then(response => {
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
        console.log("getCoupon", response);
      });
    },
    openModel(openChoice, item) {
      // 點擊「建立優惠卷」或「編輯」時執行
      const vm = this;
      if (openChoice === "建立") {
        vm.tempData = {}; // 如果是新增功能，清空欄位
        vm.due_date = "";
        vm.openChoice = "建立"; // 在updateCoupon中判定要上傳的API和method
        vm.checked = true;
        vm.tempData.is_enabled = vm.checked;
      } else {
        // 編輯
        vm.due_date = new Date(item.due_date * 1000)
          .toISOString()
          .split("T")[0];
        // 因爲會被T分割成前面的date & 後面的time,共二個索引

        // console.log(
        //   "before split",
        //   new Date(item.due_date * 1000).toISOString()
        // );
        // console.log("after split", vm.due_date);

        // 打開openModel就先將被點擊的物件資料放入vm.tempData中(包含之後更動的以及watch的vm.tempData.due_date),準備當點擊updateCoupon時上傳到後端API。
        // https://jigsawye.com/2015/10/06/javascript-object-assign/
        vm.tempData = Object.assign({}, item); // 如果是編輯功能，將值透過非參考方式傳入欄位
        // 因爲傳參考的特性,這個tempData會與openChoice='建立'的tempData值相同,所以我們使用ES6的語法解決
        // 將item的值寫到一個新{}中再放入vm.tempData,並且避免item & tempData有傳參考的特性

        vm.openChoice = "編輯"; // openChoice='編輯' (編輯功能),在updateCoupon使用
      }
      $("#modal-add").modal("show");
    },
    updateCoupon() {
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E6%96%B0%E5%A2%9E%E5%84%AA%E6%83%A0%E5%88%B8
      // 新增優惠卷
      let api = `${process.env.SERVER_API_PATH}/api/${
        process.env.USER_PATH
      }/admin/coupon`;
      let httpMethods = "post";
      const vm = this;

      // 如果不是新增功能，修改api和傳送方式(修改優惠卷)
      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E5%8F%B0-%5B%E9%9C%80%E9%A9%97%E8%AD%89%5D#%E4%BF%AE%E6%94%B9%E5%84%AA%E6%83%A0%E5%88%B8
      if (vm.openChoice === "編輯") {
        //若api使用const宣告這行會error,var or let不會
        api = `${process.env.SERVER_API_PATH}/api/${
          process.env.USER_PATH
        }/admin/coupon/${vm.tempData.id}`;
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
      let api = `${process.env.SERVER_API_PATH}/api/${
        process.env.USER_PATH
      }/admin/coupon/${coupon_id}`;
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
  watch: {
    // 監聽due_data這個變數,一有變動就執行同名函數
    due_date() {
      const vm = this;
      // 將使用者選擇的日期即時轉成時間戳記後再透過updateCoupon存入後端(可當成公式來記)
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      // 在tempData變數下新增一個due_date欄位存放時間戳記
      vm.tempData.due_date = timestamp; // 在openModel時會放入vm.tempData = Object.assign({}, item),準備當點擊updateCoupon時上傳到後端API。
    },
    // 監聽物件的屬性
    "tempData.is_enabled": function() {
      const vm = this;
      if (vm.openChoice === "編輯" && !vm.tempData.is_enabled) {
        // 若沒有勾選「啓用」則讓優惠卷截止日期過期並且讓使用者無法選取日期
        const nowDate = new Date(new Date().toLocaleDateString()); //獲取當前時間
        const preDate = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000 * 2); // 獲取前一天時間戳記
        vm.due_date = new Date(preDate).toISOString().split("T")[0]; // 這裡也會觸發watch的due_date
      }
    }
  },
  created() {
    this.getCoupon();

    /* 測試戳記
    const cur_timestamp = Math.floor(new Date() / 1000);
    console.log("當前時間戳記", cur_timestamp);
    const return_timestamp = new Date(
      cur_timestamp * 1000
    ).toLocaleDateString();
    console.log("將時間戳記返回", return_timestamp);

    var nowDate = new Date(new Date().toLocaleDateString()); //获取当前时间
    var preDate = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000);
    console.log("test", nowDate, preDate.toLocaleDateString());
    */
  }
};
</script>
<style lang="scss" scoped>
.item-hover:hover {
  background-color: darken(white, 10%);
}
</style>