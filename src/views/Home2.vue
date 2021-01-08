<template>
  <div class="layout-right" id="layout-right" style="position:relative;" ref="father">
    <Row class-name="page-header" :gutter="15">
      <Col span="16">
      <Card class="col-item">
        <div class="tit">我的工作台</div>
        <div class="header-contant">
          <div class="left-contant">
            <div>
              <img :src="userInfo.image" class="avatar" v-if="userInfo.image" />
            </div>
            <div>
              <div class="title">下午好，{{userInfo.nickName}}，{{userInfo.signature}}</div>
              <div class="info-content df">
                <div class="info-item">
                  <div class="info-tit">昵称：<span>{{userInfo.nickName}}</span></div>
                  <div class="info-tit">登录ip：<span>{{userInfo.loginIp}}</span></div>
                </div>
                <div class="info-item">
                  <div class="info-tit">身份：<span>{{userInfo.roleName}}</span></div>
                  <div class="info-tit">登录时间：<span>{{userInfo.loginTime}}</span></div>
                </div>
              </div>
              <div class="btn-content">
                <Button icon="ios-create-outline" @click="personal">修改信息</Button>
                <Button icon="ios-contact-outline" @click="goArticleCenter">个人中心</Button>
                <Button type="primary" icon="ios-paper-plane-outline">发布需求</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      </Col>
      <Col span="8">
      <Card class="col-item">
        <div class="tit df jsb">
          <span>消息通知</span>
          <span class="more" @click="moreMessage">更多</span>
        </div>
        <div class="mess-content">
          <div class="df jsb mess-item" v-for="item in messageList">
            <div>{{item.newsName}}</div>
            <div>{{ $moment(item.updateTime).format("MM/DD") }}</div>
          </div>
        </div>
      </Card>
      </Col>
    </Row>
    <Row class-name="btn-content">
      <Col span="24">
      <Card class="col-item">
        <div class="tit">常用功能</div>
        <Row :gutter="15" class="home-recommend-row">
          <Col :span="6" v-for="(v,k) in recommendList" :key="k">
          <div class="home-recommend" :style="{'background-color': v.bg}" @click="goto(v.name)">
            <i>
              <svg-icon :name="v.icon" :style="{'color': v.iconColor}"></svg-icon>
            </i>
            <div class="home-recommend-auto">
              <div>{{v.title}}</div>
              <div class="home-recommend-msg">{{v.msg}}</div>
            </div>
          </div>
          </Col>
        </Row>
      </Card>
      </Col>
    </Row>
    <div class="page-wrapper">
      <Row>
        <Col span="24">
        <Card style="width:100%; ">
          <p slot="title">进行中的项目</p>
          <a href="#" class="font-bold" slot="extra" @click.prevent="changeLimit">全部项目</a>
          <ul class="porject-contant">
            <li v-for="(item, index) in projects" :key="index" @click="path(item)">
              <div class="title">
                <Avatar :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover}`"
                  class="avatar" />
                <Icon type="md-star" size="15"></Icon>
                <span>{{item.projectName}}</span>
              </div>
              <div class="description">
                <span>{{item.projectDes}}</span>
                <Progress :percent="item.projectSchedule" hide-info :stroke-width="2" />
              </div>
              <div class="datetime">
                <span>{{item.memberName}}</span>
                <span>{{$moment(item.createTime).format("MM-DD HH:mm") }}</span>
              </div>
            </li>
            <div class="noList" v-if="projects.length == 0 ">
              <img src="../assets/images/noproject-new.png" />
              <p>暂无数据</p>
            </div>
          </ul>
        </Card>
        </Col>
      </Row>
    </div>
    <div class="page-wrapper">
      <div class="article-card" id="aa">
        <Tabs :value="tabName" @on-click="checkTab">
          <TabPane label="动态" name="dt">
            <div class="article-list">
              <div class="article-item df ac" v-for="(item,index) in articleList" @click="goArticleInfo(item)">
                <img :src="item.acId==1?item.coverImages:item.acId==2?item.headlineImages.split(',')[0]:item.videoCover"
                  alt="" class="coverImg" v-if="item.coverImages ||item.headlineImages || item.videoCover">
                <div class="text-content">
                  <div class="content-box">
                    <div class="article-tit" v-if="item.acId !=2">{{item.acId==1?item.articleTitle:item.videoName}}
                    </div>
                    <div class="article-tip" v-text="item.acId==1?item.articlePureContent:item.headlineContent"></div>
                    <div class="icon-content df">
                      <div class="df ac">
                        <img :src="item.acId==1?iconList.videoIcon:item.acId==2?iconList.ttIcon:iconList.textIcon"
                          alt="" class="createImg">
                        <span class="createText">{{item.acId==1?'文章':item.acId==2?'微头条':'视频'}}</span>
                        <img :src="item.memberImage" alt="" class="createImg b50">
                        <span class="createText">{{item.userName}}</span>
                      </div>
                      <span class="createText">{{item.createTime}}</span>
                    </div>
                  </div>

                </div>
              </div>
              <div class="noList" v-if="articleList.length == 0 ">
                <img src="../assets/images/noproject-new.png" />
                <p>暂无数据</p>
              </div>
            </div>
          </TabPane>
           <!-- <TabPane label="需求" name="name2">标签二的内容</TabPane> -->
            <!-- <TabPane label="问答" name="name3">标签三的内容</TabPane> -->
        </Tabs>
      </div>
    </div>
    <div class="article-card-header" :class="searchBarFixed == true ? 'isFixed' :''" :style="{width:fatherWidth}">
      <Tabs :value="tabName" @on-click="checkTab">
        <TabPane label="动态" name="dt"></TabPane>
        <!-- <TabPane label="需求" name="name2"></TabPane> -->
        <!-- <TabPane label="问答" name="name3"></TabPane> -->
      </Tabs>
    </div>
  </div>
</template>

<script>
  import Loading from "../components/public/common/Loading.vue";
  import {
    mapActions,
    mapState,
    mapMutations
  } from "vuex";
  import {
    getUserInfo,
    workBenchInfo,
    userMessage,
    allArtile
  } from "@/axios/api";
  import HomeVue from './Home.vue';
  export default {
    name: "index",
    components: {
      Loading,
    },
    inject: ["reload"],
    data() {
      return {
        companyId: this.$route.params.orgid,
        type: "execute",
        isDone: 1,
        order: "priority",
        taskList: [],
        pageSize: "10", //条数
        pageNum: "1", //页数
        tasktotal: 0, //总任务数
        tabName: "1",
        userInfo: {}, //个人信息
        recommendList: [{
            title: "开始设计",
            msg: "快速启动基于CAD操作的BIM设计工具",
            icon: "gzt-sj",
            bg: "#48D18D",
            iconColor: "#64d89d",
            name: "4",
          },
          {
            title: "项目管理",
            msg: "看板式项目、计划、任务、文档管理",
            icon: "gzt-xm",
            bg: "#F95959",
            iconColor: "#F86C6B",
            name: "2",
          },
          {
            title: "网盘素材",
            msg: "个人网盘、共享素材库",
            icon: "gzt-wp",
            bg: "#8595F4",
            iconColor: "#92A1F4",
            name: "3",
          },
          {
            title: "内容分享",
            msg: "设计头条、文章、视频分享",
            icon: "gzt-fx",
            bg: "#FEBB50",
            iconColor: "#FDC566",
            name: '9'
          },
        ],
        messageList: [],
        loadings: false,
        articleParam: {
          pageNum: '1',
          pageSize: '20',
        },
        articleList: [],
        iconList: {
          videoIcon: require('../assets/images/articles/video.png'),
          ttIcon: require('../assets/images/articles/tt.png'),
          textIcon: require('../assets/images/articles/text.png'),
        },
        articleInfoList: {},
        searchBarFixed: false,
        fatherWidth: '0px',
        tabName:'dt'
      };
    },
    computed: {
      ...mapState("project", ["projects", "loading", "project", "header"], "app"),
      ...mapState("app", ["header"]),
      ...mapState('drawer', ["layoutConfig"]),
    },
    mounted() {
      this.mountedMethods()
      let _this = this
      this.fatherWidth = this.$refs.father.offsetWidth + 'px'
      window.onresize = () => {
        this.fatherWidth = this.$refs.father.offsetWidth + 'px'
      }
      document.querySelector('#layout-right').addEventListener('scroll', this.handleScroll)
    },
    methods: {
      ...mapActions("project", [
        "init",
        "updateProject",
        "openSet",
        "orgProjectInit"
      ]),
      ...mapMutations("project", ["setName"]),
      handleScroll() {
        var scrollTop = document.querySelector('#layout-right').pageYOffset || document.querySelector('#layout-right')
          .scrollTop
        var offsetTop = document.querySelector('#aa').offsetTop
        if (scrollTop > offsetTop) {
          this.searchBarFixed = true
        } else {
          this.searchBarFixed = false
        }
      },
      mountedMethods() {
        this.loadings = true
        this.$Loading.start();
        document.cookie = "orgId" + "=" + localStorage.companyId + ";" + "path=/";
        document.cookie = "userId" + "=" + localStorage.userId + ";" + "path=/";
        this.$store.state.project.loading = true;
        this.orgProjectInit({
          id: this.companyId,
          type: "全部项目"
        });
        this.getUser(); //获取信息
        this.getMessageList();
        this.getattentionList()
      },
      path(item) {
        this.setName(item.projectName);
        localStorage.projectName = item.projectName;
        localStorage.taskId = item.taskId;
        this.$router.push(
          `/project/${item.projectId}/tasks/group/${item.groupId}`
        );
      },
      getUser() {
        workBenchInfo(localStorage.companyId).then(res => {
          if (res.result == 1) {
            this.userInfo = res.data;
          }
        });
      },
      changeLimit() {
        this.$router.push("/prolist/" + localStorage.companyId);
        this.$store.commit("app/changeHeaderTag", 1);
      },
      goMembers(item) {
        this.$router.push({
          path: "/members",
          query: {
            from: 'home',
            id: item.userId
          }
        });
        this.$store.commit("app/changeHeaderTag", 2);
      },
      goto(name) {
        if (name == 2) {
          this.$router.push("/prolist/" + localStorage.companyId);
        } else if (name == 3) {
          this.$router.push("/material");
        } else if (name == 4) {
          if (runPlatform == "browse") {
            this.$Message.error("设计系统必须在阿拉丁BIM云平台客户端打开");
          } else {
            ALDObj.RunALDCAD();
          }
        } else if (name == 9) {
          this.$router.push("/postArticles");
        }
      },
      //消息列表
      getMessageList() {
        let data = {
          param: 0
        };
        userMessage(data).then(res => {
          this.messageList = res.data.records;
          this.$Loading.finish();
        });
      },
      //文章列表
      getattentionList() {
        allArtile(this.articleParam).then(response => {
          this.articleList = response.data.records
        })
      },
      //文章详情
      goArticleInfo(item) {
        this.$router.push({
          name: "articleDetails",
          params: {
            articleInfoList: item
          }
        });
      },
      //去个人中心
      goArticleCenter() {
        this.$router.push({
          name: "articleCenter",
          params: {
            'userInfo': this.userInfo
          }
        });
      },
      //修改信息
      personal() {
        this.$router.push("/personal");
        this.popVisible = "none";
      },
      moreMessage() {
        this.$router.push("/messageAlert");
      },
      checkTab(name){
          this.tabName=name
      }
    }
  };
</script>
<style lang="less">
  @import "../assets/css/menu.less";
</style>