<template>
  <div class="chat-content">
    <div class="chat-content-left">
      <Tabs value="contact" @on-click="changeTab">
        <TabPane label="私信" name="contact">
          <ul class="chat-list">
            <li class="chat-list-item df" v-for="item in userList['contact']" :key="item.name">
              <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4008032110,1843662736&fm=26&gp=0.jpg"
                alt />
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
            <li class="chat-list-item df" v-for="item in userList['group']" :key="item.groupid">
              <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4008032110,1843662736&fm=26&gp=0.jpg"
                alt />
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
              <div v-if="msgList != null && msgList.length > 0">
                <div v-for="(item,i) in msgList" :key="i" style="padding-bottom:10px;">
                  <div class="me-msg" v-if="item.isOwn && item.chatDel == 0">
                    <div class="me" v-if="item.content">
                      <div class="content" v-html="item.content"></div>
                    </div>
                    <div class="file-box" v-if="item.fileList.length">
                      <div class="one-file" v-for="(f, i) in item.fileList" :key="i">
                        <!-- <img
                          v-if="images.indexOf(f.ext) > -1"
                          :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + f.fileUrl"
                          alt
                        />
                        <img v-else src="@/icons/img/moren.png" alt />-->
                        <p>{{ f.fileName }}</p>
                        <span>{{ f.size }}</span>
                      </div>
                    </div>
                    <div class="time me-time">
                      <Time :time="item.createTime" />
                      <span v-if="item.fileList.length" @click="downLoad(item.chatId)">下载附件</span>
                      <span class="chehui-btn" @click="chehui(item.chatId)"
                        v-if="new Date().getTime() - item.createTime < 1000 * 60 * 2">撤回</span>
                    </div>
                  </div>
                  <div v-else-if="item.chatDel == 1" class="chehui">“{{ item.user.userName }}”撤回了一条消息</div>
                  <div v-else>
                    <div class="other">
                      <img :src="item.user.image" alt />
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
                <img src="@/icons/img/no-msg.png" alt />
                <p>还没有项目群聊消息</p>
                <span>项目中的成员都可以在这里参与群聊</span>
              </div>
            </div>
          </div>
          <!--发消息-->
          <div class="talk">
            <div class="talkinners">
              <div class="talk-content">
                <Tooltip content="添加附件" class="fl" transfer>
                  <Upload ref="upload" :show-upload-list="false" :before-upload="handleBeforeUpload" multiple
                    :action="host" :data="uploadData" :headers="headers">
                    <Icon class="up-file" type="md-attach" />
                  </Upload>
                </Tooltip>
                <!-- 表情包组件 -->
                <Tooltip content="添加表情" class="fl" transfer>
                  <Emoji @choose="chooseEmoji" ref="emoji"></Emoji>
                </Tooltip>
              </div>
              <div class="talkUp">
                <div class="talkSymbol" v-if="showSymbol" :style="{ left: offsetLeft }">
                  <ul>
                    <li v-for="(item, index) in symbolData" :key="index" @click="choseSymbol(item.name)">
                      <img src="../../assets/images/headUser.png" alt />
                      {{ item.name }}
                      <span v-if="index == 0">・{{ symbolData.length - 1 }}</span>
                    </li>
                  </ul>
                </div>
                <div id="input" ref="textarea" contenteditable="true" @keyup="SymbolBox($event)"
                  @keyup.enter="sendChat"></div>

                <ul class="updata-box">
                  <li v-for="(item, index) in uploadList" :key="index">
                    <p class="group-chat-file">
                      <span>{{ item.name }} &nbsp; {{ renderSize(item.size) }} KB</span>
                      <Progress v-if="item.showProgress" :percent="item.percentage" :stroke-width="5" hide-info />
                    </p>
                    <Icon @click="delFile(index)" class="ivu-icon ivu-icon-ios-close" size="24" />
                  </li>
                </ul>
              </div>
              <div class="talkDown">
                <div class="send fr">
                  <Button type="primary" @click="sendMsg">发送</Button>
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
        },
        changeName: 'contact'
      };
    },
    mounted() {
      // this.getChat();
      // this.uploadList = this.$refs.upload.fileList;
      // this.aa();
      this.onGetContactUserList();
      console.log(this.msgList)
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
      ...mapState("chat", ["chatData", "images"]),
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
          group: this.group,
        };
      },
    },
    methods: {
      ...mapActions("chat", ["initChat"]),
      ...mapActions(["onGetGroupUserList", "onGetContactUserList", 'onGetCurrentChatObjMsg']),

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
        console.log(files);
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
              progress: function (p) {
                that.percentage.splice(index, 1, Math.floor(p * 100));
              }
            })
            .then(function (result) {
              var myfile = {};
              myfile.fileName = file.name;
              myfile.fileUrl = result.name;
              myfile.size = that.renderSize(file.size);
              that.charFiles.push(myfile);
            })
            .catch(function (err) {
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
      // 发送文本信息
      sendMsg() {
        let _this = this;
        // 生成本地消息id
        var id = WebIM.conn.getUniqueId();
        var msg = new WebIM.message("txt", id);
        var time = +new Date();
        let con = this.$refs.textarea.innerHTML.replace(/(^\s+)|(\s+$)/g, "");
        // 设置body
        msg.set({
          msg: con, // 发送的消息内容（content是与input输入框双向绑定的变量）
          to: "wangji000", // 接收消息对象，这里可以先写死是admin，代表发给控制台
          roomType: false,
          // ext表示拓展对象，这个会随着你发送而发送过去，你接收时同样可以拿到这个数据
          ext: {
            time
          },
          success: function (id, serverMsgId) {
            console.log(msg); // 自己去打印出来看看是啥
            //把发送者的头像和文本数据push到数组中在页面上展示
            // let value = {
            //   type: "text",
            //   avatar: require("../../assets/defult-avatar.jpg"),
            //   content: msg.value,
            //   to: "admin", // 先写死admin
            //   from: "cwlojako", // 这里写上你控制台创建的测试IM用户ID(我这里是cwlojako,见上图)
            //   time: msg.body.ext.time // 获取发送时间
            // };
            // _this.chatContent.push(value);
          },
          fail: function (e) {
            console.log("消息发送失败");
          }
        });
        msg.body.chatType = "singleChat";
        WebIM.conn.send(msg.body);
        // 发送后将输入框清空
        this.$refs.textarea.innerHTML = "";
      },
      chatList() {
        return this.$store.state.chat.msgList;
      },
      //tab切换群组还是好友
      changeTab(name) {
        this.changeName = name
        if (name == 'contact') {
          this.onGetContactUserList();
        } else {
          this.onGetGroupUserList();
        }
      },
      getLastMsg(item) {
        let name = this.changeName
        const chatList = this.chatList[name];
        console.log(this.$store.state.chat)
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
    }
  };
</script>
<style lang="less" scoped>
  @import "./instantChat.less";
</style>