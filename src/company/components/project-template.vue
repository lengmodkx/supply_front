<template>
  <div class="template-div">
    <div class="template-box">
      <header>
        <span>项目模板</span>
        <Button type="primary" @click="addTemplate()">新增模板</Button>
      </header>
      <div class="template-content">
        <List :loading="loading">
          <ListItem v-for="(item, index) in templates" :key="index">
            <ListItemMeta :avatar="item.templateCover" :title="item.templateName" :description="item.templateDes" />
            <template slot="action">
              <li>
                <span @click="showTaskModal(item)">任务列表</span>
              </li>
              <li>
                <span @click="addTemplate(item)">编辑</span>
              </li>
              <li>
                <Poptip confirm title="确定删除此模板吗?" @on-ok="deleteTemplate(item.templateId)" transfer>
                  <span>删除</span>
                </Poptip>
              </li>
            </template>
          </ListItem>
        </List>
      </div>
    </div>
    <Modal v-model="showTemplate" footer-hide title="自定义项目模板" width="360">
      <div class="add-template-box" v-if="showTemplate">
        <div class="add-template-img">
          <img :src="defaultImg" />
        </div>
        <div class="add-template-upload" style="margin-top:15px">
          <Upload ref="upload" :show-upload-list="true" :format="['jpg', 'jpeg', 'png']" :max-size="1024"
            :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload"
            :action="host" :data="uploadData" :headers="headers" :on-success="handleSuccess">
            <Button icon="ios-cloud-upload-outline">上传封面</Button>
          </Upload>
          <span style="margin-left:10px">最佳图片比例为300*150</span>
        </div>
        <div style="margin-top:15px"><Input v-model="templateName" placeholder="请输入模板名称（必填）" /></div>
        <div style="margin-top:15px"><Input v-model="templateDes" maxlength="100" show-word-limit type="textarea"
            placeholder="请输入模板描述（必填）" /></div>
        <div style="margin-top:15px"><Button type="primary" long @click="saveTemplate">保存模板</Button></div>
      </div>
    </Modal>
    <Modal v-model="showTaskList" footer-hide title="自定义任务列表" fullscreen @on-visible-change="changeVisible">
      <div v-if="showTaskList" class="task-list-box">
        <header>
          <span>{{ templateName }} 任务列表</span>
          <Button type="primary" @click="showRelationAdd()">添加任务列表</Button>
        </header>
        <div class="task-list-content">
          <List>
            <ListItem v-for="(item, index) in relations" :key="index">
              <ListItemMeta :title="item.relationName" :description="'排序：' + item.relationOrder" />
              <template slot="action">
                <li>
                  <span @click="showRelationAdd(item)">编辑</span>
                </li>
                <li>
                  <Poptip confirm title="确定删除此模板吗?" transfer @on-ok="deleteRelation(item)">
                    <span>删除</span>
                  </Poptip>
                </li>
              </template>
            </ListItem>
          </List>
        </div>
      </div>
    </Modal>
    <Modal footer-hide title="自定义任务列表" v-model="addRelation" width="330">
      <div>
        <Input v-model="relationName" placeholder="列表名称（必填）" style="width: 300px" />
        <Input v-model="relationOrder" type="number" placeholder="排序（必填）" style="width: 300px;margin-top:15px" />
        <div style="margin-top:15px"><span>排序，值越小越靠前，默认0</span></div>
        <Button type="primary" long style="margin-top:15px" @click="saveRelation">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import projectTemplate from "./projectTemplate.vue";
  import {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    initTemplate
  } from "../axios/api.js";
  import {
    initTemplateRelation,
    createTemplateRelation,
    updateTemplateRelation,
    deleteTemplateRelation
  } from "../axios/api.js";
  import {
    oss
  } from "@/axios/ossweb";
  export default {
    components: {
      projectTemplate
    },
    data() {
      return {
        defaultImg: "https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/project/bj.png",
        loading: false,
        templates: [],
        showTemplate: false,
        templateName: "",
        templateDes: "",
        fileName: "",
        templateId: "",
        showTaskList: false,
        relations: [],
        addRelation: false,
        relationName: "",
        relationOrder: 0,
        relationId: "",
        uploadData: {},
        host: "",
        headers: {
          "x-auth-token": localStorage.token
        },
        fileObj:{}
      };
    },
    mounted() {
      this.initTemplate();
    },
    methods: {
      initTemplate() {
        initTemplate({
          orgId: localStorage.companyId
        }).then((res) => {
          if (res.result == 1) {
            this.templates = res.data;
          }
        });
      },

      addTemplate(item) {
        this.showTemplate = true;
        if (item) {
          this.defaultImg = item.templateCover;
          this.templateName = item.templateName;
          this.templateDes = item.templateDes;
          this.fileName = item.templateCover;
          this.templateId = item.templateId;
        } else {
          this.defaultImg = "https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/project/bj.png";
          this.templateName = "";
          this.templateDes = "";
          this.fileName = "";
        }
      },
      saveTemplate() {
        if (this.templateId) {
          this.editTempalte(this.templateId);
        } else {
          if (!this.templateName) {
            this.$Message.warning("请输入模板名称");
            return false;
          }
          if (!this.templateDes) {
            this.$Message.warning("请输入模板描述");
            return false;
          }
          let data = {
            templateName: this.templateName,
            templateDes: this.templateDes,
            templateCover: this.fileName ? this.fileName : this.defaultImg,
            orgId: localStorage.companyId,
          };
          createTemplate(data).then((res) => {
            if (res.result == 1) {
              this.showTemplate = false;
              this.initTemplate();
              this.$Message.success("保存成功");
            } else {
              this.$Message.warning("保存失败");
            }
          });
        }
      },
      editTempalte(templateId) {
        if (!this.templateName) {
          this.$Message.warning("请输入模板名称");
          return false;
        }
        if (!this.templateDes) {
          this.$Message.warning("请输入模板描述");
          return false;
        }
        let data = {
          templateId: templateId,
          templateName: this.templateName,
          templateDes: this.templateDes,
          templateCover: this.fileName ? this.fileName : this.defaultImg,
        };
        updateTemplate(data).then((res) => {
          if (res.result == 1) {
            this.showTemplate = false;
            this.initTemplate();
            this.$Message.success("保存成功");
          } else {
            this.$Message.warning("保存失败");
          }
        });
      },
      deleteTemplate(templateId) {
        let data = {
          templateId: templateId
        };
        deleteTemplate(data).then((res) => {
          if (res.result == 1) {
            this.initTemplate();
            this.$Message.success("删除成功");
          } else {
            this.$Message.warning("删除失败");
          }
        });
      },
      showTaskModal(template) {
        this.showTaskList = true;
        this.templateId = template.templateId;
        this.templateName = template.templateName;
      },
      handleFormatError(file) {
        this.$Message.warning({
          title: "文件格式不正确",
          desc: "文件格式不正确，请选择jpg或者png.",
        });
      },
      handleMaxSize(file) {
        this.$Message.warning({
          title: "文件大小超出限制",
          desc: "文件大小不能超过1M，请重新调整再上传",
        });
      },
      handleBeforeUpload(file) {
        let dir = ''
        dir = "upload/template/" + this.$moment().format('YYYY-MM-DD') + "/";
        return oss(dir, file.name).then(res => {
          this.host = res.host;
          this.uploadData = res;
          this.fileObj=file
        });
      },
      handleSuccess() {
        const fileReader = new FileReader(); //内置方法new FileReader()   读取文件
        fileReader.addEventListener("load", () => {
          this.defaultImg = fileReader.result;
        });
        fileReader.readAsDataURL(this.fileObj);
        //到这里后, 选择图片就可以显示出来了
      },
      changeVisible(value) {
        if (value) {
          this.initRelation();
        }
      },
      showRelationAdd(relation) {
        this.addRelation = true;
        if (relation) {
          this.relationName = relation.relationName;
          this.relationOrder = relation.relationOrder;
          this.relationId = relation.relationId;
        } else {
          this.relationName = '';
          this.relationOrder = '0';
          this.relationId = '';
        }

      },
      initRelation() {
        initTemplateRelation({
          templateId: this.templateId
        }).then((res) => {
          if (res.result == 1) {
            this.relations = res.data;
          }
        });
      },
      saveRelation() {
        if (!this.relationName) {
          this.$Message.warning("请输入任务列表名称");
          return false;
        }
        let data = {
          templateId: this.templateId,
          relationName: this.relationName,
          relationOrder: this.relationOrder,
        };
        if (this.relationId) {
          this.updateRelation();
        } else {
          createTemplateRelation(data).then((res) => {
            if (res.result == 1) {
              this.addRelation = false;
              this.initRelation();
              this.$Message.success("创建成功");
            } else {
              this.$Message.warning("创建失败");
            }
          });
        }
      },
      updateRelation() {
        if (!this.relationName) {
          this.$Message.warning("请输入任务列表名称");
          return false;
        }

        let data = {
          relationId: this.relationId,
          relationName: this.relationName,
          relationOrder: this.relationOrder,
        };
        updateTemplateRelation(data).then((res) => {
          if (res.result == 1) {
            this.addRelation = false;
            this.initRelation();
            this.$Message.success("更新成功");
          } else {
            this.$Message.warning("更新失败");
          }
        });
      },
      deleteRelation(item) {
        let data = {
          relationId: item.relationId
        };
        deleteTemplateRelation(data).then((res) => {
          if (res.result == 1) {
            this.initRelation();
            this.$Message.success("删除成功");
          } else {
            this.$Message.warning("删除失败");
          }
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  .template-div {
    height: calc(100vh - 88px);
    background: #fff;
    border-radius: 4px;
  }

  .template-box {
    width: 100%;
    margin-bottom: 10px;
    height: 100%;

    header {
      width: 100%;
      height: 70px;
      border-bottom: 1px solid #e5e5e5;
      padding: 0 24px;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .template-content {
    padding-left: 20px;
    padding-right: 45px;
    height: calc(100vh - 158px);
    overflow: hidden;
    overflow-y: auto;
  }

  .add-template-box {
    img {
      width: 240px;
      height: 120px;
      border-radius: 4px;
    }

    .add-template-upload {
      display: flex;
      align-items: center;
    }
  }

  .task-list-box {
    width: 100%;
    margin-bottom: 10px;
    height: 100%;

    header {
      width: 100%;
      height: 30px;
      padding: 0 20px;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>