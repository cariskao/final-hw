<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="list-con">
      <div class="container">
        <div class="scroll-area">
          <table class="table table-hover">
            <thead>
              <tr>
                <!-- 無法做刪除,因爲後端API接口沒有做orders的刪除路徑 -->
                <th>下單時間</th>
                <th>訂單編號</th>
                <th>總金額</th>
                <th>客戶資訊</th>
                <th width="200">產品資訊</th>
                <th width="120">付款狀態</th>
                <th>備註</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in order_list" :key="item.id">
                <td>{{ item.create_at | timestamp }}</td>
                <td>{{ item.id }}</td>
                <td>{{ item.total | currency }}</td>
                <td>
                  姓名: {{ item.user.name }}
                  <br>
                  電子信箱: {{ item.user.email }}
                  <br>
                  連絡電話: {{ item.user.tel }}
                </td>
                <td>
                  <ul>
                    <li
                      v-for="product in item.products"
                      :key="product.id"
                    >{{product.product.title}} : {{product.qty}}{{product.product.unit}}-單價{{product.final_total}}</li>
                  </ul>
                </td>
                <td>
                  <b v-if="item.is_paid" class="text-success d-block">已付款</b>
                  <b v-if="item.is_paid" class="text-success">付款日期: {{ item.paid_date | timestamp }}</b>
                  <b v-if="!item.is_paid" class="text-danger">未付款</b>
                </td>
                <td>{{item.message}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <pagination :page-data="pagination" @changepage="getOrderlist"></pagination>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      order_list: [],
      pagination: {},
      status: {
        loadingItem: ""
      },
      isLoading: false
    };
  },
  methods: {
    getOrderlist(page = 1) {
      const api = `${process.env.SERVER_API_PATH}/api/${
        process.env.USER_PATH
      }/admin/orders?page=${page}`;
      const vm = this;

      vm.isLoading = true;

      this.$http.get(api).then(response => {
        vm.order_list = response.data.orders;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
        console.log("getOrderlist", response);
      });
    }
  },
  created() {
    this.getOrderlist();
  }
};
</script>
