<template>
  <div class="talk">
    <div class="talkinner">
      <div class="talkUp"
          >
        <div id="input"
             style="width: 100%;height: 40px;padding: 5px 10px"
             ref="textarea"
             placeholder="按Enter快速发布"
             contenteditable="true"
             @keyup.enter="sendMsg">
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
  import Emoji from '@/components/public/common/emoji/Emoji'
  import insertText from '@/utils/insertText'
  import {sendMsg} from '@/axios/api'
export default {
  name: '',
  props: ['publicId','projectId','publicType'],
  data() {
    return {
      data: '',
      talkvalue: ''
    }
  },
  components: {Emoji},
  methods: {
    // 发送消息
    sendMsg(){
      let con =this.$refs.textarea.innerHTML.replace(/(^\s+)|(\s+$)/g,"")
      if (con){
        let datas={
          'publicId':this.publicId,
          'projectId':this.projectId,
          'publicType':this.publicType,
          'content':con
        }
        console.log(datas)
        sendMsg(datas).then(res => {
          this.$refs.textarea.innerHTML=''
          this.$emit('scroll')
        })
      }
    },
    chooseEmoji (name) {
      // insertText(this.$refs.textarea.$el.children[1], name)
      this.$refs.textarea.innerHTML+='<img src="'+name+'" />'
    },
  }
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
