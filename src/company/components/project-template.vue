<template>
  <div class="template-div">
    <div class="template-box">
      <header>
        <span>项目模板</span>
        <Button type="primary" @click="addTemplate">新增模板</Button>
      </header>
      <div class="template-content">
        <List :loading="loading">
          <ListItem v-for="(item, index) in templates" :key="index">
            <ListItemMeta avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" title="This is title" description="This is description, this is description." />
            <template slot="action">
              <li>
                <span @click="eidtTempalte(item.templeteId)">编辑</span>
              </li>
              <li>
                <span @click="delteTemplate(item.templeteId)">删除</span>
              </li>
            </template>
          </ListItem>
        </List>
      </div>
    </div>
    <Modal v-model="showTemplate" footer-hide title="自定义项目模板" width="360" >
      <div class="add-template-box" v-if="showTemplate">
        <div class="add-template-img">
          <img :src="defaultImg" />
        </div>
        <div class="add-template-upload" style="margin-top:15px">
          <Upload
            action="/"
            ref="upload"
            :show-upload-list="false"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="1024"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
          >
            <Button icon="ios-cloud-upload-outline">上传封面</Button>
          </Upload>
          <span style="margin-left:10px">最佳图片比例为300*150</span>
        </div>
        <div style="margin-top:15px"><Input v-model="templateName" placeholder="请输入模板名称（必填）" /></div>
        <div style="margin-top:15px"><Input v-model="templateDes" maxlength="100" show-word-limit type="textarea" placeholder="请输入模板描述"/></div>
        <div style="margin-top:15px"><Button type="primary" long @click="saveTemplate">保存模板</Button></div>
      </div>
    </Modal>
  </div>
</template>
<script>
import projectTemplate from "./projectTemplate.vue";
export default {
  components: { projectTemplate },
  data() {
    return {
      defaultImg:'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/project/bj.png',
      loading: false,
      templates: [{ templeteId: "xxxxx" }],
      showTemplate: false,
      templateName:'',
      templateDes:'',
      fileName:''
    };
  },
  methods: {
    addTemplate() {
      this.showTemplate = true;
      this.defaultImg = 'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/project/bj.png';
      this.templateName='';
      this.templateDes='';
      this.fileName='';
    },
    saveTemplate(){

    },
    eidtTempalte(templeteId) {},
    delteTemplate(templeteId) {},
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件格式不正确，请选择jpg或者png.",
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小超出限制",
        desc: "文件大小不能超过1M，请重新调整再上传",
      });
    },
    handleBeforeUpload(file) {
      const fileReader = new FileReader(); //内置方法new FileReader()   读取文件
      fileReader.addEventListener("load", () => {
        this.defaultImg = fileReader.result;
      });
      fileReader.readAsDataURL(file);
      //到这里后, 选择图片就可以显示出来了
      this.fileName = 'upload/template/' + this.random_string(10) + this.get_suffix(this.filename);
      return false;
    },
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
  padding-right: 20px;
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
</style>
