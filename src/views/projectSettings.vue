<template>
  <div v-if="project!=null">
    <div class="title">项目设置</div>
    <div class="tabPage clearfix">
      <div class="tabs fl">
        <ul>
          <li :class="{tabactive:active==1}" @click="choose(1)">
            <Icon type="ios-eye-outline"></Icon>概览
          </li>
          <!--<li :class="{tabactive:active==2}" @click="choose(2)">-->
          <!--<Icon type="android-checkbox-outline"></Icon>任务权限-->
          <!--</li>-->
          <li :class="{tabactive:active==3}" @click="choose(3)">
            <Icon type="ios-more"></Icon>更多
          </li>
        </ul>
      </div>
      <div class="content fl">
        <div class="div1" v-if="active==1">
          <div class="div1-box">
            <div class="div1-title">项目封面</div>
            <div class="coverBox clearfix">
              <div class="cover fl">
                <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${project.projectCover}`" alt  v-if="pic_show" accept="image/*">
                <img :src="imageUrl" alt v-if="pic_hide" accept="image/*">
              </div>
              <div class="upload fl">
                <input type="file" ref="inputer" @change="getFile">
                <Button class="upLoadButton"  >上传新封面</Button>
              </div>
            </div>
          </div>
          <div class="div1-box">
            <div class="div1-title">项目名称</div>
            <Input v-model="project.projectName" />
          </div>
          <div class="div1-box">
            <div class="div1-title">项目简介</div>
            <Input v-model="project.projectDes" type="textarea" placeholder="介绍一个这个项目" />
          </div>
          <div class="create-project-time">
            <DatePicker placeholder="开始时间" :value="project.startTime|timeFilter2" type="date" @on-change="startDate" :options="options1"></DatePicker>
            <DatePicker placeholder="结束时间" :value="project.endTime|timeFilter2" type="date" @on-change="endDate" :options="options2"></DatePicker>
          </div>
          <div class="div1-box">
            <div class="div1-title">项目公开性</div>
            <Select v-model="priority" size="large" style="width:100%;" @on-change="priorityChange" :placeholder="project.isPublic?'私有':'公开'">
              <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <!--<div class="div1-box">-->
          <!--<div class="div1-title">项目拥有者</div>-->
          <!--<div class="clearfix">-->
          <!--<div class="owner fl">-->
          <!--<img-->
          <!--src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"-->
          <!--alt-->
          <!--&gt;-->
          <!--<span>拥有人</span>-->
          <!--</div>-->
          <!--<div class="fr">-->
          <!--<Button class="giveBtn">移交</Button>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <div class="save clearfix">
            <Button type="primary" @click="saveSet">保存</Button>
          </div>
        </div>
        <div class="div2 clearfix" v-if="active==2">
          <div class="text fl">文字</div>
          <div class="switch fl">
            <i-Switch v-model="switch1" @on-change="changeSwitch"></i-Switch>
          </div>
        </div>
        <div class="div3" v-if="active==3">
          <div class="div3-box">
            <div class="div1-title">项目操作</div>
            <p>您可以执行以下操作</p>
            <div class="btns">
              <Button @click="modal1=true;">归档项目</Button>
              <Button type="error" @click="modal2=true;">移至回收站</Button>
            </div>
            <Modal class="confirmModal" v-model="modal1" title="归档项目">
              <p style="padding:10px;font-size:15px;">一旦将项目「{{project.projectName}}」归档，本项目和所含信息将会被移到「归档项目」内，其中的内容依然会被统计和搜索收录，归档项目可以随时恢复并继续使用。</p>
              <div class="doBtn">
                <Button type="error" @click="okGuidang">归档</Button>
              </div>
            </Modal>
            <Modal class="confirmModal" v-model="modal2" title="移到回收站">
              <p style="padding:10px;font-size:15px;">一旦将项目「{{project.projectName}}」移到回收站，所有与项目有关的信息将会被移到回收站，其中的内容也不会被统计和搜索收录，需要去回收站恢复后才能继续使用。</p>
              <div class="doBtn">
                <Button type="error" @click="okHuishou">移到回收站</Button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import OSS from "ali-oss";
import { mapState, mapMutations } from "vuex";
import { updateProject,recycleProject } from "@/axios/api";
import { updataProjectPic } from "@/axios/api2";
let client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: "LTAIP4MyTAbONGJx",
    accessKeySecret: "coCyCStZwTPbfu93a3Ax0WiVg3D4EW",
    bucket: "art1001-bim-5d"
});
export default {
  data() {
    return {
      fil:null,
      active: 1,
      priority: "",
      switch1: false,
      imageUrl: "",
      filename:"",
      fileName:"",
      files:[],
      dirName: "upload/project/",
      pic_show:true,
      pic_hide:false,
      modal1: false,
      modal2: false,
      List: [
        {
          value: "0",
          label: "公开项目 (所有人都可通过链接访问，仅项目成员可编辑)"
        },
        {
          value: "1",
          label: "私有项目 (仅项目成员可查看和编辑)"
        }
      ],
      options1: {},
      options2: {}
    };
  },
  computed: {
    ...mapState("project", ["project"])
  },
  methods: {
      ...mapMutations("project", ["updatePro"]),
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
      resetFile() {
          this.showupload = true;
          this.showProgress = false;
          this.uploadList = [];
          this.percentage = [];
      },
      startDate(date) {
          this.options2 = {
              disabledDate(date1) {
                  return date1.valueOf() < new Date(date).getTime() - 86400000;
              }
          };
      },
      getFile(event) {
          const files = event.target.files
          this.filename = files[0].name          //只有一个文件
          if (this.filename.lastIndexOf('.') <= 0) {
              return alert("Please add a valid image!")        //判断图片是否有效
          }
          const fileReader = new FileReader()                //内置方法new FileReader()   读取文件
          fileReader.addEventListener('load', () => {
              this.pic_show = false,
                  this.pic_hide = true,
                  this.imageUrl = fileReader.result
          })
          fileReader.readAsDataURL(files[0])
          this.image = files[0]
          //到这里后, 选择图片就可以显示出来了

          this.fileName = this.dirName + this.random_string(10) + this.get_suffix(this.filename);
      },
      endDate(date) {
          this.options1 = {
              disabledDate(date1) {
                  return date1.valueOf() > new Date(date).getTime() - 86400000;
              }
          };
      },
      choose(flag) {
          this.active = flag;
      },
      publishAxios() {
          return new Promise((resolve, reject) => {
              this.$Message.loading({
                  content: "Loading...",
                  duration: 0
              });
              let data = {
                  projectId: this.project.projectId,
                  projectName: this.project.projectName,
                  projectDes: this.project.projectDes,
                  isPublic: this.project.isPublic,
                  projectCover:this.fileName,
                  startTime: this.project.startTime,
                  endTime: this.project.endTime,
                  projectDel: this.project.projectDel,
                  projectStatus: this.project.projectStatus
              };
              updateProject(data).then(res => {
                  console.log(res);
                  this.$Message.destroy();
                  this.updatePro(this.project);
                  resolve("成功");
              });
          });
      },

      // 选择公开性
      priorityChange(data) {
          this.project.isPublic = data;
      },
      // 点击保存按钮
      saveSet() {
          var that = this;
         /* let fd = new FormData()              //内置方法new FormData()  新建一个表格
            fd.append('file',this.image)*/
          client.multipartUpload(this.fileName, this.image, {
                  progress: function(p) {
                      //that.percentage.splice(index, 1, Math.floor(p * 100));
                  }
              })
              .then(function(result){
                  /*var myfile = {};
                  myfile.fileName = fileName;
                  myfile.fileUrl = result.name;
                  //myfile.size = that.renderSize(file.size);
                  that.files.push(myfile);*/

              }),
          this.publishAxios().then(res => {
              console.log(res);
          });
      },
      okGuidang() {
          this.project.projectStatus = 1;
          this.publishAxios().then(res => {
              this.modal1 = false;
          });
      },
      okHuishou() {
          recycleProject(this.project.projectId).then(res => {
              if (res.result === 1) {
                  this.$Message.success("成功!")
              } else {
                  this.$Message.error("失败!")
              }
          })
          // this.project.projectDel = 1;
          // this.publishAxios().then(res => {
          //   this.modal2 = false;
          // });
          // if(this.$route.params.groupId){
          //   this.$router.push("/home");
          // } else{
          //     this.$emit('close-settings', false);
          // }

      }
  }
};
</script>
<style scoped lang="less">
.title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 1px solid #e5e5e5;
}
.div1-title {
  font-size: 16px;
  margin-bottom: 10px;
}
.doBtn {
  padding: 15px 0;
  button {
    display: block;
    width: 90%;
    margin: 0 auto;
    font-size: 14px;
  }
}
.tabPage {
  height: 500px;
  .tabs {
    height: 100%;
    ul {
      height: 100%;
      border-right: 1px solid #e5e5e5;
      li {
        width: 179px;
        line-height: 50px;
        border-bottom: 1px solid #e5e5e5;
        border-left: 4px solid transparent;
        color: gray;
        font-size: 14px;
        padding-left: 15px;
        cursor: pointer;
        box-sizing: border-box;
        &:hover {
          color: #3da8f5;
        }
        i {
          font-size: 20px;
          margin-right: 10px;
        }
      }
    }
    .tabactive {
      border-left: 4px solid #3da8f5;
      color: #3da8f5;
    }
  }
  .content {
    height: 100%;
    width: calc(100% - 180px);
    .div1 {
      padding: 0 15px;
      height: 100%;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #cecece;
      }
      .owner {
        img {
          display: inline-block;
          height: 32px;
          width: 32px;
          border-radius: 50%;
          margin-right: 14px;
          vertical-align: middle;
        }
        span {
          font-size: 14px;
        }
      }
      .giveBtn {
        padding: 6px 20px;
        font-size: 14px;
        border-color: #3da8f5;
        color: #3da8f5;
        margin-right: 20px;
      }
      .save {
        padding: 20px 0;
        border-top: 1px solid #e5e5e5;
        margin-top: 20px;
        button {
          float: right;
          margin-right: 20px;
          font-size: 14px;
          padding: 6px 24px;
        }
      }
      .div1-box {
        margin-top: 20px;
      }
      .cover {
        border-radius: 4px;
        width: 250px;
        height: 125px;
        img {
          display: block;
          border-radius: 4px;
          width: 250px;
          height: 125px;
        }
      }
      .upload {
        position: relative;
        margin-left: 20px;
        &:hover {
          .upLoadButton {
            background: #3da8f5;
            color: #fff;
          }
        }
        input {
          display: block;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .upLoadButton {
          width: 90px;
          height: 36px;
          padding: 6px 0;
          font-size: 14px;
          text-align: center;
          color: #3da8f5;
          border-color: #3da8f5;
        }
      }
    }
  }
}
.div2,
.div3 {
  padding: 0 15px;
  height: 100%;
  overflow-y: auto;
}
.div3-box {
  margin-top: 20px;
  p {
    margin-bottom: 20px;
    font-size: 14px;
    color: #a6a6a6;
  }
  .btns {
    button {
      font-size: 14px;
      margin-right: 20px;
      padding: 6px 18px;
    }
  }
}
.create-project-time {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
