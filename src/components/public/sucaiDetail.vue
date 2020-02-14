<template>
  <div style="width: 100%;height: 100%">
    <div class="f-content">
      <div class="f-content-left">
        <div class="img-look-box"  v-if="file.ext.includes('jpg') ||
                           file.ext.includes('jpeg') ||
                           file.ext.includes('gif') ||
                           file.ext.includes('bmp') ||
                          file.ext.includes('png')">
          <div class="big-small-box">
            <Tooltip content="放大">
              <Icon @click="changeImgSize(1)" type="ios-add-circle-outline" />
            </Tooltip>
            <span>{{Math.floor(imgSize*100)}}%</span>
            <Tooltip content="缩小">
              <Icon @click="changeImgSize(0)" type="ios-remove-circle-outline" />
            </Tooltip>

          </div>
          <img :style="{transform:'scale('+imgSize+')'}" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.fileUrl" alt="">
        </div>
          <iframe v-else-if="file.ext.includes('doc') ||
                             file.ext.includes('docx') ||
                             file.ext.includes('docm') ||
                             file.ext.includes('dotx') ||
                             file.ext.includes('dotm') ||
                             file.ext.includes('xls') ||
                             file.ext.includes('xlsm') ||
                             file.ext.includes('xltx') ||
                             file.ext.includes('xltm') ||
                             file.ext.includes('xlsb') ||
                             file.ext.includes('xlam') ||
                             file.ext.includes('xlsx') ||
                             file.ext.includes('pptx') ||
                             file.ext.includes('pptm') ||
                             file.ext.includes('ppsx') ||
                             file.ext.includes('potx')" :src="'https://view.officeapps.live.com/op/view.aspx?src=https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.fileUrl" width='100%' height='100%' frameborder='1'>
        </iframe>

        <iframe v-else-if="file.ext.includes('txt')" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.fileUrl" width='100%' height='100%' frameborder='1'>
        </iframe>
        <div v-else class="cant-read-file">
          <span>{{file.fileName}}</span>
          <Button long size="large" type="primary">
            <a style="color: white" :download="file.fileName" :href="'https://www.aldbim.com/api/files/'+file.fileId +'/download'" ref="xiazai">下载文件（{{file.size}}）</a>
          </Button>
        </div>
       
       
      </div>
    </div>

  </div>
</template>

<script>

export default {
  props: ['file'],
  data() {
    return {
      
      imgSize: 1,
     
    };
  },
  methods: {
    closeTag() {
      this.$refs.tags.closeTag();
    },
    
    popHid() {
      setTimeout(() => {
        this.rublish = false;
      }, 300);
    },
    // 关联 回调
    binkCallback() {
      this.relationModal = false;
    },
   
    // 放大缩小图片
    changeImgSize(n) {
      if (n) {
        this.imgSize = this.imgSize + 0.1;
        console.log(this.imgSize);
      } else {
        this.imgSize = this.imgSize - 0.1;
        console.log(this.imgSize);
      }
    },
   
  },
  created:function(){
      console.log(this.file)
  }
};
</script>

<style scoped lang="less">
 @import "./sucaiDetail";
</style>
