<template>
  <textarea
    class="Simditor"
    ref="editor"
    placeholder="请输入..."
    autofocus
  ></textarea>
</template>

<script>
//import Simditor from 'simditor'
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted() {
    // this.$refs.editor.value = this.value
    // var editor = new Simditor({
    //   textarea: this.$refs.editor,
    //   upload: {
    //     url: '/upload',
    //     params: {},
    //     fileKey: 'file',
    //     connectionCount: 3,
    //     leaveConfirm: '正在上传文件'
    //   }
    //   //optional options
    // })
    // editor.on('blur', () => {
    //   this.$emit('value', editor.getValue())
    // })
  },
  components: {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.simditor {
  border: 0;
}
</style>
