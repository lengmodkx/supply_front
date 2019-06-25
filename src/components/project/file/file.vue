<template>
  <div class="file">
    <div :class="show?'file-side-show':'file-side'">
      <v-jstree :data="treeData" @item-click="treeClick"></v-jstree>
    </div>
    <div class="file-button" @click='show=!show'>
      <div class="root__3UYM" :class="show?'left':'right'">
        <i class="left__1DdF"></i>
        <i class="indicator__1TO8"></i>
      </div>
    </div>

    <div class="file-view-wrap fade in">
      <header class="file-header">
        <div class="file-header-title">
          <!-- <span v-show='breadcrumb.length' @click="breadcrumbClick(item.fileId)" v-for="(item) in breadcrumb" :key="item.fileId">{{item.fileName}}＞</span> -->
          项目文件
        </div>
        <div class="file-header-add">
          <a href="javascript:void(0)" @click="showAddFolder=!showAddFolder">
            <Icon type="plus-circled" class="icon-file" size="20"></Icon>创建文件夹
          </a>
          <Dropdown trigger="click" class="upload-file" @on-click="showFileChoose($event)">
            <a href="javascript:void(0)">
              <Icon type="plus-circled" class="icon-file" size="20"></Icon>上传
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="model">上传模型文件</DropdownItem>
              <DropdownItem name="commonfile">上传普通文件</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </header>

      <div class="input-box" style="padding:10px 20px 10px 20px;">
        <div class="input-box-left">
          <Input search enter-button placeholder="请输入文件名搜索" style="width:500px;margin-right:20px;" @on-search="search" v-model="searched" />
          <Select v-model="curtag" style="width:200px">
            <Option v-for="item in tags" :value="item.tagId" :key="item.tagId">
              <div class="circle" :style="`background-color:${item.bgColor}`"></div>
              {{ item.tagName }}
            </Option>
          </Select>
        </div>
        <div class="icon-box">
          <Icon type="ios-apps" @click="view='view'" />
          <Icon type="ios-list" @click="view='list'" />
        </div>
      </div>
      <Loading v-if="loading"></Loading>

      <!--正常展示-->
      <ul class="file-content-wrap" v-else-if="files.length && view=='view'" :key="fileId">
        <li v-for="(file,index) in files" :key="index" @click="fileDetail(file.catalog,file.fileId, file)">
          <div class="file-content-view">
            <img v-if="file.catalog==1&&file.filePrivacy==1" src='../../../assets/images/folder.png' style="height:64px;width:80px">
            <img v-else-if="file.catalog==1&&(file.filePrivacy==1||file.filePrivacy==2)" src='../../../assets/images/folder.png' style="height:64px;width:80px">
            <img v-else-if="file.catalog==1&&file.filePrivacy==0" src='../../../assets/images/folder_privacy.png' style="height:64px;width:80px">
            <div v-else style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center">
              <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
              <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" alt="">
              <img v-else-if="'.doc'.includes(file.ext)||'.docx'.includes(file.ext)" src="@/icons/img/word.png" alt="">
              <img v-else-if="'.xls'.includes(file.ext)||'.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" alt="">
              <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" alt="">
              <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" alt="">
              <img v-else-if="'.zip'.includes(file.ext)||'.rar'.includes(file.ext)" src="@/icons/img/zip.png" alt="">
              <img v-else src="@/icons/img/moren.png" alt="">
            </div>
            <div @click.stop class="file-content-opt" v-if="file.filePrivacy!=2">
              <p></p>
              <Poptip class="menu-file" width="250" :transfer="true" @on-popper-hide="popHid">
                <Icon @click="getFileid(file.fileId,file.fileName)" type="ios-arrow-down" class="mr0" />
                <div slot="content">
                  <div v-show="rublish" class="rublish">
                    <div class="rublish-header">
                      <Icon @click="rublish=false" type="ios-arrow-back" />
                      移到回收站
                      <!--<Icon @click="menuShow=false" type="ios-close" />-->
                      <span></span>
                    </div>
                    <p>您确定要把该文件移到回收站吗？</p>
                    <Button long type="error" @click="putRecyclebin">移到回收站</Button>
                  </div>
                  <div v-show="showFileEdit" class="rublish">
                    <div class="rublish-header">
                      <Icon @click="showFileEdit=false" type="ios-arrow-back" />
                      修改文件名称
                      <span></span>
                    </div>
                    <div class="rublish-input">
                      <Input v-model.trim="editFileName" />
                    </div>
                    <Button long type="primary" @click='fileEdit(file.fileId)'>确定</Button>
                  </div>

                  <div v-show="!rublish&&!showFileEdit">
                    <div class="menu-file-title" style="text-align:center;font-size:16px">
                      <span>文件菜单</span>
                    </div>
                    <section v-if="file.catalog" class="file-folder-opt">
                      <ul>
                        <li @click="removeClone('移动')">移动文件夹</li>
                        <li @click="removeClone('复制')">复制文件夹</li>
                        <li @click="rublish=true">移到回收站</li>
                        <li @click="rublish=true">可见性设置</li>
                        <li @click="setCanSee">可见性设置</li>
                      </ul>
                    </section>
                    <section v-else class="file-folder-opt">
                      <ul>
                        <li><a style="color: #333" :download="file.fileName" @click="downLoad(file.fileId)">下载文件</a></li>
                        <li @click="removeClone('移动')">移动文件</li>
                        <li @click="removeClone('复制')">复制文件</li>
                        <li @click="showFileEdit=true">修改名称</li>
                        <li>复制文件链接</li>
                        <li @click="collectFile">收藏文件</li>
                        <li @click="rublish=true">移到回收站</li>
                      </ul>
                    </section>
                    <div class="footer">
                      <div class="footer-left">
                        <i class="ivu-icon ivu-icon-unlocked"></i>
                        <div class="footer-privacy-text" @click="changePrivacy(file.fileId,file.filePrivacy)">
                          <span>隐私模式</span>
                          <span v-if="file.filePrivacy=='0'">仅参与者可见</span>
                          <span v-else>所有成员可见</span>
                        </div>
                      </div>
                      <span v-if="file.filePrivacy=='0'" style="color:#3da8f5" @click="changePrivacy(file.fileId,file.filePrivacy)">已开启</span>
                      <span v-else style="color:#3da8f5" @click="changePrivacy(file.fileId,file.filePrivacy)">已关闭</span>
                    </div>
                  </div>

                </div>
              </Poptip>
            </div>
          </div>
          <div class="file-content-filename" v-if="file.catalog==1">{{file.fileName}}</div>
          <div class="file-content-filename" v-if="file.catalog==0">{{file.fileName.substr(0,10)+file.ext}}</div>
        </li>
      </ul>
      <!-- 列表展示 -->
      <div class="file-list" v-else-if="files.length && view=='list'" :key="fileId">
        <div class="titel">
          <span>名称</span>
          <span>大小</span>
          <span>创建者</span>
          <span>更新时间</span>
        </div>

        <ul class="contant">
          <li v-for="(file,index) in files" :key="index">
            <div class="contant-left" @click="fileDetail(file.catalog,file.fileId, file)">
              <div class="contant-titel">
                <img v-if="file.catalog==1&&file.filePrivacy==1" src='../../../assets/images/folder.png'>
                <img v-else-if="file.catalog==1&&(file.filePrivacy==1||file.filePrivacy==2)" src='../../../assets/images/folder.png'>
                <img v-else-if="file.catalog==1&&file.filePrivacy==0" src='../../../assets/images/folder_privacy.png'>
                <div v-else>
                  <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
                  <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" alt="">
                  <img v-else-if="'.doc'.includes(file.ext)||'.docx'.includes(file.ext)" src="@/icons/img/word.png" alt="">
                  <img v-else-if="'.xls'.includes(file.ext)||'.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" alt="">
                  <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" alt="">
                  <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" alt="">
                  <img v-else-if="'.zip'.includes(file.ext)||'.rar'.includes(file.ext)" src="@/icons/img/zip.png" alt="">
                  <img v-else src="@/icons/img/moren.png" alt="">
                </div>
                <span v-if="file.catalog==1 ">{{file.fileName}}</span>
                <span v-if="file.catalog==0">{{file.fileName.substr(0,10)+file.ext}}</span>

              </div>
              <div class="contant-erery">
                {{file.size||"无"}}
              </div>
              <div class="contant-erery">{{file.memberName||"无"}}</div>
              <div class="contant-erery">{{file.updateTime | formatDate}}</div>
            </div>
            <!-- <div class="file-edit" v-show="showFileEdit==index">
                <Input v-model.trim="editFileName" @on-enter='fileEdit(file.fileId)' />
              </div> -->
            <div class="contant-right">
              <Icon type="md-arrow-down" @click="downLoad(file.fileId)" />
              <!-- <Icon type="ios-exit" @click="removeClone('移动')" /> -->
            </div>
            <div @click.stop class="file-content-opt" v-if="file.filePrivacy!=2">
              <p></p>
              <Poptip class="menu-file" width="250" :transfer="true" @on-popper-hide="popHid">
                <Icon @click="getFileid(file.fileId,file.fileName)" type="ios-arrow-down" class="mr0" />
                <div slot="content">
                  <div v-show="rublish" class="rublish">
                    <div class="rublish-header">
                      <Icon @click="rublish=false" type="ios-arrow-back" />
                      移到回收站
                      <!--<Icon @click="menuShow=false" type="ios-close" />-->
                      <span></span>
                    </div>
                    <p>您确定要把该文件移到回收站吗？</p>
                    <Button long type="error" @click="putRecyclebin">移到回收站</Button>
                  </div>

                  <div v-show="showFileEdit" class="rublish">
                    <div class="rublish-header">
                      <Icon @click="showFileEdit=false" type="ios-arrow-back" />
                      修改文件名称
                      <span></span>
                    </div>
                    <div class="rublish-input">
                      <Input v-model.trim="editFileName" />
                    </div>

                    <Button long type="primary" @click='fileEdit(file.fileId)'>确定</Button>
                  </div>

                  <div v-show="!rublish&&!showFileEdit">
                    <div class="menu-file-title" style="text-align:center;font-size:16px">
                      <span>文件菜单</span>
                    </div>
                    <section v-if="file.catalog" class="file-folder-opt">
                      <ul>
                        <li @click="removeClone('移动')">移动文件夹</li>
                        <li @click="removeClone('复制')">复制文件夹</li>
                        <li @click="rublish=true">移到回收站</li>
                        <li @click="rublish=true">可见性设置</li>
                        <li @click="setCanSee">可见性设置</li>
                      </ul>
                    </section>
                    <section v-else class="file-folder-opt">
                      <ul>
                        <li><a style="color: #333" :download="file.fileName" @click="downLoad(file.fileId)">下载文件</a></li>
                        <li @click="removeClone('移动')">移动文件</li>
                        <li @click="removeClone('复制')">复制文件</li>
                        <li @click="showFileEdit=true">修改名称</li>
                        <li>复制文件链接</li>
                        <li @click="collectFile">收藏文件</li>
                        <li @click="rublish=true">移到回收站</li>
                      </ul>
                    </section>
                    <div class="footer">
                      <div class="footer-left">
                        <i class="ivu-icon ivu-icon-unlocked"></i>
                        <div class="footer-privacy-text" @click="changePrivacy(file.fileId,file.filePrivacy)">
                          <span>隐私模式</span>
                          <span v-if="file.filePrivacy=='0'">仅参与者可见</span>
                          <span v-else>所有成员可见</span>
                        </div>
                      </div>
                      <span v-if="file.filePrivacy=='0'" style="color:#3da8f5" @click="changePrivacy(file.fileId,file.filePrivacy)">已开启</span>
                      <span v-else style="color:#3da8f5" @click="changePrivacy(file.fileId,file.filePrivacy)">已关闭</span>
                    </div>
                  </div>

                </div>
              </Poptip>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="no-files">
        <Icon type="md-folder" />
        <p>暂无内容</p>
      </div>

      <Modal title="上传模型文件" v-model="showModel" class-name="file-vertical-center-modal" :width="500" transfer footer-hide>
        <model ref="model" @close="showModel=false" :fileId="fileId"></model>
      </Modal>
      <Modal v-model="showCommon" title="上传普通文件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
        <common-file @close="showCommon=false" :fileId="fileId" :projectId="projectId"></common-file>
      </Modal>
      <!--创建文件夹 模态框-->
      <Modal v-model="showAddFolder" :footer-hide="true" title="创建文件夹" class-name="file-vertical-center-modal" :width="350">
        <Input v-model="folderName" placeholder="请输入文件夹名称" class="folderName" ref="input" @keyup.enter.native="handleSave" />
        <div>
          <Button type="info" long @click="handleSave">确定</Button>
        </div>
      </Modal>
      <!--复制、移动 模态框-->
      <Modal v-model="showMove" :z-index=11111 class-name="vertical-center-modal" width="800" @on-visible-change="changeVisible" class="show-move">
        <div slot="header">
          <span style="font-size:18px">移动文件{{fileName}}至</span>
        </div>
        <div class="move-and-mobile-file">
          <div class="column-projects flex-static thin-scroll">
            <div class="project-title">项目</div>
            <ul>
              <li v-for="(project, index) in projects" :key="index" :class="{ selected:project.projectId==projectId,unselected:project.projectId!=projectId }" @click="changeProject(project.projectId)">
                <span>{{project.projectName}}</span>
              </li>
            </ul>
          </div>
          <div class="picker-column thin-scroll flex-fill flex-vert">
            <Loading v-show="loading1"></Loading>
            <v-jstree :data="asyncData" show-checkbox :multiple=false whole-row @item-click="itemClick" ref="jstree" children-field-name="child"></v-jstree>
          </div>

        </div>
        <div slot="footer" class="move-footer">
          <span>{{footerTxt}}</span>
          <div class="move-footer-btn">
            <Button type="default" size="large" @click="cancelRemoveClone">取消</Button>
            <Button type="primary" size="large" @click="removeCloneFile">确定</Button>
          </div>
        </div>
      </Modal>
      <!--文件详情-->
      <Modal v-model="showModelDetai" fullscreen :footer-hide="true" class-name="model-detail" :closable="false">
        <fileDetail @close="closeDetail" v-if="showModelDetai"></fileDetail>
      </Modal>
      <!--模型文件详情-->
      <Modal class="nopadding" v-model="showModelFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
        <!-- <modelFileDetail :url="svfUrl" v-if="showModelFileDetail"></modelFileDetail> -->
        <iframe :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/viewer-offline.html?path=${svfUrl}`" style="width:100vw;height:100vh" v-if="showModelFileDetail"></iframe>
      </Modal>
      <!--文件夹 可见性设置 模态框-->
      <Modal v-model="showVisibilityModal" :z-index=2000 :footer-hide="true" class-name="vertical-center-modal" width="600" class="can-see-modal">
        <fileCanSee v-if="showVisibilityModal"></fileCanSee>
      </Modal>
    </div>
  </div>

</template>
<script>
import model from "./model.vue";
import commonFile from "./commonfile.vue";
import fileDetail from "./fileDetail";
import modelFileDetail from "./modelFileDetail";
import fileCanSee from "./fileCanSee";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getFileDetails, getChildFiles } from "@/axios/fileApi";
import {
  changeName,
  downloadFile,
  jionPeople,
  removeFile,
  cloneFile,
  recycleBin,
  filePrivacy
} from "@/axios/fileApi";
import {
  files,
  createFolder,
  getProjectList,
  folderChild,
  collect
} from "../../../axios/api.js";
import VJstree from "vue-jstree";
export default {
  inject: ["reload"],
  components: {
    model,
    commonFile,
    VJstree,
    fileDetail,
    modelFileDetail,
    fileCanSee
  },
  data() {
    return {
      show: true,
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
      loading1: false
    };
  },
  watch: {
    $route(to, from) {
      this.reload();
    },
    file: {
      handler: function(val, oldVal) {
        console.log("file" + val);
      },
      deep: true
    },

    treeData: {
      handler: function(val, oldVal) {
        console.log(val, oldVal);
      },
      deep: true
    },
    curtag: {
      handler: function(value, oldValue) {
        console.log(value);
        this.searched = "";
        if (value != "") {
          let data = { tag: value };
          this.searchFile(data).then(res => {
            this.loading = false;
          });
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState("file", ["files", "filePath", "treeData", "tags", "breadcrumb"])
  },
  mounted: function() {
    console.log(">>>>>>>>", this.fileId);
    if (localStorage.view) {
      this.view = localStorage.view;
    }

    let params = { fileId: this.fileId };
    this.initFile(params).then(res => {
      this.loading = false;
    });
    let data = { fileId: this.fileId, projectId: this.projectId };

    this.initFolders(data).then(res => {});
    this.initTag(this.projectId).then(res => {});
  },
  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d;
    }
  },
  methods: {
    ...mapActions("file", ["initFile", "initFolders", "searchFile", "initTag"]),
    ...mapMutations("file", ["putOneFile"]),
    leftShow() {},
    setCanSee() {
      this.showVisibilityModal = true;
      this.rublish = false;
    },
    // 获取当前文件id
    getFileid(id, name) {
      this.thisFileId = id;
      this.editFileName = name;
    },
    closeDetail() {
      this.showModelDetai = false;
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
      window.location.href =
        process.env.NODE_ENV == "development"
          ? "/api/files/" + fileId + "/download"
          : process.env.VUE_APP_URL + "/files/" + fileId + "/download";
    },

    // menuShow(catalog, fileId, e) {
    //   if (catalog == 0) {
    //     this.menu1Show = true;
    //     this.menu2Show = false;
    //   } else {
    //     this.menu2Show = true;
    //     this.menu1Show = false;
    //   }
    //   this.top = e.clientY + "px";
    //   this.left = e.clientX + "px";
    //   this.fileIdParam = fileId;
    // },
    popHid() {
      setTimeout(() => {
        this.rublish = false;
        this.showFileEdit = false;
      }, 300);
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
      console.log(data);
      if (data === "model") {
        this.showModel = !this.showModel;
      } else {
        this.showCommon = !this.showCommon;
      }
    },
    download() {
      window.location.href = `http://192.168.1.103:8080/files/${
        this.fileIdParam
      }/download`;
    },
    // 收藏文件
    collectFile() {
      let data = {
        projectId: this.projectId,
        publicId: this.file.data.fileId,
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
      console.log(node.data.id);
      let params = { fileId: this.folderId };
      this.initFile(params).then(res => {
        this.loading = false;
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

    // 点击文件、文件夹进入详情
    fileDetail(catalog, id, file) {
      //获取目录
      let data = { fileId: id, projectId: this.projectId };
      this.initFolders(data).then(res => {});
      if (".svf".includes(file.ext)) {
        // 模型文件
        getFileDetails(id).then(res => {
          console.log(res.data.fileUrl);
          this.svfUrl = res.data.fileUrl;
          this.showModelFileDetail = true;
        });

        console.log(file);
      } else {
        // 普通文件或者文件夹
        if (catalog == 1) {
          this.loading = true;
          this.fileId = id;
          this.pathData.push({ name: file.fileName, id: file.fileId });
          getChildFiles(id).then(res => {
            console.log(res);
            this.$store.commit("file/initFile", res.data);
            this.loading = false;
            localStorage.fileParentId = res.parentId;
          });
          localStorage.view = this.view;
          this.$router.push({
            path: `/project/${this.$route.params.id}/files/${id}`
          });
        } else {
          this.loading = true;
          getFileDetails(id).then(res => {
            console.log(res);
            this.loading = false;
            this.putOneFile(res);
            this.showModelDetai = true;
          });
        }
      }
    },
    // 隐私模式
    changePrivacy(id, privacy) {
      let num = 0;
      if (privacy == "0") {
        num = 1;
      } else {
        num = 0;
      }
      filePrivacy(id, num).then(res => {
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
      this.caozuo = caozuo;
      this.showMove = true;
      this.footerTxt = "跨项目移动时，部分信息不会被保留。";
      this.asyncData = [this.$refs.jstree.initializeLoading()];
      folderChild(this.projectId).then(res => {
        this.asyncData = res.data;
        this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
      });
    },
    // 移动、复制文件的确定按钮
    removeCloneFile() {
      if (this.folderId) {
        if (this.caozuo === "移动") {
          removeFile(this.folderId, this.thisFileId, this.projectId).then(
            res => {
              if (res.result) {
                this.$Message.success("移动成功");
                this.showMove = false;
              }
            }
          );
        } else if (this.caozuo === "复制") {
          cloneFile(this.folderId, this.thisFileId).then(res => {
            this.$Message.success("复制成功");
            this.showMove = false;
          });
        }
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
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "./file";
.input-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .input-box-left {
    display: flex;
    .circle {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      float: left;
      margin: 5px 5px 0 0;
    }
  }
  .icon-box {
    color: #2d8cf0;
    line-height: 22px;
    font-size: 22px;
    i {
      cursor: pointer;
      padding-left: 10px;
    }
    i:last-child {
      font-size: 34px;
      font-weight: bold;
    }
  }
}

.can-see-modal {
  /deep/ .ivu-modal-body {
    padding: 0 !important;
    height: 480px;
  }
}

.no-files {
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
  width: 1000px;
  min-height: 500px;
  border-radius: 4px;
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
.file-header {
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 70px;
}
.file-header-title {
  font-size: 18px;
  line-height: 60px;
  float: left;
  display: flex;
  span {
    margin-right: 10px;
    cursor: pointer;
  }
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
    position: relative;
    border-radius: 5px;
    cursor: pointer;
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
// .tree-themeicon-custom{

// }
</style>


