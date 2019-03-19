<template>
  <div>
    <textarea :ref="id" v-model="nValue">
    </textarea>
    <div>
      <Button @click="$emit('cancel',nValue)">取消</Button>
      <Button type="primary"
              @click="$emit('save',nValue)">保存</Button>
    </div>
  </div>
</template>
<script>
import Simditor from 'simditor'
import 'simditor/styles/simditor.css'
export default {
  name: 'simditor',
  props: ['value'],
  data () {
    return {
      id: 'simditorbox_' + +new Date(),
      nValue: this.value,
      editor: '',
      // 'underline',// 'strikethrough',// 'fontScale',// 'color',// 'code',// 'indent',// 'outdent',// 'alignment',
      toolbar: ['title', 'bold', 'italic', 'image', 'link', 'ol', 'ul', 'blockquote', 'hr', 'table']

    }
  },
  mounted () {
    this.createEditor()
  },
  methods: {
    createEditor () {
      this.editor = new Simditor({
        textarea: this.$refs[this.id],
        toolbar: this.toolbar,
        tabIndent: true,//是否在编辑器中使用 tab 键来缩进
        imageButton: 'upload',
        pasteImage: true,
        upload: {
          //https://simditor.tower.im/docs/doc-config.html#anchor-imageButton
          url: '/upload', //文件上传的接口地址
          params: null, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
          fileKey: 'image', //服务器端获取文件数据的参数名
          connectionCount: 3,
          leaveConfirm: '正在上传文件'
        }
      });
      this.editor.on("valuechanged", (e, src) => {
        this.nValue = this.editor.getValue()
      })
    }
  }
}

</script>
<style>
.simditor .simditor-toolbar > ul > li > .toolbar-item {
  width: 30px;
  height: 30px;
  line-height: 30px;
}
.simditor .simditor-toolbar {
  background-color: #eee;
}
.simditor .simditor-body {
  min-height: 130px;
  padding: 10px;
}
.simditor .simditor-body p{
  margin-bottom:0px !important;
}
</style>
