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
              <div class="title">{{ $moment(new Date()).format("a") }}好，{{userInfo.nickName}}，{{userInfo.signature}}</div>
              <div class="info-content df">
                <div class="info-item">
                  <div class="info-tit">昵称：<span>{{userInfo.nickName}}</span></div>
                  <div class="info-tit">登录ip：<span>{{userInfo.loginIp}}</span></div>
                </div>
                <div class="info-item">
                  <div class="info-tit">职业：<span>{{userInfo.roleName}}</span></div>
                  <div class="info-tit">登录时间：<span>{{userInfo.loginTime}}</span></div>
                </div>
              </div>
              <div class="btn-content">
                <Button icon="ios-create-outline" @click="personal">修改信息</Button>
                <Button icon="ios-contact-outline" @click="goArticleCenter">个人中心</Button>
                <Button type="primary" icon="ios-paper-plane-outline" @click="goRequire">发布需求</Button>
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
            <div class="mess-tit">{{item.newsName}}</div>
            <div >{{ $moment(item.updateTime).format("MM/DD") }}</div>
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
                <!-- <Icon type="md-star" size="15"></Icon> -->
                <span style="margin-left:10px;">{{item.projectName}}</span>
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
      <div class="article-card" id="article-card">
        <Tabs :value="tabName" @on-click="checkTab" :animated="false">
          <Loading v-if="tabloading"></Loading>
          <TabPane :label="item.label" :name="item.name" v-for="(item,index) in tabList" :key="index">
            <div class="article-list">
              <div class="article-item df ac" v-for="(item,index) in articleList" @click="goArticleInfo(item)">
                <img :src="item.acId==1?item.coverImages:item.acId==2?item.headlineImages.split(',')[0]:item.videoCover"
                  alt="" class="coverImg" v-if="item.coverImages ||item.headlineImages || item.videoCover">
                <div class="text-content">
                  <div class="content-box">
                    <div class="article-tit" v-if="item.acId !=2">{{item.acId==1?item.articleTitle:item.videoName}}
                    </div>
                    <div class="article-tip" v-html="item.acId==1?item.articlePureContent:item.headlineContent"></div>
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
          <TabPane label="需求" name="xq">
            <Table :columns="columnsList" :data="requirementsList" class="reuqire-table" style="padding-bottom:15px;">
              <template slot-scope="{ row }" slot="demandName">
                <div>{{ row.demandName }}</div>
              </template>
              <template slot-scope="{ row }" slot="createTime">
                <div>{{ row.createTime }}</div>
              </template>
              <template slot-scope="{ row }" slot="bid">
                <div>{{ row.bid }}</div>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" ghost @click="goDemand(row, index)">查看</Button>
              </template>
            </Table>
          </TabPane>
          <TabPane label="问答" name="wd">
            <div class="article-list">
              <div class="article-item df ac" v-for="(item,index) in qaList" @click="goReplyInfo(item)">
                <div class="text-content">
                  <div class="content-box">
                    <div class="article-tit">{{item.questionContent}}
                    </div>
                    <div class="article-tip" v-if="item.questionDepict">{{item.questionDepict}}</div>
                    <div class="img-content" v-if="item.questionDepictImages">
                      <img v-for="(item,index) in item.questionDepictImages" :src="item" :key="index">
                    </div>
                    <div class="icon-content df">
                      <div class="df ac">
                        <img :src="iconList.wdIcon" alt="" class="createImg">
                        <span class="createText">问答 {{item.replyCount}}</span>
                        <img :src="item.questionMemberImage" alt="" class="createImg b50">
                        <span class="createText">{{item.questionMemberName}}</span>
                      </div>
                      <span class="right-icon-content">
                        <div class="icon-content">
                          <svg-icon name="bi"></svg-icon><span>写问答</span>
                        </div>
                      </span>
                    </div>
                  </div>

                </div>
              </div>
              <!-- <div class="noList" v-if="qaList.length == 0 ">
                <img src="../assets/images/noproject-new.png" />
                <p>暂无数据</p>
              </div> -->
            </div>
          </TabPane>

        </Tabs>
      </div>
    </div>
    <div class="article-card-header" :class="searchBarFixed == true ? 'isFixed' :''" >
      <Tabs :value="tabName" @on-click="checkTab">
        <TabPane :label="item.label" :name="item.name" v-for="(item,index) in tabList" :key="index"></TabPane>
        <TabPane label="需求" name="xq"></TabPane>
        <TabPane label="问答" name="wd"></TabPane>
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
    allArtile,
    attentionListArticle,
    demandList,
    questionList
  } from "@/axios/api";
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
            msg: "设计头条、文章、视频分享以及问答",
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
          wdIcon: require('../assets/images/articles/wd.png'),
        },
        articleInfoList: {},
        searchBarFixed: false,
        tabName: 'dt',
        tabList: [{
            label: '动态',
            name: 'dt'
          },
          {
            label: '关注',
            name: 'gz'
          },
        ],
        columnsList: [{
            title: '需求标题',
            slot: 'demandName'
          }, {
            title: '发布时间',
            slot: 'createTime'
          },
          {
            title: '金额',
            slot: 'bid'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        requirementsList: [],
        demandParam: {
          pageNum: 1,
          type: 4,
        },
        flag: false, //下拉加载开关
        qaParam: {
          pageNum: 1,
        },
        qaList: [],
        tabloading: false
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
        var offsetTop = document.querySelector('#article-card').offsetTop
        if (scrollTop > offsetTop) {
          this.searchBarFixed = true
        } else {
          this.searchBarFixed = false
        }
        let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        let scrollHeight = document.querySelector('#layout-right').scrollHeight || document.body.scrollHeight;
        if (scrollTop + windowHeight == scrollHeight + 48 && this.flag) {
          if (this.tabName == 'dt') {
            this.articleParam.pageNum++;
            this.getattentionList()
          } else if (this.tabName == 'gz') {
            this.articleParam.pageNum++;
            this.getMyattention()
          } else if (this.tabName == 'xq') {
            this.demandParam.pageNum++;
            this.demandList()
          } else if (this.tabName == 'wd') {
            this.qaParam.pageNum++;
            this.getQAlist()
          }
        }
      },
      mountedMethods() {
        this.loadings = true
        // this.$Spin.show();
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
        let param = {
          orgId: localStorage.companyId,
          memberId: localStorage.userId
        }
        workBenchInfo(param).then(res => {
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
        });
      },
      //文章列表
      getattentionList() {
        allArtile(this.articleParam).then(response => {
          if (response.data.records.length < 20) {
            this.flag = false
          } else {
            this.flag = true
          }
          response.data.records.forEach((item) => {
            this.articleList.push(item)
          })
          this.tabloading = false
          // this.$Spin.hide();
          this.$Loading.finish();
        })
      },
      //文章详情
      goArticleInfo(item) {
        this.$router.push("/articleDetails")
        localStorage.setItem('articleInfoList', JSON.stringify(item))
      },
      //去个人中心
      goArticleCenter() {
        this.$router.push("/articleCenter")
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      },
      //修改信息
      personal() {
        this.$router.push("/personal");
        this.popVisible = "none";
      },
      moreMessage() {
        this.$router.push("/messageAlert");
      },
      checkTab(name) {
        this.tabloading = true
        this.tabName = name
        this.articleParam.pageNum = 1
        this.articleList=[]
        this.requirementsList=[]
        this.qaList=[]
        if (name == 'dt') {
          this.getattentionList()
        } else if (name == 'gz') {
          this.getMyattention()
        } else if (name == 'xq') {
          this.demandList()
        } else if (name == 'wd') {
          this.getQAlist()
        }
      },
      getMyattention() {
        attentionListArticle(this.articleParam).then(response => {
          if (response.data.records.length < 20) {
            this.flag = false
          } else {
            this.flag = true
          }
          response.data.records.forEach((item) => {
            this.articleList.push(item)
          })
          this.tabloading = false
        })
      },
      demandList() {
        demandList(this.demandParam).then(response => {
          if (response.data.records.length < 20) {
            this.flag = false
          } else {
            this.flag = true
          }
          response.data.records.forEach((item) => {
            this.requirementsList.push(item)
          })
          this.tabloading = false
        })
      },
      getQAlist() {
        questionList(this.qaParam).then(response => {
          if (response.data.records.length < 20) {
            this.flag = false
          } else {
            this.flag = true
          }
          response.data.records.forEach((item) => {
            this.qaList.push(item)
          })
          this.tabloading = false
        })
      },
      goRequire() {
        this.$router.push("/requirements");
      },
      //问答详情
      goReplyInfo(item) {
        this.$router.push("/qaDetails")
        localStorage.setItem('replyInfoList', JSON.stringify(item))
      },
      //需求详情
      goDemand(row,index){
        this.$router.push("/demandDetails")
        localStorage.setItem('demandInfoList', JSON.stringify(row))
      }
    }
  };
</script>
<style lang="less">
  @import "../assets/css/menu.less";
  @import "../assets/css/deepBug.less";

</style>