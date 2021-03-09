<template>
  <div class="common-file-content">
    <Upload type="drag" ref="upload" :before-upload="beforeUpload" multiple :action="uploadHost" :data="uploadData">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或者拖拽文件进行上传</p>
      </div>
    </Upload>
  </div>
</template>
<script>
import { uploadCommonFile } from "../../../axios/api2.js";
import { updateFileVersion } from "@/axios/fileApi";
import { oss } from "../../../axios/oss.js";
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
    console.log(this.crumbs);
    console.log(this.createFileId);
  },
  methods: {
    beforeUpload(file) {
      return oss(file.name, this.crumbs.length, this.createFileId, this.projectId).then(res => {
        this.uploadHost = res.host;
        this.uploadData = res;
        console.log(res);
      });
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    uploadFile() {
      this.loading = true;
      var that = this;
      this.uploadList.forEach((file, index) => {
        var fileName = this.dirName + this.random_string(10) + this.get_suffix(file.name);
        client
          .multipartUpload(fileName, file, {
            progress: function(p) {
              that.percentage.splice(index, 1, Math.floor(p * 100));
            }
          })
          .then(function(result) {
            var myfile = {};
            myfile.fileName = file.name;
            myfile.fileUrl = result.name;
            myfile.size = that.renderSize(file.size);
            that.files.push(myfile);
            if (that.uploadList.length == that.files.length) {
              that.uploadServer();
            }

            console.log(result);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    },
    uploadServer() {
      let params = {
        projectId: this.projectId,
        files: JSON.stringify(this.files)
      };

      let param = {
        files: JSON.stringify(this.files)
      };
      console.log(this.fileDetail);
      if (this.fileDetail) {
        updateFileVersion(this.fileId, param).then(res => {
          if (res.result === 1) {
            this.resetFile();
            this.loading = false;
            this.files = [];
            this.$Notice.success({
              title: "上传成功"
            });
            this.$emit("close");
          }
        });
        return;
      }
      uploadCommonFile(this.fileId, params).then(res => {
        if (res.result === 1) {
          this.resetFile();
          this.loading = false;
          this.files = [];
          this.$Notice.success({
            title: "上传成功"
          });
          this.$emit("close");
        }
      });
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
