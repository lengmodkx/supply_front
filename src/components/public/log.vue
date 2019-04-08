<template>
  <div class="log-wrap">
      <div style="height: 50px;line-height: 50px;width: 100%;font-size: 16px">所有动态</div>
      <div class="more-msg" v-if="unReadMsg" >
          <span v-if="!restData.length" @click="loadMore">查看剩余{{unReadMsg}}条消息...</span><span v-else @click="shouqi" style="color: #3da8f5">收起</span>
      </div>
      <div class="log-list" v-for="(item, index) in logs" :key="index">
          <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.memberImg" alt="">
          <p class="things">{{item.content}}</p>
          <p class="time"><Time :time="item.createTime-1000*60" :interval="60" /></p>
      </div>
      <div v-show="restData.length">
          <div class="log-list" v-for="(item, index) in restData" :key="index">
              <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.memberImg" alt="">
              <p class="things">{{item.content}}</p>
              <p class="time"><Time :time="item.createTime-1000*60" :interval="60" /></p>
          </div>
      </div>
  </div>
</template>
<script>
    import {restMsg} from '@/axios/api'
  export default {
      props: ['logs','unReadMsg','publicId'],
      components: {
      },
      data() {
          return {
              jiazai: false,
              restData:[]
          }
      },
      mounted(){},
      methods:{
          loadMore(){
              restMsg(this.publicId, this.unReadMsg).then(res => {
                  if (res.result){
                      this.restData=res.data
                  }
              })
          },
          shouqi(){
              this.restData=[]
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

