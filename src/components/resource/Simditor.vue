
<template>
  <div ref="editor">
    <p v-html="contents"></p>
  </div>
</template>
<script>
import E from "wangeditor";
import OSS from "ali-oss";
let client = new OSS({
  region: "oss-cn-beijing",
  accessKeyId: "LTAIP4MyTAbONGJx",
  accessKeySecret: "coCyCStZwTPbfu93a3Ax0WiVg3D4EW",
  bucket: "art1001-bim-5d"
});
export default {
  props:['contents'],
  data() {
    return {
      content:''
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
    }
  },
  mounted() {
    this.content=this.contents
    var editor = new E(this.$refs.editor);
    // 关闭粘贴样式的过滤
    editor.customConfig.pasteFilterStyle = false;
    // 忽略粘贴内容中的图片
    editor.customConfig.pasteIgnoreImg = true;
    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
    editor.customConfig.uploadImgMaxLength = 5;
    editor.customConfig.onchange = html => {
      this.content = html;
    };
    // editor.customConfig.onfocus = function() {
    //   editor.txt.clear();
    // };
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "undo", // 撤销
      "redo" // 重复
    ];
    editor.customConfig.customAlert = function(info) {
      this.$Notice.warning({
        title: "上传图片失败"
      });
    };
    var that = this;
    editor.customConfig.customUploadImg = function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      console.log(files);
      // 上传代码返回结果之后，将图片插入到编辑器中
      // insert(imgUrl);

      files.forEach((file, index) => {
        var fileName =
          "upload/share/img/" +
          that.random_string(10) +
          that.get_suffix(file.name);
        client
          .multipartUpload(fileName, file, null)
          .then(function(result) {
            insert(
              //"https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png"
              "https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/" +
                result.name
            );
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    };
    editor.create();
  }
};
</script>
<style>
.quill-editor {
  height: 400px;
}
.w-e-toolbar{
  flex-wrap: wrap;
}
</style>
