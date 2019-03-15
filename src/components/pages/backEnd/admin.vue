<template>
  <div>
    <!-- <Navbar/> -->
    <!-- <Alert>預設不顯示,這裡引入全部檔案皆可調用,不知爲何只能將檔案放在這裡 -->
    <Alert/>
    <div class="container-fluid">
      <div class="row">
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
export default {};
</script>