<template>
  <div class="log-wrap">
      <div style="height: 50px;line-height: 50px;width: 100%;font-size: 16px">所有动态</div>
      <div class="more-msg" v-if="logs.length>9">
          <span v-if="!jiazai" @click="loadMore">查看剩余的{{this.unReadMsg}}条消息...</span><span v-else style="color: #3da8f5">loading...</span>
      </div>
      <div class="log-list" v-for="(item, index) in logs" :key="index">
          <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.memberImg" alt="">
          <p class="things">{{item.content}}</p>
          <p class="time"><Time :time="item.createTime" :interval="1" /></p>
      </div>
  </div>
</template>
<script>
  export default {
      props: ['logs','unReadMsg'],
      components: {
      },
      data() {
          return {
              jiazai: false
          }
      },
      mounted(){},
      methods:{
          loadMore(){
              this.jiazai=true
          }
      }
  }
</script>
<style scoped lang="less">
    .log-wrap{
        width: 100%;
    }
    .log-list{
        width: 100%;
        display: flex;
        margin-bottom: 24px;
        img{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            flex: none;
            margin-right: 16px;
        }
        .things{
            width: 100%;
            line-height: 20px;
            font-size: 12px;
            color: #a6a6a6;
        }
        .time{
            line-height: 20px;
            font-size: 12px;
            color: #a6a6a6;
            flex: none;
            margin-left: 5px;
        }
    }
    .more-msg{
        margin: 5px 0;
        width: 100%;
        cursor: pointer;
        text-align: center;
        color: #3da8f5;
    }
</style>

