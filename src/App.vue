<template>
  <div id="app">
    <header-main v-if="hasHeader" :companyId="companyId" :avatar="avatar"></header-main>
    <div class="content-main">
      <router-view v-if="isRouterAlive" :key="$route.fullPath" />
      <!-- <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
        </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    </div>
  </div>
</template>

<script>
import Header from "./components/public/Header.vue";

export default {
  name: "App",
  components: {
    "header-main": Header
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      hasHeader: true,
      companyId: "",
      avatar: ""
    };
  },
  created() {
    this.renderHeader();
    console.log(this.companyId);
  },
  watch: {
    $route() {
      this.renderHeader();
    }
  },
  methods: {
    renderHeader() {
      this.hasHeader =
        this.$route.path !== "/" &&
        this.$route.path.indexOf("/management") < 0 &&
        this.$route.path !== "/register" &&
        this.$route.path !== "/bind" &&
        this.$route.path.indexOf("/statisticsDetail") < 0 &&
        this.$route.path !== "/forget" &&
        this.$route.path.indexOf("/organization-admin") < 0&&
        this.$route.path.indexOf("/material") < 0&&
        this.$route.path.indexOf("/detail") < 0 &&
        this.$route.path!== "/loginCompany" < 0 ;
      // this.hasHeader = this.$route.path !== '/management'
      this.companyId = localStorage.companyId;
      this.avatar = localStorage.userImg;
    },
    reload() {
      console.log("xxxxxxx");
      this.isRouterAlive = false;
      //在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>

<style lang="less">
@import "assets/css/font.less";
@import "assets/css/appNew.less";
</style>
