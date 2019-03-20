
<template>
  <div class="edit_container">
    <quill-editor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>
<script>
  import { quillEditor } from "vue-quill-editor"
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    components: {
      quillEditor
    },
    data () {
      return {
        content: `<p>请输入</p>`,
        editorOption: {
        }
      }
    },
    methods: {
      onEditorReady (editor) { // 准备编辑器

      },
      onEditorBlur (val) {}, // 失去焦点事件
      onEditorFocus () {
        console.log(1)
      }, // 获得焦点事件
      onEditorChange () {
      } // 内容改变事件

    },
    computed: {
      editor () {
        return this.$refs.myQuillEditor.quill
      }
    }
  }
</script>
<style>
  .quill-editor{
    height: 400px;
  }
</style>
