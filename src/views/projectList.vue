<template>
  <div class="layout-right">
    <div class="layouts-right messageAlert" v-if="messageAlert">
      <messageAlert :messageType="messageType"></messageAlert>
    </div>
    <div class="layouts-right" v-else>
      <div class="btnContent df">
        <Icon :class="{ now: moShi == 'liebiao' }" @click="moShi = 'liebiao'" type="ios-list-box-outline" size="24" />
        <Icon :class="{ now: moShi == 'tupian' }" @click="moShi = 'tupian'" type="ios-apps-outline" size="24" />
        <div class="create" @click="showproject = true"><Icon type="md-add" color="#0077ff;" />创建项目</div>
      </div>
      <Tabs :value="tabValue" @on-click="tabChange">
        <TabPane :label="item.label" :name="item.value" v-for="(item, index) in projectList" :key="index">
          <Loading v-if="searchLoading"></Loading>
          <Row class="titleRow" type="flex" align="middle" v-if="moShi == 'liebiao'">
            <Col span="12">项目名称</Col>
            <Col span="3">创建日期</Col>
            <Col span="3">创建人</Col>
            <Col span="3">进度</Col>
            <Col span="3">操作</Col>
          </Row>
          <div v-if="moShi == 'liebiao'">
            <Row class="ant-list-item" type="flex" align="middle" v-for="(item, index) in projects" :key="index" @click.prevent.native="path(item)">
              <Col span="12" class="info-title">
                <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover}`" alt />
                <div>
                  <div class="contant">
                    <div class="proName">{{ item.projectName }}</div>
                  </div>
                  <span class="proDes">{{ item.projectDes }}</span>
                </div>
              </Col>
              <Col span="3" class="info-item">{{ $moment(item.createTime).format("YYYY-MM-DD") }}</Col>
              <Col span="3" class="info-item">
                <span>{{ item.memberName }}</span>
              </Col>
              <Col span="3" class="info-item">
                <Progress :percent="item.projectSchedule" />
              </Col>
              <Col span="3">
                <div class="info-icon">
                  <Tooltip content="添加成员" placement="top">
                    <Icon type="ios-person-add-outline" size="18" @click.stop="inviteMem(item.projectId)" />
                  </Tooltip>
                  <Tooltip content="项目设置" placement="top">
                    <Icon type="ios-cog" size="18" @click.stop="setProject(item)" />
                  </Tooltip>
                  <Tooltip content="收藏" placement="top">
                    <Icon type="md-star" size="18" :class="{ starOn: item.collect }" @click.stop="setStar(item.projectId)"></Icon>
                  </Tooltip>
                  <Tooltip content="移置回收站" placement="top">
                    <Icon type="ios-trash-outline" size="18" @click.stop="confirmHuishou(item)" />
                  </Tooltip>
                </div>
              </Col>
            </Row>
          </div>
          <Row v-else-if="moShi == 'tupian'">
            <iCol :lg="8" :xl="6" :xxl="4" v-for="(item, index) in projects" :key="index">
              <div @click="path(item)" class="col" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`">
                <div class="zzc">
                  <div class="projectName">{{ item.projectName }}</div>
                  <p>{{ item.projectDes }}</p>
                  <div class="iconPic" v-if="projectType != '回收站的项目'">
                    <Tooltip class="iconpic2" :class="{ showStar: item.collect }" content="星标" placement="top">
                      <span @click.stop="setStar(item.projectId)">
                        <Icon type="md-star" size="18" :class="{ starOn: item.collect }"></Icon>
                      </span>
                    </Tooltip>
                    <Tooltip class="iconpic1" content="打开项目设置" placement="top">
                      <span @click.stop="setProject(item)">
                        <Icon type="md-settings" size="18"></Icon>
                      </span>
                    </Tooltip>
                  </div>
                  <div v-else class="iconPic">
                    <Tooltip class="iconpic2" content="恢复项目" placement="top">
                      <span @click.stop="recover(item.projectId)">
                        <Icon type="md-refresh" size="22" />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </iCol>
          </Row>
          <div class="noList" v-if="projects.length == 0">
            <img src="../assets/images/noproject-new.png" />
            <p>暂无数据</p>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <!-- 创建项目 -->
    <Modal v-model="showproject" class="newPro-modal" :mask-closable="false" width="850" footer-hide title="选择项目模板">
      <!-- <CreateProject v-if="showproject" :showProject="showproject" @hideModal="showproject = false"@getNewList="getNewList"></CreateProject> -->
      <choose-template v-if="showproject"></choose-template>
    </Modal>
    <!--邀请成员-->
    <Modal v-model="showInviteMembers" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>邀请新成员</span>
      </p>
      <div class="titleContent">
        <div class="accountInv">账号邀请</div>
        <div
          class="linkInv"
          @click="
            showLink = true;
            showInviteMembers = false;
          "
        >
          通过链接邀请
        </div>
      </div>
      <InviteMembers v-if="showInviteMembers" :projectId="projectId"></InviteMembers>
    </Modal>
    <Modal v-model="showLink" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>邀请新成员</span>
      </p>
      <div>
        <Loading v-if="linkLoading"></Loading>
        <div>链接有日期：{{ linkExpireTime }}</div>
        <div class="linkContent">
          <div class="link-name tasklink">{{ linkText }}</div>
          <div class="copyBtn" @click="copyLinks" data-clipboard-target=".tasklink">复制链接</div>
        </div>
      </div>
    </Modal>

    <!-- 项目设置 -->
    <Modal v-model="projectSet" class="setPro-modal" width="790" footer-hide>
      <projectSetNew @closesettings="closeSettings" @signOut="signOut"></projectSetNew>
    </Modal>
    <!-- 删除项目 -->
    <Modal class="confirmModal" v-model="showBin" title="移到回收站" footer-hide>
      <p style="padding:10px;font-size:15px;">一旦将项目「{{ this.binName }}」移到回收站，所有与项目有关的信息将会被移到回收站，其中的内容也不会被统计和搜索收录，需要去回收站恢复后才能继续使用。</p>
      <div class="doBtn">
        <Button type="error" @click="okHuishou">移到回收站</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Clipboard from "clipboard";
import CreateProject from "./CreateProject.vue";
import projectSetNew from "./projectSetNew.vue";
import messageAlert from "./messageAlert.vue";
import InviteMembers from "../components/public/InviteMembers.vue";
import Loading from "../components/public/common/Loading.vue";
import chooseTemplate from "./chooseTemplate";
import { mapActions, mapState, mapMutations } from "vuex";
import { setStarProject, guidangProject, recycleProject, recoverProject, delProject, searchProjects, getProjectTree, roleJudgment, linkInvitation } from "@/axios/api";
export default {
  // name: "index",
  components: {
    CreateProject,
    projectSetNew,
    Loading,
    InviteMembers,
    messageAlert,
    chooseTemplate,
  },
  inject: ["reload"],
  data() {
    return {
      //用变量承接一下要传入modal的每个id或参数
      showBin: false, //显示回收站
      binName: "", //回收站项目名称
      binProjectId: "",
      cancelID: null,
      searchWords: "",
      isSearch: false,
      searchData: [],
      cancelStatus: null,
      searchLoading: false,
      recoverId: null,
      delId: null,
      delName: null,
      guiName: null,
      guiId: null,
      showproject: false,
      tabBox: false,
      guidangModal: false,
      cancelModal: false,
      modal3: false,
      modal4: false,
      projectSet: false,
      deleteList: [],
      projectdata: "",
      starProject: [], //我的收藏
      mineCreateProject: [], //我创建的
      participationProject: [], //我参与的
      guiDangList: [], //已归档
      delLIst: [], //回收站
      user: sessionStorage.userInfo,
      companyId: "",
      projectType: "全部项目",
      selectView: "卡片视图",
      treeData: [],
      projectList: [
        {
          value: "0",
          label: "全部项目",
        },
        {
          value: "1",
          label: "我创建的",
        },
        {
          value: "2",
          label: "我参与的",
        },
        {
          value: "3",
          label: "我的收藏",
        },
        {
          value: "4",
          label: "已归档",
        },
        {
          value: "5",
          label: "回收站",
        },
      ],
      spanLeft: 5,
      spanRight: 19,
      isCollapsed: true,
      moShi: "tupian",
      showInviteMembers: false,
      projectId: "", //邀请新成员时传的项目id
      showLink: false, //链接邀请弹窗
      linkText: "",
      tabValue: "0", //项目列表tab栏选中项
      menuActive: "1,0", //菜单栏选中项
      openNames: ["1"],
      linkLoading: false,
      linkExpireTime: "", //链接有效期
      messageAlert: false,
      messageType: "", // 消息提醒
    };
  },
  computed: {
    ...mapState("project", ["projects", "loading", "project", "header"], "app"),
    ...mapState("app", ["header"]),
    ...mapState("drawer", ["layoutConfig"]),
  },
  mounted() {
    document.cookie = "orgId" + "=" + localStorage.companyId + ";" + "path=/";
    document.cookie = "userId" + "=" + localStorage.userId + ";" + "path=/";
    this.$store.state.project.loading = true;
    this.companyId = localStorage.companyId;
  },
  created() {
    // if (this.$route.query.from == "tips") {
    //   this.messageAlert = true;
    //   this.messageType = 0;
    //   this.menuActive = "4,0";
    //   this.openNames = ["4"];
    // }
    this.openTag(this.$route.query.checkTagName);
  },
  methods: {
    ...mapActions("project", ["init", "updateProject", "openSet", "orgProjectInit"]),
    ...mapMutations("project", ["setName"]),
    // 选择项目类型
    selectProjectType(value) {
      this.projectType = value;
      this.$store.state.project.loading = true;

      this.orgProjectInit({
        id: this.companyId,
        type: value,
      });
    },
    inputMess(val) {
      this.projectList = this.projectList[1];
    },
    path(item) {
      this.setName(item.projectName);
      localStorage.projectName = item.projectName;
      this.$router.push(`/project/${item.projectId}/tasks/group/${item.groupId}`);
    },
    showMore() {
      this.tabBox = !this.tabBox;
    },
    setStar(id) {
      setStarProject(id).then((res) => {
        if (res.result == 1 && res.msg == "收藏成功") {
          this.$Message.success("星标成功!");
        } else {
          this.$Message.success("取消星标成功!");
        }
        //this.init("我创建的");
        this.orgProjectInit({
          id: this.companyId,
          type: this.projectType,
        });
      });
    },
    getNewList(value) {
      //this.init(value);
      this.orgProjectInit({
        id: this.companyId,
        type: value,
      });
      if (this.selectView === "列表视图") {
        getProjectTree("").then((res) => {
          this.treeData = res.data;
        });
      }
    },
    //打开项目设置
    setProject(item) {
      // roleJudgment(item.projectId).then(res => {
      //   if (res.data == 0) {
      this.openSet(item.projectId).then((res) => {
        this.projectSet = true;
      });
      //   } else {
      //     this.$Message.error('只有项目拥有者或管理员才可修改项目设置');
      //   }
      // });
    },
    recover(id) {
      recoverProject(id).then((res) => {
        if (res.result == 1) {
          this.$Message.success("项目已恢复!");
          //this.init(this.projectType);
          this.orgProjectInit({
            id: this.companyId,
            type: this.projectType,
          });
        }
      });
    },
    // 搜索项目
    searchProject(name) {
      let arr = {
        全部项目: "all",
        我创建的: "created",
        我参与的: "join",
        我的收藏: "star",
        已归档: "complete",
        回收站: "trash",
      };
      this.searchLoading = true;
      this.isSearch = true;
      searchProjects("", arr[name], this.companyId).then((res) => {
        this.searchLoading = false;
        this.searchData = res.data;
      });
    },
    searchNo() {
      if (this.searchWords == "") {
        this.searchData = [];
        this.isSearch = false;
      }
    },

    closeSettings: function(data) {
      this.projectSet = data;
    },
    //删除项目
    confirmHuishou: function(data) {
      this.showBin = true;
      this.binName = data.projectName;
      this.binProjectId = data.projectId;
    },
    okHuishou() {
      recycleProject(this.binProjectId).then((res) => {
        if (res.result == "1") {
          this.showBin = false;
        }
      });
    },
    // 卡片，列表视图切换
    changeView(data) {
      if (data === "列表视图") {
        getProjectTree("").then((res) => {
          this.treeData = res.data;
        });
      }
    },
    // 加载树形 子项目
    loadData(item, callback) {
      getProjectTree(item.id).then((res) => {
        callback(res.data);
      });
      setTimeout(() => {
        const data = [
          {
            title: "children",
            loading: false,
            children: [],
          },
          {
            title: "children",
            loading: false,
            children: [],
          },
        ];
      }, 1000);
    },
    collapsedSider() {
      this.isCollapsed = !this.isCollapsed;

      this.$store.commit("app/changeHeader", this.isCollapsed);
    },
    toggleClick() {
      if (this.spanLeft === 5) {
        this.spanLeft = 2;
        this.spanRight = 22;
      } else {
        this.spanLeft = 5;
        this.spanRight = 19;
      }
    },
    tabChange(name) {
      this.menuActive = "1," + name;

      this.searchLoading = true;
      let arr = ["全部项目", "我创建的项目", "我参与的项目", "星标项目", "已归档的项目", "回收站的项目"];
      console.log(arr[name]);
      this.projectType = arr[name];
      this.orgProjectInit({
        id: localStorage.companyId,
        type: arr[name],
      }).then((val) => {
        this.searchLoading = false;
      });
    },
    inviteMem(id) {
      this.showInviteMembers = true;
      this.projectId = id;
      this.linkLoading = true;
      linkInvitation(localStorage.companyId, id).then((res) => {
        this.linkLoading = false;
        if (res.result === 1) {
          this.linkExpireTime = res.data.expireTime;
          this.linkText = res.data.shortUrl;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    copyLinks() {
      var clipboard = new Clipboard(".copyBtn");
      clipboard.on("success", (e) => {
        this.$Message.info("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        console.log("该浏览器不支持自动复制");
        clipboard.destroy();
      });
    },
    openTag(tagName) {
      if (tagName.split(",")[0] == 2) {
        this.tabValue = tagName.split(",")[1];
        this.tabChange(tagName.split(",")[1]);
        this.messageAlert = false;
      } else if (tagName.split(",")[0] == 4) {
        this.messageAlert = true;
        this.messageType = tagName.split(",")[1];
      }
    },
    //设置中退出当前项目，退出后刷新项目里列表
    signOut(flag) {
      this.projectSet = flag;
      this.$store.state.project.loading = true;
      this.orgProjectInit({
        id: localStorage.companyId,
        type: "全部项目",
      });
    },
    // 主题暗色与亮色
    isSubMenuTheme() {
      let { subMenuTheme } = this.$store.state.drawer.layoutConfig;
      return subMenuTheme;
    },
  },
  watch: {
    $route: {
      handler() {
        this.openTag(this.$route.query.checkTagName);
        //深度监听，同时也可监听到param参数变化
      },
      deep: true,
    },
  },
};
</script>
<style lang="less">
@import "../assets/css/menu.less";
</style>
<style scoped lang="less">
.starOn {
  color: #ffaa31 !important;
}

.doBtn {
  padding: 15px 0;

  button {
    display: block;
    width: 90%;
    margin: 0 auto;
    font-size: 14px;
  }
}

.titleContent {
  display: flex;
  justify-content: space-between;
  color: #333333;
  margin-bottom: 9px;

  .accountInv {
    font-size: 16px;
  }

  .linkInv {
    color: #0077ff;
    cursor: pointer;
  }
}

.linkContent {
  margin: 10px 0 0;
  display: flex;

  .link-name {
    width: 75%;
    line-height: 36px;
    text-indent: 10px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    transition: border-color 0.3s ease-out;
    border: 1px solid #d9d9d9;
    border-right: none;
    background-color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .copyBtn {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background: #2db7f5;
    color: #ffffff;
    width: 25%;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
  }
}

.layouts-right {
  flex: 1;
  padding: 15px 24px;
  background: #fff;
  overflow-y: auto;
  position: relative;
  min-height: 100%;
  .btnContent {
    position: absolute;
    right: 24px;
    z-index: 99;

    i {
      margin-right: 16px;
      cursor: pointer;
    }

    .create {
      width: 110px;
      line-height: 32px;
      border-radius: 3px;
      border: 1px solid #0077ff;
      text-align: center;
      color: #0077ff;
      margin-top: -6px;
      cursor: pointer;

      i {
        margin-right: 5px;
        cursor: pointer;
      }
    }
  }

  .titleRow {
    line-height: 45px;
    padding: 0 20px;
    background-color: #f0f0f0;

    .ivu-col:not(:first-child) {
      text-align: center;
    }

    .member-name {
      padding-left: 47px;
    }

    .branch {
      margin-top: 0;
    }

    a {
      color: #333333;
    }
  }

  .ant-list-item {
    padding: 1em 20px;
    /* border-bottom: 1px solid #e5e4e5; */
    color: #333333;

    .info-title {
      display: flex;
      flex-flow: row nowrap;
      line-height: 24px;

      img {
        width: 50px;
        height: 50px;
        border-radius: 3px;
        margin-right: 1em;
      }

      .contant {
        display: flex;

        .proName {
          color: #333333;
        }

        .level {
          cursor: pointer;
          height: 22px;
          line-height: 20px;
          color: #52c41a;
          background: #f6ffed;
          border-color: #b7eb8f;
          margin-left: 1em;
          border: 1px solid #aee884;
          padding: 0 5px;
          border-radius: 4px;
        }
      }

      .proDes {
        color: #979797;
      }
    }

    .info-item {
      display: flex;
      align-items: center;
      justify-content: center;
      /* height: 100%; */
    }

    .info-icon {
      i {
        cursor: pointer;
        padding: 0 0.3em;
        border-right: 1px solid #e5e4e5;
        color: #999999;
      }

      i:last-child {
        border-right: none;
      }
    }
  }

  .col {
    // width: 100%;
    // height: 128px;
    width: 230px;
    height: 116px;
    border-radius: 4px;
    box-shadow: 0 0 0 rgba(56, 56, 56, 0.6);
    transition: all 0.218s ease;
    color: #fff;
    cursor: pointer;
    background-color: #fff;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    margin-bottom: 20px;

    .projectName {
      font-size: 16px;
    }

    &.add-project {
      // color: rgb(19, 19, 19);
      color: #a6a6a6;

      h1 {
        margin-top: 18px;
      }
    }

    &.add-project:hover {
      color: #3da8f5;
    }

    .iconPic {
      position: absolute;
      top: 9px;
      right: 5px;
      width: 40px;

      i {
        color: #ddd;
      }

      i:hover {
        color: #fff;
      }

      .iconpic1 {
        display: none;
      }

      .iconpic2 {
        display: none;
      }

      .showStar {
        display: inline-block;
      }
    }

    &:hover .iconpic1 {
      display: inline-block;
    }

    &:hover .iconpic2 {
      display: inline-block;
    }

    .zzc {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: 4px;
      padding: 8px 16px;
      transition: all 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .noList {
    margin-top: 10%;

    img {
      display: block;
      width: 135px;
      height: 90px;
      margin: 8px auto 16px;
    }

    p {
      text-align: center;
      color: #333333;
    }
  }
}

.messageAlert {
  padding: 0;
}

.setPro-modal {
  /deep/.ivu-modal {
    top: calc((100vh - 545px) / 2);
  }
}
</style>
