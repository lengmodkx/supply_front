<template>
  <div class="chat-content">
    <div class="chat-content-left">
      <Tabs value="contact" @on-click="changeTab">
        <TabPane label="私信" name="contact">
          <ul class="chat-list">
            <li
              class="chat-list-item df"
              v-for="item in userList['contact']"
              :key="item.name"
              @click="select2(item, item.name)"
            >
              <img
                src="../../assets/images/headUser.png"
                alt
              />
              <div class="text-content">
                <div>
                  <div class="chat-user">{{item.name}}</div>
                  <div class="message">把icon发我一下</div>
                </div>
                <div class="date-time"></div>
              </div>
            </li>
          </ul>
        </TabPane>
        <TabPane label="群聊" name="group">
          <ul class="chat-list">
            <li
              class="chat-list-item df"
              v-for="item in userList['group']"
              :key="item.groupid"
              @click="select2(item, item.groupid)"
            >
              <img
                src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4008032110,1843662736&fm=26&gp=0.jpg"
                alt
              />
              <div class="text-content">
                <div>
                  <div class="chat-user">{{item.name}}</div>
                  <div class="message">把icon发我一下</div>
                </div>
                <div class="date-time"></div>
              </div>
            </li>
          </ul>
        </TabPane>
      </Tabs>
    </div>
    <div class="chat-content-right">
      <div class="group-chat-main">
        <div class="group-chat-view">
          <div class="title">
            {{ projectName }}
            <Icon type="more" class="fr"></Icon>
          </div>
          <div class="chat-text" ref="scrollbox" id="data-list-content">
            <!--有消息-->
            <div style="height: 100%">
              <div>
                <div v-for="(item,i) in msgList" :key="i" style="padding-bottom:10px;">
                  <div class="me-msg" v-if="item.bySelf">
                    <div class="file-box" v-if="item.type==='file'">
                      <div class="one-file">
                        <img src="@/icons/img/moren.png" alt />
                        <p>{{ item.filename }}</p>
                        <span>{{readablizeBytes(item.file_length)}}</span>
                      </div>
                    </div>
                    <img
                      :key="item.msg"
                      :src="item.msg?item.msg:''"
                      v-else-if="item.type === 'img'"
                      class="img-style"
                    />
                    <div class="me" v-else>
                      <div class="content" v-html="item.msg"></div>
                    </div>

                    <div class="time me-time">
                      <div>{{renderTime(item.time)}}</div>
                      <a :href="item.msg" :download="item.filename" v-if="item.type==='file'">点击下载</a>
                      <!-- <span class="chehui-btn" @click="chehui(item.chatId)"
                      v-if="new Date().getTime() - item.createTime < 1000 * 60 * 2">撤回</span>-->
                    </div>
                  </div>
                  <!-- <div v-else-if="item.chatDel == 1" class="chehui">“{{ item.user.userName }}”撤回了一条消息</div> -->
                  <div v-else-if="!item.bySelf" class="other-msg">
                    <div class="file-box" v-if="item.type==='file'">
                      <div class="one-file">
                        <img src="@/icons/img/moren.png" alt />
                        <p>{{ item.filename }}</p>
                        <span>{{readablizeBytes(item.file_length)}}</span>
                      </div>
                    </div>
                    <img
                      :key="item.msg"
                      :src="item.msg?item.msg:''"
                      v-else-if="item.type === 'img'"
                      class="img-style"
                    />
                    <div class="other" v-else>
                      <div class="content" v-html="item.msg"></div>
                    </div>

                    <div class="time">
                      <div>{{renderTime(item.time)}}</div>
                      <a :href="item.msg" :download="item.filename" v-if="item.type==='file'">点击下载</a>
                    </div>
                  </div>
                </div>
              </div>
              <!--无消息-->
              <!-- <div class="no-msg" v-else>
                <img src="@/icons/img/no-msg.png" alt />
                <p>还没有项目群聊消息</p>
                <span>项目中的成员都可以在这里参与群聊</span>
              </div>-->
            </div>
          </div>
          <!--发消息-->
          <div class="talk">
            <div class="talkinners">
              <div class="talk-content">
                <Tooltip content="添加附件" class="fl" transfer>
                  <label for="uploadFile" @click="clickFile">
                    <Icon class="up-file" type="md-attach" />
                    <input type="file" class="hide" ref="imgDom" @change="fileChange" />
                  </label>
                </Tooltip>
                <!-- 表情包组件 -->
                <Tooltip content="添加表情" class="fl" transfer>
                  <Emoji @choose="chooseEmoji" ref="emoji"></Emoji>
                </Tooltip>
              </div>
              <div class="talkUp">
                <div class="talkSymbol" v-if="showSymbol" :style="{ left: offsetLeft }">
                  <ul>
                    <li
                      v-for="(item, index) in symbolData"
                      :key="index"
                      @click="choseSymbol(item.name)"
                    >
                      <img src="../../assets/images/headUser.png" alt />
                      {{ item.name }}
                      <span
                        v-if="index == 0"
                      >・{{ symbolData.length - 1 }}</span>
                    </li>
                  </ul>
                </div>
                <div
                  id="input"
                  ref="textarea"
                  contenteditable="true"
                  @keyup="SymbolBox($event)"
                  @keyup.enter="sendChat"
                ></div>

                <!-- <ul class="updata-box">
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
                </ul> -->
              </div>
              <div class="talkDown">
                <div class="send fr">
                  <Button type="primary" @click="sendChat">发送</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Emoji from "@/components/public/common/emoji/Emoji";
import insertText from "@/utils/insertText";
import upFile from "../project/pages/index/chatUpFile";
import { sendChat, getChat, recall } from "../../axios/api";
import { mapActions, mapState, mapGetters } from "vuex";
// 上传
import OSS from "ali-oss";
let client = new OSS({
  region: "oss-cn-beijing",
  accessKeyId: "LTAIP4MyTAbONGJx",
  accessKeySecret: "coCyCStZwTPbfu93a3Ax0WiVg3D4EW",
  bucket: "art1001-bim-5d"
});
import { oss } from "../../axios/ossweb";
import moment from "moment";

export default {
  name: "App",
  components: { Emoji, upFile },
  data() {
    return {
      files: [],
      talkvalue: "",
      showCommon: false,
      projectName: '',
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
      },
      changeName: "contact",
      activedKey: {
        contact: "",
        group: ""
      }
    };
  },
  mounted() {
    this.onGetContactUserList();
    setTimeout(() => {
      this.onGetCurrentChatObjMsg({
        type: "contact",
        id: this.userList["contact"][0].name
      });
      this.select2(
        this.userList["contact"][0],
        this.userList["contact"][0].name
      );
    }, 1000);
  },
  watch: {
    msgList() {
      this.$nextTick(() => {
        var div = document.getElementById("data-list-content");
        div.scrollTop = div.scrollHeight + 1;
      });
    }
  },
  computed: {
    ...mapGetters({
      contact: "onGetContactUserList",
      group: "onGetGroupUserList",
      msgList: "onGetCurrentChatObjMsg"
    }),
    userList() {
      return {
        contact: this.contact.filter(item => {
          // if (item && !this.blackList.includes(item.name)) {
          return item;
          // }
        }),
        group: this.group
      };
    }
  },
  methods: {
    ...mapActions("chat", ["initChat"]),
    ...mapActions(["sendFileMessage"]),
    ...mapActions([
      "onGetGroupUserList",
      "onGetContactUserList",
      "onGetCurrentChatObjMsg",
      "onSendText",
      "getHistoryMessage",

    ]),

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
      this.$refs.textarea.innerHTML +=
        '<img src="' + name + '" style="width: 26px;height: 26px;"/>';
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

    // 发送消息
    sendChat() {
      if (
        this.$refs.textarea.innerHTML == "" ||
        this.$refs.textarea.innerHTML == "\n"
      ) {
        this.$refs.textarea.innerHTML = "";
        return;
      }
      this.onSendText({
        chatType: this.changeName,
        chatId: this.$data.activedKey[this.changeName],
        message: this.$refs.textarea.innerHTML
      });
      this.$refs.textarea.innerHTML = "";
      this.$nextTick(() => {
        var div = document.getElementById("data-list-content");
        div.scrollTop = div.scrollHeight + 1;
        if(this.msgList==undefined){
          setTimeout(()=>{
            this.select2(this.$data.activedKey[this.changeName],this.projectName)
          },500)
        }
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
    },
    chatList() {
      return this.$store.state.chat.msgList;
    },
    //tab切换群组还是好友
    changeTab(name) {
      this.changeName = name;
      if (name == "contact") {
        this.onGetContactUserList();
      } else {
        this.onGetGroupUserList();
      }
    },
    getLastMsg(item) {
      let name = this.changeName;
      const chatList = this.chatList[name];
      let userId = "";
      if (name == "contact") {
        userId = item.name;
      } else if (name == "group") {
        userId = item.groupid;
      } else {
        userId = item.id;
      }
      const currentMsgs = chatList[userId] || [];
      let lastMsg = "";
      let lastType =
        currentMsgs.length && currentMsgs[currentMsgs.length - 1].type;
      if (currentMsgs.length) {
        if (lastType === "img") {
          lastMsg = "[image]";
        } else if (lastType === "file") {
          lastMsg = currentMsgs[currentMsgs.length - 1].filename;
        } else if (lastType === "audio") {
          lastMsg = "[audio]";
        } else if (lastType === "vidio") {
          lastMsg = "[vidio]";
        } else {
          lastMsg = currentMsgs[currentMsgs.length - 1].msg;
        }
      }
      const msgTime = currentMsgs.length
        ? this.renderTime(currentMsgs[currentMsgs.length - 1].time)
        : "";
      return {
        lastMsg,
        msgTime
      };
    },
    select2(key, index) {
      this.projectName = index;
      this.$data.selectedKeys = [index];
      this.select(key);
      this.$data.activedKey[this.changeName] = key;
      console.log(this.msgList)
    },
    select(key) {
      if (this.changeName === "group") {
        this.onGetCurrentChatObjMsg({ type: this.changeName, id: key.groupid });
      } else if (this.changeName === "contact") {
        this.onGetCurrentChatObjMsg({ type: this.changeName, id: key.name });
      } 
    },
    selectedKeys() {
      return [this.getKey(this.activedKey[this.changeName]) || ""];
    },
    renderTime(time) {
      const nowStr = new Date();
      const localStr = time ? new Date(time) : nowStr;
      const localMoment = moment(localStr);
      const localFormat = localMoment.format("MM-DD hh:mm A");
      return localFormat;
    },
    // 计算附件大小
    readablizeBytes(value) {
      let s = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
      let e = Math.floor(Math.log(value) / Math.log(1024));
      return (value / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },
    clickFile() {
      let img = this.$refs.imgDom;
      img && img.click();
    },
    // TODO 当前username、及type不是从pams里取
    fileChange(e) {
      let isRoom =
        this.changeName == "chatroom" || this.changeName == "groupchat";
      let file = WebIM.utils.getFileUrl(e.target);
      if (!file.filename) {
        this.$refs.imgDom.value = null;
        return false;
      }
      let obj = {
        chatType: this.changeName,
        chatId: this.$data.activedKey[this.changeName], // TODO 这里在群里面应该取的是ID，后期跟进
        file: file,
        roomType: isRoom,
        callback: () => {
          this.$refs.imgDom.value = null;
        }
      };
      this.sendFileMessage(obj);
    }
  }
};
</script>
<style lang="less" scoped>
@import "./instantChat.less";
</style>