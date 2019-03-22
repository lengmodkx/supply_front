<template>
  <div class="file-view-wrap fade in">
    <header class="file-header">
      <div class="file-header-title">文件库</div>
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

    <div style="border-bottom: 1px solid #e9e9e9;padding:10px 20px 10px 20px;">
      <Input search enter-button placeholder="请输入文件名搜索" style="width:500px" @on-search="searchFile" />
    </div>
    <loading v-if="loading"></loading>
    <ul class="file-content-wrap">
      <li v-for="(file,index) in files" :key="index" @click="fileDetail(file.catalog,file.fileId)">
        <div class="file-content-view">
          <Icon type="folder" size="60" color="#2d8cf0" v-if="file.catalog==1"></Icon>
          <img src='../../../assets/images/folder.png' style="height:64px;width:80px">
          <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" v-if="file.catalog==0" />
          <div class="file-content-opt">
            <p></p>
            <Icon type="md-arrow-dropdown" size=22 ref="arrow" @click.stop="menuShow(file.catalog, file.fileId,$event)" />
          </div>
        </div>
        <div class="file-content-filename" v-if="file.catalog==1">{{file.fileName}}</div>
        <div class="file-content-filename" v-if="file.catalog==0">{{file.fileName.substr(0,10)+file.ext}}</div>
      </li>
    </ul>
    <Modal title="上传模型文件" v-model="showModel" class-name="file-vertical-center-modal" :width="500" transfer footer-hide>
      <model ref="model" @close="showModel=false" :fileId="fileId"></model>
    </Modal>
    <Modal v-model="showCommon" title="上传普通文件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
      <common-file @close="showCommon=false" :fileId="fileId" :projectId="projectId"></common-file>
    </Modal>
    <Modal v-model="showAddFolder" title="创建文件夹" class-name="file-vertical-center-modal" :width="350">
      <div class="drop-munu-content">
        <Input v-model="folderName" placeholder="请输入文件夹名称" class="folderName" ref="input" />
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="handleSave">确定</Button>
      </div>
    </Modal>
    <Modal v-model="showMove" width="800" @on-visible-change="changeVisible" class="show-move">
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
          <v-jstree :data="asyncData" show-checkbox :multiple=false whole-row @item-click="itemClick" ref="jstree" children-field-name="child"></v-jstree>
        </div>

      </div>
      <div slot="footer" class="move-footer">
        <span>{{footerTxt}}</span>
        <div class="move-footer-btn">
          <Button type="default" size="large" @click="showMove=false">取消</Button>
          <Button type="primary" size="large" @click="showMove=false">确定</Button>
        </div>
      </div>
    </Modal>
    <Modal v-model="menu1Show" width="240" :styles="{top: top,left:left,margin:0}" :mask=false>
      <div slot="header" style="text-align:center;font-size:16px">
        <span>文件菜单</span>
      </div>
      <section class="file-folder-opt">
        <ul>
          <li @click="download">下载文件</li>
          <li @click="moveFile">移动文件</li>
          <li>复制文件</li>
          <li>收藏文件</li>
          <li>移到回收站</li>
        </ul>
      </section>
      <div class="footer" slot="footer">
        <div class="footer-left">
          <i class="ivu-icon ivu-icon-unlocked"></i>
          <div class="footer-privacy-text">
            <span>隐私模式</span>
            <span>{{privacyTxt}}</span>
          </div>
        </div>
        <span style="color:#3da8f5" @click="changePrivacy">{{privacyStatus}}</span>
      </div>
    </Modal>

    <Modal v-model="menu2Show" width="240" :styles="{top: top, left:left,margin:0}" :mask=false>
      <div slot="header" style="text-align:center;font-size:16px">
        <span>文件菜单</span>
      </div>
      <section class="file-folder-opt">
        <ul>
          <li>移动文件夹</li>
          <li>复制文件夹</li>
          <li>移到回收站</li>
          <li>可见性设置</li>
        </ul>
      </section>
      <div class="footer" slot="footer">
        <div class="footer-left">
          <i class="ivu-icon ivu-icon-unlocked"></i>
          <div class="footer-privacy-text">
            <span>隐私模式</span>
            <span>{{privacyTxt}}</span>
          </div>
        </div>
        <span style="color:#3da8f5" @click="changePrivacy">{{privacyStatus}}</span>
      </div>
    </Modal>
  </div>

</template>
<script>
import model from "./model.vue";
import commonFile from "./commonfile.vue";
import Loading from "../../public/common/Loading.vue";
import { mapState, mapActions } from "vuex";
import {
  files,
  createFolder,
  getProjectList,
  folderChild
} from "../../../axios/api.js";
import VJstree from "vue-jstree";
export default {
  inject: ["reload"],
  components: {
    model,
    commonFile,
    Loading,
    VJstree
  },
  data() {
    return {
      showModel: false,
      showCommon: false,
      showAddFolder: false,
      visible: false,
      showMove: false,
      menu1Show: false,
      menu2Show: false,
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
      asyncData: []
    };
  },
  computed: {
    ...mapState("file", ["files", "loading"])
  },
  mounted: function() {
    let params = { fileId: this.fileId };
    this.initFile(params);
    var data = [
      {
        id: "80fdc0eaea0a4da28c2498ab4c01fd56",
        text: "公共模型库",
        child: [
          {
            id: "7d1fbe2cb9894517868939d8693104a7",
            text: "111"
          }
        ]
      }
    ];
    console.log(data[0]["child"]);
  },
  methods: {
    ...mapActions("file", ["initFile"]),
    itemClick(node) {
      console.log(node.model.id + " clicked !");
      console.log(this.projectId);
    },

    searchFile() {},
    menuShow(catalog, fileId, e) {
      if (catalog == 0) {
        this.menu1Show = true;
        this.menu2Show = false;
      } else {
        this.menu2Show = true;
        this.menu1Show = false;
      }
      this.top = e.clientY + "px";
      this.left = e.clientX + "px";
      this.fileIdParam = fileId;
    },
    handleSave() {
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
      window.location.href = `http://192.168.31.120:8090/files/${
        this.fileIdParam
      }/download`;
    },

    fileDetail(catalog, id) {
      if (catalog == 1) {
        this.$router.push({
          path: `/project/${this.$route.params.id}/files/${id}`
        });
      }
    },
    changePrivacy() {
      if (this.isPrivacy == 1) {
        this.privacyTxt = "所有成员可见";
        this.isPrivacy = 2;
        this.privacyStatus = "未开启";
      } else {
        this.privacyTxt = "仅参与者可见";
        this.isPrivacy = 1;
        this.privacyStatus = "已开启";
      }
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
    copyFile() {
      this.showMove = true;
      this.footerTxt = "跨项目复制时，部分信息不会被保留。";
    },

    moveFile() {
      if (this.catalog == 0) {
        this.menu1Show = !this.menu1Show;
      } else {
        this.menu2Show = !this.menu2Show;
      }
      this.showMove = true;
      this.footerTxt = "跨项目移动时，部分信息不会被保留。";
      this.asyncData = [this.$refs.jstree.initializeLoading()];
      folderChild(this.projectId).then(res => {
        console.info(res.data);
        this.asyncData = res.data;
      });
      this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
    },

    projectList() {
      getProjectList().then(res => {
        if (res.result == 1) {
          this.projects = res.data;
        }
      });
    },
    changeVisible(bool) {
      if (bool) {
        this.projectList();
      } else {
        this.projects = [];
        this.items = [];
      }
    },
    changeProject(projectId) {
      this.items = [];
      this.projectId = projectId;
      this.projectList();
    },
    childByValue(childValue, index) {
      this.items.splice(index + 1, this.items.length - 1, {
        component: "my-li",
        projectId: this.projectId,
        fileId: childValue,
        index: new Date().getTime()
      });
      console.log(this.$refs.component);
    }
  },
  watch: {
    $route(to, from) {
      this.reload();
    }
  }
};
</script>
<style lang="less">
.project-main {
  background: #f7f7f7;
}
.file-view-wrap {
  width: 1100px;
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

.drop-munu-content {
  width: 150px;
  margin-left: 15px;
  text-align: center;
  .create-folder-title {
    border-bottom: 1px solid #e5e5e5;
    font-size: 18px;
  }
}
.folderName {
  width: 320px;
  margin-bottom: 15px;
  margin-top: 10px;
}
.file-operate {
  line-height: 60px;
}

.file-content-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
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
      width: 100px;
      height: 100px;
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
      width: 160px;
      height: 25px;
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
.show-move .ivu-modal-body {
  padding: 0;
}
</style>


