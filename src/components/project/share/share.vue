<template>
  <div class="share">
    <div class="share-main">
      <Row>
        <iCol span="6" class="left">
          <div class="share-header">
            <Dropdown trigger="click" @on-click="clickEvent">
              <a href="javascript:void(0)" class="dropdown-a">
                所有分享
                <Icon type="chevron-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="1"
                  >所有分享
                  <Icon type="checkmark" v-if="type === 1"></Icon>
                </DropdownItem>
                <DropdownItem name="2"
                  >我的分享
                  <Icon type="checkmark" v-if="type === 2"></Icon>
                </DropdownItem>
                <DropdownItem divided name="3"
                  >按发布时间排序
                  <Icon type="checkmark" v-if="type === 3"></Icon>
                </DropdownItem>
                <DropdownItem name="4"
                  >按回复时间排序
                  <Icon type="checkmark" v-if="type === 4"></Icon>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <a href="javascript:;" @click="showAddshare = true" class="fr">
              <Icon type="android-add-circle"></Icon>
              添加分享
            </a>
            <Modal v-model="showAddshare" title="添加分享" transfer fullscreen footer-hide class-name="ivu-modal-wrap">
              <add-share ref="addshare" @close="addShares" :projectId="projectId"></add-share>
            </Modal>
          </div>
          <div class="share-list">
            <Loading v-if="loading"></Loading>
            <ul>
              <li v-for="(item, index) in shareList" :key="index" :class="{ active: index == indexNow }" @click="changeContent(index, item.id)">
                <img class="ava" v-bind:src="item.memberImg" />
                <div class="">
                  <p class="t">{{ item.title }}</p>
                  <p class="c">{{ item.memberName }}发布于{{ $moment(item.createTime).format("YYYY-MM-DD HH:mm") }}</p>
                </div>
              </li>
            </ul>
          </div>
        </iCol>
        <iCol span="18" class="right">
          <div class="share-view" v-if="share && open">
            <div class="share-text">
              <div class="rng">
                <div class="share-title">
                  <div class="left-title">
                    <div>
                      <Icon type="ios-list-box-outline" size="18" />
                      分享
                    </div>
                    <span>{{ this.share.title }}</span>
                  </div>
                  <div class="right-icons">
                    <!--<Tooltip content="点个赞" placement="bottom">-->
                    <!--<span class="zan" :class="{zan_blue:zan}">-->
                    <!--<Icon type="md-thumbs-up"></Icon>-->
                    <!--&lt;!&ndash;<span class="zanNum" v-if="zan">1</span>&ndash;&gt;-->
                    <!--</span>-->
                    <!--</Tooltip>-->
                    <span class="down">
                      <singleFenxiangMenu
                        @changeNowIndex="indexNow = 0"
                        @shareEdit="editShare = true"
                        :data="share"
                        :name="publicType"
                        :projectId="projectId"
                      ></singleFenxiangMenu>
                    </span>
                  </div>

                  <div>
                    <Icon type="chevron-down" size="18" @click.native="showmenu = true"></Icon>
                    <Modal v-model="showmenu" width="250">
                      <p slot="header" style="color:#111111;text-align:center">
                        <span>分享菜单</span>
                      </p>
                      <div slot="footer" class="footer">
                        <div class="footer-left">
                          <i class="ivu-icon ivu-icon-unlocked"></i>
                          <div @click="changePrivacy" class="footer-privacy-text">
                            <span>隐私模式</span>
                            <span>{{ privacyTxt }}</span>
                          </div>
                        </div>
                        <span style="color:#3da8f5">{{ privacyStatus }}</span>
                      </div>
                    </Modal>
                  </div>
                </div>

                <div class="html">
                  <div class="share-content" v-html="share.content"></div>
                  <div class="label">
                    <div class="ol" style="width: 70px">
                      <Icon type="ios-pricetags-outline" size="18" />
                      标签
                    </div>
                    <div @click.stop>
                      <!-- <Tag closable v-for="tag in share.tagList" :color="tag.bgColor" @on-close="closeTag" :key="tag.tagId">{{tag.name}}</Tag> -->
                      <!-- <tag ref="tags" :taglist="share.tagList" :projectId="projectId" :publicId="share.id" :publicType="publicType"></tag> -->
                      <Tags ref="tags" :taglist="share.tagList" :projectId="projectId" :publicId="share.id" :publicType="publicType" v-if="share.tagList"> </Tags>
                    </div>
                  </div>
                  <!--关联-->
                  <p class="name" style="margin-top: 5px"><Icon type="ios-link-outline" style="font-size: 18px;margin-right: 3px"></Icon>关联内容</p>
                  <div class="has-relevance">
                    <ul v-if="share.bindTasks.length != 0">
                      <div class="what-title">关联的任务</div>
                      <li class="gl-task-list" v-for="(b, i) in share.bindTasks" :key="i">
                        <div class="gl-task-list-con" @click.stop="showaa(b.taskId)">
                          <Icon type="md-checkbox-outline" size="22" />
                          <img v-if="b.userImage" :src="b.userImage" alt="执行者" />
                          <Icon type="md-contact" v-else size="26" />
                          <div class="gl-con">
                            <div class="gl-con-top">
                              <span>{{ b.taskName }}</span
                              ><span>{{ b.projectName }}</span>
                            </div>
                            <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                          </div>
                        </div>
                        <Poptip @click.stop>
                          <Icon class="glpop" type="ios-arrow-down" size="20" />
                          <div slot="content">
                            <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                            <div class="glpop-list" @click.stop="cancle(b.taskId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                          </div>
                        </Poptip>
                      </li>
                    </ul>
                    <ul v-if="share.bindFiles.length != 0">
                      <div class="what-title">关联的文件</div>
                      <li class="gl-task-list" v-for="(b, i) in share.bindFiles" :key="i">
                        <div class="gl-task-list-con" @click="getFileDetail(b.fileId)">
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
                            <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                            <div class="glpop-list" @click.stop="cancle(b.fileId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                          </div>
                        </Poptip>
                      </li>
                    </ul>
                    <ul v-if="share.bindSchedules.length != 0">
                      <div class="what-title">关联的日程</div>
                      <li class="gl-task-list" v-for="(b, i) in share.bindSchedules" :key="i">
                        <div class="gl-task-list-con" @click="editSchedule(b.scheduleId)">
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
                            <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                            <div class="glpop-list" @click.stop="cancle(b.scheduleId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                          </div>
                        </Poptip>
                      </li>
                    </ul>
                    <ul v-if="share.bindShares.length != 0">
                      <div class="what-title">关联的分享</div>
                      <li class="gl-task-list" v-for="(b, i) in share.bindShares" :key="i">
                        <div class="gl-task-list-con" @click="goShareDetail(b.shareId)">
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
                            <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                            <div class="glpop-list" @click.stop="cancle(b.shareId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                          </div>
                        </Poptip>
                      </li>
                    </ul>
                  </div>
                  <div class="addLink" @click="relationModal = true"><Icon type="ios-add-circle-outline" />添加关联</div>
                  <Modal v-model="relationModal" class="relationModal" id="relationModal" :footer-hide="true">
                    <AddRelation :publicId="share.id" :fromType="publicType"></AddRelation>
                  </Modal>
                </div>
              </div>
              <!-- 设置参与者 -->
              <div class="participator">
                <h5>
                  参与者 · {{ share.joinInfo != null ? share.joinInfo.length : 0 }}
                  <Tooltip content="参与者将会收到评论和任务更新通知" placement="right" transfer>
                    <Icon type="ios-help"></Icon>
                  </Tooltip>
                </h5>
                <div class="involve-list clearfix">
                  <div class="member-avatar fl" v-for="(item, index) in share.joinInfo" :key="index">
                    <Tooltip :content="item.userName" placement="top" transfer>
                      <div class="ava">
                        <!-- 删除需要加在关闭按钮上 -->
                        <img v-if="item.image" :src="item.image" alt="" />
                        <svg-icon v-else style="width:24px;height:24px;display:block;" name="allMember"></svg-icon>
                        <span class="close" @click="deleteInvolve(item.userId)">×</span>
                      </div>
                    </Tooltip>
                  </div>
                  <div class="addButton fl">
                    <InvolveMember ref="involveMember" :checkedList="joinInfoIds" :projectId="share.projectId" @save="saveInvolveMember"></InvolveMember>
                  </div>
                </div>
                <log :logs="share.logs" :unReadMsg="share.unReadMsg" :publicId="share.id"></log>
              </div>
            </div>
            <publish :publicId="share.id" :projectId="share.projectId" :publicType="publicType"></publish>
          </div>
          <div v-else class="no-share"><img src="@/icons/img/sys-msg.png" alt="" />暂无分享</div>
        </iCol>
      </Row>
    </div>
    <Modal v-model="showAddMember" width="252" footer-hide transfer :mask="false" :closable="false">
      <user-list :projectId="projectId"></user-list>
    </Modal>
    <!--编辑分享-->
    <Modal v-model="editShare" transfer fullscreen footer-hide class-name="ivu-modal-wrap">
      <edit-share v-if="editShare" @close="editShare = false" :projectId="projectId" :share="share" :joins="joinInfoIds"></edit-share>
    </Modal>
  </div>
</template>

<script>
import publish from "../../public/Publish.vue";
import addShare from "./AddShare.vue";
import editShare from "./EditShare.vue";
import tag from "./Tags.vue";
import Tags from "../../public/Tags.vue";
import { shares, setSysClip } from "../../../axios/api2.js";
import userList from "../../resource/userList.vue";
import log from "../../public/log";
import singleFenxiangMenu from "../../public/common/SingleFenxiangMenu.vue";
import AddRelation from "@/components/public/common/AddRelation";
import { mapState, mapMutations, mapActions } from "vuex";
import { share, changeJoin, cancle } from "../../../axios/api";
export default {
  components: {
    publish,
    addShare,
    editShare,
    tag,
    Tags,
    userList,
    singleFenxiangMenu,
    log,
    AddRelation
  },
  data() {
    return {
      loading: true,
      type: 1,
      editShare: false,
      showAddshare: false,
      projectId: this.$route.params.id,
      shareTitle: "",
      relationModal: false,
      indexNow: 0,
      showmenu: false,
      isPrivacy: 1,
      privacyTxt: "所有成员可见",
      privacyStatus: "未开启",
      publicType: "分享",
      showAddMember: false,
      zan: 0,
      open: false
    };
  },
  computed: {
    ...mapState("member", ["members"]),
    ...mapState("project", ["projectName"]),
    ...mapState("share", ["shareList","share"]),
    joinInfoIds() {
      return this.share.joinInfo.map(i => {
        return i.userId;
      });
    }
  },
  mounted() {
    this.init(this.$route.params.id).then(res => {
        this.open = true;
        this.indexNow = 0;
        this.loading = false;
      });
  },
  methods: {
    ...mapActions("share", ["init", "changeShares", "destroyShare"]),
    ...mapMutations("share", ["changeShare", "removeShare"]),
    
    clickEvent(parameter) {},
    changePrivacy() {
      if (this.isPrivacy == 1) {
        this.privacyTxt = "所有成员可见";
        this.isPrivacy = 2;
        this.privacyStatus = "未开启";
      } else {
        this.privacyTxt = "仅参与者可见";
        this.isPrivacy = 1;
        this.privacyStatus = "已开启";
      }
    },
    // 点击左侧分享
    changeContent(index, id) {
      this.open = true;
      this.indexNow = index;
      this.changeShares(id);
    },
    // 添加参与者
    saveInvolveMember(detailList) {
      changeJoin(this.share.id, detailList).then(res => {
        console.log(res);
      });
    },
    // 移除参与者
    deleteInvolve(id) {
      console.log(this.share);
      let arr = this.share.joinInfo;
      arr.forEach((i, n) => {
        if (i.userId === id) {
          arr.splice(n, 1);
        }
      });
      let strings = arr
        .map(v => {
          return v.userId;
        })
        .join(",");
      changeJoin(this.share.id, strings).then(res => {
        console.log(res);
      });
    },
    // 取消关联
    cancle(id) {
      cancle(id, this.projectId, this.publicType, this.share.id).then(res => {
        if (res.result === 1) {
          this.$Message.success("已取消");
        }
      });
    },
    //复制关联
    clone(id) {
      let url = "http://" + process.env.NODE_ENV == "development" ? "/shares/" + id : process.env.VUE_APP_URL + "/shares/" + id;
      setSysClip(url).then(res => {
        if (res.result === 1) {
          this.$Message.success(res.msg);
        }
      });
    },
    showMember() {
      this.showAddMember = !this.showAddMember;
    },
    addShares() {
      if (this.shareList.length) {
        this.showAddshare = false;
        this.indexNow=0;
      } else {
        this.showAddshare = false;
      }

      // this.loading = true;
      // this.init(this.$route.params.id).then(res => {
      //   this.loading = false;
      //   this.$store.dispatch("member/init", this.shareList[0].joinInfo);
      // });
    }
  },
  created: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.ivu-modal-wrap {
  background-color: #fff;
}

.share {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  background-color: rgb(244, 244, 244);
  padding-top: 20px;
  .omg {
    padding: 20px;
    font-size: 14px;
    color: #a6a6a6;
    .ot {
      margin-bottom: 10px;
      color: #111111;
    }
    .oc {
      overflow: hidden;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        margin-right: 15px;
        float: left;
      }
      .ivu-icon {
        font-size: 30px;
      }
    }
    .hr {
      border-top: 1px solid rgb(226, 226, 226);
      p {
        margin-top: 15px;
      }
    }
  }
  .rng {
    background-color: #fff;
    padding: 20px;
    position: relative;
  }
  .p {
    margin-top: 20px;
  }
  .label {
    padding: 20px 0;
    margin-top: 20px;
    border-top: 1px solid rgb(229, 229, 229);
    border-bottom: 1px solid rgb(229, 229, 229);
    display: flex;

    .ol {
      width: 45px;
    }
    a {
      color: gray;
      &:hover {
        color: #2a75ab;
      }
    }
  }
  .share-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    .share-text {
      overflow-x: hidden;
      overflow-y: auto;
      .share-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 28px;
        .left-title {
          display: flex;
          align-items: center;
          div {
            display: flex;
            width: 64px;
            height: 28px;
            padding: 4px;
            align-items: center;
            justify-content: space-between;
            background-color: #eff9fe;
            color: #77c2f8;
            font-size: 14px;
            margin-right: 15px;
          }
        }
        .right-icons {
          position: absolute;
          right: 20px;
          top: 20px;
          display: flex;
          align-items: center;
          height: 28px;
          i {
            cursor: pointer;
            font-size: 18px;
            margin-right: 10px;
            &:hover {
              color: #3da8f5;
            }
          }
        }
      }
    }
  }
  .share-view,
  .share-view .share-text {
    position: relative;
    height: 100%;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
      background-color: #e5e5e5;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cecece;
    }
  }
  .share-main {
    position: relative;
    height: 100%;
    background-color: #fff;
    margin: 0 auto;
    width: 1180px;
    border-radius: 3px 3px 0 0;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    .share-text {
      width: 100%;
      background-color: rgb(244, 244, 244);
      .t {
        font-size: 16px;
        a {
          font-size: 20px;
          color: gray;
          margin-left: 10px;
        }
      }
      .html {
        margin-top: 20px;
        font-size: 14px;
        line-height: 25px;
      }
    }
    .share-list {
      width: 100%;
      height: calc(100% - 65px);
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #cecece;
      }
      li {
        padding: 20px 15px;
        display: flex;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        cursor: pointer;
        transition-duration: 0.3s;
        &:hover,
        &.active {
          background-color: rgb(246, 246, 246);
        }
        .ava {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        .t,
        .c {
          padding-left: 15px;
        }
        .t {
          color: #3da8f5;
        }
      }
    }
    .share-header {
      padding: 20px 15px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
    .dropdown-a {
      font-size: 16px;
      color: gray;
    }
    .ivu-dropdown-item {
      .ivu-icon {
        margin-left: 15px;
        float: right;
        margin-top: 4px;
      }
    }
    a.fr {
      font-size: 16px;
    }
    .ivu-row {
      position: relative;
      height: 100%;
    }
    .left {
      position: relative;
      height: 100%;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
    .right {
      position: relative;
      height: 100%;
      overflow: hidden;
    }
  }
}
.active {
  background-color: #f7f7f7;
}

.footer {
  .footer-left {
    display: flex;
  }

  display: flex;
  justify-content: space-between;
  .footer-privacy-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .ivu-icon {
    margin-right: 10px;
  }
}
.has-relevance {
  width: 100%;
  padding: 0 16px;
  ul {
    width: 100%;
    padding: 0 16px;
    border: 1px solid #e5e5e5;
    margin-top: 10px;
    border-radius: 4px;
    .what-title {
      height: 44px;
      width: 100%;
      line-height: 44px;
      font-size: 14px;
      color: gray;
    }
    .gl-task-list {
      width: 100%;
      display: flex;
      padding-bottom: 16px;
      .gl-task-list-con {
        width: 100%;
        height: 60px;
        padding: 8px 0;
        display: flex;
        color: #a6a6a6;
        cursor: pointer;
        padding-right: 5px;
        &:hover {
          background-color: #f5f5f5;
        }
        i {
          margin-right: 10px;
          color: gray;
          line-height: 24px;
          flex: none;
        }
        img {
          width: 24px;
          height: 24px;
          margin-right: 12px;
          flex: none;
        }
        .gl-con {
          width: 100%;
          .gl-con-top {
            height: 24px;
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
          }
          .gl-con-bottom {
            line-height: 20px;
          }
        }
      }
      .glpop {
        color: gray;
        cursor: pointer;
        margin-left: 10px;
        margin-right: 4px;
        flex: none;
        line-height: 22px;
        padding-top: 8px;
      }
      /deep/ .ivu-poptip-body {
        padding: 10px 0;
      }
      .glpop-list {
        width: 200px;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        cursor: pointer;
        color: gray;
        &:hover {
          background-color: #f5f5f5;
        }
        span {
          font-size: 14px;
          margin-left: 15px;
        }
      }
    }
  }
}
.participator {
  padding: 10px 16px;
  background-color: #f6f6f6;
  border-bottom: 1px solid #eee;
  h5 {
    font-size: 14px;
    color: gray;
  }
  .involve-list {
    margin-top: 12px;
    .member-avatar {
      .ava {
        margin-right: 5px;
        cursor: pointer;
        border: 2px solid transparent;
        img {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .close {
          display: none;
        }
      }
    }
    .member-avatar:not(:nth-child(1)) {
      .ava {
        margin-right: 5px;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 50%;
        &:hover {
          border: 2px solid #a6a6a6;
          .close {
            display: block;
          }
        }
        img {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .close {
          position: absolute;
          font-size: 14px;
          top: -3px;
          right: 1px;
          width: 12px;
          height: 12px;
          line-height: 12px;
          border-radius: 50%;
          color: #fff;
          text-align: center;
          background-color: #a6a6a6;
          display: none;
          &:hover {
            background-color: #3da8f5;
          }
        }
      }
    }
  }
}
.no-share {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  img {
    margin-bottom: 15px;
  }
}
</style>
