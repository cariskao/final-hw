<template>
  <div class="my-5 row justify-content-center">
    <form class="col-md-6" @submit.prevent="payOrder">
      <table class="table">
        <thead>
          <th>品名</th>
          <th>數量</th>
          <th>單價</th>
        </thead>
        <tbody>
          <tr v-for="item in order.products" :key="item.id">
            <td class="align-middle">{{ item.product.title }}</td>
            <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
            <td class="align-middle text-right">{{ item.final_total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="text-right">總計</td>
            <td class="text-right">{{ order.total }}</td>
          </tr>
        </tfoot>
      </table>

      <table class="table">
        <tbody>
          <tr>
            <th width="100">Email</th>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span v-if="!order.is_paid">尚未付款</span>
              <span v-else class="text-success">付款完成</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-right" v-if="order.is_paid === false">
        <button class="btn btn-danger">確認付款去</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        user: {} // 沒寫上在{{order.user.xxx}}會報錯
      },
      orderId: ""
    };
  },
  methods: {
    getOrder() {
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      const vm = this;

      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-[%E5%85%8D%E9%A9%97%E8%AD%89]#%E5%8F%96%E5%BE%97%E6%9F%90%E4%B8%80%E7%AD%86%E8%A8%82%E5%96%AE
      // 取得某一筆訂單
      const api = `${SERVER_PATH}/api/${API_PATH}/order/${vm.orderId}`;

      vm.isLoading = true;

      this.$http.get(api).then(response => {
        console.log("getOrder", response);
        vm.order = response.data.order;
        vm.isLoading = false;
      });
    },
    payOrder() {
      const SERVER_PATH = "https://vue-course-api.hexschool.io";
      const API_PATH = "caris";
      const vm = this;

      // https://github.com/hexschool/vue-course-api-wiki/wiki/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9-[%E5%85%8D%E9%A9%97%E8%AD%89]#%E7%B5%90%E5%B8%B3%E4%BB%98%E6%AC%BE
      // 結帳付款
      const api = `${SERVER_PATH}/api/${API_PATH}/pay/${vm.orderId}`;

      vm.isLoading = true;

      this.$http.post(api).then(response => {
        console.log("payOrder", response);
        if (response.data.success) {
          this.getOrder();
        }
        vm.isLoading = false;
      });
    }
  },
  created() {
    // 可用this.$route.params這個方法來取得網址上的參數,這裡就是指
    // http://localhost:8080/#/customer_checkout/-LZMthmllJ4e9vJjvi7z的-LZMthmllJ4e9vJjvi7z
    this.orderId = this.$route.params.orderId;
    // 而orderId要對應到router/index.js下的path: 'customer_checkout/:orderId'
    // console.log("created-orderId", this.orderId); //check是否有抓到名稱

    this.getOrder();
  }
};
</script>