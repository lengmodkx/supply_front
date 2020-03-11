<template>
  <div class="file-contant" v-if="files != null">
    <Row class="file-list" v-if="files.length > 0" type="flex" justify="start">
      <Col class="file-list-col" v-for="(file, index) in files" :key="index" span="3" 
      :class="{ selectedcol: selected == index }" @click.native="fileDetail(file, index)">
        <Icon type="ios-checkbox" class="ios-check" size="28" color="#a5a5a5" :class="{ showIcon: selected == index }" @click.native.stop="iosCheck(file,index)" />
        <div class="img-box">
          <img v-if="file.catalog == 1 && file.filePrivacy == 0" src="../../../assets/images/folder.png" />
          <img v-else-if="file.catalog == 1 && file.filePrivacy == 1" src="../../../assets/images/folder_privacy.png" />
          <div v-else class="fileThumbnail-box">
            <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
            <img v-else-if="imageExt.indexOf(file.ext) > -1" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileUrl}`" />
            <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" />
            <img v-else-if="'.doc'.includes(file.ext) || '.docx'.includes(file.ext)" src="@/icons/img/word.png" />
            <img v-else-if="'.xls'.includes(file.ext) || '.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" />
            <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" />
            <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" />
            <img v-else-if="'.zip'.includes(file.ext) || '.rar'.includes(file.ext)" src="@/icons/img/zip.png" />
            <img v-else src="@/icons/img/moren.png" />
          </div>
        </div>
        <Tooltip :content="file.fileName" placement="top" transfer v-if="file.catalog == 1">
          <div class="file-name">{{ file.fileName }}</div>
        </Tooltip>
        <Tooltip :content="file.fileName + file.ext" placement="top" transfer v-if="file.catalog == 0" max-width="250">
          <div style="display:flex;justify-content: center">
            <div class="file-name">{{ file.fileName }}</div>
            <div>{{ file.ext }}</div>
          </div>
        </Tooltip>
      </Col>
    </Row>

    <div v-else class="no-files">
      <Icon type="md-folder" />
      <p>暂无内容</p>
    </div>

    <Modal title="上传模型文件" v-model="showModel" class-name="file-vertical-center-modal" :width="500" transfer footer-hide>
      <model ref="model" @close="showModel = false" :fileId="fileId"></model>
    </Modal>
    <Modal v-model="showCommon" title="上传普通文件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
      <common-file v-if="showCommon" @close="showCommon = false" :fileId="fileId" :projectId="projectId"></common-file>
    </Modal>
    <!--创建文件夹 模态框-->
    <Modal v-model="showAddFolder" :footer-hide="true" title="创建文件夹" class-name="file-vertical-center-modal" :width="350">
      <Input v-model="folderName" placeholder="请输入文件夹名称" class="folderName" ref="input" @keyup.enter.native="handleSave" />
      <div>
        <Button type="info" long @click="handleSave">确定</Button>
      </div>
    </Modal>
    <!--复制、移动 模态框-->
    <Modal v-model="showMove" :z-index="11111" class-name="vertical-center-modal" width="800" @on-visible-change="changeVisible" class="show-move">
      <div slot="header">
        <span style="font-size:18px">移动文件{{ fileName }}至</span>
      </div>
      <div class="move-and-mobile-file">
        <div class="column-projects flex-static thin-scroll">
          <div class="project-title">项目</div>
          <ul>
            <li
              v-for="(project, index) in projects"
              :key="index"
              :class="{ selected: project.projectId == projectId, unselected: project.projectId != projectId }"
              @click="changeProject(project.projectId)"
            >
              <span>{{ project.projectName }}</span>
            </li>
          </ul>
        </div>
        <div class="picker-column thin-scroll flex-fill flex-vert">
          <Loading v-show="loading1"></Loading>
          <v-jstree :data="asyncData" show-checkbox :multiple="false" whole-row @item-click="itemClick" ref="jstree" children-field-name="children"></v-jstree>
        </div>
      </div>
      <div slot="footer" class="move-footer">
        <span>{{ footerTxt }}</span>
        <div class="move-footer-btn">
          <Button type="default" size="large" @click="cancelRemoveClone">取消</Button>
          <Button type="primary" size="large" @click="removeCloneFile">确定</Button>
        </div>
      </div>
    </Modal>

    <!--模型文件详情-->
    <Modal class="nopadding" v-model="showModelFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
      <!-- <modelFileDetail :url="svfUrl" v-if="showModelFileDetail"></modelFileDetail> -->
      <iframe :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/viewer-offline.html?path=${svfUrl}`" style="width:100vw;height:100vh" v-if="showModelFileDetail"></iframe>
    </Modal>
    <!--文件夹 可见性设置 模态框-->
    <Modal v-model="showVisibilityModal" :z-index="2000" :footer-hide="true" class-name="vertical-center-modal" width="600" class="can-see-modal">
      <fileCanSee v-if="showVisibilityModal"></fileCanSee>
    </Modal>
    <Modal v-model="fileMenu" :styles="{ left: left, top: top }" width="250" :footer-hide="true" :mask-closable="true" v-if="mFile" class="mf0">
      <div slot="header" class="file-menu-header">
        <Icon
          @click="
            rublish = false;
            showFileEdit = false;
          "
          type="ios-arrow-back"
          size="18"
          v-if="rublish == true || showFileEdit == true"
        />
        <span>{{ modalTitle }}</span>
      </div>
      <div>
        <div v-show="rublish" class="rublish">
          <p>您确定要把该文件移到回收站吗？</p>
          <Button long type="error" @click="putRecyclebin(mFile)">移到回收站</Button>
        </div>
        <div v-show="showFileEdit" class="rublish">
          <div class="rublish-input">
            <Input v-model.trim="editFileName" />
          </div>
          <Button long type="primary" @click="fileEdit(mFile.fileId)">确定</Button>
        </div>
        <div v-show="!rublish && !showFileEdit">
          <section v-if="mFile.catalog" class="file-folder-opt">
            <ul>
              <li @click="removeClone('移动')">移动文件夹</li>
              <li @click="removeClone('复制')">复制文件夹</li>
              <li @click="rublish = true">移到回收站</li>

              <li @click="setCanSee">可见性设置</li>
            </ul>
          </section>
          <section v-else class="file-folder-opt">
            <ul>
              <li @click="downLoad(mFile.fileId)"><a style="color: #333" :download="mFile.fileName">下载文件</a></li>
              <li @click="removeClone('移动')">移动文件</li>
              <li @click="removeClone('复制')">复制文件</li>
              <li
                @click="
                  showFileEdit = true;
                  modalTitle = '修改文件名称';
                "
              >
                修改文件名称
              </li>
              <li>复制文件链接</li>
              <li @click="collectFile">收藏文件</li>
              <li
                @click="
                  rublish = true;
                  modalTitle = '移到回收站';
                "
              >
                移到回收站
              </li>
            </ul>
          </section>
          <div class="footer">
            <div class="footer-left">
              <i class="ivu-icon ivu-icon-unlocked"></i>
              <div class="footer-privacy-text" @click="changePrivacy()">
                <span>隐私模式</span>
                <span v-if="mFile.filePrivacy == '1'">仅参与者可见</span>
                <span v-else>所有成员可见</span>
              </div>
            </div>
            <span v-if="mFile.filePrivacy == '1'" style="color:#3da8f5;margin-right:5px" @click="changePrivacy()">已开启</span>
            <span v-else style="color:#3da8f5;margin-right:5px" @click="changePrivacy()">已关闭</span>
          </div>
        </div>
      </div>
    </Modal>
    <!--文件详情-->
    <Modal v-model="showModelDetai" fullscreen :footer-hide="true" class-name="model-detail">
      <sucaiDetail @close="closeDetail" :file="curFile" v-if="showModelDetai"></sucaiDetail>
    </Modal>
  </div>
</template>
<script>
import sucaiDetail from "../../public/sucaiDetail.vue";
import model from "../file/model.vue";
import commonFile from "../file/commonfile.vue";
import fileDetail from "../file/fileDetail";
import modelFileDetail from "../file/modelFileDetail";
import fileCanSee from "../file/fileCanSee";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getFileDetails, getChildFiles, putImportant } from "@/axios/fileApi";
import { changeName, downloadFile, jionPeople, removeFile, cloneFile, recycleBin, filePrivacy } from "@/axios/fileApi";
import { files, createFolder, getProjectList, folderChild, collect } from "../../../axios/api.js";
import VJstree from "vue-jstree";
var timer = null;
export default {
  inject: ["reload"],
  components: {
    model,
    commonFile: resolve => require(["../file/commonfile.vue"], resolve),
    VJstree,
    fileDetail,
    modelFileDetail,
    fileCanSee,
    sucaiDetail
  },
  data() {
    return {
      isactive: -1,
      data: [],
      modalTitle: "文件菜单",
      fileMenu: false,
      menuId: null,
      show: true,
      paixu: "",
      asyncData: [],
      curtag: "",
      showIcon: null,
      showFileEdit: false,
      editFileName: "",
      view: "view",
      showModel: false,
      showModelDetai: false,
      showCommon: false,
      showAddFolder: false,
      visible: false,
      showMove: false,
      menu1Show: false,
      menu2Show: false,
      showVisibilityModal: false,
      folderName: "",
      fileId: this.$route.params.fileId,
      projectId: this.$route.params.id,
      isPrivacy: 1,
      privacyTxt: "所有成员可见",
      privacyStatus: "未开启",
      footerTxt: "跨项目移动时，部分信息不会被保留。",
      isActive: false,
      isNotActive: true,
      fileName: "",
      projects: [],
      items: [],
      catalog: 0,
      indeterminate: true,
      checkAll: false,
      top: 0,
      left: 0,
      fileIdParam: "",
      fileData: null,
      loading: true,
      caozuo: "",
      folderId: "",
      menuShow: false,
      rublish: false,
      thisFileId: "",
      searchData: [],
      searched: "",
      pathData: [
        {
          name: "项目文件夹",
          id: this.$route.params.fileId
        }
      ],
      showModelFileDetail: false,
      svfUrl: "",
      loading1: false,
      mFile: null,
      curFile: {},
      imageExt: [".gif", ".GIF", ".jpg", ".JPG", ".JPEG", ".png", ".PNG", ".bmp", ".BMP"],
      selected: -1
    };
  },
  watch: {
    $route(to, from) {
      this.reload();
    },
    file: {
      handler: function(val, oldVal) {},
      deep: true
    },

    treeData: {
      handler: function(val, oldVal) {},
      deep: true
    }
    // curtag: {
    //   handler: function(value, oldValue) {
    //     console.log(value);
    //     this.searched = "";
    //     if (value != "") {
    //       let data = { tag: value };
    //       this.searchFile(data).then(res => {
    //         this.loading = false;
    //       });
    //     }
    //   },
    //   deep: true
    // }
  },
  computed: {
    ...mapState("file", ["files", "filePath", "treeData", "tags", "breadcrumb", "itemfile", "createFileId"]),
    ...mapState("tree", ["slider"])
  },
  mounted: function() {
    if (localStorage.view) {
      this.view = localStorage.view;
    }
    this.files.forEach(v => {
      this.$set(v, "selected", true);
    });
    console.log(this.files);
  },
  created() {
    let params = { fileId: this.createFileId };
    this.initFile(params).then(res => {
      this.loading = false;
    });
    this.initTag(this.projectId).then(res => {});
  },
  methods: {
    ...mapActions("file", ["initFile", "initFolders", "searchFile", "initTag", ]),
    ...mapMutations("file", ["putOneFile","changeToolsShow","initItem"]),
    iosCheck(file,index) {
      this.selected = index;
      this.initItem(file);
      this.changeToolsShow(true);
      this.thisFileId = file.fileId
    },
    leftShow() {},
    setCanSee() {
      this.showVisibilityModal = true;
      this.rublish = false;
    },
    // 获取当前文件id
    getFileid(e, file) {
      this.mFile = file;
      this.top = e.clientY + "px";
      this.left = e.clientX - 125 + "px";
      this.fileMenu = true;
      this.rublish = false;
      this.showFileEdit = false;
    },
    closeDetail() {
      this.showModelDetai = false;
    },
    // 标记为重要文件
    setImp(id, important) {
      let lable = 0;
      if (important) {
        lable = 0;
      } else {
        lable = 1;
      }
      putImportant(id, lable).then(res => {
        this.$Message.success("操作成功!");
      });
    },
    // 选择排序方式
    selectPaixu(value) {
      if (value === "按时间降序") {
        let params = {
          fileId: this.fileId,
          orderType: 1
        };
        this.initFile(params).then(res => {
          this.loading = false;
        });
      } else if (value === "按下载量") {
        let params = {
          fileId: this.fileId,
          orderType: 2
        };
        this.initFile(params).then(res => {
          this.loading = false;
        });
      }
    },
    // 选择标签
    selectTag(value) {
      let data = {
        tag: value,
        projectId: this.projectId
      };
      this.searchFile(data).then(res => {
        this.loading = false;
      });
    },
    // 搜索文件
    search(value) {
      this.curtag = "";
      if (value !== "") {
        this.loading = true;
        var data = { fileName: value, projectId: this.projectId };
        this.searchFile(data).then(res => {
          this.loading = false;
        });
      } else {
        let params = { fileId: this.fileId };
        this.initFile(params).then(res => {
          this.loading = false;
        });
      }
    },
    //文件下载
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
        this.rublish = false;
        this.showFileEdit = false;
      }, 300);
    },
    popShow(id) {
      this.menuId = id;
    },
    handleSave() {
      //创建文件夹
      if (this.folderName == null || this.folderName == "") {
        this.$Notice.warning({
          title: "请输入文件夹名称"
        });
        this.$refs.input.focus();
        return false;
      }
      let params = {
        projectId: this.projectId,
        folderName: this.folderName
      };
      createFolder(this.fileId, params).then(res => {
        if (res.result == 1) {
          this.$Notice.success({
            title: "创建成功"
          });
          this.showAddFolder = false;
          this.folderName = "";
        }
      });
    },

    showFileChoose(data) {
      if (data === "model") {
        this.showModel = !this.showModel;
      } else {
        this.showCommon = !this.showCommon;
      }
    },
    // download() {
    //   window.location.href = `http://192.168.1.103:8080/files/${
    //     this.fileIdParam
    //   }/download`;
    // },
    // 收藏文件
    collectFile() {
      let data = {
        projectId: this.projectId,
        publicId: this.fileId,
        collectType: "文件"
      };
      collect(data).then(res => {
        if (res.result) {
          this.$Message.success("收藏成功");
        }
      });
    },
    // 点击 上面文件夹的路径
    whereGo(i, n) {
      this.loading = true;
      this.pathData.splice(n + 1);
      getChildFiles(i.id).then(res => {
        this.$store.commit("file/initFile", res.data);
        this.loading = false;
        localStorage.fileParentId = res.parentId;
      });
    },
    // 选中要移动到哪
    treeClick(node) {
      this.folderId = node.data.id;

      let params = { fileId: this.folderId };
      // this.initFile(params).then(res => {
      //   this.loading = false;
      // });
      this.$router.push({
        path: `/project/${this.$route.params.id}/files/${this.folderId}`
      });
      let data = { fileId: this.folderId, projectId: this.projectId };
      this.initFolders(data).then(res => {});
    },
    // 选中要移动到哪
    breadcrumbClick(id) {
      this.folderId = id;
      let params = { fileId: this.folderId };
      this.initFile(params).then(res => {
        this.loading = false;
      });
      let data = { fileId: id, projectId: this.projectId };
      this.initFolders(data).then(res => {});
    },
    dfileDetail(file, index, catalog) {
      //双击只对文件夹操作
      clearTimeout(timer);
      if (".svf".includes(file.ext)) {
        getFileDetails(file.fileId).then(res => {
          console.log(res.data.fileUrl);
          this.svfUrl = res.data.fileUrl;
          this.showModelFileDetail = true;
        });
        console.log("模型文件");
      } else {
        if (catalog == 1) {
          //文件夹
          this.$store.commit("file/changeCreateFileId", file.fileId); //重点改变fileId
          this.$store.commit("file/crumbsAdd", file);
          this.fileId = file.fileId;
          getChildFiles(file.fileId).then(res => {
            this.$store.commit("file/initFile", res.data);
            localStorage.fileParentId = this.fileId;
          });
        } else {
          //文件
          this.showModelDetai = true;
          this.curFile = file;
          console.log("文件", catalog);
        }
      }
    },
    // 点击文件、文件夹进入详情
    fileDetail(file, index) {
      if (file.catalog == 1) {
        //文件夹
        this.$store.commit("file/changeCreateFileId", file.fileId); //重点改变fileId
        this.$store.commit("file/crumbsAdd", file);
        this.fileId = file.fileId;
        getChildFiles(file.fileId).then(res => {
          this.$store.commit("file/initFile", res.data);
          localStorage.fileParentId = this.fileId;
        });
      } else {
        //文件
        if (file.ext!=null&&".svf"===file.ext) {
          getFileDetails(file.fileId).then(res => {
            console.log(res.data.fileUrl);
            this.svfUrl = res.data.fileUrl;
            this.showModelFileDetail = true;
          });
        }else{
          this.showModelDetai = true;
          this.curFile = file;
        }
      }
    },
    // 隐私模式
    changePrivacy() {
      let num = 0;
      if (this.mFile.filePrivacy == "0") {
        num = 1;
        this.mFile.filePrivacy = 1;
      } else {
        num = 0;
        this.mFile.filePrivacy = 0;
      }
      filePrivacy(this.mFile.fileId, num).then(res => {
        console.log(res);
      });
    },
    showMore(fileName, fileId, catalog) {
      this.fileName = fileName;
      this.catalog = catalog;
      if (catalog == 0) {
        this.menu1Show = !this.menu1Show;
      } else {
        this.menu2Show = !this.menu2Show;
      }
    },
    // 移到回收站
    putRecyclebin() {
      console.log(this.thisFileId, this.projectId);

      recycleBin(this.thisFileId, this.projectId).then(res => {
        if (res.result) {
          this.$Message.success("成功移到回收站");
          this.popHid();
        }
      });
    },
    copyFile() {
      this.showMove = true;
      this.footerTxt = "跨项目复制时，部分信息不会被保留。";
    },

    itemClick(node) {},
    // 取消 移动复制
    cancelRemoveClone() {
      this.folderId = "";
      this.showMove = false;
    },
    //点击 移动、复制文件
    removeClone(caozuo) {
      console.log("xxxxxxxxxxx");
      this.caozuo = caozuo;
      this.showMove = true;
      this.footerTxt = "跨项目移动时，部分信息不会被保留。";
      this.asyncData = [this.$refs.jstree.initializeLoading()];
      folderChild(this.projectId).then(res => {
        console.log(res.data);
        this.asyncData = res.data;
        this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
      });
    },
    // 移动、复制文件的确定按钮
    removeCloneFile() {
      if (this.caozuo === "移动") {
        removeFile(this.folderId, this.thisFileId, this.projectId).then(res => {
          if (res.result) {
            this.$Message.success("移动成功");
            this.showMove = false;
          }
        });
      } else if (this.caozuo === "复制") {
        cloneFile(this.folderId, this.thisFileId).then(res => {
          this.$Message.success("复制成功");
          this.showMove = false;
        });
      }
    },
    // 获取项目列表
    projectList() {
      getProjectList().then(res => {
        if (res.result == 1) {
          this.projects = res.data;
        }
      });
    },
    // 移动、赋值文件框打开关闭
    changeVisible(bool) {
      if (bool) {
        this.projectId = this.$route.params.id;
        this.projectList();
      } else {
        this.projects = [];
        this.items = [];
      }
    },
    // 改变选择的项目
    changeProject(projectId) {
      this.loading1 = true;
      this.items = [];
      this.projectId = projectId;
      folderChild(this.projectId).then(res => {
        this.asyncData = res.data;
        this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
        this.loading1 = false;
      });
    },
    //文件修改名
    fileEdit(id) {
      if (this.editFileName == "") {
        this.$Message.info("请输入名称");
      }
      changeName(id, this.editFileName).then(res => {
        this.showFileEdit = false;
        this.$Message.info("修改名称成功");
        this.editFileName = "";
      });
    }
  }
};
</script>
<style lang="less">
.selectedcol {
  border: 2px solid #1b9aee !important;
}
.showIcon {
  display: block !important;
  color: #1b9aee !important;
}
.file-contant {
  height: calc(100vh - 87px);
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  .file-list {
    .file-list-col {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      cursor: pointer;
      padding-bottom: 10px;
      border: 1px solid #e5e5e5;
      margin-right: 15px;
      margin-bottom: 15px;
      height: 140px;
      justify-content: center;
      &:hover {
        .ios-check {
          display: block;
        }
      }
      /deep/ .ivu-tooltip {
        width: 120px;
      }
      .file-name {
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 20px;
        text-align: center;
        overflow: hidden;
      }
      .ios-check {
        position: absolute;
        top: 0px;
        left: 0px;
        display: none;
      }
      .img-box {
        display: flex;
        padding-bottom: 20px;
        .file-content-opt {
          width: 18px;
          height: 18px;
          position: absolute;
          display: flex;
          width: 25px;
          height: 25px;
          right: 5px;
          top: 5px;
        }

        img {
          display: block;
          width: 64px;
          height: 52px;
        }
        .fileThumbnail-box img {
          display: block;
          width: 60px;
          height: 60px;
        }
      }
    }
  }
}
// 弹框
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
      .ivu-btn {
        display: none;
      }
    }
    &:hover .ivu-btn {
      display: block;
    }
  }
}
.ivu-checkbox-large .ivu-checkbox-inner {
  width: 24px;
  height: 24px;
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
.picker-column {
  display: flex;
  flex-direction: column;
  min-width: 0%;
  background-color: #fff;
}
.flex-fill {
  flex: 1 1 auto;
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
  padding: 10px;
  .rublish-input {
    margin-bottom: 10px;
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
.mf0 {
  /deep/ .ivu-modal-body {
    padding: 0;
  }
  /deep/ .ivu-modal-footer {
    padding: 0;
  }
  /deep/ .ivu-modal {
    margin: 0;
  }
  /deep/ .ivu-modal-mask {
    display: none;
  }
}
.footer {
  padding-top: 5px;
  padding-bottom: 5px;
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
.file-menu-header {
  text-align: center;
  i {
    position: absolute;
    left: 10px;
  }
}
</style>
