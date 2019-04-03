<template>
  <div class="talk">
    <div class="talkinner">
      <div class="talkUp" @keyup.enter="sendMsg"
           contenteditable="true">
        <Input id="input"
               v-model.trim="talkvalue"
               ref="textarea"
               placeholder="按Enter快速发布" />
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
      if (this.talkvalue){
        let datas={
          'publicId':this.publicId,
          'projectId':this.projectId,
          'publicType':this.publicType,
          'content':this.talkvalue
        }
        console.log(datas)
        sendMsg(datas).then(res => {
          this.talkvalue=''
        })
      }
    },
    chooseEmoji (name) {
      insertText(this.$refs.textarea.$el.children[1], name)
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
</style>
