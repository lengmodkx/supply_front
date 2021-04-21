<template>
  <div style="width: 100%;height: 100%">
    <header class="f-header" v-if="type == '文件'">
      <Icon class="close" @click="$emit('close')" type="md-close" />
      <div class="f-header-left">{{ file.fileName }}</div>
      <div class="f-header-right">
        <!-- 更新版本 -->
        <upload-file-card :uploadList="uploadList" @close="handleRemove"></upload-file-card>
        <Upload ref="upload" :show-upload-list="false"
          :before-upload="beforeUpload" :action="uploadHost" :data="uploadData" :on-success="handleSuccess">
           <p class="padd8"><Icon type="ios-cloud-upload-outline"/>更新版本</p>
        </Upload>
        <!-- 下载 -->
        <p class="padd8">
          <Icon type="ios-cloud-download-outline" />
          <a style="color: gray" :download="file.fileName" @click="downLoad(file.fileId)" ref="xiazai">下载</a>
        </p>
      </div>
    </header>

    <div class="f-content">
      <div class="f-content-left">
        <div class="img-look-box" v-if="imageExt.indexOf(file.ext) > -1">
          <div class="big-small-box">
            <Tooltip content="放大">
              <Icon @click="changeImgSize(1)" type="ios-add-circle-outline" />
            </Tooltip>
            <span>{{ Math.floor(imgSize * 100) }}%</span>
            <Tooltip content="缩小">
              <Icon @click="changeImgSize(0)" type="ios-remove-circle-outline" />
            </Tooltip>
          </div>
          <img :style="{ transform: 'scale(' + imgSize + ')' }" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + file.fileUrl" alt="" />
        </div>
        <iframe
          v-else-if="officeExt.indexOf(file.ext) > -1"
          :src="'https://view.officeapps.live.com/op/view.aspx?src=' + url + '/files/' + file.fileId +'/preview'"
          width="100%"
          height="100%"
          frameborder="1"
        >
        </iframe>
        <iframe v-else-if="'.txt'.indexOf(file.ext) > -1" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + file.fileUrl" width="100%" height="100%" frameborder="1"> </iframe>
        <div v-else-if="'.dwg'.indexOf(file.ext)>-1" style="width:100%;height:100%">
            <loading v-if="!file.modelUrl"></loading>
            <iframe v-if="file.modelUrl" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + file.modelUrl" frameborder="1" width="100%" height="100%"></iframe>
        </div>
        <!-- <iframe id="previewpdf" v-else-if="'.pdf'.indexOf(file.ext)>-1" :src="'../../pdf/web/viewer.html?file=https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.fileUrl" width="100%" height="100%" frameborder="0"></iframe> -->
        <iframe id="previewpdf" v-else-if="'.pdf'.indexOf(file.ext)>-1" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.fileUrl" width="100%" height="100%" frameborder="0"></iframe>
        <div v-else class="cant-read-file">
          <span>{{ file.fileName + file.ext }}</span>
          <Button long size="large" type="primary" @click="downLoad(file.fileId)">
            <a style="color: white" :download="file.fileName" ref="xiazai">下载文件（{{ file.size }}）</a>
          </Button>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="f-content-right" v-if="type == '文件'">
        <div class="padd16">
          <!-- 版本 -->
          <div class="bbxx">
            <div><Icon type="ios-folder-open-outline" size="18" />版本信息</div>
            <div class="sp-bw" v-for="(version, index) in file.versions" :key="index">
              <p @click="updateFile(version)">
                <Icon type="ios-information-circle-outline" size="18" />
                <span>{{ version.info }}</span>
                <span v-if="version.isMaster == 1" class="is-master">主版本</span>
              </p>
              <Poptip placement="left" transfer width="280" v-model="version.visible" popper-class="operationBubble">
                <a href="javascript:void(0)">
                  <p class="arrow-down"><Icon type="ios-arrow-down" color="#2d8cf0" v-if="version.isMaster != 1"/></p>
                </a>
                <div slot="title" class="member-title">
                  <span>版本菜单</span>
                  <Icon type="md-close" size="18" class="role-md-close" @click.native="version.visible=false" />
                </div>
              <div slot="content">
                <ul class="org-role">
                  <li @click="updateVersion(version)">
                    <span>设置为主版本</span>
                  </li>
                </ul>
              </div>
              </Poptip>
            </div>
          </div>
          <!--标签-->
          <div class="tags">
            <span class="name"> <Icon type="ios-pricetags-outline"></Icon>标签 </span>
            <!-- 取到data.tag了再添加孙子辈组件 -->
            <!-- :fileTask='"fileTask"' -->
            <Tags ref="tags" :taglist="file.tagList" :publicId="file.fileId" :publicType="publicType" :projectId="file.projectId"></Tags>
          </div>
          <!--关联-->
          <div class="relevance">
            <p class="name"><Icon type="ios-link-outline" />关联内容</p>
            <div class="addLink" @click="relationModal = true"><Icon type="ios-add-circle-outline" />添加关联</div>
            <Modal v-model="relationModal" class="relationModal" id="relationModal" :footer-hide="true" width="850">
              <AddRelation v-if="relationModal" @binkCallback="binkCallback" :publicId="file.fileId" :fromType="publicType"></AddRelation>
            </Modal>
          </div>
          <!--有关联内容-->
          <div class="has-relevance">
            <div v-if="file.bindTasks">
              <ul v-if="file.bindTasks.length > 0">
                <div class="what-title">关联的任务</div>
                <li class="gl-task-list" v-for="(b, i) in file.bindTasks" :key="i">
                  <div class="gl-task-list-con">
                    <Icon type="md-checkbox-outline" size="22" />
                    <!--<Icon type="ios-list-box-outline" size="22" />-->
                    <!--<Icon type="ios-calendar-outline" size="22" />-->
                    <!--<Icon type="ios-document-outline" size="22" />-->
                    <img v-if="b.userImage" :src="b.userImage" alt="执行者" />
                    <img
                      v-else
                      src="../../assets/images/headUser.png"
                    />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.taskName }}</span
                        ><span>{{ b.projectName }}</span>
                      </div>
                      <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <div class="glpop-list"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                      <div class="glpop-list" @click="cancle(b.taskId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                    </div>
                  </Poptip>
                </li>
              </ul>
            </div>
            <div v-if="file.bindFiles">
              <ul v-if="file.bindFiles.length > 0">
                <div class="what-title">关联的文件</div>
                <li class="gl-task-list" v-for="(b, i) in file.bindFiles" :key="i">
                  <div class="gl-task-list-con">
                    <!--<Icon type="md-checkbox-outline" size="22" />-->
                    <Icon type="ios-document-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.fileName }}</span
                        ><span>{{ b.projectName }}</span>
                      </div>
                      <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <div class="glpop-list"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                      <div class="glpop-list" @click="cancle(b.fileId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                    </div>
                  </Poptip>
                </li>
              </ul>
            </div>
            <div v-if="file.bindSchedules">
              <ul v-if="file.bindSchedules.length > 0">
                <div class="what-title">关联的日程</div>
                <li class="gl-task-list" v-for="(b, i) in file.bindSchedules" :key="i">
                  <div class="gl-task-list-con">
                    <!--<Icon type="md-checkbox-outline" size="22" />-->
                    <Icon type="ios-calendar-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.scheduleName }}</span
                        ><span>{{ b.projectName }}</span>
                      </div>
                      <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <div class="glpop-list"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                      <div class="glpop-list" @click="cancle(b.scheduleId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                    </div>
                  </Poptip>
                </li>
              </ul>
            </div>
            <div v-if="file.bindShares">
              <ul v-if="file.bindShares.length > 0">
                <div class="what-title">关联的分享</div>
                <li class="gl-task-list" v-for="(b, i) in file.bindShares" :key="i">
                  <div class="gl-task-list-con">
                    <Icon type="ios-open-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.shareName }}</span
                        ><span>{{ b.projectName }}</span>
                      </div>
                      <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <div class="glpop-list"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                      <div class="glpop-list" @click="cancle(b.shareId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                    </div>
                  </Poptip>
                </li>
              </ul>
            </div>
          </div>
          <div class="line"></div>
          <!-- 设置参与者 -->
          <div class="participator">
            <h5>
              参与者 · {{ file.joinInfo ? file.joinInfo.length : 0 }}
              <Tooltip content="参与者将会收到评论和任务更新通知" placement="right" transfer>
                <Icon type="ios-help"></Icon>
              </Tooltip>
            </h5>
            <div class="involve-list clearfix">
              <div class="member-avatar fl" v-for="(item, index) in file.joinInfo" :key="index">
                <Tooltip :content="item.userName" placement="top" transfer>
                  <div class="ava">
                    <!-- 删除需要加在关闭按钮上 -->
                    <img v-if="item.image" :src="item.image" alt="" />
                    <span class="close" @click="deleteInvolve(item.userId)">×</span>
                  </div>
                </Tooltip>
              </div>
              <div class="addButton fl">
                <InvolveMember ref="involveMember" :checkedList="joinInfoIds" :projectId="file.projectId" @save="saveInvolveMember"></InvolveMember>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <!--所有动态-->
          <log :logs="file.logs" :publicId="file.fileId" :unReadMsg="file.unReadMsg"></log>
        </div>
        <!--发消息-->
        <div class="talk">
          <div class="talkinner">
            <div class="talkUp">
              <div id="input" style="width: 100%;height: 40px;padding: 5px 10px" ref="textarea" placeholder="按Enter快速发布" contenteditable="true" @keyup.enter="sendChat"></div>
            </div>
            <div class="talkDown clearfix">
              <Tooltip content="上传附件" class="fl">
                <Icon @click="showCommon = true" class="up-file" type="md-attach" />
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
      <!-- 右侧 -->
    </div>
  </div>
</template>
<script>
import { mapState,mapActions } from "vuex";
import { jionPeople, recycleBin, filePrivacy,modelChange } from "@/axios/fileApi";
import { folderChild, collect, sendMsg } from "@/axios/api";
import Tags from "../public/Tags.vue";
import AddRelation from "@/components/public/common/AddRelation"; //关联
import log from "@/components/public/log"; //标签
import Emoji from "@/components/public/common/emoji/Emoji"; //表情包
import VersionUpdate from './versionUpdate.vue';
import { oss } from "@/axios/ossweb.js";
import { updateFileVersion,changeVersion } from "@/axios/fileApi";
import { map } from 'highcharts';
export default {
  props: ["type"],
  data() {
    return {
      showCommonFile:false,
      loading:false,
      privacyStatus: "已关闭",
      rublish: false,
      menuShow: false,
      relationModal: false, //关联
      publicType: "文件",
      imgSize: 1,
      url:process.env.NODE_ENV == "test"?process.env.VUE_APP_TEST_URL:process.env.VUE_APP_URL,
      imageExt: [".gif", ".GIF", ".jpg", ".JPG", ".JPEG", ".png", ".PNG", ".bmp", ".BMP"],
      officeExt: [".doc", ".docx", ".docm", ".dotx", ".dotm", ".xls", ".xlsm", ".xltx", ".xltm", ".xlsb", ".xlam", ".xlsx", ".pptx", ".pptm", ".ppsx", ".potx", ".ppt"],
      projectId:this.$route.params.id,
      uploadData: {},
      uploadHost: "",
      dirName: 'upload/file/',
      uploadList: [],
      uploadFiles:[]
    };
  },
  components: { Tags, AddRelation, log, Emoji,versionUpdate: resolve => require(["./versionUpdate"], resolve), VersionUpdate, },
  computed: {
    ...mapState("file", ["joinInfoIds", "file","crumbs","createFileId"])
  },
  mounted() {
    // console.log(this.file);
    //     console.log('xxxxxxxxxxxxxxxxxxxxx')
    // console.log('https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+this.file.fileUrl)
    if(this.file.ext==".dwg"){
        // console.log('xxxxxxxxxxxxxxxxxxxxx')
        modelChange(this.file.fileId);
    }
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    ...mapActions("file",["putOneFile"]),
    handleRemove() {
      this.$refs.upload.clearFiles();
      this.uploadList = [];
    },
    beforeUpload(file) {
      var dir = this.dirName + this.$moment().format('YYYY-MM-DD') + "/";
      return oss(dir,file.name).then(res => {
        this.uploadHost = res.host;
        this.uploadData = res;
        this.uploadList = this.$refs.upload.fileList;
        var myfile = {};
        myfile.fileName = file.name;
        myfile.fileUrl = res.key;
        myfile.size = this.renderSize(file.size);
        myfile.ext = file.name.substr(file.name.indexOf("."),file.name.length);
        myfile.level = this.crumbs.length;
        myfile.parentId = this.createFileId
        this.uploadFiles.push(myfile);
      });
    },
    handleSuccess(res, file){
      this.uploadServer();
    },
    uploadServer(){
      let param = { projectId: this.projectId,fileId:this.file.fileId, files: JSON.stringify(this.uploadFiles) };
      updateFileVersion(this.createFileId, param).then(res => {
        if (res.result === 1) {
          this.uploadFiles = [];
          this.$Notice.success({title: "更新成功"});
        }
      });
    },
    updateVersion(version){
      let params = {
        projectId: this.projectId,
        parentId: this.createFileId,
        oldFileId:version.fileId
      }
      changeVersion(this.file.fileId,params).then(res=>{
        if(res.result==1){

        }
      })
    },
    updateFile(version){
      console.log(version);
      this.putOneFile(version.fileId)
    },
    closeTag() {
      this.$refs.tags.closeTag();
    },
    popHid() {
      setTimeout(() => {
        this.rublish = false;
      }, 300);
    },
    // 关联 回调
    binkCallback() {
      this.relationModal = false;
    },

    // 放大缩小图片
    changeImgSize(n) {
      if (n) {
        this.imgSize = this.imgSize + 0.1;
        console.log(this.imgSize);
      } else {
        this.imgSize = this.imgSize - 0.1;
        console.log(this.imgSize);
      }
    },

    // 新增右侧部分
    // 添加参与者
    saveInvolveMember(detailList) {
      jionPeople(this.file.fileId, detailList).then(res => {
        if (res.result) {
          this.$Message.success("添加成功");
        }
      });
    },
    // 发送消息
    sendChat() {
      let con = this.$refs.textarea.innerHTML.replace(/(^\s+)|(\s+$)/g, "");
      if (con) {
        let datas = {
          publicId: this.file.fileId,
          projectId: this.projectId,
          publicType: this.publicType,
          content: con
        };
        console.log(datas);
        sendMsg(datas).then(res => {
          this.$refs.textarea.innerHTML = "";
        });
      }
    },
    chooseEmoji(name) {
      alert(1);
      this.$refs.textarea.innerHTML += '<img src="' + name + '" />';
    },
    // 更新文件
    showFileChoose(data) {
      console.log(data);
      if (data === "model") {
        this.showModel = !this.showModel;
      } else {
        this.showCommon = !this.showCommon;
      }
    },
    //文件下载
    downLoad(fileId) {
      var url = "";
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_URL;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_URL;
      } else {
        url = "/api";
      }
      window.location.href = url + "/files/" + fileId + "/download";
    },

    // 移到回收站
    putRecyclebin() {
      recycleBin(this.file.fileId, this.projectId).then(res => {
        if (res.result) {
          this.$Message.success("成功移到回收站");
          this.popHid();
        }
      });
    },
    // 收藏文件
    collectFile() {
      let data = {
        projectId: this.projectId,
        publicId: this.file.fileId,
        collectType: "文件"
      };
      collect(data).then(res => {
        if (res.result) {
          this.$Message.success("收藏成功");
        }
      });
    },
    // 更改隐私模式
    changePrivacy() {
      let num = 0;
      if (this.privacyStatus == "已关闭") {
        num = 1;
        this.privacyStatus = "已开启";
      } else {
        num = 0;
        this.privacyStatus = "已关闭";
      }
      filePrivacy(this.file.fileId, num).then(res => {});
    },
    // 点击 移动、赋值文件
    showModels(caozuo) {
      this.caozuo = caozuo;
      this.showMove = true;
      this.footerTxt = `跨项目${caozuo}时，部分信息不会被保留。`;

      folderChild(this.projectId).then(res => {});
    },
  }
};
</script>

<style scoped lang="less">
@import "./sucaiDetail";
</style>
