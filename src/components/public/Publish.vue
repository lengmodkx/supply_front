<template>
  <div class="talk">
    <div class="talkinner">
      <div class="talkUp">
        <div class="talkSymbol" v-if="showSymbol" :style="{left:offsetLeft}"> 
              <ul >
                <li v-for='(item,index) in symbolData ' :key="index" @click="choseSymbol(item.memberName,item.memberId,index)" >
                  <img  v-if="index==0" src="../../assets/images/headUser.png" alt="">  
                  <img v-else :src="item.memberImg" class="avatar" />
                  {{item.memberName}}  <span v-if="index==0">・{{symbolData.length-1}}</span>
                </li>
              </ul>
       </div>

        <div id="input"
             style="width: 100%;height: 40px;padding: 5px 10px"
             ref="textarea"
             placeholder="按Enter快速发布"
             contenteditable="true"
             @keyup.enter="sendMsg"
             @keydown="SymbolBox($event)" 
             >
        </div>
      </div>
      <div class="talkDown clearfix">
        <!-- 表情包组件 -->
        <Emoji @choose="chooseEmoji"
               ref="emoji"></Emoji>
        <div class="send fr" >
          <Button type="primary" @click="sendMsg">发布</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
  import Emoji from '@/components/public/common/emoji/Emoji'
  import insertText from '@/utils/insertText'
  import {sendMsg} from '@/axios/api'
export default {
  name: '',
  props: ['publicId','projectId','publicType'],
  data() {
    return {
      data: '',
      talkvalue: '',
      showSymbol:true,
      offsetLeft: 0,
      mentionIdList:[],
      ids:""
    }
  },
  components: {Emoji},
   computed: {
    ...mapState("member", ["symbolData",])
  },
  methods: {
    //打开@
    SymbolBox(e){
       
        if(e.keyCode==50){
            console.log(e.keyCode)
            this.showSymbol=true
            const width=this.$refs.textarea.innerHTML.length*17

            if(width<327){
              this.offsetLeft=width+"px"
            }else{
              this.offsetLeft=327+"px"
            }
            console.log(width)
        }else{
           this.showSymbol=false
        }
          

      },
      //选择成员
    choseSymbol(name,id,index){
      this.showSymbol=false;
      this.$refs.textarea.innerHTML=this.$refs.textarea.innerHTML+name

      this.mentionIdList.push(id)
      this.ids= this.mentionIdList.join(",")
     
      console.log(this.ids)
    },
    // 发送消息
    sendMsg(){
      let con =this.$refs.textarea.innerHTML.replace(/(^\s+)|(\s+$)/g,"")
      if (con){
        let datas={
          'publicType':this.publicType,
          'publicId':this.publicId,
          'projectId':this.projectId,
          'content':con,
          "mentionIdList":this.ids.split(",")
        }

        sendMsg(datas).then(res => {
          this.$refs.textarea.innerHTML=''
          this.$emit('scroll')
          this.mentionIdList=[]//发送成功清楚@
        })
      }
    },
    chooseEmoji (name) {
      // insertText(this.$refs.textarea.$el.children[1], name)
      this.$refs.textarea.innerHTML+='<img src="'+name+'" />'
    },
    //获取成员
    searchUser() {
      if (!this.keyword2) {
        this.$Notice.warning({
          title: "请输入关键字"
        });
        return false;
      }
      this.loading = true;
      let projectId = this.$route.params.id;
      getOrgIdUsers(this.keyword2, localStorage.companyId).then(res => {
        this.loading = false;
        if (res.result === 1) {
          this.invitUsers = res.data;
        }
      })
    },

  },
  created:function(){

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .talk {
    position: relative;
    border: 1px solid #e5e5e5;
    .talkinner {
      position: relative;
      min-height: 40px;
      margin: 14px 20px 13px 15px;
      background-color: #fff;
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      .talkUp {
        position: relative;
        z-index: 1;
        max-height: 290px;
        background-color: #fff;
        border-bottom: 1px solid #e8e8e8;
        .talkSymbol{
              position: absolute;
              bottom:40px;
              display: flex;
              flex-flow: column nowrap;
              box-shadow:2px 2px 5px #eeeeee;
              ul{
                background: #ffffff;
                max-height: 320px;
                padding: 4px 0;
                overflow-y: auto;
              }
              li{
                display: flex;
                cursor: pointer;
                padding:10px 30px;
                align-items: center;
                img{
                  border-radius: 50%;
                  margin-right: 10px;
                  width: 32px;
                  height: 32px;
                }
              }
              li:hover{
                background: #f5f5f5;
              }
       }

        #input {
          input:hover {
            border-color: #dddee1;
          }
        }
      }
      .talkDown {
        line-height: 40px;
        height: 40px;

        .send {
          margin-right: 10px;
        }
      }
    }
  }
  .talkUp{
    div{
      display: flex;
      align-items: center;
    }
    img{
      width: 18px;
    }
  }
</style>
