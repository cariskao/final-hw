<template>
  <div>
    <nav class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">
        <h6
          class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
        >
          <span>管理員 - 後台</span>
          <a class="d-flex align-items-center text-muted" href="#">
            <span data-feather="plus-circle">(需登入)</span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <!-- <a class="nav-link" href="#">
              <span data-feather="file-text"></span>
              產品列表
            </a>-->
            <!-- 改成<router-link> ,記得補上原有的class name-->
            <router-link class="nav-link" to="/admin/products">
              <!-- 已有在根目錄/index.html下載入fontawesome -->
              <i class="fas fa-box-open"></i>產品列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/orders" class="nav-link">
              <i class="far fa-list-alt"></i> 訂單列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/coupons" class="nav-link">
              <i class="fas fa-ticket-alt"></i> 優惠券
            </router-link>
          </li>
        </ul>
        <h6
          class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
        >
          <span>客戶選購 - 前台</span>
          <a class="d-flex align-items-center text-muted" href="#">
            <span data-feather="plus-circle">(免登入)</span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <i class="fas fa-ticket-alt"></i>模擬購物
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>