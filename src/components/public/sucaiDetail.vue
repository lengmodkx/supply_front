<template>
  <div style="width: 100%;height: 100%">
    <div class="f-content">
      <div class="f-content-left">
        <div class="img-look-box" >
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
   
  }
};
</script>

<style scoped lang="less">
 @import "./sucaiDetail";
</style>
