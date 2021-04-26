<template>
  <div class="im-chat-home-modal">
    <div class="im-chat-menu">
      <Avatar icon="ios-person" class="menu-img" />
      <Tooltip content="聊天" transfer>
        <img src="../assets/images/chat_list.png" class="menu-img1" />
      </Tooltip>
      <Tooltip content="通讯录" transfer>
        <img src="../assets/images/chat_group.png" class="menu-img1" />
      </Tooltip>
    </div>
    <div class="im-chat-contact">
      <div class="contact-header">
        <Input suffix="ios-search" placeholder="搜索" style="width: auto" class="contact-header-search" />
        <div class="contact-header-add"><img src="../assets/images/chat_add.png" /></div>
      </div>
      <div class="contact-people">
        <Badge :count="9" :overflow-count="99" :offset="[0, 15]" class="badge-alone">
          <Avatar icon="ios-person" class="contact-people-img" />
        </Badge>
        <div class="contact-people-content">
          <div class="content-name-time">
            <span class="name">汪亚峰</span>
            <span class="time">10:15</span>
          </div>
          <span class="content">今晚去大排档吃饭嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻</span>
        </div>
      </div>
    </div>
    <div class="im-chat-content">
      <div class="im-chat-content-header">
        <div>
          <Avatar icon="ios-person" class="header-img" />
          <span class="header-name">wangyafeng</span>
        </div>
        <div class="header-close" @click="closeModal"><img src="../assets/images/chat_close.png" /></div>
      </div>
      <div class="chat-content-list">
        
      </div>
      <div class="chat-content-send">
        <div class="chat-content-emoji">
          <VEmojiPicker v-show="isShowEmoji" @select="selectEmoji" />
        </div>
        <!-- <div class="m-recorder"><m-recorder v-if="showRecord" @handleStop="handelEndRecord"></m-recorder></div> -->
        <div class="send-img-list">
          <svg-icon name="biaoqing" class="biaoqing" @click="isShowEmoji = !isShowEmoji"></svg-icon>
          <svg-icon name="accessories" class="accessories"></svg-icon>
          <svg-icon name="tupian" class="tupian"></svg-icon>
          <!-- <svg-icon name="yuyin" class="yuyin" @click="showRecord=!showRecord"></svg-icon> -->
          <!-- <svg-icon name="video" class="video"></svg-icon> -->
          <svg-icon name="info" class="info"></svg-icon>
        </div>
        <Input ref="textarea" id="textarea" @keydown.native="handleContent($event)" v-model="chatContent" :rows="5" :autosize="{ maxRows: 5, minRows: 5 }" maxlength="300" type="textarea" placeholder="请输入内容" autofocus class="send-content" />
        <Button type="primary" class="send-btn" @click="sendContent">发送</Button>
      </div>
    </div>
    
  </div>
</template>
<script>
import { VEmojiPicker } from "v-emoji-picker";
import mRecorder from './mRecorder.vue'
export default {
  name: "ChatIM",
  components: { VEmojiPicker,mRecorder },
  data() {
    return {
      showRecord:false,
      msource:null,
      isShowEmoji: false,
      activeIndex: 0,
      chatContent: "",
      emoji: "",
      userId:'1',
      chatList: [
        {
          contentType: "1",
          content: "今晚去吃饭",
          id: 1,
          time: "",
          fromId: "1",
          toId: "2",
          userName:'',
          image:""
        },
        {
          contentType: "2",
          content: "视频",
          id: 2,
          time: "",
          fromId: "1",
          toId: "2",
          userName:'',
          image:""
        },
      ],
    };
  },
  mounted() {
    this.$refs.textarea.focus();
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    sendContent() {
      console.log(">>>>>>>>", this.chatContent);
      if (this.chatContent == null || this.chatContent == "" || this.chatContent == undefined) {
        this.$Message.warning("请输入聊天内容！");
      }
    },
    handleContent(e) {
      if (e.ctrlKey && e.keyCode == 13) {
        //用户点击了ctrl+enter触发
        this.chatContent += "\n";
      } else if (e.keyCode == 13) {
        //用户点击了enter触发
        e.preventDefault(); // 阻止浏览器默认换行操作
        this.sendContent(); // 发送文本
        return false;
      }
    },
    selectEmoji(emoji) {
      console.log(emoji);
      // insertText(this.$refs.textarea.$el.children[1], name)
      //this.$refs.textarea.innerHTML += '<img src="' + name + '" />';
      var elInput = document.getElementById("textarea").getElementsByTagName("textarea")[0]; //根据id选择器选中对象
      var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
      if (startPos === undefined || endPos === undefined) return;
      var txt = elInput.value;
      // 将表情添加到选中的光标位置
      var result = txt.substring(0, startPos) + emoji.data + txt.substring(endPos);
      elInput.value = result; // 赋值给input的value
      // 重新定义光标位置
      elInput.focus();
      elInput.selectionStart = startPos + emoji.data.length;
      elInput.selectionEnd = startPos + emoji.data.length;
      this.chatContent = result; // 赋值给表单中的的字段
      this.isShowEmoji = false;
    },
    // 录音处理结束事件
    handelEndRecord(param) {
      this.msource = param;
      if(param.url!=''){
        var myAuto = document.getElementById('myaudio');
        myAuto.src=param.url;
        myAuto.play();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.im-chat-home-modal {
  width: 900px;
  height: 595px;
  display: flex;
  background-color: #ffffff;
  .im-chat-menu {
    width: 60px;
    height: 595px;
    background: #1685f8;
    display: flex;
    align-items: center;
    flex-direction: column;
    .menu-img {
      margin-top: 15px;
    }
    .menu-img1 {
      margin-top: 40px;
      height: 28px;
      width: 28px;
    }
  }
  .im-chat-contact {
    width: 240px;
    border-right: 1px solid #e8e8e9;
    .contact-header {
      height: 60px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e9;
      .contact-header-search {
        width: 163px;
        height: 32px;
        background: #f3f3f3;
        margin-left: 15px;
        margin-right: 15px;
      }
      .contact-header-add {
        width: 32px;
        height: 32px;
        margin-right: 15px;
      }
    }
    .contact-people {
      height: 66px;
      display: flex;
      border-bottom: 1px solid #e8e8e9;
      align-items: center;
      .contact-people-img {
        margin-left: 15px;
        margin-right: 15px;
        display: inline-block;
      }
      .contact-people-content {
        display: flex;
        flex-direction: column;
        .content-name-time {
          width: 170px;
          display: flex;
          justify-content: space-between;
          .name {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3c3c3c;
          }
          .time {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #707070;
          }
        }

        .content {
          max-width: 160px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #707070;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
  .im-chat-content {
    width: 600px;
    .im-chat-content-header {
      height: 60px;
      border-bottom: 1px solid #e8e8e9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header-close {
        margin-right: 15px;
      }
      .header-img {
        margin-left: 15px;
        margin-right: 15px;
      }
      .header-name {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3c3c3c;
      }
    }
    .chat-content-list {
      height: 384px;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e9;
    }
    .chat-content-send {
      width: 100%;
      .chat-content-emoji {
        position: absolute;
        bottom: 150px;
      }
      .m-recorder{
        position: absolute;
        bottom: 150px;
        left:415px;
        background-color: #ffffff;
        width: 200px;
      }
      .send-img-list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 35px;
        .biaoqing {
          width: 19px;
          margin-left: 10px;
          cursor: pointer;
          color: #ababab;
          &:hover {
            color: #3da8f5;
          }
        }
        .accessories {
          width: 19px;
          margin-left: 10px;
          cursor: pointer;
          color: #ababab;
          &:hover {
            color: #3da8f5;
          }
        }
        .tupian {
          width: 19px;
          margin-left: 10px;
          cursor: pointer;
          color: #ababab;
          &:hover {
            color: #3da8f5;
          }
        }
        .yuyin {
          width: 15px;
          margin-left: 10px;
          cursor: pointer;
          color: #ababab;
          &:hover {
            color: #3da8f5;
          }
        }
        .video {
          width: 19px;
          margin-left: 10px;
          cursor: pointer;
          color: #ababab;
          &:hover {
            color: #3da8f5;
          }
        }
        .info {
          width: 19px;
          margin-left: 10px;
          cursor: pointer;
          color: #ababab;
          &:hover {
            color: #3da8f5;
          }
        }
      }
      .send-content {
        width: 100%;
        /deep/.ivu-input {
          position: relative;
          box-shadow: none;
          border: none;
          background: none;
          border-radius: 0;
          height: 85px;
          overflow: hidden;
        }
      }
      .send-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
}
.badge-alone {
  /deep/.ivu-badge-count {
    height: 15px;
    font-size: 10px;
    line-height: 15px;
    padding: 0px;
  }
}
</style>
