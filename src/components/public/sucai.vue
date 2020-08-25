<template>
  <div style="background:#fff">
    <Loading v-if="loading"></Loading>
    <div class="material-file">
      <div class="picker-column material-fill">
        <tree :data="fileTree" ref="tree" @init="init"></tree>
      </div>
      <Divider type="vertical" class="divide"></Divider>
      <div class="file-view-wrap fade in">
        <div class="file-header">
          <div class="left">
            <button class="move" @click="back"></button>
            <!--后退 -->
            <button class="back" @click="forward"></button>
          </div>
          <div class="middle">
            <span @click="home"><img src="../../assets/images/03.png" alt=""/></span>
            <ul class="crumbs">
              <li v-for="(item, index) in crumbs" :key="index" @click="changeCrumbs(item, index)">
                {{ item.fileName }}
                <a> </a>
              </li>
            </ul>
          </div>
          <div class="right">
            <Input search enter-button v-model="searched" @on-search="search" placeholder="请输入搜索" />
          </div>
        </div>
        <div class="input-box">
          <div class="icon-box">
            <Icon type="ios-apps" @click="view = 'view'" />
            <Icon type="md-list" @click="view = 'list'" />
          </div>
        </div>
        <div class="main-content">
          <ul v-if="view === 'view'" class="view-file-box">
            <li v-for="(file, index) in allFile" :key="index" @click="goNext(file.catalog, file.fileId, file)" :class="{ cur: file.catalog }">
              <Icon class="xiazai" v-if="!file.catalog" @click.stop="downLoad(file.fileId)" type="md-cloud-download" />
              <div class="top-img" :data-id="file.fileId" v-if="file.catalog">
                <div class="down-img">
                  <span>已下载</span>
                </div>
                <img src="@/assets/images/folder.png" />
              </div>
              <div class="top-img" :data-id="file.fileId" v-else>
                <div class="down-img">
                  <span>已下载</span>
                </div>
                <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
                <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" alt="" />
                <img v-else-if="'.doc'.includes(file.ext) || '.docx'.includes(file.ext)" src="@/icons/img/word.png" alt="" />
                <img v-else-if="'.xls'.includes(file.ext) || '.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" alt="" />
                <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" alt="" />
                <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" alt="" />
                <img v-else-if="'.zip'.includes(file.ext) || '.rar'.includes(file.ext)" src="@/icons/img/zip.png" alt="" />
                <img v-else src="@/icons/img/moren.png" alt="" />
              </div>
              <p class="bottom-font">
                <Poptip trigger="hover" :content="file.fileName" placement="bottom">
                  {{ file.fileName }}
                </Poptip>
              </p>
            </li>
          </ul>
          <!--列表模式-->
          <ul v-if="view === 'list'" class="list-file-box">
            <div class="list-file-title">
              <span>名称</span>
              <span>大小</span>
              <span>创建者</span>
              <span>更新时间</span>
            </div>
            <li v-for="(file, index) in allFile" :key="index" @click="goNext(file.catalog, file.fileId, file)">
              <div class="list-file-part">
                <div class="list-file-img" :data-id="file.fileId" v-if="file.catalog">
                  <div class="down-img">
                    <span>已下载</span>
                  </div>
                  <img src="@/assets/images/folder.png" />
                </div>
                <div class="list-file-img" :data-id="file.fileId" v-else>
                  <div class="down-img">
                    <span>已下载</span>
                  </div>
                  <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
                  <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" alt="" />
                  <img v-else-if="'.doc'.includes(file.ext) || '.docx'.includes(file.ext)" src="@/icons/img/word.png" alt="" />
                  <img v-else-if="'.xls'.includes(file.ext) || '.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" alt="" />
                  <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" alt="" />
                  <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" alt="" />
                  <img v-else-if="'.zip'.includes(file.ext) || '.rar'.includes(file.ext)" src="@/icons/img/zip.png" alt="" />
                  <img v-else src="@/icons/img/moren.png" alt="" />
                </div>
                <Poptip trigger="hover" :content="file.fileName" placement="bottom">
                  <p>{{ file.fileName }}</p>
                </Poptip>
              </div>
              <div class="list-file-part">{{ file.size }}</div>
              <div class="list-file-part">平台</div>
              <div class="list-file-part">{{ file.updateTime | timeFilter }}</div>
              <div class="list-file-part opeart-icon" @click.stop="downLoad(file.fileId)" v-if="file.catalog==0">
                <Icon type="md-arrow-down" />
              </div>
            </li>
          </ul>
          <div v-if="allFile">
            <div v-show="allFile.length == 0" class="no-files">
              <Icon type="md-folder" />
              <p>暂无内容</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="showModelDetai" fullscreen :footer-hide="true" class-name="model-detail">
      <sucaiDetail @close="closeDetail" :type="'素材'" v-if="showModelDetai"></sucaiDetail>
    </Modal>
  </div>
</template>
<script>
import sucaiDetail from "./sucaiDetail";
import { getSuCaiTreeDate, getSucai, getSucaiSearch, getMaterialTree } from "../../axios/fileApi";
import tree from "@/components/public/fodderTree.vue"; //树
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      orderType: false,
      showModelDetai: false,
      searched: "",
      treeLoading: true,
      loading: true,
      showModel: false,
      showCommon: false,
      fileId: "ef6ba5f0e3584e58a8cc0b2d28286c93",
      projectId: "",
      showAddFolder: false,
      folderName: "",
      loading1: false,
      wjj: 0,
      allFile: [],
      total: 0,
      pageNum: 1,
      view: "view",
      searchFont: "",
      isSearch: false,
      searchData: [],
      opearteShow: "文件菜单",
      fileName: "",
      treeData: [],
      flagTree: false,
      treeId: "",
      page: 0,
      curFile: {},
      fileTree: [],
    };
  },
  components: {
    sucaiDetail,
    tree,
  },
  mounted() {
    this.init(this.fileId);
  },
  computed: {
    ...mapState("tree", ["showView"]),
    ...mapState("materialfile", ["crumbs", "crumbsCache", "crumbsIndex", "createFileId"]),
  },

  created() {
    this.treeInit();
  },
  methods: {
    ...mapActions("file", ["putOneFile"]),
    back() {
      if (this.crumbsIndex == 1) {
        console.log("后退终止");
        return;
      }
      this.$store.commit("materialfile/crumbsBack");
      //刷新页面
      this.init(this.createFileId);
    },
    forward() {
      if (this.crumbsIndex >= this.crumbsCache.length) {
        console.log("前进终止");
        return;
      }
      this.$store.commit("materialfile/crumbsForward");
      //刷新页面
      this.init(this.createFileId);
    },
    home() {
      this.$store.commit("materialfile/crumbsHome");
      this.init(this.fileId);
    },
    changeCrumbs(item, index) {
      console.log(item);
      var data = {
        self: item,
        index: index,
      };
      this.$store.commit("materialfile/crumbsClick", data);
      this.init(item.id);
    },

    //关闭详情
    closeDetail() {
      this.showModelDetai = false;
    },
    treeInit() {
      getMaterialTree().then((res) => {
        this.fileTree = res.data;
      });
    },
    // 初始化 页面信息和分页
    init(fileId) {
      getSucai(fileId, this.pageNum, this.orderType).then((res) => {
        if (res.result == 1) {
          this.loading = false;
          this.allFile = res.data.records;
          this.searched = "";
        }
      });
    },
    // 搜索文件
    search(value) {
      if (value !== "") {
        this.loading = true;
        getSucaiSearch(value, this.pageNum).then((res) => {
          if (res.result == 1) {
            this.loading = false;
            this.allFile = res.data;
          }
        });
      } else {
       this.init(this.fileId);
      }
    },

    // 点击的是文件夹
    goNext(type, fileId, file) {
      if (type == 1) {
        this.init(fileId);
        this.flagTree = false;
      } else {
        this.showModelDetai = true;
        this.putOneFile(fileId);
      }
    },

    // 下载文件
    downLoad(fileId) {
      var url = "";
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_URL;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_URL;
      } else {
        url = "/api";
      }
      window.location.href = url + "/files/" + fileId + "/download";
    },
    popHid() {
      setTimeout(() => {
        this.opearteShow = "文件菜单";
      }, 300);
    },
  },
};
</script>
<style scoped lang="less">
@import "./file";
.main-content {
  width: 100%;
  display: flex;
  position: relative;
  height: calc(100vh - 220px);
  overflow: auto;
}
@media screen and (max-width: 1440px) {
  .main-content {
    min-height: calc(100vh - 480px);
  }
}

.bth-box {
  display: flex;
  margin-bottom: 40px;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  button {
    margin-right: 20px;
  }
  .search-file {
    width: 400px;
    margin-left: -250px;
  }
  .icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      color: gray;
      margin-left: 15px;
      cursor: pointer;
    }
    .now-view {
      color: #2d8cf0;
    }
  }
}
.list-file-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .list-file-title {
    width: 90%;
    // height: 50px;
    display: flex;
    span {
      height: 100%;
      line-height: 50px;
      font-size: 14px;
      text-align: center;
      width: 15%;
    }
    span:nth-of-type(1) {
      width: 40%;
      text-align: left;
    }
  }
  li {
    width: 90%;
    height: 60px;
    border-bottom: 1px solid #e5e5e5;
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #f5f5f5;
      .opeart-icon {
        display: flex;
      }
    }
    .list-file-part {
      text-align: center;
      width: 15%;
      display: flex;
      align-items: center;
      justify-content: center;
      .list-file-img {
        position: relative;
        width: 55px;
        height: 55px;
        margin-right: 10px;
        flex: none;
        img {
          width: 64px;
          height: 52px;
        }

        .down-img span {
          display: none;
          position: absolute;
          background: #ffffff;
          z-index: 999;
          border-radius: 3px;
          color: #3f9dd7;
          font-size: 70%;
          padding: 2px 4px 0;
          bottom: 5px;
          left: 5px;
          line-height: 1.4;
          -ms-transform: rotate(7deg);
          -webkit-transform: rotate(7deg);
          transform: rotate(7deg);
          -webkit-transition: 0 0.1s ease-in;
          -moz-transition: 0 0.1s ease-in;
          -o-transition: 0 0.1s ease-in;
          transition: transform 0.1s ease-in;
        }
        .down-img-show span {
          display: block;
          position: absolute;
          background: #ffffff;
          z-index: 999;
          border-radius: 3px;
          color: #3f9dd7;
          font-size: 70%;
          padding: 2px 4px 0;
          bottom: 5px;
          left: 5px;
          line-height: 1.4;
          -ms-transform: rotate(7deg);
          -webkit-transform: rotate(7deg);
          transform: rotate(7deg);
          -webkit-transition: 0 0.1s ease-in;
          -moz-transition: 0 0.1s ease-in;
          -o-transition: 0 0.1s ease-in;
          transition: transform 0.1s ease-in;
        }
      }
      p {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .list-file-part:nth-of-type(1) {
      width: 40%;
      text-align: left;
      justify-content: left;
    }
    .opeart-icon {
      display: none;
      i {
        font-size: 20px;
        &:hover {
          color: #2db7f5;
        }
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .list-file-box {
    max-height: 460px;
    overflow-x: auto;
  }
}

.view-file-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  // height: 430px;
  .cur {
    cursor: pointer;
  }
  li {
    width: 165px;
    height: 200px;
    margin-right: 16px;
    list-style: none;
    position: relative;
    &:hover {
      .deletes {
        display: block;
      }
      .xiazai {
        z-index: 99999;
        display: block;
      }
    }
    .xiazai {
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 24px;
      cursor: pointer;
      color: gray;
      display: none;
      &:hover {
        color: #3da8f5;
      }
    }
    .poptip {
      position: absolute;
      top: 2px;
      right: 2px;
    }
    .deletes {
      display: none;
      cursor: pointer;
      &:hover {
        color: #2db7f5;
      }
      /*i{*/
      /*cursor: pointer;*/
      /*font-size: 20px;*/
      /*color: #2db7f5;*/
      /*&:hover{*/
      /*color: #ed4014;*/
      /*}*/
      /*}*/
    }
    .top-img {
      position: relative;
      width: 165px;
      height: 165px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e5e5e5;
      img {
        max-width: 90%;
        max-height: 90%;
      }
      .down-img span {
        display: none;
        position: absolute;
        background: #3f9dd7;
        z-index: 999;
        border-radius: 3px;
        color: #fff;
        font-size: 70%;
        padding: 2px 4px 0;
        bottom: 10px;
        left: 10px;
        line-height: 1.4;
        -ms-transform: rotate(7deg);
        -webkit-transform: rotate(7deg);
        transform: rotate(7deg);
        -webkit-transition: 0 0.1s ease-in;
        -moz-transition: 0 0.1s ease-in;
        -o-transition: 0 0.1s ease-in;
        transition: transform 0.1s ease-in;
      }

      .down-img-show span {
        display: block;
        position: absolute;
        background: #3f9dd7;
        z-index: 999;
        border-radius: 3px;
        color: #fff;
        font-size: 70%;
        padding: 2px 4px 0;
        bottom: 10px;
        left: 10px;
        line-height: 1.4;
        -ms-transform: rotate(7deg);
        -webkit-transform: rotate(7deg);
        transform: rotate(7deg);
        -webkit-transition: 0 0.1s ease-in;
        -moz-transition: 0 0.1s ease-in;
        -o-transition: 0 0.1s ease-in;
        transition: transform 0.1s ease-in;
      }
    }
    .bottom-font {
      margin-top: 5px;
      height: 30px;
      width: 100%;
      font-size: 12px;
      line-height: 30px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @media screen and (max-width: 1440px) {
    li {
      width: 106px;
      height: 150px;
      .top-img {
        width: 106px;
        height: 106px;
      }
      .bottom-font {
        margin-top: 5px;
        height: 30px;
        width: 106px;
        font-size: 12px;
        line-height: 30px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.opearte-list p {
  width: 100%;
  height: 30px;
  padding: 0 8px;
  line-height: 30px;
  cursor: pointer;
  color: #333;
  &:hover {
    background-color: #f5f5f5;
  }
}
.go-return {
  position: absolute;
  left: 0;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    color: #2db7f5;
  }
}
.view-file-box {
  /deep/ .ivu-poptip-body {
    padding: 8px 0 !important;
  }
}
.change-name {
  width: 170px;
  margin: 0 auto;
}

.input-box {
  float: right;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.icon-box {
  color: #2d8cf0;
  i {
    cursor: pointer;
    padding-left: 10px;
    line-height: 22px;
    font-size: 22px;
  }
}

.can-see-modal {
  /deep/ .ivu-modal-body {
    padding: 0 !important;
    height: 480px;
  }
}

.no-files {
  position: absolute;
  width: 100%;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: gray;
  i {
    font-size: 40px;
  }
  p {
    font-size: 14px;
    margin-top: 10px;
  }
}
.project-main {
  background: #f7f7f7;
}
.file-view-wrap {
  flex: 8;
  min-height: 300px;
  background-color: #ffffff;
  margin: 0 auto;
}

.fade.in {
  opacity: 1;
}
.fade {
  opacity: 0;
  transition: opacity 0.15s linear;
}
.material-header {
  height: 45px;
}
.file-header-title {
  font-size: 18px;
  line-height: 60px;
}
.file-header-add {
  float: right;
  line-height: 60px;
}
.file-header-add a {
  font-size: 16px;
  margin-left: 15px;
  .icon-file {
    margin-right: 5px;
    vertical-align: middle;
  }
}
.folder-add {
  border: 1px solid #e5e5e5;
  width: 164px;
  height: 164px;
  text-align: center;
  line-height: 164px;
  .icon-folder {
    font-size: 32px;
  }
}
.ivu-dropdown-menu {
  width: 180px;
}
.folderName {
  width: 320px;
  margin-bottom: 15px;
  margin-top: 10px;
  margin-left: 0px;
}
.file-operate {
  line-height: 60px;
}

.file-content-wrap {
  // display: flex;
  // flex-wrap: wrap;
  //justify-content: flex-start;
  height: calc(100vh - 250px);
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #e5e5e5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cecece;
  }
  li {
    float: left;
    height: 200px;
    position: relative;
    .important {
      position: absolute;
      font-size: 12px;
      bottom: 0;
      right: 0;
      transform: rotate(-45deg);
      z-index: 300;
      width: 26px;
      height: 26px;
      line-height: 30px;
      color: white;
      &:after {
        position: absolute;
        bottom: 2px;
        right: -7px;
        content: "";
        width: 0;
        height: 0;
        border-width: 20px;
        border-style: solid;
        z-index: -1;
        border-color: #ed4014 #ed4014 transparent transparent;
        transform: rotate(135deg);
      }
    }
  }
  .file-content-filename {
    height: 30px;
    margin-left: 20px;
    text-align: center;
    line-height: 30px;
    &:hover {
      background: #f7f7f7;
    }
  }
  .file-content-view {
    border: 1px solid #e5e5e5;
    height: 160px;
    width: 160px;
    margin-top: 20px;
    margin-left: 20px;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    img {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .file-content-view-checkbox {
      position: absolute;
      left: 3px;
      display: block;
    }
    .ivu-icon-folder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .file-content-opt {
      position: absolute;
      display: flex;
      width: 25px;
      height: 25px;
      top: 0;
      right: 0;
      justify-content: space-between;
      i {
        display: none;
      }
    }
    &:hover i {
      display: block;
    }
  }
}
.ivu-checkbox-large .ivu-checkbox-inner {
  width: 24px;
  height: 24px;
}
.footer {
  .footer-left {
    display: flex;
  }

  display: flex;
  justify-content: space-between;
  .footer-privacy-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .ivu-icon {
    margin-right: 10px;
  }
}

.file-handler {
  height: 40px;
  font-size: 14px;
  padding-left: 15px;
  line-height: 40px;
  &:hover {
    background: #f7f7f7;
  }
}
.optactive {
  display: block;
  position: absolute;
  bottom: 0;
  width: 160px;
  height: 25px;
  text-align: center;
  .arrow_down {
    margin-right: 10px;
  }
  svg {
    width: 20px;
    height: 20px;
  }
}
.move-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.move-and-mobile-file {
  display: flex;
}
.flex-static {
  flex-shrink: 0;
}
.column-projects {
  width: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 438px;
  border-right: 1px solid #e5e5e5;
  .project-title {
    font-size: 14px;
    color: gray;
    font-weight: 700;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
  }
  .project-list {
    height: 30px;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    line-height: 30px;
    padding-left: 14px;
  }
}
.selected {
  background: #3da8f5;
  color: white;
  height: 30px;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  line-height: 30px;
  padding-left: 10px;
}
.unselected {
  &:hover {
    background: #eee;
  }
  height: 30px;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  line-height: 30px;
  padding-left: 10px;
}

.file-folder-opt {
  li {
    height: 35px;
    line-height: 35px;
    padding-left: 10px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background: #e5e5e5;
    }
  }
}

.menu-file-title {
  height: 40px;
  line-height: 40px;
}
.menu-file {
  margin-right: 15px;
  i {
    cursor: pointer;
    font-size: 20px;
    &:hover {
      color: #3da8f5;
    }
  }
  /deep/ .ivu-poptip-body {
    padding: 0;
  }
  .footer {
    padding-top: 10px;
    border-top: 1px solid #e5e5e5;
    .footer-left {
      display: flex;
    }

    display: flex;
    justify-content: space-between;
    .footer-privacy-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .ivu-icon {
      margin-right: 10px;
    }
  }
}
.rublish {
  padding-bottom: 15px;
  .rublish-input {
    margin: 15px 0;
  }
  .rublish-header {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e5e5e5;
    i {
      color: grey;
      font-size: 20px;
      font-weight: 400;
      cursor: pointer;
    }
  }
  p {
    margin: 15px 0;
    font-size: 14px;
  }
}
.nopadding {
  /deep/ .ivu-modal-body {
    padding: 0;
  }
  /deep/ .ivu-modal-close {
    z-index: 999999;
  }
}
.finish-down {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: fixed;
  bottom: 30px;
  right: 30px;
  text-align: center;
  line-height: 60px;
  color: #2d8cf0;
  border: 2px solid #2d8cf0;
}
.file-header {
  width: 100vm;
  height: 52px;
  padding: 10px;
  background-image: linear-gradient(#fff, #f3f3f3);
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  .left {
    width: 65px;
    button {
      width: 32px;
      height: 32px;
      border: 1px solid #dddddd;
    }
    button:hover {
      box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
    }
    .move {
      background: #fff url("~@/assets/images/01.png") no-repeat center;
      background-size: 10px;
    }
    .back {
      background: #fff url("~@/assets/images/02.png") no-repeat center;
      background-size: 10px;
      border-left: none;
    }
    .button-disable {
      box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
    }
  }
  .middle {
    flex: 1;
    margin: 0px 100px 0px 30px;
    border: 1px solid #ddd;
    display: flex;
    line-height: 32px;
    span {
      display: block;
      background: #fafafa;
      width: 35px;
      height: 28px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #dddddd;
      cursor: pointer;
    }
    span:hover {
      background: #e4f8ff;
    }
    span:first-child {
      border-left: none;
      border-right: 1px solid #dddddd;
    }
    .crumbs {
      flex: 1;
      display: flex;
      overflow: hidden;
      li {
        display: flex;
        align-items: center;
        background: #f2f2f2;
        cursor: pointer;
        padding-left: 10px;
        img {
          padding: 10px 10px 10px 0;
        }
      }
      a {
        display: block;
        width: 14px;
        height: 28px;
        background: url("~@/assets/images/06.png") no-repeat center;
      }
      li:last-child a {
        background: url("~@/assets/images/07.png") no-repeat center;
      }
    }
  }
  .right {
    float: right;
    width: 200px;
    margin-right: 10px;
  }
}
</style>
