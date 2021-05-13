<template>
  <div class="file-tools">
    <div class="left">
      <div class="pull-box">
        <div class="pull" @click="showAddFolder = true">
          <img src="../../../assets/images/wjj.png" alt="" />
          <span>新建文件夹</span>
        </div>
      </div>
      <div class="pull-box">
        <upload-file-card :uploadList="uploadList" @close="handleRemove"></upload-file-card>
        <Upload ref="upload" :show-upload-list="false" :before-upload="handleBeforeUpload" :action="host"
                :data="uploadData" :on-success="handleSuccess" multiple>
          <div class="pull">
            <img src="../../../assets/images/view6.png" alt="" />
            <span>上传</span>
          </div>
        </Upload>
      </div>
      <div class="pull-box" v-show="toolsShow">
        <div class="pull" @click="downLoad">
          <img src="../../../assets/images/view9.png" alt="" />
          <span>下载</span>
        </div>
        <!-- <div class="pull clear-border">
                            <img src="../../../assets/images/view5.png" alt="">
                            <span>分享</span>
                          </div> -->
        <div class="pull clear-border" @click="removeClone('移动')">
          <img src="../../../assets/images/view12.png" alt="" />
          <span>移动</span>
        </div>
        <div class="pull clear-border" @click="removeClone('复制')">
          <img src="../../../assets/images/view13.png" alt="" />
          <span>复制</span>
        </div>
        <div class="pull clear-border"  @click="rublish = true;modalTitle = '移到回收站'">
          <img src="../../../assets/images/view8.png" alt="" />
          <span>移入回收站</span>
        </div>
      </div>
    </div>
    <div class="right">
      <!-- 缩放 -->
      <!-- <Poptip placement="bottom" width="204">
        <div class="view"><img src="../../../assets/images/view11.png" alt="" /></div>
        <div class="silder-box" slot="content">
          <Slider class="silder" v-model="sliderValue" :max="64" :tip-format="hideFormat"></Slider>
        </div>
      </Poptip> -->

      <!-- 排序 -->
      <!-- <Poptip placement="bottom" >
                  <div class="view" ><img src="../../../assets/images/view1.png" alt=""></div>
                  <div class="view-pop" slot="content">
                          <ul>
                            <li v-for="(item,index) in sortList" :key='index'>
                              <img v-show='item.src' :src="item.src" alt=""> 
                              {{item.name}}
                            </li>
                          </ul>
                  </div>
                </Poptip> -->
      <!-- 列表 -->
      <div class="view" @click="changeView('list')">
        <Tooltip placement="top" transfer content="列表">
          <img src="../../../assets/images/view3.png" alt="" />
        </Tooltip>
      </div>
      <!-- 缩略图 -->
      <div class="view " @click="changeView('view')">
        <Tooltip placement="top" transfer content="缩略图">
          <img src="../../../assets/images/view2.png" alt="" />
        </Tooltip>
      </div>
    </div>
    <!-- <Modal v-model="showModelFile" title="上传模型文件" class-name="file-vertical-center-modal" :width="500" transfer footer-hide>
      <model-file @close="showModelFile = false" :fileId="createFileId"></model-file>
    </Modal> -->
    
    <!--创建文件夹 模态框-->
    <Modal v-model="showAddFolder" :footer-hide="true" title="创建文件夹" class-name="file-vertical-center-modal" :width="350">
      <Input v-model="folderName" placeholder="请输入文件夹名称" class="folderName" ref="input" @keyup.enter.native="handleSave" />
      <div>
        <Button type="info" long @click="handleSave">确定</Button>
      </div>
    </Modal>
    <Modal v-model="rublish" :width="350" :footer-hide="true">
      <div class="rublish">
        <p>您确定要把该文件移到回收站吗？</p>
        <Button long type="error" @click="putRecyclebin">移到回收站</Button>
      </div>
    </Modal>
    <!--复制、移动 模态框-->
    <Modal v-model="showMove" class-name="vertical-center-modal" width="800" @on-visible-change="changeVisible" class="show-move">
      <div slot="header">
        <span style="font-size:18px">{{ caozuo }}文件/文件夹至</span>
      </div>
      <div class="move-and-mobile-file">
        <div class="column-projects flex-static thin-scroll">
          <div class="project-title">项目</div>
          <ul>
            <li
              v-for="(project, index) in projects"
              :key="index"
              :class="{ selected: project.projectId == mProjectId, unselected: project.projectId != mProjectId }"
              @click="changeProject(project.projectId)"
            >
              <span>{{ project.projectName }}</span>
            </li>
          </ul>
        </div>
        <div class="picker-column thin-scroll flex-fill flex-vert">
          <Loading v-show="loading1"></Loading>
          <tree :data="mFileTree" ref="tree"></tree>
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
  </div>
</template>
<script>
import modelFile from "@/components/project/file/model.vue"; //上传模型文件
import tree from "@/components/project/newFile/Tree_move.vue"; //树
import { mapState, mapActions, mapMutations } from "vuex";
import { createFolder, getProjectList } from "../../../axios/api.js";
import { oss } from "../../../axios/ossweb.js";
import { uploadCommonFile } from "../../../axios/api2.js";
import { removeFile, cloneFile, recycleBin, checkPerm, checkdownload } from "../../../axios/fileApi.js";
export default {
  components: {
    commonFile: resolve => require(["../file/commonfile.vue"], resolve),
    modelFile,
    tree
  },
  data() {
    return {
      pullList: [
        { name: "上传普通文件", src: require("../../../assets/images/view6.png") },
        { name: "上传模型文件", src: require("../../../assets/images/view6.png") }
      ],
      sortList: [
        { name: "名称", src: require("../../../assets/images/view10.png") },
        { name: "类型" },
        { name: "大小" },
        { name: "修改时间" },
        { name: "递增", src: require("../../../assets/images/view10.png") },
        { name: "递减" }
      ],
      thisFileId: "",
      showModelFile: false,
      showmodelMove: false, //移动弹窗
      moveTitel: "",
      visibleTip: false,
      sliderValue: 21,
      fileId: this.$route.params.fileId,
      projectId: this.$route.params.id,
      showAddFolder: false, //新建文件夹
      folderName: "",
      rublish: false,
      modalTitle: "文件菜单",
      showMove: false,
      projects: [],
      loading1: false,
      asyncData: [],
      footerTxt: "跨项目移动时，部分信息不会被保留。",
      caozuo: "",
      mProjectId: this.$route.params.id,
      uploadData: {},
      host: "",
      dirName: 'upload/file/',
      uploadList: [],
      uploadFiles:[]
    };
  },
  computed: {
    ...mapState("tree", ["fileTree", "showView", "slider", "mFileTree"]),
    ...mapState("file", ["files", "fileIds", "createFileId", "toolsShow","crumbs"]),
    
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    ...mapActions("tree", ["changeShowView", "changeSlider", "initMTree"]),
    ...mapActions("file", ["initFile", "searchFile", "initTag"]),
    ...mapMutations("file", ["changeToolsShow"]),

    handleRemove() {
      this.$refs.upload.clearFiles();
      this.uploadList = [];
    },

    async handleBeforeUpload(file) {
      let result = await checkPerm();
      if (result == 0) {
          this.$Message.error(res.msg);
          return false;
      } else {
        var dir = this.dirName + this.$moment().format('YYYY-MM-DD') + "/";
        return oss(dir, file.name).then(res => {
            this.host = res.host;
            this.uploadData = res;
            this.uploadList =this.$refs.upload.fileList;
            var myfile = {};
            myfile.fileName = file.name;
            myfile.fileUrl = res.key;
            myfile.size = this.renderSize(file.size);
            myfile.ext = file.name.substr(file.name.indexOf("."),file.name.length);
            myfile.level = this.crumbs.length;
            myfile.parentId = this.createFileId
            this.uploadFiles.push(myfile);
        });
      }
    },
    handleSuccess(res, file) {
      this.uploadServer();
    },
    uploadServer() {
      let params = { projectId: this.projectId, files: JSON.stringify(this.uploadFiles) };
      uploadCommonFile(this.createFileId, params).then(res => {
        if (res.result === 1) {
          this.uploadFiles = [];
        }
      });
    },

    changeView(data) {
      this.$emit("recovery");
      this.changeShowView(data);
    },
    // 缩放
    hideFormat() {
      this.changeSlider(this.sliderValue);
      return null;
    },
    //移动
    move() {
      this.showmodelMove = true;
      this.moveTitel = "移动文件至";
    },
    //创建文件夹
    handleSave() {
      if (this.folderName == null || this.folderName == "") {
        this.$Notice.warning({ title: "请输入文件夹名称" });
        this.$refs.input.focus();
        return false;
      }
      let params = { projectId: this.projectId,folderName: this.folderName };
      createFolder(this.createFileId, params).then(res => {
        if (res.result == 1) {
          this.$Notice.success({ title: "创建成功" });
          this.showAddFolder = false;
          this.folderName = "";
          this.$emit("createFolder", this.createFileId);
        }
      });
    },
    // 下载
    downLoad() {
      checkdownload().then(res => {
        if (res.result == 0) {
          this.$Message.error(res.msg);
        } else {
          var fileIds = this.fileIds.join(",");
          console.log(this.fileIds);
          var url = "";
          if (process.env.NODE_ENV == "test") {
            url = process.env.VUE_APP_TEST_URL;
          } else if (process.env.NODE_ENV == "production") {
            url = process.env.VUE_APP_URL;
          } else {
            url = "/api";
          }
          // window.location.href = url + "/files/batch/download?fileIds=" + fileIds;
          window.open(url + "/files/batch/download?fileIds=" + fileIds,"下载")
        }
      });
    },
    //点击 移动、复制文件
    removeClone(caozuo) {
      this.caozuo = caozuo;
      this.showMove = true;
      this.footerTxt = "跨项目移动时，部分信息不会被保留。";
    },
    // 移动、复制文件的确定按钮
    removeCloneFile() {
      var folderId = this.$refs.tree.getFolderId();
      if (this.caozuo === "移动") {
        console.log(JSON.stringify(this.fileIds));
        removeFile(folderId, this.fileIds.join(","), this.createFileId, this.mProjectId, this.projectId).then(res => {
          if (res.result == 1) {
            this.$Message.success("移动成功");
            this.showMove = false;
            this.changeToolsShow(false);
          }
        });
      } else if (this.caozuo === "复制") {
        cloneFile(folderId, this.fileIds.join(","), this.mProjectId, this.projectId).then(res => {
          if (res.result == 1) {
            this.$Message.success("复制成功");
            this.showMove = false;
            this.changeToolsShow(false);
          }
        });
      }
    },
    // 移到回收站
    putRecyclebin() {
      recycleBin(this.fileIds.join(","), this.projectId).then(res => {
        if (res.result == 1) {
          this.changeToolsShow(false);
          this.$emit("removeFolder", this.fileIds);
          //重置文件选中状态
          this.$emit("recovery");
          this.$Message.success("成功移到回收站");
          this.popHid();
        }
      });
    },
    popHid() {
      setTimeout(() => {
        this.rublish = false;
      }, 300);
    },
    // 移动、赋值文件框打开关闭
    changeVisible(bool) {
      if (bool) {
        this.projectId = this.$route.params.id;
        this.initMTree(this.projectId);
        this.projectList();
      } else {
        this.projects = [];
        this.items = [];
      }
    },
    // 获取项目列表
    projectList() {
      getProjectList(localStorage.companyId).then(res => {
        if (res.result == 1) {
          this.projects = res.data;
        }
      });
    },

    // 改变选择的项目
    changeProject(projectId) {
      this.loading1 = true;
      this.items = [];
      this.mProjectId = projectId;
      this.initMTree(projectId).then(res => {
        this.loading1 = false;
      });
    },
    // 取消 移动复制
    cancelRemoveClone() {
      this.showMove = false;
    }
  }
};
</script>
<style lang="less">
.file-tools {
  width: 100vm;
  height: 35px;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    .pull-box {
      margin-right: 10px;
      .pull {
        float: left;
        height: 24px;
        line-height: 24px;
        display: flex;
        border: 1px solid #dddddd;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
          margin: 3px 10px;
        }
        span {
          margin-right: 15px;
        }
        .pull-icon {
          width: 32px;
          height: 22px;
          border: none;
          border-left: 1px solid #dddddd;
          margin-left: 10px;
          background: #fff;
          cursor: pointer;
          img {
            width: 8px;
            height: 5px;
          }
        }
        .pull-pop {
          li {
            display: flex;
            align-items: center;
            margin: 5px 0px;
          }
        }
      }
      .clear-border {
        border-left: none;
      }
    }
  }
  .right {
    margin-right: 10px;
    .view {
      cursor: pointer;
      float: right;
      padding: 4px 5px 2px;
      border: 1px solid #dddddd;
    }
    .silder-box {
      padding-left: 10px;
    }
    .view-pop {
      li {
        cursor: pointer;
        line-height: 25px;
        position: relative;
        padding-left: 30px;
        img {
          position: absolute;
          left: 0;
          top: 5px;
        }
      }
    }
    .silder {
      width: 150px;
    }
  }
}

.folderName {
  width: 320px;
  margin-bottom: 15px;
  margin-top: 5px;
  margin-left: 0px;
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
</style>
