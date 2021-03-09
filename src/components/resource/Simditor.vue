<template>
  <div ref="editor">
    <p v-html="contents"></p>
  </div>
</template>
<script>
  import E from "wangeditor";
  import {
    oss
  } from "@/axios/ossweb";
  export default {
    props: ['contents'],
    data() {
      return {
        content: ''
      };
    },
    mounted() {
      this.content = this.contents
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
        "bold", // 粗体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "emoticon", // 表情
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "image", // 插入图片
        "table", // 表格
        "fontName", // 字体
        "head", // 标题
        "fontSize", // 字号
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "undo", // 撤销
        "redo" // 重复
      ];
      editor.customConfig.customAlert = function (info) {
        this.$Notice.warning({
          title: "上传图片失败"
        });
      };
      var that = this;
      editor.customConfig.customUploadImg = function (files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        console.log(files);
        // 上传代码返回结果之后，将图片插入到编辑器中
        // insert(imgUrl);

        files.forEach((file, index) => {
          let dir = ''
          dir = "upload/share/img/" + that.$moment().format('YYYY-MM-DD') + "/";
          return oss(dir, file.name).then(res => {
            //创建一个空对象实例
            var formData = new FormData();
            formData.append('key', res.key); //存储在oss的文件路径
            formData.append('OSSAccessKeyId', res.OSSAccessKeyId); //accessKeyId
            formData.append('policy', res.policy); //policy
            formData.append('signature', res.signature); //签名
            formData.append('success_action_status', '200'); //成功后返回的操作码
            // 将文件存入file下面，这个一定要放到最后！！！不然会出错
            formData.append("file", file);
            var url = res.host
            const xhr = new XMLHttpRequest();
            xhr.open('post', url, true);
            xhr.send(formData)
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                insert(res.host + '/' + res.key)
              }
            }
          });

        });
      };
      editor.create();
    }
  };
</script>
<style>
  .quill-editor {
    height: 350px;
  }

  .w-e-toolbar {
    flex-wrap: wrap;
  }

  .editor {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
  }

  .toolbar {
    border: 1px solid #ccc;
  }

  .text {
    border: 1px solid #ccc;
    min-height: 500px;
  }
</style>