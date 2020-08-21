<template>
  <div class="file-contant" v-if="files != null">
    <Row class="file-list" v-if="files.length > 0 && showView == 'view'" type="flex" :gutter="10" justify="start">
      <Col class="file-list-col" v-for="(file, index) in filesContent" :key="index" :xl="{ span: 3}" :xxl="{ span: 2}" @click.native="fileDetail(file, index)">
        <div class="img-box" :class="{ checked: fileArr.includes(file.fileId) }">
          <Icon type="ios-checkbox" class="ios-check" size="28"  :class="{ showIcon: fileArr.includes(file.fileId) }" @click.native.stop="iosCheck(file, index)" />
          <Button icon="ios-arrow-down" class="file-more_opt" :class="{ showIcon: isactive2 == index }" @click.stop="getFileid($event,file, index)"></Button>
          <img v-if="file.catalog == 1 && file.filePrivacy == 0" src="../../../assets/images/folder.png" />
          <img v-else-if="file.catalog == 1 && file.filePrivacy == 1" src="../../../assets/images/folder_privacy.png" />
          <suffix v-else class="fileThumbnail-box" :file="file"></suffix>
        </div>
        <div class="file-hinted" >
          <Tooltip :content="file.fileName + (file.catalog == 0 ? file.ext : '')" placement="top" transfer max-width="250" v-if="isactive != index">
            <div class="file-name" @click.stop="changeView(file, index)">
              <span class="file-name-obj"  v-if="file.catalog == 0">{{ file.fileNameHead }}</span>
              <span class="file-name-obj" v-else>{{ file.fileName }}</span>
              <span v-if="file.catalog == 0" class="file-name-foot">{{ file.fileNameFoot }}</span>
              <Icon type="ios-lock-outline" size="18" v-if="file.catalog==0&&file.filePrivacy==1" class="file-lock"/>
            </div>
          </Tooltip>
          <Input
            style="text-align:center;"
            autofocus
            v-model.trim="editFileName"
            @on-enter="updateFileName(file.fileId)"
            v-if="isactive == index"
            :element-id="file.fileId"
            v-click-outside="reset"
            ref="mFileName"
          />
        </div>
      </Col>
    </Row>

    <div class="file-view-wrap fade in" v-show="files.length > 0 && showView == 'list'">
      <!-- 列表展示 -->
      <div class="file-list1">
        <Table border :columns="columns" :data="files" ref="table" :height="tableHeight" 
         @on-row-click="fileDetail"
         @on-selection-change="onSelectionChange">
          <template slot-scope="{ row, index }" slot="fileName">
            <div class="contant-left">
              <div class="contant-titel">
                <img v-if="row.catalog == 1 && row.filePrivacy == 0" src="../../../assets/images/folder.png" />
                <img v-else-if="row.catalog == 1 && row.filePrivacy == 1" src="../../../assets/images/folder_privacy.png" />
                <suffix v-else class="fileThumbnail-box" :file="row"></suffix>
                <div @click.stop>
                  <span v-if="isactive1 != index">{{ row.fileName }}</span>
                  <Input autofocus
                    style="text-align:center;width: 320px"
                    v-model.trim="editFileName"
                    @on-enter="updateFileName(row.fileId)"
                    v-if="isactive1 == index"
                    :element-id="row.fileId"
                    v-click-outside="reset1"
                    ref="mFileName"/>
                </div>
              </div>
              <Tooltip content="参与者可见" placement="top" >
                <Icon type="ios-lock-outline" size="18" v-if="row.catalog==0&&row.filePrivacy==1" class="file-lock"/>
              </Tooltip>
              <!-- <Icon type="ios-lock-outline" size="18" v-if="row.catalog==0&&row.filePrivacy==1" class="file-lock"/> -->
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="size">
            <span>{{ row.size?row.size:"-" }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="createTime">
            <span>{{ $moment(row.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="action" >
            <div style="height: 30px;line-height: 30px;">
              <span class="info"  @click.stop="downLoad(row.fileId)">下载</span>
              <span class="info"  @click.stop="reFileName(row, index)" ref="btnName">{{isactive1 != index?'重命名':'保存'}}</span>
              <span class="info"  @click.stop="getFileid($event,row, index)">更多</span>
            </div>
          </template>
        </Table>
      </div>
    </div>
    <div v-if="files.length == 0" class="no-files">
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
    <!-- <Modal v-model="showMove" :z-index="11111" class-name="vertical-center-modal" width="800" @on-visible-change="changeVisible" class="show-move">
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
    </Modal> -->

    <!--模型文件详情-->
    <Modal class="nopadding" v-model="showModelFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
      <!-- <modelFileDetail :url="svfUrl" v-if="showModelFileDetail"></modelFileDetail> -->
      <iframe :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${svfUrl}`" style="width:100vw;height:100vh" v-if="showModelFileDetail"></iframe>
    </Modal>
    <!--文件夹 可见性设置 模态框-->
    <Modal v-model="showVisibilityModal" title="文件夹可见性设置" :footer-hide="true" class-name="vertical-center-modal" width="600" class="can-see-modal">
      <fileCanSee v-if="showVisibilityModal"></fileCanSee>
    </Modal>
    <Modal v-model="fileMenu" :styles="{ left: left, top: top }" width="200" :footer-hide="true" :mask-closable="true" v-if="mFile" class="mf0">
      <div slot="header" class="file-menu-header">
        <Icon
          @click="rublish = false"
          type="ios-arrow-back"
          size="18"
          v-if="rublish == true"
        />
        <span>{{ modalTitle }}</span>
      </div>
      <div>
        <div v-show="rublish" class="rublish">
          <p>您确定要把该文件移到回收站吗？</p>
          <Button long type="error" @click="putRecyclebin">移到回收站</Button>
        </div>
        <div v-show="!rublish">
          <section v-if="mFile.catalog==1" class="file-folder-opt">
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
              <!-- <li>复制文件链接</li> -->
              <li @click="collectFile">收藏文件</li>
              <li @click="rublish = true;modalTitle = '移到回收站';">移到回收站</li>
            </ul>
          </section>
          <div class="footer" v-if="mFile.catalog==0">
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

    <Modal v-model="showModelDetai" fullscreen :footer-hide="true" class-name="model-detail" :closable="false">
      <sucaiDetail @close="closeDetail" :type="'文件'" v-if="showModelDetai"></sucaiDetail>
    </Modal>
  </div>
</template>
<script>
import sucaiDetail from "../../public/sucaiDetail.vue";
import model from "../file/model.vue";
import commonFile from "../file/commonfile.vue";
import fileDetail from "../file/fileDetail";
import modelFileDetail from "../file/modelFileDetail";
import fileCanSee from "../file/fileCanSee.vue";
import suffix from './suffixCom.vue'
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getFileDetails, getChildFiles, putImportant } from "@/axios/fileApi";
import { changeName, downloadFile, jionPeople, removeFile, cloneFile, recycleBin, filePrivacy,checkdownload } from "@/axios/fileApi";
import { createFolder, getProjectList, folderChild, collect } from "../../../axios/api.js";
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
    sucaiDetail,
    suffix
  },
  data() {
    return {
      isactive: -1,
      isactive1: -1,
      isactive2: -1,
      data: [],
      modalTitle: "文件菜单",
      fileMenu: false,
      menuId: null,
      show: true,
      paixu: "",
      asyncData: [],
      curtag: "",
      showIcon: null,
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
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          slot: "fileName",
          width: 480
        },
        {
          title: "大小",
          key: "size",
          slot: "size",
          maxWidth: 100,
          sortable: true
        },
        {
          title: "创建者",
          key: "memberName",
          maxWidth: 80
        },
        {
          title: "创建时间",
          key: "createTime",
          slot: "createTime",
          maxWidth: 180,
          sortable: true
        },
        {
          title: "操作",
          slot: "action",
          align: "center"
        }
      ],
      fileArr: [],
      showInput: false,
      tableHeight:490,
      filesContent:[]
    };
  },
  computed: {
    ...mapState("file", ["files", "filePath", "treeData", "tags", "breadcrumb", "createFileId"]),
    ...mapState("tree", ["showView"])
  },

    mounted() {
    // 设置表格高度
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 220
  },
  created() {
    let params = { fileId: this.createFileId };
    this.initFile(params).then(res => {
      this.filesContent=this.files
        this.filesContent.map(p=>{
        if(p.catalog == 0){
          let fileName=p.fileName+p.ext
          p.fileNameHead=fileName.substring(0,fileName.length - 6);
          p.fileNameFoot=fileName.substring(fileName.length - 6);
        }
      })
      this.loading = false;
    });
    
  },
  methods: {
    ...mapActions("file", ["initFile", "initFolders", "searchFile", "putOneFile"]),
    ...mapMutations("file", ["changeToolsShow", "initItem","setSFile"]),
    onSelectionChange(selection){
      this.fileArr=[];
      selection.forEach(element => {
        this.fileArr.push(element.fileId);
      });
      this.initItem(this.fileArr);
      this.changeToolsShow(this.fileArr.length != 0);
      // console.log(this.fileArr)
    },

    recoverySelected() {
      this.fileArr = [];
      this.initItem(this.fileArr);
      this.changeToolsShow(false);
    },
   // 获取当前文件id
    getFileid(e, file) {
      this.mFile = file;
      this.top = e.clientY + "px";
      this.left = e.clientX - 180 + "px";
      this.fileMenu = true;
      this.rublish = false;
    },
    iosCheck(file, index) {
      if (this.fileArr.includes(file.fileId)) {
        this.fileArr = this.fileArr.filter(ele => ele != file.fileId);
      } else {
        this.fileArr.push(file.fileId);
      }

      this.initItem(this.fileArr);
      this.changeToolsShow(this.fileArr.length != 0);
      this.thisFileId = file.fileId;
    },
    setCanSee() {
      this.showVisibilityModal = true;
      this.rublish = false;
      this.fileMenu = false;
      console.log('<<<<<<<<<<<<<<',this.mFile)
      this.setSFile(this.mFile);
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
   
    //文件下载
    downLoad(fileIds) {
      checkdownload().then(res => {
        if (res.result == 0) {
          this.$Message.error(res.msg);
        } else {
          var url = "";
          if (process.env.NODE_ENV == "test") {
            url = process.env.VUE_APP_TEST_URL;
          } else if (process.env.NODE_ENV == "production") {
            url = process.env.VUE_APP_URL;
          } else {
            url = "/api";
          }
          window.location.href = url + "/files/batch/download?fileIds=" + fileIds;
        }
      });
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
    // 收藏文件
    collectFile() {
      this.fileMenu = false;
      let data = {
        projectId: this.projectId,
        publicId: this.fileId,
        collectType: "文件"
      };
      collect(data).then(res => {
        if (res.result==1) {
          this.$Message.success("收藏成功");
        }
      });
    },
    // 点击文件、文件夹进入详情
    fileDetail(file, index) {
      this.recoverySelected();
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
        this.showModelDetai = true;
        this.putOneFile(file.fileId);
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
      filePrivacy(this.mFile.fileId, num,this.projectId,this.mFile.parentId).then(res => {
        if(res.result==1){
          this.$Message.success("隐私设置成功")
        }else{
          this.$Message.success(res.msg)
        }
      });
    },
    // 移到回收站
    putRecyclebin() {
        this.fileMenu = false;
        this.rublish =false;
        recycleBin(this.mFile.fileId, this.projectId).then(res => {
          if (res.result==1) {
            this.$Message.success("成功移到回收站");
          }
      });
    },
    itemClick(node) {},
    // 取消 移动复制
    cancelRemoveClone() {
      this.showMove = false;
    },
    //点击 移动、复制文件
    removeClone(caozuo) {
     this.fileMenu = false;
     this.caozuo = caozuo;
      this.initItem([this.mFile.fileId]);
      this.$emit('removeClone',caozuo);
    },
    //文件修改名
    updateFileName(id) {
      if (this.editFileName == "") {
        this.$Message.info("请输入名称");
      }
      changeName(id, this.editFileName).then(res => {
        this.$emit("updateNodeName", id, this.editFileName);
        this.$Message.info("修改名称成功");
        this.editFileName = "";
        this.isactive = -1;
        this.isactive1 = -1;
      });
    },
    reset() {
      this.updateFileName(this.$refs.mFileName[0].elementId);
    },
    reset1() {
      this.updateFileName(this.$refs.mFileName.elementId);
    },
    changeView(file, index) {
      this.isactive = index;
      this.editFileName = file.fileName;
      this.$nextTick(() => {
        this.$refs.mFileName[0].focus();
      });
    },
    reFileName(row,index){
     var btnName = this.$refs.btnName.innerHTML;
      if(btnName=='重命名'){
        this.isactive1 = index;
        this.editFileName = row.fileName;
        this.$refs.btnName.innerHTML="保存"
        this.$nextTick(() => {
          this.$refs.mFileName.focus();
        });
      }else{
        this.$refs.btnName.innerHTML="重命名"
        this.updateFileName(row.fileId)
      }
    }
  }
};
</script>
<style lang="less">
.checked {
  border: 2px solid #1b9aee !important;
}
.showIcon {
  display: block !important;
  color: #1b9aee !important;
}
.file-contant {
  height: calc(100vh - 220px);
  overflow: hidden;
  // overflow-y: auto;
  padding-left: 10px;
  // padding-top: 10px;
  margin-top: 10px;
  padding-right: 10px;
  .file-view-wrap {
    height: calc(100vh - 220px);
  }
  .file-list {
    .file-list-col {
      margin-bottom: 10px;
      cursor: pointer;
      height: 140px;
      justify-content: center;

      // /deep/ .ivu-tooltip {
      //   width: 140px;
      // }
      .file-hinted {
        margin: 10px auto 0;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #f5f5f5;
          .file-lock{
            display: none;
          }
        }
        .file-name {
          // width: 140px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          .file-name-obj {
            width: 80px;
            display: block;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
            overflow: hidden;
          }
          .file-name-foot {
            white-space: nowrap;
          }
        }
      }

      .img-box {
        display: flex;
        border: 1px solid #e5e5e5;
        height: 100px;
        // width: 140px;
        justify-content: center;
        align-items: center;
        position: relative;
        .ios-check {
          color:rgba(0,0,0,0.34);
          position: absolute;
          top: 0px;
          left: 0px;
          display: none;
        }
        &:hover {
          .ios-check {
            display: block;
          }
        }
        .file-more_opt{
          position: absolute;
          top: 1.5px;
          right: 1.5px;
          display: none;
          width: 22px;
          height: 22px;
        }
        &:hover {
          .file-more_opt {
            display: block;
          }
        }
        img {
          display: block;
          width: 60px;
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

.contant-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .contant-titel {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      height: 26px;
      margin-right: 15px;
    }
  }
  .contant-erery {
    width: 150px;
    text-align: center;
  }
}

.info{
  margin-right: 5px;
  padding: 7px 8px;
  background-color: #2db7f5;
  border-color: #2db7f5;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
}
.file-name-foot {
            white-space: nowrap;
          }

</style>
