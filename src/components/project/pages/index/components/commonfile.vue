<template>
  <div class="common-file-content">
    <Upload ref="upload" :show-upload-list="true" :before-upload="handleBeforeUpload" multiple class="file-progress"
      :action="host" :data="uploadData" :headers="headers" :on-remove="removeFile">
      <Button icon="ios-cloud-upload-outline" type="primary">请选择非模型文件,最多7个文件</Button>
    </Upload>
    <!-- <div v-if="showProgress" class="file-progress">
      <div class="m-progress" v-for="(file,index) in uploadList" :key="index">
        <div class="file-show">
          <span>{{file.name}}</span>
          <Progress :percent="percentage[index]" ref="progress" />
        </div>
        <Button type="default" @click="removeFile(file)">移除</Button>
      </div>
    </div> -->
    <div class="model-op">
      <Button type="default" @click="resetFile" class="op-btn">重选</Button>
      <Button type="primary" @click="uploadFile" class="op-btn" :loading="loading">提交</Button>
    </div>
  </div>
</template>
<script>
  import {
    bind_files
  } from "@/axios/api2";
  import {
    oss
  } from "@/axios/ossweb";
  export default {
    props: ["fileId", "publicId"],
    data() {
      return {
        showupload: true,
        showProgress: false,
        dirName: "upload/file/",
        uploadList: [],
        percentage: [],
        files: [],
        loading: false,
        projectId: this.$route.params.id,
        uploadData: {},
        host: "",
        headers: {
          "x-auth-token": localStorage.token
        },
      };
    },
    methods: {
      removeFile(file) {
        this.uploadList.splice(this.uploadList.indexOf(file), 1);
        this.files.splice(this.uploadList.indexOf(file), 1);
      },
      resetFile() {
        this.uploadList = [];
        this.$refs.upload.clearFiles();
      },

      handleBeforeUpload(file) {
        var that = this;
        this.uploadList.push(file);
        if (this.uploadList.length > 7) {
          this.$Notice.warning({
            title: "最多同时只能上传7个文件"
          });
          this.uploadList.splice(7, this.uploadList.length - 1);
          return false;
        } else {
          let dir = ''
          dir = this.dirName + this.$moment().format('YYYY-MM-DD') + "/";
          return oss(dir, file.name).then(res => {
            this.host = res.host;
            this.uploadData = res;
            var myfile = {};
            myfile.fileName = file.name;
            myfile.fileUrl = res.key;
            myfile.size = that.renderSize(file.size);
            myfile.projectId = that.projectId;
            myfile.ext = file.name.substr(
              file.name.indexOf("."),
              file.name.length
            );
            myfile.publicId = that.publicId;
            this.files.push(myfile);
          });
        }

      },
      uploadFile() {
        var that = this;

        if (that.uploadList.length == that.files.length) {
          that.uploadServer();
        }


      },
      uploadServer() {
        let params = {
          files: JSON.stringify(this.files),
          publicId: this.publicId,
          projectId: this.projectId
        };
        bind_files(params).then(res => {
          if (res.result === 1) {
            this.loading = false;
            this.resetFile();
            this.files = [];
            this.$Notice.success({
              title: "上传成功"
            });
            this.$Modal.remove();
            this.files.splice(0, this.files.length);
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

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
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
        width: 420px;
      }
    }
  }
</style>