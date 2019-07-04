<template>
  <div>
    <Poptip class="task-menuwrapper" placement="bottom" transfer v-model="visible" @on-popper-hide="popHide">
      <Icon class="xiala" type="ios-arrow-down" size="20" />
      <!-- <Icon type="ios-arrow-down"
              size="20"></Icon> -->
      <div slot="content" class="task-menuwrapper-content" v-if="initCom">
        <div class="dropdownTitle">
          <span class="back">
            <span v-if="active!=''" @click="active='';reset(true)">
              <svg-icon class="backicon" name="back"></svg-icon>
            </span>
          </span>
          {{name}}菜单
          <span class="guanbi" @click="visible=false">
            <svg-icon class="closePop" name="close"></svg-icon>
          </span>
        </div>
        <div class="task-menu-list" v-if="active===''">
          <div class="menuItem" @click="$emit('shareEdit')">
            <Icon type="md-color-filter" />编辑分享</div>
          <div class="menuItem" @click="topShare">
            <Icon type="ios-share-outline" />置顶分享</div>
          <div class="menuItem" @click="listItemClick('b','复制到')">
            <Icon type="ios-paper-outline" />复制{{name}}</div>
          <div class="menuItem" @click="listItemClick('a','移动到')">
            <Icon type="ios-log-out" />移动{{name}}</div>
          <div class="menuItem" @click="collectShare">
            <Icon type="md-clipboard" />{{collect ? '取消收藏':'收藏'+name}}</div>

          <div class="menuItem" @click="listItemClick('c','移到回收站')">
            <Icon type="ios-trash-outline" />移到回收站</div>
          <div class="privacy">
            <div class="p_left fl clearfix" @click="privacyChange">
              <div v-if="data.isPrivacy" style="overflow:hidden;">
                <Icon type="unlocked" class="fl"></Icon>
                <div class="p_title fl">
                  <h5>隐私模式</h5>
                  <p>所有成员可见</p>
                </div>
              </div>

              <div v-if="!data.isPrivacy" style="overflow:hidden;">
                <Icon type="locked" class="fl"></Icon>
                <div class="p_title fl">
                  <h5>隐私模式</h5>
                  <p>仅参与者可见</p>
                </div>
              </div>
            </div>
            <div class="p_right fr">
              <span>{{data.isPrivacy==1?"已关闭":"已开启"}}</span>
            </div>
          </div>
        </div>

        <!-- 内容部分的盒子： -->
        <div class="task-menu-detail">
          <div class="con5" v-if="active=='a'" style="height: auto">
            <div class="con5item1">
              <span>项目</span>
              <Select v-model="model7" style="width:100px" @on-open-change="getProjectList" @on-change="getGroupList">
                <OptionGroup label="星标项目">
                  <Option v-for="(item, index) in starProject" :value="item.projectId" :key="index">{{ item.projectName}}</Option>
                </OptionGroup>
                <OptionGroup label="非星标项目">
                  <Option v-for="(item,index) in notStarProject" :value="item.projectId" :key="index">{{ item.projectName }}</Option>
                </OptionGroup>
              </Select>

            </div>
            <div class="con5tip">跨项目移动时，部分参与者信息不会保留</div>
            <Button type="primary" long style="margin-top:8px;" @click="removeRc">确定</Button>
          </div>
          <div class="con6" v-if="active=='b'">
            <div class="con5item1">
              <span>项目</span>
              <Select v-model="model7" style="width:150px" placeholder="选择项目" @on-open-change="getProjectList" @on-change="getGroupList">
                <OptionGroup label="星标项目">
                  <Option v-for="(item,index) in starProject" :value="item.projectId" :key="index">{{ item.projectName }}</Option>
                </OptionGroup>
                <OptionGroup label="非星标项目">
                  <Option v-for="(item,index) in notStarProject" :value="item.projectId" :key="index">{{ item.projectName }}</Option>
                </OptionGroup>
              </Select>
            </div>
            <div class="con5tip">参与者、评论不会被复制到新分享</div>
            <Button type="primary" long @click="copyTask">确定</Button>

          </div>
          <div class="con7" v-if="active=='c'">
            <div class="ask">您确定要把该分享移到回收站吗？</div>
            <Button type="error" @click="recycle" long>移到回收站</Button>
          </div>
        </div>
      </div>
    </Poptip>
    <!--&lt;!&ndash;编辑分享&ndash;&gt;-->
    <!--<Modal v-model="editShare" :z-index=999999999  transfer fullscreen footer-hide class-name="ivu-modal-wrap" >-->
      <!--<add-share v-if="editShare" ref="editshare" @close="editShare=false" :projectId="projectId" :shareTitle="data.title" :shareContent="data.content" :shareId="data.id"></add-share>-->
    <!--</Modal>-->
  </div>

</template>
<script>
import Clipboard from "clipboard";
import addShare from '../../project/share/AddShare'
import {
  collectTask,
  cancelCollect,
  taskToRecycle,
  getStarProjectList,
  getGroupList,
  getMenuList,
  copyShare,
  moveShare,
  recycleShare,
  privacyShare,
  topShare
} from "@/axios/api";

export default {
  props: ["data", "name", 'projectId'],
  data() {
    return {
      link: "https://www.baidu.com",
      initCom: true,
      visible: false,
      unlock: 1,
      active: "",
      newTask: "",
      curTopTitle: "任务菜单",
      title: this.data.title,
      findMember: "",
      findPro: "",
      notice: [],
      starProject: [],
      notStarProject: [],
      currProjectId: "",
      currGroupId: "",
      currMenuId: "",
      groupList: [],
      menuList: [],
      model7: "",
      model9: "",
      model10: "",
      editShare: false,
      collect: this.data.collect
    };
  },
  components: {addShare},
  computed: {
    topTitle() {
      return this.active ? this.curTopTitle : "任务菜单";
    }
  },
  mounted() {},
  methods: {
    copylink() {
      var clipboard = new Clipboard(".tasklink");
      clipboard.on("success", e => {
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        console.log("该浏览器不支持自动复制");
        clipboard.destroy();
      });
    },
    // 置顶分享
    topShare() {
      topShare(this.data.id, this.projectId).then(res => {
        this.$emit('changeNowIndex')
        this.$Message.success("置顶成功");
      });
    },
    saveTitle() {
      this.visible = false;
      //发请求修改标题
    },
    //获取项目数据
    getProjectList() {
      getStarProjectList().then(res => {
        if (res.result === 1) {
          this.notStarProject = res.notStarProject;
          this.starProject = res.starProject;
        }
      });
    },
    //获取分组数据
    getGroupList(projectId) {
      this.currProjectId = projectId;
      getGroupList(projectId).then(res => {
        if (res.result === 1) {
          this.groupList = res.data;
        }
      });
    },
    //获取菜单数据
    getMenuLists(groupId) {
      this.currGroupId = groupId;
      getMenuList(groupId).then(res => {
        if (res.result === 1) {
          this.menuList = res.data;
        }
      });
    },
    //获取选中菜单id
    getMenuId(menuId) {
      this.currMenuId = menuId;
    },
    listItemClick(index, title) {
      this.active = index;
      this.curTopTitle = title;
    },
    clearAll() {},
    changeTitle() {
      this.active = "";
    },
    //项目选择框触发时间
    createNew() {
      this.active = "";
    },
    // 收藏分享
    collectShare() {
      if (this.collect) {
        cancelCollect(this.projectId,this.data.id,'分享').then(res => {
          if (res.result === 1) {
            this.$Message.success(res.msg);
            this.collect = false;
          }
        });
      } else {
        collectTask(
          this.projectId,
          this.data.id,
          "分享"
        ).then(res => {
          if (res.result === 1) {
            this.$Message.success(res.msg);
            this.collect = true;
            console.log(this.data)
          }
        });
      }
    },
    //复制分享
    copyTask() {
      copyShare(this.data.id, this.currProjectId).then(res => {
        console.log(res)
        if (res.result === 1) {
          this.$Message.success("复制成功");
        }
      });
    },
    // 移动分享
    removeRc() {
      debugger
      moveShare(this.data.id, this.currProjectId,this.projectId).then(res => {
        if (res.result) {
          this.$Message.success("移动成功");
          this.$emit('removeSahre')
        }
      });
    },
    //分享移入回收站
    recycle() {
      recycleShare(this.data.id,this.projectId).then(res => {
        if (res.result) {
          this.$Message.success("已移到回收站");
          this.$emit('removeSahre')
        }
      });
    },
    // 更新隐私模式
    privacyChange() {
      privacyShare(this.data.id,this.projectId).then(res => {
        console.log(res);
      });
    },
    reset(flag) {
      Object.assign(this.$data, this.$options.data());
      this.visible = flag;
      this.title = this.data.title;
    },
    popHide() {
      setTimeout(_ => {
        this.reset();
      }, 300);
    }
  }
};
</script>
<style lang="less">
@import "./poptipMenu";
</style>

