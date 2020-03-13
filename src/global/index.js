const global = {
  // install方法是必需的
  // 包含两个参数：Vue 构造器，一个可选的选项对象
  install(Vue, options) {
    Vue.prototype.IMAGE_SERVER = 'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'
    Vue.prototype.HEIGHT = window.innerHeight
    Vue.prototype.renderSize = this.renderSize
  },
  renderSize(value) {
    if (null == value || value == '') {
      return '0B'
    }
    var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
    var index = 0,
      srcsize = parseFloat(value)
    index = Math.floor(Math.log(srcsize) / Math.log(1024))
    var size = srcsize / Math.pow(1024, index)
    //  保留的小数位数
    size = size.toFixed(2)
    return size + unitArr[index]
  },
  _isNotEmpty(value){
    if(value!==null&&value!==''&&value!=undefined){
      return true;
    }else{
      return false;
    }
  }

}
export default global
