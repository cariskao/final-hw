<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <!-- pageData對應backCoupon.vue的:page-data(要先用props接收父傳來的值) -->
      <li class="page-item" :class="{'disabled': !pageData.has_pre}">
        <a
          @click.prevent="changePage(pageData.current_page-1)"
          class="page-link"
          href="#"
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        class="page-item"
        v-for="page in pageData.total_pages"
        :key="page"
        :class="{'active': pageData.current_page === page}"
      >
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{'disabled': !pageData.has_next}">
        <a
          @click.prevent="changePage(pageData.current_page+1)"
          class="page-link"
          href="#"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "pagination",
  props: ["pageData"], //子接收父傳來的值
  methods: {
    // 子傳父, 被點擊時傳送自訂事件changepage並帶入page,到父組件接收後再執行changepage事件的函數來獲取JSON中的pagination資訊。
    changePage(page) {
      this.$emit("changepage", page);
    }
  },
  created() {
    const vm = this;
  }
};
</script>