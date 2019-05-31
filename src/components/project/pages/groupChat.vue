<template>
  <div class="group-chat">
    <div class="group-chat-main">
      <div class="group-chat-view">
        <div class="title">{{projectName}}
          <Icon type="more" class="fr"></Icon>
        </div>
        <div class="chat-text" ref="scrollbox">

          <!--有消息-->
          <div style="height: 100%">
            <div v-if="chatData.length" ref="heightbox">
              <div v-for="(item, index) in chatData" :key="index">
                <div class="me-msg" v-if="item.isOwn && item.chatDel==0">
                  <div class="me">
                    <div class="content" v-html="item.content"></div>
                  </div>
                  <div class="file-box" v-if="item.fileList.length">
                    <div class="one-file" v-for="(f,i) in item.fileList" :key="i">
                      <img v-if="images.indexOf(f.ext) > -1" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + f.fileUrl" alt="">
                      <img v-else src="@/icons/img/moren.png" alt="">
                      <p>{{f.fileName}}</p>
                      <span>{{f.size}}</span>
                    </div>
                  </div>
                  <div class="time me-time">
                    <Time :time="item.createTime" />
                    <span v-if="item.fileList.length" @click="downLoad(item.chatId)">下载附件</span>
                    <span class="chehui-btn" @click="chehui(item.chatId)" v-if="new Date().getTime()-item.createTime<1000*60*2">撤回</span>
                  </div>
                </div>
                <div v-else-if="item.chatDel==1" class="chehui">“{{item.user.userName}}”撤回了一条消息</div>
                <div v-else>
                  <div class="other">
                    <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.user.image" alt="">
                    <div class="content" v-html="item.content"></div>
                  </div>
                  <div class="time">
                    <Time :time="item.createTime" />
                    <span v-if="item.fileList.length">下载附件</span>
                  </div>
                </div>
              </div>
            </div>
            <!--无消息-->
            <div class="no-msg" v-else>
              <img src="@/icons/img/no-msg.png" alt="">
              <p>还没有项目群聊消息</p>
              <span>项目中的成员都可以在这里参与群聊</span>
            </div>
          </div>
        </div>
        <!--发消息-->
        <div class="talk">
          <div class="talkinner">
            <div class="talkUp">
              <div id="input" style="width: 100%;height: 40px;padding: 5px 10px" ref="textarea" placeholder="按Enter快速发布" contenteditable="true" @keyup.enter="sendChat">
              </div>
            </div>
            <div class="talkDown clearfix">
              <Tooltip content="上传附件" class="fl">
                <Icon @click="showCommon=true" class="up-file" type="md-attach" />
              </Tooltip>
              <!-- 表情包组件 -->
              <Emoji @choose="chooseEmoji" ref="emoji"></Emoji>
              <div class="send fr">
                <Button type="primary" @click="sendChat">发布</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="showCommon" title="上传附件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
      <up-file @close="showCommon=false" :projectId="this.$route.params.id" @saveFileInfo="getFiles"></up-file>
    </Modal>
  </div>
</template>

<script>
import Emoji from "@/components/public/common/emoji/Emoji";
import insertText from "@/utils/insertText";
import upFile from "./index/chatUpFile";
import { sendChat, getChat, recall } from "@/axios/api";
import { mapActions, mapState } from "vuex";
export default {
  name: "App",
  components: { Emoji, upFile },
  data() {
    return {
      files: [],
      talkvalue: "",
      showCommon: false
    };
  },
  mounted() {
    this.getChat();
  },
  watch: {
    chatData() {
      this.$nextTick(() => {
        if (this.$refs.heightbox) {
          this.$refs.scrollbox.scrollTop =
            this.$refs.heightbox.clientHeight + 100;
        }
      });
    }
  },
  computed: {
    ...mapState('chat',['chatData','images']),
    ...mapState('project',['projectName'])
  },
  methods: {
    ...mapActions("chat", ["initChat"]),
    // 获取消息
    getChat() {
      this.initChat(this.$route.params.id).then(res => {
        // this.$refs.scrollbox.scrollTop=this.$refs.heightbox.clientHeight+100
      });
    },
    // 发送消息
    sendChat() {
      let con = this.$refs.textarea.innerHTML.replace(/(^\s+)|(\s+$)/g, "");
      if (con) {
        sendChat(this.$route.params.id, con, JSON.stringify(this.files)).then(
          res => {
            this.$refs.textarea.innerHTML = "";
            this.$nextTick(() => {
              this.$refs.scrollbox.scrollTop =
                this.$refs.heightbox.clientHeight + 100;
              console.log(this.$refs.scrollbox.scrollTop);
            });
          }
        );
      }
    },
    getFiles(files) {
      this.files = files;
      this.showCommon = false;
    },
    //下载附件
    downLoad(id) {
      window.location.href = "http://192.168.3.189:8090/groupchat/" + id;
    },
    chooseEmoji(name) {
      this.$refs.textarea.innerHTML += '<img src="' + name + '" />';
      // insertText(this.$refs.textarea.$el.children[1], name)
    },
    // 撤回消息
    chehui(chatId) {
      recall(chatId, this.$route.params.id).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style lang="less">
.file-box {
  width: 100%;
  height: 60px;
  padding: 0 15px;
  .one-file {
    width: 400px;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background-color: #e5f6fb;
    border-radius: 10px;
    img {
      width: 32px;
      height: 40px;
      margin-right: 8px;
      flex: none;
    }
    p {
      width: 290px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      width: 40px;
      margin-left: 12px;
      flex: none;
      text-align: right;
    }
  }
}
.me-msg {
  .chehui-btn {
    display: none;
  }
  &:hover {
    .chehui-btn {
      display: block;
    }
  }
  .one-file {
    float: right;
  }
}
#input {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 12px;
  img {
    width: 26px;
    height: 26px;
  }
}
.group-chat {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  background-color: rgb(244, 244, 244);
  padding-top: 20px;
  .time {
    font-size: 11px;
    padding: 0 15px 0 62px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    span {
      cursor: pointer;
      margin: 0 5px;
    }
    &.me-time {
      text-align: right;
      flex-direction: row-reverse;
    }
  }
  .other .one-file {
    float: left;
  }
  .other,
  .me {
    width: 100%;
    display: flex;
    padding: 0 15px;
    margin-top: 25px;
    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 10px;
      margin-top: 5px;
    }
    .content {
      display: inline-block;
      padding: 8px 13px;
      color: #383838;
      font-size: 15px;
      word-break: break-word;
      background-color: #eee;
      border-radius: 10px;
    }
  }
  .me {
    display: inline-block !important;
    .content {
      float: right;
      text-align: right;
      background-color: #e5f6fb;
    }
  }
  .title {
    line-height: 64px;
    padding: 0 16px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 18px;
    .fr {
      font-size: 25px;
      margin-top: 19.5px;
      cursor: pointer;
    }
  }
  .group-chat-main {
    position: relative;
    height: 100%;
    background-color: #fff;
    margin: 0 auto;
    width: 1100px;
    border-radius: 3px 3px 0 0;
    -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  }
  .group-chat-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    .chat-text {
      overflow-x: hidden;
      overflow-y: scroll;
      padding-bottom: 25px;
      &::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #cecece;
      }
    }
  }
  .group-chat-view,
  .group-chat-view .chat-text {
    position: relative;
    height: 100%;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  }
}
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
.up-file {
  float: left;
  font-size: 20px;
  transform: rotate(90deg);
  cursor: pointer;
  color: gray;
  margin-top: 15px;
  margin-left: 5px;
  &:hover {
    color: #3da8f5;
  }
}
.chehui {
  width: 330px;
  margin: 0 auto;
  margin-top: 25px;
  text-align: center;
  font-size: 12px;
  padding: 0 10px;
  height: 28px;
  line-height: 28px;
  background-color: #efeeec;
  color: #a6a6a6;
  border-radius: 8px;
}
.no-msg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #d2d2d2;
  img {
    width: 95px;
    margin-bottom: 10px;
  }
  p {
    font-size: 16px;
    line-height: 20px;
  }
  span {
    font-size: 12px;
    line-height: 20px;
  }
}
.content {
  display: flex !important;
  align-items: center;
  img {
    width: 26px;
  }
}
</style>
