<template>
  <div class="model-file-up-box">
    <div class="model-name"><span>模型名称</span><Input v-model="modelName" placeholder="选输入模型文件名称" /></div>
    <div class="model-name"><span>模型文件</span>
      <Upload :before-upload="handleUpload1" action="/upload/file/Office" v-if="showupload1" accept=".pln,.gsm,.skp,.mod,.svf,.zip,.rar">
        <Button icon="ios-cloud-upload-outline" type="primary">请选择模型文件</Button>
      </Upload>
      <div v-if="showProgress1" class="model-progress">
        <div class="m-progress">
          <span>{{modelFile.fileName}}</span>
          <Progress :percent="percent1" />
        </div>
        <!--<Button type="primary" style="margin-right:10px" @click="uploadModel">{{upload1}}</Button>-->
        <!--<Button type="default" @click="resetModel">{{reset1}}</Button>-->
      </div>
    </div>
    <div class="model-name"><span>模型图片</span>
      <Upload :before-upload="handleUpload2" action="/" v-if="showupload2" accept=".gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.bmp,.BMP">
        <Button icon="ios-cloud-upload-outline" type="primary">请选择模型缩略图</Button>
      </Upload>
      <div v-if="showProgress2" class="model-progress">
        <div class="m-progress">
          <span>{{modelImg.fileName}}</span>
          <Progress :percent="percent2" />
        </div>
        <!--<Button type="primary" style="margin-right:10px" @click="uploadImg">{{upload2}}</Button>-->
        <!--<Button type="default" @click="resetImg">{{reset2}}</Button>-->
      </div>
    </div>
    <div class="model-op">
      <Button type="primary" @click="uploadServer" class="op-btn" :loading="loading">上传</Button>
      <Button type="default" @click="cancleUploadServer" class="op-btn">取消</Button>
    </div>
  </div>
</template>

<script>
import JSZip from "jszip";
import { uploadModel,updateModelVersion} from "../../../axios/api2.js";
export default {
  props: ["fileId",'fileDetail'],
  data() {
    return {
      showupload1: true,
      showupload2: true,
      showProgress1: false,
      showProgress2: false,
      upload1: "上传",
      upload2: "上传",
      reset1: "重选",
      reset2: "重选",
      modelName: "",
      percent1: 0,
      percent2: 0,
      dirName: "upload/model/",
      file1: null,
      file2: null,
      modelFile: { fileName: "", size: "", fileUrl: "", ext: "" },
      modelImg: { fileName: "", size: "", fileUrl: "" },
      loading: false
    };
  },
  methods: {
    randomStr(len) {
      len = len || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    getSuffix(filename) {
      var pos = filename.lastIndexOf(".");
      var suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    // 上传模型前处理
    handleUpload1(file) {
      this.file1 = file;
      this.modelFile.fileName = file.name;
      this.modelFile.size = file.size;
      this.showupload1 = false;
      this.showProgress1 = true;
      return false;
    },
    // 上传模型缩略图前处理
    handleUpload2(file) {
      this.file2 = file;
      this.modelImg.fileName = file.name;
      this.modelImg.size = file.size;
      this.showupload2 = false;
      this.showProgress2 = true;
      return false;
    },
    // 重选模型
    resetModel() {
      this.showupload1 = true;
      this.showProgress1 = false;
      this.percent1 = 0;
      this.modelFile.fileName = "";
    },
    // 重选模型缩略图
    resetImg() {
      this.showupload2 = true;
      this.showProgress2 = false;
      this.percent2 = 0;
      this.modelImg.fileName = "";
    },
    // 模型上传
    // uploadModel() {
    //   var that = this;
    //   var zip = new JSZip();
    //   var file = this.file1;
    //   if (".svf".includes(this.getSuffix(file.name))) {
    //     var randomName = this.randomStr(10);
    //     var fileName = this.dirName + randomName + ".zip";
    //     var file = new File([file], fileName);
    //     client
    //       .multipartUpload(file.name, file, {
    //         progress: function(p) {
    //           that.percent1 = Math.floor(p * 100);
    //         }
    //       })
    //       .then(function(result) {
    //         that.modelFile.fileUrl =
    //           "upload/model/svf/" + randomName + "/3d.svf";
    //         //console.log(">>>>>>>>>>>", result);
    //       })
    //       .catch(function(err) {
    //         console.log(err);
    //       });
    //   } else {
    //     var fileName =
    //       this.dirName + this.randomStr(10) + this.getSuffix(file.name);
    //     zip.file(file.name, file, { type: "blob" });
    //     zip
    //       .generateAsync({
    //         type: "blob",
    //         compression: "DEFLATE",
    //         compressionOptions: {
    //           level: 6
    //         }
    //       })
    //       .then(function(data) {
    //         var file = new File([data], fileName);
    //         client
    //           .multipartUpload(file.name, file, {
    //             progress: function(p) {
    //               that.percent1 = Math.floor(p * 100);
    //             }
    //           })
    //           .then(function(result) {
    //             that.modelFile.fileUrl = result.name;
    //           })
    //           .catch(function(err) {
    //             console.log(err);
    //           });
    //       });
    //   }
    // },
    // 模型缩略图上传
    // uploadImg() {
    //   var that = this;
    //   var file = this.file2;
    //   var fileName =
    //     this.dirName + this.randomStr(10) + this.getSuffix(file.name);
    //   client
    //     .multipartUpload(fileName, file, {
    //       progress: function(p) {
    //         that.percent2 = Math.floor(p * 100);
    //       }
    //     })
    //     .then(function(result) {
    //       that.modelImg.fileUrl = result.name;
    //     })
    //     .catch(function(err) {
    //       console.log(err);
    //     });
    // },
// 点击确定上传按钮
    uploadServer() {
      this.loading = true;
      let upImg= new Promise((resolve, reject) => {
        var that = this;
        var file = this.file2;
        var fileName =
                this.dirName + this.randomStr(10) + this.getSuffix(file.name);
        client
                .multipartUpload(fileName, file, {
                  progress: function(p) {
                    that.percent2 = Math.floor(p * 100);
                  }
                })
                .then(function(result) {
                  that.modelImg.fileUrl = result.name;
                  resolve('成功了')
                })
                .catch(function(err) {
                  console.log(err);
                });
      })
      let upModel = new Promise((resolve, reject) => {
        var that = this;
        var zip = new JSZip();
        var file = this.file1;
        if (".svf".includes(this.getSuffix(file.name))) {
          var randomName = this.randomStr(10);
          var fileName = this.dirName + randomName + ".zip";
          var file = new File([file], fileName);
          client
                  .multipartUpload(file.name, file, {
                    progress: function(p) {
                      that.percent1 = Math.floor(p * 100);
                    }
                  })
                  .then(function(result) {
                    that.modelFile.fileUrl =
                            "upload/model/svf/" + randomName + "/3d.svf";
                    //console.log(">>>>>>>>>>>", result);
                    resolve('success')
                  })
                  .catch(function(err) {
                    console.log(err);
                  });
        } else {
          var fileName = this.dirName + this.randomStr(10) + this.getSuffix(file.name);
          zip.file(file.name, file, { type: "blob" });
          zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: {
                      level: 6
                    }
                  })
                  .then(function(data) {
                    var file = new File([data], fileName);
                    client.multipartUpload(file.name, file, {
                              progress: function(p) {
                                that.percent1 = Math.floor(p * 100);
                              }
                            })
                            .then(function(result) {
                              that.modelFile.fileUrl = result.name;
                              resolve('success')
                            })
                            .catch(function(err) {
                              console.log(err);
                            });
                  });
        }
      })
      Promise.all([upImg,upModel]).then(res => {
        if (this.modelName == "" || this.modelName == null) {
          this.$Notice.warning({
            title: "请输入模型文件名称"
          });
          return false;
        }

        if (this.modelFile.fileUrl == "" || this.modelFile.fileUrl == null) {
          this.$Notice.warning({
            title: "请上传模型文件"
          });
          return false;
        }
        if (this.modelImg.fileUrl == "" || this.modelImg.fileUrl == null) {
          this.$Notice.warning({
            title: "请上传模型文件缩略图"
          });
          return false;
        }
        //上传模型文件
        let params = {
          filename: this.modelName,
          fileModel: JSON.stringify(this.modelFile),
          fileCommon: JSON.stringify(this.modelImg)
        };
          if(this.fileDetail){
              updateModelVersion(this.fileId, params).then(res=>{
                if (res.result == 1) {
                  this.loading = false;
                  this.resetModel();
                  this.resetImg();
                  this.$Notice.success({
                    title: "上传成功"
                  });
                  this.$emit("close");
              }
              })
              return
          }
        uploadModel(this.fileId, params).then(res => {
          if (res.result == 1) {
            this.loading = false;
            this.resetModel();
            this.resetImg();
            this.$Notice.success({
              title: "上传成功"
            });
            this.$emit("close");
          }
        });
      }).catch(error => {
        console.log(error)
      })
    },
    cancleUploadServer() {
      this.$emit("close");
    }
  }
};
</script>
<style scoped lang="less">
.model-file-up-box {
  width: 100%;
  background-color: white;
  height: 200px;
  margin: 0 auto;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.model-name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  padding: 0 20px;
  span {
    flex: none;
    margin-right: 10px;
  }
  .model-progress {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    .m-progress {
      width: 100%;
    }
  }
}
.model-op {
  border-top: 1px solid #e5e5e5;
  margin: 10px 0;
  .op-btn {
    float: right;
    margin-right: 10px;
    margin-top: 10px;
  }
}
</style>
