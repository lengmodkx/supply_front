<template>
  <div class="common-file-content">
    <Upload type="drag" ref="upload" :show-upload-list="true"
    :before-upload="beforeUpload" :action="uploadHost" :data="uploadData" :on-remove="resetFile" :on-success="handleSuccess">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或者拖拽文件进行上传</p>
      </div>
    </Upload>
  </div>
</template>
<script>
import { uploadCommonFile } from "@/axios/api2.js";
import { updateFileVersion } from "@/axios/fileApi";
import { oss } from "@/axios/ossweb.js";
import { mapState } from "vuex";
export default {
  props: ["fileId", "projectId", "fileDetail"],
  data() {
    return {
      showupload: true,
      showProgress: false,
      dirName: "upload/file/",
      uploadList: [],
      percentage: [],
      files: [],
      loading: false,
      uploadData: {},
      uploadHost: ""
    };
  },
  computed: {
    ...mapState("file", ["crumbs", "createFileId"])
  },
  mounted() {
    console.log(this.fileId);
    console.log(this.createFileId);
  },
  methods: {
    beforeUpload(file) {
      var dir = this.dirName + this.$moment().format('YYYY-MM-DD') + "/";
      return oss(dir,file.name).then(res => {
        this.uploadHost = res.host;
        this.uploadData = res;
        console.log(res)
        var myfile = {};
        myfile.fileName = file.name;
        myfile.fileUrl = res.key;
        myfile.size = this.renderSize(file.size);
        myfile.ext = file.name.substr(file.name.indexOf("."),file.name.length);
        myfile.level = this.crumbs.length;
        myfile.parentId = this.createFileId
        this.files.push(myfile);
      });
    },
    handleSuccess(res, file){
      this.uploadServer();
    },
    resetFile() {
      this.$refs.upload.clearFiles();
    },
    uploadServer() {
      console.log(this.fileDetail);
      if (this.fileDetail) {
        let param = { projectId: this.projectId,fileId:this.fileId, files: JSON.stringify(this.files) };
        updateFileVersion(this.createFileId, param).then(res => {
          if (res.result === 1) {
            this.resetFile();
            this.files = [];
            this.$Notice.success({
              title: "更新成功"
            });
            this.$emit("close");
          }
        });
      }else{
        let params = {
          projectId: this.projectId,
          files: JSON.stringify(this.files)
        };
        uploadCommonFile(this.createFileId, params).then(res => {
          if (res.result === 1) {
            this.resetFile();
            this.files = [];
            this.$Notice.success({
              title: "上传成功"
            });
            this.$emit("close");
          }
        });
      }
      
    }
  }
};
</script>
<style lang="less">
.common-file-content {
  width: 100%;
  height: 400px;
  overflow-y: auto;
  .file-clear {
    margin-bottom: 10px;
    text-align: right;
  }
  .model-op {
    margin-left: -16px;
    position: absolute;
    bottom: 0px;
    border-top: 1px solid #e5e5e5;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .op-btn {
      margin-right: 10px;
    }
  }
}

.common-file-upload {
  padding: 20px;
}

.file-progress {
  padding: 10px;
  .m-progress {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
    .file-show {
      width: 100%;
    }
  }
}
</style>
