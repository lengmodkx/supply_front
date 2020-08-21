<template>
  <div class="group-chat">
    <div class="group-chat-main">
      <div class="group-chat-view">
        <div class="title">
          {{ projectName }}
          <Icon type="more" class="fr"></Icon>
        </div>
        <div class="chat-text" ref="scrollbox" id="data-list-content">
          <!--有消息-->
          <div style="height: 100%">
            <div v-if="chatData != null && chatData.length > 0">
              <div v-for="(item, index) in chatData" :key="index" style="padding-bottom:10px;">
                <div class="me-msg" v-if="item.isOwn && item.chatDel == 0">
                  <div class="me" v-if="item.content">
                    <div class="content" v-html="item.content"></div>
                  </div>
                  <div class="file-box" v-if="item.fileList.length">
                    <div class="one-file" v-for="(f, i) in item.fileList" :key="i">
                      <img
                        v-if="images.indexOf(f.ext) > -1"
                        :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + f.fileUrl"
                        alt
                      />
                      <img v-else src="@/icons/img/moren.png" alt />
                      <p>{{ f.fileName }}</p>
                      <span>{{ f.size }}</span>
                    </div>
                  </div>
                  <div class="time me-time">
                    <Time :time="item.createTime" />
                    <span v-if="item.fileList.length" @click="downLoad(item.chatId)">下载附件</span>
                    <span
                      class="chehui-btn"
                      @click="chehui(item.chatId)"
                      v-if="new Date().getTime() - item.createTime < 1000 * 60 * 2"
                    >撤回</span>
                  </div>
                </div>
                <div v-else-if="item.chatDel == 1" class="chehui">“{{ item.user.userName }}”撤回了一条消息</div>
                <div v-else>
                  <div class="other">
                    <img :src="item.user.image" alt />
                    <div class="content" v-html="item.content" v-if="item.content"></div>
                    <div class="file-box" v-if="item.fileList.length">
                      <div class="one-file" v-for="(f, i) in item.fileList" :key="i">
                        <img
                          v-if="images.indexOf(f.ext) > -1"
                          :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + f.fileUrl"
                          alt
                        />
                        <img v-else src="@/icons/img/moren.png" alt />
                        <p>{{ f.fileName }}</p>
                        <span>{{ f.size }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="time">
                    <Time :time="item.createTime" />
                    <span v-if="item.fileList.length" @click="downLoad(item.chatId)">下载附件</span>
                  </div>
                </div>
              </div>
            </div>
            <!--无消息-->
            <div class="no-msg" v-else>
              <img src="@/icons/img/no-msg.png" alt />
              <p>还没有项目群聊消息</p>
              <span>项目中的成员都可以在这里参与群聊</span>
            </div>
          </div>
        </div>
        <!--发消息-->
        <div class="talk">
          <div class="talkinner">
            <div class="talkUp">
              <div class="talkSymbol" v-if="showSymbol" :style="{ left: offsetLeft }">
                <ul>
                  <li
                    v-for="(item, index) in symbolData"
                    :key="index"
                    @click="choseSymbol(item.name)"
                  >
                    <img src="../../../assets/images/headUser.png" alt />
                    {{ item.name }}
                    <span v-if="index == 0">・{{ symbolData.length - 1 }}</span>
                  </li>
                </ul>
              </div>
              <div
                id="input"
                style="width: 100%;height: 40px;padding: 5px 10px"
                ref="textarea"
                placeholder="按Enter快速发布"
                contenteditable="true"
                @keyup.enter="sendChat"
                @keyup="SymbolBox($event)"
              ></div>
              <ul class="updata-box">
                <li v-for="(item, index) in uploadList" :key="index">
                  <p class="group-chat-file">
                    <span>{{ item.name }} &nbsp; {{ renderSize(item.size) }} KB</span>
                    <Progress
                      v-if="item.showProgress"
                      :percent="item.percentage"
                      :stroke-width="5"
                      hide-info
                    />
                  </p>
                  <Icon @click="delFile(index)" class="ivu-icon ivu-icon-ios-close" size="24" />
                </li>
              </ul>
            </div>
            <div class="talkDown clearfix">
              <Tooltip content="添加附件" class="fl" transfer>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :before-upload="handleBeforeUpload"
                  multiple
                  :action="host"
                  :data="uploadData"
                  :headers="headers"
                >
                  <Icon class="up-file" type="md-attach" />
                </Upload>

                <!-- <Icon  class="up-file" @click="showCommon=true" type="md-attach" /> -->
              </Tooltip>
              <!-- 表情包组件 -->
              <Tooltip content="添加表情" class="fl" transfer>
                <Emoji @choose="chooseEmoji" ref="emoji"></Emoji>
              </Tooltip>

              <div class="send fr">
                <Button type="primary" @click="sendChat">发送</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <Modal v-model="showCommon" title="上传附件" class-name="file-vertical-center-modal" :mask-closable="false" footer-hide transfer :width="500">
      <up-file @close="showCommon=false" :projectId="this.$route.params.id" @saveFileInfo="getFiles"></up-file>
    </Modal>-->
  </div>
</template>

<script>
import Emoji from "@/components/public/common/emoji/Emoji";
import insertText from "@/utils/insertText";
import upFile from "./index/chatUpFile";
import { sendChat, getChat, recall } from "../../../axios/api";
import { mapActions, mapState } from "vuex";
// 上传
import OSS from "ali-oss";
let client = new OSS({
  region: "oss-cn-beijing",
  accessKeyId: "LTAIP4MyTAbONGJx",
  accessKeySecret: "coCyCStZwTPbfu93a3Ax0WiVg3D4EW",
  bucket: "art1001-bim-5d"
});
import { oss } from "../../../axios/ossweb";
export default {
  name: "App",
  components: { Emoji, upFile },
  data() {
    return {
      files: [],
      talkvalue: "",
      showCommon: false,
      projectName: localStorage.projectName,
      symbolData: [],
      offsetLeft: 0,
      showSymbol: false,
      showupload: true,
      showProgress: false,
      dirName: "upload/chat/",
      uploadList: [],
      percentage: [],
      charFiles: [],
      uploadData: {},
      host: "",
      headers: {
        "x-auth-token": localStorage.token
      }
    };
  },
  mounted() {
    this.getChat();
    this.uploadList = this.$refs.upload.fileList;
  },
  watch: {
    chatData() {
      this.$nextTick(() => {
        var div = document.getElementById("data-list-content");
        div.scrollTop = div.scrollHeight + 1;
      });
    }
  },
  computed: {
    ...mapState("chat", ["chatData", "images"])
  },
  methods: {
    ...mapActions("chat", ["initChat"]),
    // 获取消息e
    SymbolBox(e) {
      const inner = this.$refs.textarea.innerHTML.split("");
      if (inner[inner.length - 1] === "@") {
        this.showSymbol = true;
        const width = this.$refs.textarea.innerHTML.length * 17;


        if (width < 1200) {
          this.offsetLeft = width + "px";
        } else {
          this.offsetLeft = 850 + "px";
        }
      } else {
        this.showSymbol = false;
      }
    },
    choseSymbol(name) {
      this.showSymbol = false;
      this.$refs.textarea.innerHTML = this.$refs.textarea.innerHTML + name;
    },
    getChat() {
      this.initChat(this.$route.params.id);
    },

    getFiles(files) {
      this.files = files;
      this.showCommon = false;
    },
    //下载附件
    downLoad(id) {
      var url = "";
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_URL;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_URL;
      } else {
        url = "/api";
      }
      window.location.href = url + "/groupchat/" + id;
    },
    chooseEmoji(name) {
      this.$refs.textarea.innerHTML += '<img src="' + name + '" />';
      // insertText(this.$refs.textarea.$el.children[1], name)
    },
    // 撤回消息
    chehui(chatId) {
      recall(chatId, this.$route.params.id);
    },
    delFile(index) {
      this.uploadList.splice(index, 1);
      this.charFiles.splice(index, 1);
    },

    // 上传
    handleBeforeUpload(file) {
      return oss(file.name).then(res => {
        this.host = res.host;
        this.uploadData = res;
        var object = {};
        object.size = this.renderSize(file.size);
        object.url = res.key;
        object.name = file.name.substring(0, file.name.lastIndexOf("."));
        object.ext = file.name.substring(file.name.lastIndexOf("."));
        this.charFiles.push(object);
        // console.log(this.uploadList)
      });
    },
    // 发送消息
    sendChat() {
      let con = this.$refs.textarea.innerHTML.replace(/(^\s+)|(\s+$)/g, "");
        let data = {
          projectId: this.$route.params.id,
          content: con,
          files: JSON.stringify(this.charFiles)
        };
        // console.log(JSON.stringify(this.charFiles))
        sendChat(data).then(res => {
          this.$refs.textarea.innerHTML = "";
          this.$nextTick(() => {
            var div = document.getElementById("data-list-content");
            div.scrollTop = div.scrollHeight + 1;
          });
          this.charFiles = [];
          this.uploadList.splice(0, this.uploadList.length);
          this.$refs.upload.clearFiles();
        });
    },

    uploadFile() {
      this.uploadList.forEach((file, index) => {
        var fileName =
          this.dirName + this.random_string(10) + this.get_suffix(file.name);
        client
          .multipartUpload(fileName, file, {
            progress: function(p) {
              that.percentage.splice(index, 1, Math.floor(p * 100));
            }
          })
          .then(function(result) {
            var myfile = {};
            myfile.fileName = file.name;
            myfile.fileUrl = result.name;
            myfile.size = that.renderSize(file.size);
            that.charFiles.push(myfile);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    },

    random_string(len) {
      len = len || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    get_suffix(filename) {
      var pos = filename.lastIndexOf(".");
      var suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    }
  }
};
</script>

<style lang="less">
.file-box {
  width: 100%;
  min-height: 60px;
  padding: 0 15px 0 0;

  .one-file {
    width: 400px;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background-color: #e5f6fb;
    border-radius: 5px;
    margin: 0px 0px 5px 5px;
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
      margin-right: 15px;
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
    // float: left;
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
      border-radius: 5px;
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
      // 上传文件
      .updata-box {
        max-height: 164px;
        overflow-y: auto;

        li {
          width: 99%;
          padding: 0px 10px;
          margin: 5px auto;
          background: #f0f0f0;
          display: flex;
          flex-direction: row;
          align-items: center;
          .group-chat-file {
            text-align: left;
            flex: 1;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            position: relative;
            padding: 5px 0px;
          }

          .progress {
            width: 98%;
          }
        }
      }
      .talkSymbol {
        position: absolute;
        bottom: 40px;
        display: flex;
        flex-flow: column nowrap;
        box-shadow: 2px 2px 5px #eeeeee;
        ul {
          background: #ffffff;
          max-height: 320px;
          padding: 4px 0;
          overflow-y: auto;
        }
        li {
          display: flex;
          cursor: pointer;
          padding: 10px 30px;
          align-items: center;
          img {
            margin-right: 10px;
            width: 32px;
            height: 32px;
          }
        }
        li:hover {
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
  // align-items: center;
  img {
    width: 26px;
  }
}

.group-chat-file {
  display: flex;
  flex-direction: column;
}
</style>
