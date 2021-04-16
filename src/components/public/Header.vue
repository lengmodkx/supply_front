<template>
  <div>
    <header class="header" id="header">
      <div class="left-header" :class="header?'padding-big':'padding-small'">
        <svg-icon :name="header ? 'push' : 'pull'" class="svgIcon" @click="collapsedSider" v-if="showLeftMenu"></svg-icon>
        <Breadcrumbs v-if="showBread"></Breadcrumbs>
      </div>
        <div class="logo-content">
            <svg-icon name="header-logo"></svg-icon>
        </div>
      <div class="df ac">
        <div class="menu">
          <a @click="showHeaderTag(7)">
            <span class="texttag">
              <Icon type="ios-settings-outline" size="22" />
            </span>
          </a>
          <a @click="goProList">
            <span class="texttag" style="border-right:none;">
              <Badge :count="newsCount ? newsCount : 0" overflow-count="99" type="info" :offset="[0, 0]">
                <Icon type="ios-notifications-outline" size="22" />
              </Badge>
            </span>
          </a>
        </div>
        <div class="right-header">
          <Avatar :src="headeImg" class="avatar" @click.native="showMenu" v-click-outside="hideContent" />
        </div>
        <div class="userInfo" :style="{ display: popVisible }">
          <ul>
            <li class="tab-menu-item">
              <div class="tab-menu-item-content1">升级</div>
            </li>
            <li class="tb-navigation-menu-divider"></li>
            <li class="tab-menu-item">
              <div class="tab-menu-item-content2" @click="checkEnter">
                <div>切换企业</div>
                <div style="font-size:12px;color:#8c8c8c">{{orgName}}</div>
              </div>
            </li>
            <li class="tb-navigation-menu-divider"></li>
            <li class="tab-menu-item">
              <div class="tab-menu-item-content3" @click="personal">账号设置</div>
            </li>
            <li class="tab-menu-item">
              <div class="tab-menu-item-content3" @click="getDown">下载ALDCAD</div>
            </li>
            <li class="tb-navigation-menu-divider"></li>
            <li class="tab-menu-item">
              <div class="tab-menu-item-content1" @click="goout">退出登陆</div>
            </li>
          </ul>
        </div>
      </div>
      <Modal v-model="tagHeader" :mask="false" fullscreen :title="title" footer-hide @on-cancel="closeTag"
        :styles="{ top: '50px' }" class="tab-content">
        <suCai v-if="showtag == 'sucai'"></suCai>
        <div slot="footer"></div>
      </Modal>
      <DropdownDrawer ref="dropdownDrawer" />
    </header>
  </div>

</template>

<script>
  import TagsView from './TagsView/index'
  import DropdownDrawer from "./dropdownDrawer";
  import Breadcrumbs from './custom-bread-crumb'
  import {
    mapActions,
    mapState,
    mapMutations
  } from "vuex";
  import {
    checkPermission,
    userIsOwner,
    userlogout
  } from "../../axios/api.js";
  import suCai from "./sucai"; //素材
  import SockJS from "sockjs-client";
  import Stomp from "stompjs";
  import Cookies from 'js-cookie';
  export default {
    name: "header-main",
    components: {
      suCai, //素材库
      TagsView,
      DropdownDrawer,
      Breadcrumbs
    },
    computed: {
      ...mapState("app", ["header"]),
      ...mapState("app", ["activeHeaderTag"]),
      ...mapState("news", ["newsCount"]),
      breadCrumbList() {
        return this.$store.state.breadCrumb.breadCrumbList
      } 
    },
    data() {
      return {
        // active: 0,
        popVisible: "none",
        headeImg: localStorage.userImg,
        orgName: localStorage.orgName,
        tagHeader: false, //显示日历
        showtag: "",
        title: "",
      };
    },
    props: ["showLeftMenu","showBread"],
    mounted() {
      this.setBreadCrumb(this.$route)
      this.setHomeRoute(this.$router.options.routes)
      this.getNewsCount();
      this.initSocket(localStorage.userId);
    },
    methods: {
      ...mapActions("company", ["initCompany"]),
      ...mapMutations([
      'setBreadCrumb',
      'setHomeRoute',
    ]),
      initSocket(id) {
        // 建立连接对象
        var url = "";
        if (process.env.NODE_ENV == "test") {
          url = process.env.VUE_APP_TEST_SOCKET;
        } else if (process.env.NODE_ENV == "production") {
          url = process.env.VUE_APP_SOCKET;
        } else {
          url = process.env.VUE_APP_SOCKET;
        }
        var socket = new SockJS(url); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
        // 获取STOMP子协议的客户端对象
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({},
          frame => {
            this.stompClient.subscribe(`/user/${id}/message`, msg => {
              var result = JSON.parse(msg.body);
              switch (result.type) {
                case "I1":
                  this.$store.commit("project/deleteProject", result.object);
                  break;
                default:
                  console.log(result)
                  this.$store.commit("news/getNewsCount", result.data);
                  break;
              }
            });
          },
          err => {}
        );
      },
      checkEnter() {
        this.$router.push("/enterprisesList");
      },
      personal() {
        // let routeUrl = this.$router.resolve({
        //   path: "/personal"
        // });
        // window.open(routeUrl.href, "_blank");
        this.$router.push("/personal");
        this.popVisible = "none";
      },
      goout() {
        // userlogout().then(response=>{
          
        // })
          localStorage.clear();
          Cookies.remove('token', {
            path: '/',
            domain: 'aldbim.com'
          });
          var url = "";
          if (process.env.NODE_ENV == "test") {
            url = 'http://test.art1001.com';
          } else if (process.env.NODE_ENV == "production") {
            url = "https://www.aldbim.com";
          } else {
            url = "/";
          }
          window.location.href = url;
      },
      showMenu() {
        if (this.popVisible == "none") {
          this.popVisible = "block";
        } else {
          this.popVisible = "none";
        }
      },
      hideContent() {
        this.popVisible = "none";
      },
      getNewsCount() {
        this.$store.dispatch("news/getNewsCount");
      },
      goProList() {
        this.$router.push("/messageAlert");
      },
      showHeaderTag(id) {
        if (id === 6) {
          //素材
          this.tagHeader = true;
          this.showtag = "sucai";
          this.title = "素材";
        } else if (id === 7) {
          //设置
          this.$refs.dropdownDrawer.openDrawer();
        } else if (id === 5) {
          if (runPlatform == "browse") {
            this.$Message.error("设计系统必须在阿拉丁BIM云平台客户端打开");
          } else {
            ALDObj.RunALDCAD();
          }
        }
      },
      closeTag() {
        this.tagHeader = false;
        this.showtag = "";
      },
      getDown() {
        window.location.href =
          "https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/ALDBIM2020.exe";
      },
      // 展开/收起左侧菜单
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
        this.$store.commit("app/changeHeader", this.isCollapsed);
      },
    },
    watch: {
      $route(newRoute) {
      this.setBreadCrumb(newRoute)
    }
    }
  };
</script>
<style scoped lang="less"></style>