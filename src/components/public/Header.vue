<template>
  <header class="header" id="header">
    <Poptip>
     <Icon class="app-icon" type="md-apps" />
      <div slot="content"  >
        <ul class="app-con">
          <router-link tag="li" :to="'/org/'+companyId" class="app-li">
            <img @click="mainMenu=false" src="@/assets/images/home.png" alt="">
            <p>主页</p>
          </router-link>
          <li @click="goMembers"  class="app-li">
            <img @click="mainMenu=false" src="https://dn-st.teambition.net/appstore/images/basic_app_members.png" alt="">
            <p>成员</p>
          </li>
          <li class="app-li" @click="goBackstage">
            <img @click="mainMenu=false" src="https://dn-st.teambition.net/appstore/images/basic_app_administration.png" alt="">
            <p>管理后台</p>
          </li>
        </ul>
      </div>
    </Poptip>
    <div class="logo">
      <img src="../../assets/images/logo.png" alt="">
      <Icon type="code" @click="openMenu"></Icon>
    </div>
    <div class="fr menu">
      <a :class="{activeHeaderTag:activeHeaderTag==1}" @click="showHeaderTag(1)"><span class="text">我的</span></a>
      <a :class="{activeHeaderTag:activeHeaderTag==2}" @click="showHeaderTag(2)"><span class="text">日历</span></a>
      <a :class="{activeHeaderTag:activeHeaderTag==5}" @click="showHeaderTag(6)"><span class="text">素材</span></a>
      <a :class="{activeHeaderTag:activeHeaderTag==4}" @click="showHeaderTag(4)"><span class="text">下载</span></a>
      <a @click="showHeaderTag(5)"><span class="text ">设计</span></a>
       <!-- <Poptip trigger="hover" class="desing" content="请打开设计系统">
      </Poptip> -->
      <a :class="{activeHeaderTag:activeHeaderTag==3}"  @click="showHeaderTag(3)">
        <span class="text" style="border-right:none;">
          <Badge :count="newsCount?newsCount:0" overflow-count="99" type="info" :offset=[10,0]>
            <Icon type="ios-notifications-outline" size="22" />
          </Badge>
        </span>
      </a>
     
      <!-- <a :class="{activeHeaderTag:activeHeaderTag==4}" @click="clickHeaderTag(4)" class="last-child">消息</a> -->
      <Poptip placement="bottom-end" width="220" class="userPop" v-model="popVisible" @on-popper-show="initCompany">
        
        <img class="avatar" :src="`${defaultImage}`" alt="">
        <div class="userInfo" slot="content">
          <!-- <div class="sck" @click="goSucai">素材库</div> -->
          <ul class="org">
            <div class="createdOrg" :class="hoverClass=='create'?'hoverClass':''" @click="addOrgModal=true;popVisible=false;hoverClass='create'">创建企业</div>
            <li class="addOrgPro"  v-for="(item, index) in companyList" :key="index" @click="changeOrg(item);">
              {{item.organizationName}}
              <Icon v-if="item.isSelection" type="md-checkmark" />
            </li>
          </ul>
          <ul class="admin">
            <li   :class="hoverClass=='person'?'hoverClass':''"  @click="personal();popVisible=false"> 账号设置</li>
            <!-- <li > 账号设置</li> -->
          </ul>
          <ul class="logOut" >
            <li @click="goout">退出登录</li>
          </ul>
        </div>
      </Poptip>

    </div>
    <div class="logoMenu" @mouseleave="mouseOut" :class="logoMenu" :style="'display: '+display" style="display: inline-block">
      <div class="main">
        <Row>
          <iCol span="8" :class="$route.path === i.path ? 'active' :'' " v-for="(i, k) in data" :key="k">
            <div class="" @click="pathClick(i.path)">
              <p>
                <Icon :type="i.icon"></Icon>
              </p>
              <h2>{{i.value}}</h2>
            </div>
          </iCol>
        </Row>
      </div>
    </div>
    <!-- 我的 -->
    <!-- <Mine :class="{showmine:activeHeaderTag==1}" @close="activeHeaderTag=-1"></Mine> -->
    <!-- 创建企业项目 -->
    <Modal v-model="addOrgModal" class="newOrg">
      <CreateOrg @closeCreateOrg="addOrgModal=false" v-if="addOrgModal"></CreateOrg>
    </Modal>
    <!-- 日历 -->

    <Modal v-model="tagHeader"  :mask='false' width='100vh' :z-index=10  @on-cancel='closeTag'  :styles="{top: '50px',}" class="tab-content">
      <Mine v-if="showtag=='Mine'"></Mine>
      <calendar v-if="showtag=='canlender'"></calendar>
      <suCai v-else-if="showtag=='sucai'"></suCai>
      <down v-else-if="showtag=='down'"></down>
      <message  v-else-if="showtag=='message'"></message>
      <div slot="footer"></div>
    </Modal>


  </header>
</template>

<script>
// import Mine from './Mine'
import calendar from './calendar';//日历
import suCai from './sucai';//素材
import down from './down';//下载
import message from './message';//消息
import Mine from './Mine';//消息

import CreateOrg from "./common/CreateOrg";
import { mapState, mapActions, mapMutations } from "vuex";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
export default {
  name: "header-main",
  components: {
     Mine,//我的
    CreateOrg,
    calendar,//日历
    suCai,//素材库
    down,//下载
    message,//消息
  },
  data() {
    return {
      tagHeader:false,//显示日历
      showtag:'',
      display: "none",
      popVisible: false,
      addOrgModal: false,
      logoMenu: "",
      active: false,
      mainMenu: false,
      hoverClass:"",
      showSck: false,
      //src: localStorage.userImg,
      companyId: localStorage.companyId,
      data: [
        {
          value: "阿拉丁",
          icon: "social-chrome",
          path: "/"
        },
        {
          value: "成员",
          icon: "person",
          path: "/member"
        },
        {
          value: "报告",
          icon: "clipboard",
          path: "/report"
        },
        {
          value: "统计",
          icon: "pie-graph",
          path: "/calc"
        },
        {
          value: "目标管理",
          icon: "gear-b",
          path: "/target"
        },
        {
          value: "管理后台",
          icon: "paper-airplane",
          path: "/management"
        }
      ],
      time: 0
    };
  },
  mounted() {
    this.initSocket(localStorage.userId);
    this.initCompany();
  },
  methods: {
    ...mapActions("company", ["initCompany"]),
    ...mapActions("project", ["orgProjectInit"]),
    ...mapMutations('app',['changeHeaderTag']),
    initSocket(id) {
      // 建立连接对象 
      var url='';
      if(process.env.NODE_ENV=='test'){
        url=process.env.VUE_APP_TEST_SOCKET
      }else if(process.env.NODE_ENV=='production'){
        url=process.env.VUE_APP_SOCKET
      }else{
        url="http://192.168.1.107:8080/webSocketServer"
      }
      var socket = new SockJS(url); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        {},
        frame => {
          this.stompClient.subscribe(`/user/${id}/message`, msg => {
            var result = JSON.parse(msg.body);
            switch (result.type) {
              case "I1":
                this.$store.dispatch("project/init","我创建的项目")
                break;
              default:
                this.$store.commit("news/addNews", result.message);
                break;

            }
          });
        },
        err => {}
      );
    },
    personal(){
      this.$router.push("/personal");
      this.hoverClass='person'
    },
    pathClick(path) {
      this.$router.push(path);
      this.popVisible=false
    },
    // 点击企业 改变当前企业
    changeOrg (org) {
      this.orgProjectInit({'id': org.organizationId,'type':'我创建的项目'})
      localStorage.companyId=org.organizationId
      this.$router.push('/org/'+org.organizationId)
      this.popVisible=false
    },
    mouseOut() {
      if (this.time) return;
      this.logoMenu = "";
      setTimeout(() => {
        this.display = "none";
      }, 300);
    },
    openMenu() {
      this.time = 1;
      this.display = "inline-block";
      setTimeout(() => {
        this.logoMenu = "show";
        setTimeout(() => {
          this.time = 0;
        }, 300);
      }, 10);
    },
    getNewsCount() {
      this.$store.dispatch("news/getNewsCount");
    },
    showHeaderTag(id){
         if(id===1){
            //我的
            this.tagHeader=true;
            this.showtag='Mine'
         }
         else if (id === 2) {
           //日历
            this.tagHeader=true;
            this.showtag='canlender'
         }else if(id === 3){
           //素材
            this.tagHeader=true;
            this.showtag='message'

         }else if(id === 6){
           //素材
            this.tagHeader=true;
            this.showtag='sucai'
         }else if(id === 4){
           //下载
           this.tagHeader=true;
            this.showtag='down'
         }else if(id === 5){
              if(runPlatform == 'browse') {
                this.$Message.error('设计系统必须在阿拉丁BIM云平台客户端打开'); 
              }else {
                    ALDObj.RunALDCAD()           
              }
         }
    },
    closeTag(){
               this.tagHeader=false;
               this.showtag=''
    },
    clickHeaderTag(id) {     
      this.changeHeaderTag(id)
      if (this.$route.fullPath.includes("home") || this.$route.fullPath.includes("project") ) {
        localStorage.projectRouter = this.$route.fullPath;
      }
      if (id === 1) {
        if (localStorage.mineRouter) {
          this.$router.push(localStorage.mineRouter);
        } else {
          this.$router.push("/mine/nearThing");
        }
      } else if (id === 2) {
        this.$router.push("/calendar");
      } else if (id === 3) {
        this.$router.push("/message");
      }else if (id === 4) {
        this.$router.push("/down");
      }else if(id === 5){        
        if(runPlatform == 'browse') {
          this.$Message.error('设计系统必须在阿拉丁BIM云平台客户端打开'); 
         }else {
              ALDObj.RunALDCAD()           
         }
      }
    },
    // 去管理后台页面
    goBackstage () {
        if (localStorage.companyId){
            window.open('/company.html', '_blank')
        } else {
            this.$Notice.warning({
                // title: '没有企业',
                desc: '请先创建企业'
            });
        }

    },
      // 去成员页面
      goMembers () {
          if (localStorage.companyId){
              this.$router.push('/members')
          } else {
              this.$Notice.warning({
                  desc: '请先创建企业'
              });
          }

      },
    // 去素材库页面
    goSucai() {
      this.popVisible=false
      this.$router.push('/sucai/'+localStorage.fileId)
    },
    goHome(){
         this.$router.push('/home')
    },
    goout() {
      localStorage.token=''
      localStorage.companyId=''
      this.$router.push('/')
    }
  },
  computed: {
    ...mapState("user", ["mineRouter", "users",'defaultImage']),
    ...mapState('app', ['activeHeaderTag']),
    ...mapState("news", ["newsCount"]),
    ...mapState("company", ["companyList"]),
    ...mapActions("project", ["init", "updateProject", "openSet"])
  },
  created() {
    this.getNewsCount();
  }
};
</script>
<style scoped lang="less">
   
    /deep/.ivu-modal-wrap{
      overflow: hidden;
    }
    /deep/.ivu-modal-body{
      padding:0;
      height: 100vh;
    
      }
    /deep/ .ivu-modal-content{
        box-shadow: none
        }
    /deep/.ivu-modal-footer{
      border-top:none 
      }
.menu .activeHeaderTag {
  color: #2d8cf0;
  background-color: #f5f5f5;
}
.showmine {
  bottom: 0;
  transition: 0.3s;
  height: calc(100% - 48px) !important;
  overflow-y: auto !important;
}
.sck{
  width: 100%;
  height: 37px;
  line-height: 37px;
  cursor: pointer;
  padding: 0 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  &:hover{
    background-color: #f5f5f5;
  }
}
</style>
