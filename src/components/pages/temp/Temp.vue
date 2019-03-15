<template>
  <div>
    <Navbar/>
    <!-- <Alert>預設不顯示 -->
    <Alert/>
    <div class="container-fluid">
      <div class="row">
        <Sidebar/>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <!-- 所以<router-view>現在是巢狀的,這裡是內層,外層在App.vue -->
          <!-- 這裡引入router/index.js下的/admin/children -->
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
// 區域使用元件(組件)
import Navbar from "@c/pages/temp/Navbar";
import Sidebar from "@c/pages/temp/Sidebar";
import Alert from "@c/commons/AlertMessage";
export default {
  components: {
    Navbar,
    Sidebar,
    Alert
  }
};
</script>