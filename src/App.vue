<template>
  <div id="app">
    <header-main v-if="hasHeader" :showLeftMenu="showLeftMenu" :showBread="showBread"></header-main>
   
    <!-- <common-tab></common-tab> -->
    <div class="content-main">
      <div class="wrap-box layout df">
        <Left-Menu v-if="showLeftMenu"></Left-Menu>
        <router-view v-if="isRouterAlive" :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script>
  import Header from "./components/public/Header.vue";
  import Menu from "../src/components/menu/index.vue";
  import CommonTab from "./components/tags-nav/CommonTab";

  export default {
    name: "App",
    components: {
      "header-main": Header,
      "Left-Menu": Menu,
      "common-tab": CommonTab
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
        avatar: "",
        showLeftMenu: true,
        showBread:true,
      };
    },
    created() {
      this.renderHeader();

    },
    watch: {
      $route(newRoute) {
        this.renderHeader();
        this.$store.commit('tab/selectMenu', newRoute)
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
          this.$route.path.indexOf("/organization-admin") < 0 &&
          this.$route.path.indexOf("/detail") < 0 &&
          this.$route.path !== "/loginCompany" &&
          this.$route.path !== "/enterprisesList" &&
          this.$route.path !== "/creatEnter";
        this.companyId = localStorage.companyId;
        this.avatar = localStorage.userImg;
        this.showLeftMenu =
          this.$route.path !== "/" &&
          this.$route.path.indexOf("/management") < 0 &&
          this.$route.path !== "/register" &&
          this.$route.path !== "/bind" &&
          this.$route.path.indexOf("/statisticsDetail") < 0 &&
          this.$route.path !== "/forget" &&
          this.$route.path.indexOf("/organization-admin") < 0 &&
          this.$route.path.indexOf("/detail") < 0 &&
          this.$route.path !== "/loginCompany" &&
          this.$route.path !== "/enterprisesList" &&
          this.$route.path !== "/creatEnter" &&
          this.$route.path.indexOf("/project");
          this.showBread =this.$route.path.indexOf("/project")== '-1'?true:false;
          console.log(this.showBread)
      },
      reload() {
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

  .tag-nav-wrapper {
    position: fixed;
    left: 0;
    top: 48px;
    width: 100%;
    z-index: 100;
  }
</style>