<template>
  <div>
    <div>
      <header>
        <span style="font-size:16px;color:#262626">空白模板</span>
      </header>
      <section>
        <Card class="template-null-content" @click.native="showproject=true">
          <div>
            <Icon type="md-add" size="20" />
            <span>空白模板</span>
          </div>
        </Card>
      </section>
    </div>
    <div>
      <header class="template-manager">
        <span style="font-size:16px;color:#262626">企业模板</span>
        <div class="template-manager-opt">
          <span @click="showTemplate = true"><Icon type="md-add-circle" />新建模板</span>
          <span><Icon type="md-settings" /> 模板管理</span>
        </div>
      </header>
      <section>
        <Row>
          <Col span="6" v-for="(template, index) in templateList" :key="index" @click.native="enterTask(template.templateId)">
            <Card class="template-null-content" :style="`background: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${template.templateCover}) center`">
              <div>
                <span style="color:#ffffff">{{ template.templateName }}</span>
              </div>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
    <Modal v-model="showTemplate" fullscreen footer-hide class="create-template" title="创建企业模板">
      <template-type v-if="showTemplate" @close="showTemplate = false"></template-type>
    </Modal>
    <Modal v-model="showTemplate1" fullscreen footer-hide :closable="false" class="show-template1">
      <create-template v-if="showTemplate1" :templateId="templateId" @close="showTemplate1=false"></create-template>
    </Modal>
    <Modal v-model="showproject" :mask-closable="false" footer-hide>
      <create-project v-if="showproject" :showProject="showproject" @hideModal="hideModal"></create-project>
    </Modal>
  </div>
</template>
<script>
import { templates } from "../axios/template.js";
import templateType from "../components/custemplate/templateType.vue";
import createTemplate from "../components/createTemplate/createTemplate.vue";
import createProject from "./CreateProject.vue";
export default {
  components: { templateType, createTemplate,createProject },
  data() {
    return {
      templateList: [],
      orgId: localStorage.companyId,
      showTemplate: false,
      showTemplate1: false,
      templateId: "",
      showproject:false
    };
  },
  mounted() {
    this.templates();
  },
  methods: {
    templates() {
      templates({ orgId: this.orgId }).then((res) => {
        if (res.result == 1) {
          this.templateList = res.data;
        }
      });
    },
    enterTask(templateId) {
      console.log("xxxxxxxx");
      this.showTemplate1 = true;
      this.templateId = templateId;
    },
    hideModal(value){
      this.showproject = false;
      this.$emit("close",value);
    }
  },
};
</script>
<style lang="less" scoped>
.template-null-content {
  background-color: #f7f7f7;
  color: grey;
  width: 200px;
  height: 100px;
  margin-top: 5px;
  margin-bottom: 15px;
  cursor: pointer;
  i {
    position: absolute;
    top: 5px;
    left: 5px;
  }
  span {
    position: absolute;
    bottom: 5px;
    left: 5px;
  }
}
.template-manager {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .template-manager-opt {
    color: #0077ff;
    i {
      margin-left: 5px;
      margin-right: 5px;
    }
    span {
      cursor: pointer;
    }
  }
}
.create-template {
  .header-box-shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
}

.modal-header {
  height: 100%;
  h3 {
    font-size: 14px;
    font-weight: 700;
    color: #383838;
  }

  .template-property {
    margin-right: 28px;
  }
}
.show-template1{
  /deep/ .ivu-modal-body{
    padding: 0px;
  }
}
</style>
