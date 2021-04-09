<template>
  <div style="width: 100%;height: 100%">
    <div class="f-content">
      <div class="f-content-left">
        <div class="img-look-box" v-if="file.ext.includes('jpg') || file.ext.includes('jpeg') || file.ext.includes('gif') || file.ext.includes('bmp') || file.ext.includes('png')">
          <div class="big-small-box">
            <Tooltip content="放大">
              <Icon @click="changeImgSize(1)" type="ios-add-circle-outline" />
            </Tooltip>
            <span>{{ Math.floor(imgSize * 100) }}%</span>
            <Tooltip content="缩小">
              <Icon @click="changeImgSize(0)" type="ios-remove-circle-outline" />
            </Tooltip>
          </div>
          <img :style="{ transform: 'scale(' + imgSize + ')' }" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + file.fileUrl" alt="" />
        </div>
<iframe id="previewpdf" v-else-if="'.pdf'.indexOf(file.ext)>-1" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.fileUrl" width="100%" height="100%" frameborder="0"></iframe>
        <iframe
          v-else-if="
            file.ext.includes('doc') ||
              file.ext.includes('docx') ||
              file.ext.includes('docm') ||
              file.ext.includes('dotx') ||
              file.ext.includes('dotm') ||
              file.ext.includes('xls') ||
              file.ext.includes('xlsm') ||
              file.ext.includes('xltx') ||
              file.ext.includes('xltm') ||
              file.ext.includes('xlsb') ||
              file.ext.includes('xlam') ||
              file.ext.includes('xlsx') ||
              file.ext.includes('pptx') ||
              file.ext.includes('pptm') ||
              file.ext.includes('ppsx') ||
              file.ext.includes('potx')
          "
          :src="'https://view.officeapps.live.com/op/view.aspx?src=https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + file.fileUrl"
          width="100%"
          height="100%"
          frameborder="1"
        >
        </iframe>

        <iframe v-else-if="file.ext.includes('txt')" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + file.fileUrl" width="100%" height="100%" frameborder="1"> </iframe>
        <div v-else class="cant-read-file">
          <span>{{ file.fileName }}</span>
          <Button long size="large" type="primary" @click="downLoadLL(file.fileId)">
            <a style="color: white" ref="xiazai">下载文件（{{ file.size }}）</a>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeName, downloadFile, jionPeople, removeFile, cloneFile, recycleBin, filePrivacy } from "@/axios/fileApi";
import { folderChild, getProjectList, collect, cancle, sendMsg } from "@/axios/api";

export default {
  props: ["file"],
  name: "fileDetail",
  data() {
    return {
      relationModal: false,
      publicType: "文件",
      glPop: false,
      task: {},
      showCommon: false,
      menuShow: false,
      isPrivacy: 1,
      privacyTxt: "所有成员可见",
      privacyStatus: "已关闭",
      rublish: false,
      showMove: false,
      footerTxt: "",
      asyncData: [],
      projects: [],
      items: [],
      caozuo: "",
      fileId: this.$route.params.fileId,
      projectId: this.$route.params.id,
      loading: false,
      folderId: "",
      imgSize: 1,
      showModel: false
    };
  },
  methods: {
    //文件下载
    downLoadLL(fileId) {
      
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
      }, 300);
    },
    // 关联 回调
    binkCallback() {
      this.relationModal = false;
    },
    // 更改文件名称
    changeFileName() {
      changeName(this.file.data.fileId, this.file.data.fileName).then(res => {
        this.$Message.success("修改成功");
      });
    },
    // 更新文件
    showFileChoose(data) {
      console.log(data);
      if (data === "model") {
        this.showModel = !this.showModel;
      } else {
        this.showCommon = !this.showCommon;
      }
    },
    // 取消关联
    cancle(id) {
      cancle(id, this.projectId, this.publicType, this.file.data.fileId).then(res => {
        if (res.result === 1) {
          this.$Message.success("已取消");
        }
      });
    },
    // 放大缩小图片
    changeImgSize(n) {
      if (n) {
        this.imgSize = this.imgSize + 0.1;
        console.log(this.imgSize);
      } else {
        this.imgSize = this.imgSize - 0.1;
        console.log(this.imgSize);
      }
    },

    // 添加参与者
    saveInvolveMember(detailList) {
      jionPeople(this.file.data.fileId, detailList).then(res => {
        if (res.result) {
          this.$Message.success("添加成功");
        }
      });
    },
    // 移出参与者
    deleteInvolve(userid) {
      let a = this.file.data.joinInfo.map(v => {
        return v.userId;
      });
      a.forEach((i, n) => {
        if (i === userid) {
          a.splice(n, 1);
        }
      });
      let newJoin = a.join(",");
      jionPeople(this.file.data.fileId, newJoin).then(res => {
        if (res.result) {
          this.$Message.success("移除成功");
        }
      });
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
    // 移到回收站
    putRecyclebin() {
      recycleBin(this.file.data.fileId, this.projectId).then(res => {
        if (res.result) {
          this.$Message.success("成功移到回收站");
          this.popHid();
        }
      });
    },
    // 更改隐私模式
    changePrivacy() {
      let num = 0;
      if (this.privacyStatus == "已关闭") {
        num = 1;
        this.privacyStatus = "已开启";
      } else {
        num = 0;
        this.privacyStatus = "已关闭";
      }
      filePrivacy(this.file.data.fileId, num).then(res => {});
    },
    // 移动、赋值文件框打开关闭
    changeVisible(bool) {
      if (bool) {
        this.projectList();
        this.projectId = this.$route.params.id;
      } else {
        this.projects = [];
        this.items = [];
      }
    },
    // 移动、复制文件的确定按钮
    removeCloneFile() {
      if (this.folderId) {
        if (this.caozuo === "移动") {
          removeFile(this.folderId, this.file.data.fileId, this.projectId).then(res => {
            if (res.result) {
              this.$Message.success("移动成功");
              this.showMove = false;
            }
          });
        } else if (this.caozuo === "复制") {
          cloneFile(this.folderId, this.file.data.fileId).then(res => {
            this.$Message.success("复制成功");
            this.showMove = false;
          });
        }
      }
    },
    // 取消 移动复制
    cancelRemoveClone() {
      this.folderId = "";
      this.showMove = false;
    },
    // 点击 移动、赋值文件
    showModels(caozuo) {
      this.caozuo = caozuo;
      this.showMove = true;
      this.footerTxt = `跨项目${caozuo}时，部分信息不会被保留。`;
      this.asyncData = [this.$refs.jstree.initializeLoading()];
      folderChild(this.projectId).then(res => {
        this.asyncData = res.data;
        this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
      });
    },
    // 改变选择的项目
    changeProject(projectId) {
      this.loading = true;
      this.items = [];
      this.projectId = projectId;
      folderChild(this.projectId).then(res => {
        this.asyncData = res.data;
        this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
        this.loading = false;
      });
    },
    // 获取项目列表
    projectList() {
      getProjectList().then(res => {
        if (res.result == 1) {
          this.projects = res.data;
        }
      });
    },
    // 选中要移动到哪
    itemClick(node) {
      this.folderId = node.data.id;
      console.log(node.data.id);
    }
  }
};
</script>

<style scoped lang="less">
@import "./fileDetail";
</style>
