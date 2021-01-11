<template>
  <div class="navbar-left">
    <template>
      <!-- <Breadcrumb separator="/">
        <transition-group name="breadcrumb">
          <BreadcrumbItem v-for="(item, index) in levelList" :key="item.path">
            <span v-if="index == levelList.length - 1">{{item.meta.title}}</span>
            <a v-else @click.prevent="onHandleLink(item)">{{item.meta.title}}</a>
          </BreadcrumbItem>
        </transition-group>
      </Breadcrumb> -->
    </template>
  </div>
</template>

<script>
  import {
    mapState,
    mapActions
  } from "vuex";
  // import {
  //   dynamicRouter
  // } from "@/utils/routesAsync";
  export default {
    name: "breadcrumb",
    components: {},
    data() {
      return {
        levelList: null,
        layouts: {},
        deptIdList: [],
        isCollapsed: true,
      };
    },
    computed: {
      ...mapState(["layoutConfig"]),
      ...mapState("app", ["header"]),
    },
    mounted() {
      this.layouts = this.layoutConfig;
    },
    methods: {
      ...mapActions(["setLayoutConfig"]),
      // !! 前 ! 转换成布尔型。递归获取当前子节点的所有父节点
      lookupCurrentRoute(arr, path) {
        let menuArr = [];
        if (arr.length == 0) {
          if (!!path) menuArr.unshift(arr)
          return menuArr;
        }
        let fun = (data, nodeId) => {
          for (var i = 0, length = data.length; i < length; i++) {
            let node = data[i]
            if (node.path == nodeId) {
              menuArr.unshift(node)
              fun(arr, node.parentPath)
              break
            } else {
              if (!!node.children) fun(node.children, nodeId)
            }
          }
          return menuArr;
        };
        menuArr = fun(arr, path);
        return menuArr;
      },
      // 顶部 `breadcrumb 面包屑` 数组获取
      getBreadcrumb(path) {
        let originalMenuData = dynamicRouter(this.$store.state.originalMenuData)
        this.levelList = this.lookupCurrentRoute(originalMenuData.children, path);
      },
      // 顶部 `breadcrumb 面包屑` 点击
      onHandleLink(item) {
        const {
          redirect,
          path
        } = item;
        if (redirect) {
          this.$router.push(redirect);
          return;
        }
        this.$router.push(path);
      },

    },
    watch: {
      // 监听路由变化，改变顶部 `breadcrumb 面包屑` 数组内容
      $route: {
        handler(to) {
          this.getBreadcrumb(to.path);
        },
        immediate: true,
        deep: true,
      },
    },
  };
</script>

<style scoped lang="less">
  .navbar-left {
    height: 100%;
    display: flex;
    align-items: center;
    flex: 1;

    .logo {
      width: 210px;
      height: 100%;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
      }
    }

    i {
      font-size: 20px;
      cursor: pointer;
      margin-right: 15px;
      margin-left: 15px;
    }
  }
</style>