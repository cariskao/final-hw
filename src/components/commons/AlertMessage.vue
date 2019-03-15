<template>
  <!-- even bus,Products.vue在新增或編輯上傳的圖片檔案格式錯誤時跳出警告視窗 -->
  <div class="message-alert">
    <div
      class="alert alert-dismissible"
      :class="'alert-' + item.status"
      v-for="(item, i) in messages"
      :key="i"
    >
      {{ item.message }}
      <button
        type="button"
        class="close"
        @click="removeMessage(i)"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      messages: [
        // for test
        /*
        {
          message: "預設訊息內容",
          status: "danger"
        }*/
      ]
    };
  },
  methods: {
    updateMessage(message, status) {
      const timestamp = Math.floor(new Date() / 1000);
      // console.log(timestamp); // 給每個產生的訊息一個時間戳記

      this.messages.push({
        message,
        status,
        timestamp
      });

      // 每當我們送出訊息到messages[]後timestamp秒,就將自己移除
      this.removeMessageWithTiming(timestamp);
    },
    // 按下彈跳訊息的「x」就刪除
    removeMessage(num) {
      this.messages.splice(num, 1);
    },
    removeMessageWithTiming(timestamp) {
      const vm = this;

      // 5秒鐘後比對時間戳記相同的話就刪除
      setTimeout(() => {
        vm.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1);
          }
        });
      }, 5000);
    }
  },
  created() {
    const vm = this;
    // 要先在main.js import './bus'
    // 在非父子層Prodcucts.vue發送$emit()事件,並傳來二個參數,然後這裡用$on去監聽
    vm.$bus.$on("msg-from-products", (message, status = "warning") => {
      vm.updateMessage(message, status);
    });
  }
};
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>