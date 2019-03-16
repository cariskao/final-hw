<template>
  <div>
    <Navbar/>
    <!-- <Alert>預設不顯示,好像要放在欲使用此組件的父層 -->
    <!-- 在main.js已寫成全局組件 -->
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
import Navbar from "@c/pages/backEnd/common/Navbar";
import Sidebar from "@c/pages/backEnd/common/Sidebar";
export default {
  components: {
    Navbar,
    Sidebar
  }
};
</script>