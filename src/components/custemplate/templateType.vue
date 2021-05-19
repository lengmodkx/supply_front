<template>
  <div>
    <div class="modal-content">
      <h2 class="template-tit">创建企业模板</h2>
      <div class="template-tip">你可以通过以下方式创建企业共享的项目模板</div>
      <div class="class-content df jsb">
        <div class="class-item" @click="commonTemplate">
          <div class="img-content">
            <img src="https://g.alicdn.com/teambition/web/teambition/images/template-simple.2d7759aa.png" />
          </div>
          <div class="text-content">
            <h4 class="template-name">普通模板</h4>
            <div>从空白普通项目开始创建模板</div>
          </div>
        </div>
        <div class="class-item" style="display:none">
          <div class="img-content">
            <img src="https://g.alicdn.com/teambition/web/teambition/images/template-taskflow.d60d2f5a.png" />
          </div>
          <div class="text-content">
            <h4 class="template-name">工作流模板</h4>
            <div>从空白工作流项目开始创建模板</div>
          </div>
        </div>
        <div class="class-item" style="display:none">
          <div class="img-content">
            <img src="https://g.alicdn.com/teambition/web/teambition/images/template-copy.f2b3d768.png" />
          </div>
          <div class="text-content">
            <h4 class="template-name">复制现有项目</h4>
            <div>包含项目内任务、分组、列表、文件等</div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="modal" width="570" title="模板基本信息" class-name="modal-second">
      <div slot="header" style="text-align: center; font-size: 16px; color: #262626">
        <span>模板基本信息</span>
      </div>
      <div>
        <div class="div1-box">
          <div class="div1-title">模板封面</div>
          <div class="df">
            <div class="cover">
              <img src="https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/project/bj.png" alt v-if="pic_show" />
              <img :src="imageUrl" alt v-if="pic_hide" accept="image/*" />
            </div>
            <div class="upload">
              <div>
                <Upload :show-upload-list="false" :max-size="2048" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :action="host" :data="uploadData" :on-success="handleSuccess">
                  <Button type="primary" ghost>上传新封面</Button>
                </Upload>
              </div>
            </div>
          </div>
          <div class="project-setting-section-horizontal">
            <div class="project-setting-section edit-name">
              <div class="section-grid" data-fields="name">
                <label for="name"> 模板名称 </label>
                <Input v-model="templateName" placeholder="空白项目" maxlength="30" minlength="1" autofocus="autofocus" class="template-name" />
              </div>
            </div>
            <!-- <div class="project-setting-section">
              <div class="section-grid" data-fields="name">
                <label for="name"> 模板权限设置 </label>
                <div id="project-template-permission-setting"></div>
              </div>
            </div> -->
          </div>
          <div class="project-setting-section edit-description">
            <div class="section-grid" data-fields="description">
              <label for="description"> 模板简介 </label>
              <Input v-model="introduction" type="textarea" :rows="3" placeholder="介绍一下这个项目" class="template-description" name="description" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="save">保存更改</Button>
      </div>
    </Modal>
    <Modal v-model="showTemplate" fullscreen title="模板基本信息" footer-hide>
      <create-template v-if="showTemplate"></create-template>
    </Modal>
  </div>
</template>
<script>
import { oss } from "@/axios/ossweb";
import { saveTemplate } from "../../axios/template.js";
import createTemplate from "../createTemplate/createTemplate";
export default {
  components: {createTemplate},
  data() {
    return {
      modal: false,
      uploadData: {},
      host: "",
      dirName: "upload/project/",
      pic_show: true,
      pic_hide: false,
      imageUrl: "",
      introduction: "",
      templateName: "",
      name: "upload/project/bj.png",
      showTemplate: false,
    };
  },

  methods: {
    commonTemplate() {
      this.modal = true;
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超过文件大小限制",
        desc: "文件  " + file.name + " 过大, 超过2M.",
      });
    },
    handleBeforeUpload(file) {
      let dir = this.dirName + this.$moment().format("YYYY-MM-DD") + "/";
      return oss(dir, file.name).then((res) => {
        this.host = res.host;
        this.uploadData = res;
        this.imageUrl = res.host + "/" + res.key;
        this.name = res.key;
      });
    },
    handleSuccess() {
      this.pic_show = false;
      this.pic_hide = true;
    },
    save() {
      var data = {
        templateName: this.templateName,
        templateDes: this.introduction,
        templateCover: this.name,
        orgId: localStorage.companyId,
      };
      saveTemplate(data).then((res) => {
        if (res.result == 1) {
          this.$Message.success("保存成功");
          this.modal = false;
          this.$emit("close");
          this.showTemplate = true;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.modal-content {
  width: 881px;
  margin: 0 auto;

  .template-tit {
    font-size: 28px;
    font-weight: 500;
    margin: 0 0 4px;
    line-height: 40px;
    color: #262626;
  }

  .template-tip {
    font-size: 18px;
    color: grey;
    line-height: 25px;
    margin-bottom: 48px;
  }

  .class-content {
    .class-item {
      width: 283px;
      height: 223px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      transition: box-shadow 0.3s;
      padding: 18px 20px;
      cursor: pointer;

      .img-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 126px;
        margin-bottom: 12px;

        img {
          width: 83px;
        }
      }

      .text-content {
        color: grey;
        .template-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0 0 4px;
          font-size: 16px;
          color: #383838;
          line-height: 22px;
          font-weight: 500;
        }
      }

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
.div1-box {
  color: #262626;
  .div1-title {
    margin-bottom: 12px;
  }
  .inputContent {
    width: 49%;
    .ivu-date-picker {
      width: 100%;
    }
  }
  .saveid-btn {
    margin-left: 8px;
  }
}
.cover {
  border-radius: 4px;
  width: 200px;
  height: 100px;

  img {
    display: block;
    border-radius: 4px;
    width: 200px;
    height: 100px;
  }
}

.upload {
  position: relative;
  margin-left: 49px;

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
    width: 150px;
    height: 40px;
    padding: 6px 0;
    font-size: 14px;
    text-align: center;
    color: #ffffff;
    background: #2db7f5;
  }

  .tips {
    font-size: 12px;
    color: #999999;
    margin-top: 3px;
  }
}
.project-setting-section-horizontal {
  line-height: 20px;
  color: #262626;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .project-setting-section {
    flex: 1;
    margin-top: 24px;
    flex-direction: column;

    .section-grid {
      flex: 1 1 auto;
      position: relative;

      label {
        display: inline-block;
        max-width: 100%;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}

.project-setting-section {
  display: flex;
  margin-top: 24px;
  flex-direction: column;

  .section-grid {
    flex: 1 1 auto;
    position: relative;

    label {
      display: inline-block;
      max-width: 100%;
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
