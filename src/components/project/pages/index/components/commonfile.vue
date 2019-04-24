<template>
  <div class="common-file-content">
    <Upload ref="upload" :show-upload-list="false" :before-upload="handleBeforeUpload" multiple action="/" v-show="showupload" class="file-progress">
      <Button icon="ios-cloud-upload-outline" type="primary">请选择非模型文件,最多7个文件</Button>
    </Upload>
    <div v-if="showProgress" class="file-progress">
      <div class="m-progress" v-for="(file,index) in uploadList" :key="index">
        <div class="file-show">
          <span>{{file.name}}</span>
          <Progress :percent="percentage[index]" ref="progress" />
        </div>
        <Button type="default" @click="removeFile(file)">移除</Button>
      </div>
    </div>
    <div class="model-op">
      <Button type="default" @click="resetFile" class="op-btn">重选</Button>
      <Button type="primary" @click="uploadFile" class="op-btn">提交</Button>
    </div>
  </div>
</template>
<script>
import { uploadCommonFile, bind_files} from "@/axios/api2";
import OSS from "ali-oss";
let client = new OSS({
  region: "oss-cn-beijing",
  accessKeyId: "LTAIP4MyTAbONGJx",
  accessKeySecret: "coCyCStZwTPbfu93a3Ax0WiVg3D4EW",
  bucket: "art1001-bim-5d"
});
export default {
  props: ["fileId", "projectId","publicId"],
  data() {
    return {
      showupload: true,
      showProgress: false,
      dirName: "upload/file/",
      uploadList: [],
      percentage: [],
      files: []
    };
  },
  methods: {
    random_string(len) {
      len = len || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    get_suffix(filename) {
      var pos = filename.lastIndexOf(".");
      var suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    removeFile(file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1);
      this.percentage.splice(this.uploadList.indexOf(file), 1);
      if (this.uploadList.length == 0) {
        this.showupload = true;
        this.showProgress = false;
      }
    },
    resetFile() {
      this.showupload = true;
      this.showProgress = false;
      this.uploadList = [];
      this.percentage = [];
    },

    handleBeforeUpload(file) {
      var that = this;
      this.showupload = false;
      this.showProgress = true;
      this.percentage.push(0);
      this.uploadList.push(file);
      if (this.uploadList.length > 7) {
        this.$Notice.warning({
          title: "最多同时只能上传7个文件"
        });
        this.uploadList.splice(6, this.uploadList.length - 1);
      }
      return false;
    },
    uploadFile() {
      var that = this;
      this.uploadList.forEach((file, index) => {
        var fileName =
          this.dirName + this.random_string(10) + this.get_suffix(file.name);
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
            myfile.projectId = that.projectId;
            myfile.ext = file.name.substr(file.name.indexOf("."),file.name.length);
            myfile.publicId = that.publicId;
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
        files: JSON.stringify(this.files),
        publicId:this.publicId,
        projectId:this.projectId
      };
      bind_files(params).then(res => {
        if (res.result === 1) {
          this.files = [];
          this.$Notice.success({
            title: "上传成功"
          });
          this.files.splice(0,this.files.length)
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