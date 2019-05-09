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
                <DropdownItem name='1'>所有分享
                  <Icon type="checkmark" v-if="type===1"></Icon>
                </DropdownItem>
                <DropdownItem name='2'>我的分享
                  <Icon type="checkmark" v-if="type===2"></Icon>
                </DropdownItem>
                <DropdownItem divided name='3'>按发布时间排序
                  <Icon type="checkmark" v-if="type===3"></Icon>
                </DropdownItem>
                <DropdownItem name='4'>按回复时间排序
                  <Icon type="checkmark" v-if="type===4"></Icon>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <a href="javascript:;" @click="showAddshare=true" class="fr">
              <Icon type="android-add-circle"></Icon>
              添加分享
            </a>
            <Modal v-model="showAddshare" title="添加分享" transfer fullscreen footer-hide class-name="ivu-modal-wrap">
              <add-share ref="addshare" @close="addShares" :projectId="projectId" :shareTitle="shareTitle" :shareContent="shareContent"></add-share>
            </Modal>
          </div>
          <div class="share-list">
            <Loading v-if="loading"></Loading>
            <ul v-if="shareList.length">
              <li v-for="(share,index) in shareList" :key="share.id" :class="{ active: index==indexNow }" @click="changeContent(index)">
                <img class="ava" v-bind:src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${share.memberImg}`">
                <div class="">
                  <p class="t">{{share.title}}</p>
                  <p class="c"> {{share.memberName}}发布于{{share.createTimeStr}}</p>
                </div>
              </li>
            </ul>
          </div>
        </iCol>
        <iCol span="18" class="right">
          <div class="share-view" v-if="share">
            <div class="share-text">
              <div class="rng">
                <div class="share-title">
                  <div class="left-title">
                    <div>
                      <Icon type="ios-list-box-outline" size="18" />
                      分享
                    </div>
                    <span>{{this.share.title}}</span>
                  </div>
                  <div class="right-icons">
                    <Tooltip content="点个赞" placement="bottom">
                      <span class="zan" :class="{zan_blue:zan}">
                        <Icon type="md-thumbs-up"></Icon>
                        <!--<span class="zanNum" v-if="zan">1</span>-->
                      </span>
                    </Tooltip>
                    <span class="down">
                      <singleFenxiangMenu :data="share" :name="publicType"></singleFenxiangMenu>
                    </span>
                  </div>

                  <div>
                    <Icon type="chevron-down" size="18" @click.native="showmenu=true"></Icon>
                    <Modal v-model="showmenu" width="250">
                      <p slot="header" style="color:#111111;text-align:center">
                        <span>分享菜单</span>
                      </p>
                      <div slot="footer" class="footer">
                        <div class="footer-left">
                          <i class="ivu-icon ivu-icon-unlocked"></i>
                          <div @click="changePrivacy" class="footer-privacy-text">
                            <span>隐私模式</span>
                            <span>{{privacyTxt}}</span>
                          </div>
                        </div>
                        <span style="color:#3da8f5">{{privacyStatus}}</span>
                      </div>
                    </Modal>
                  </div>
                </div>

                <div class="html">
                  <div class="share-content" v-html="share.content"></div>
                  <div class="label">
                    <div class="ol" style="width: 55px">
                      <Icon type="ios-pricetags-outline" size="18" />
                      标签
                    </div>
                    <div>
                      <!-- <Tag closable v-for="tag in share.tagList" :color="tag.bgColor" @on-close="closeTag" :key="tag.tagId">{{tag.name}}</Tag> -->
                      <tag :taglist="share.tagList" :projectId="projectId" :publicId="share.id" :publicType="publicType"></tag>
                    </div>
                  </div>
                  <!--关联-->
                  <p class="name" style="margin-top: 5px">
                    <Icon type="ios-link-outline" style="font-size: 18px;margin-right: 3px"></Icon>关联内容
                  </p>
                  <div class="addLink" @click="relationModal=true;">
                    <Icon type="ios-add-circle-outline" />添加关联</div>
                  <Modal v-model="relationModal" class="relationModal" id="relationModal" :footer-hide="true">
                    <AddRelation :publicId="share.id" :fromType="publicType"></AddRelation>
                  </Modal>
                </div>
              </div>
              <div class="omg" v-if="members">
                <p class="ot">参与者 · {{members.length}}</p>
                <p class="oc" v-for="user in members" :key="user.id">
                  <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.image}`">
                  <Icon type="md-add-circle" size="28" color="#2d8cf0" @click.native="showMember"></Icon>
                </p>

                <log :logs="share.logs" :unReadMsg="share.unReadMsg" :publicId="share.id"></log>
              </div>
            </div>
            <publish :publicId="share.id" :projectId="share.projectId" :publicType="publicType"></publish>
          </div>
        </iCol>
      </Row>
    </div>
    <Modal v-model="showAddMember" width="252" footer-hide transfer :mask="false" :closable="false">
      <user-list :projectId="projectId"></user-list>
    </Modal>

  </div>
</template>

<script>
import publish from "../../public/Publish.vue";
import addShare from "./AddShare.vue";
import tag from "./Tags.vue";
// import { shares } from "../../../axios/api2.js";
import userList from "../../resource/userList.vue";
import log from "../../public/log";
import singleFenxiangMenu from "../../public/common/SingleFenxiangMenu.vue";
import AddRelation from "@/components/public/common/AddRelation";
import { mapState, mapMutations, mapActions } from "vuex";
import { share } from "../../../axios/api";
export default {
  components: {
    publish,
    addShare,
    tag,
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
      shareContent: "",
      // shareList: [],
      indexNow: 0,
      // share: null,
      showmenu: false,
      isPrivacy: 1,
      privacyTxt: "所有成员可见",
      privacyStatus: "未开启",
      showTag: false,
      tagList: [],
      publicType: "分享",
      showAddMember: false,
      zan: 0
    };
  },
  computed: {
    ...mapState("member", ["members"]),
    ...mapState("project", ["projectName"]),
    ...mapState("share", ["shareList", "share"])
  },
  mounted() {
    this.init(this.$route.params.id).then(res => {
      this.loading = false;
      if (this.share != null) {
        this.$store.dispatch("member/init", this.share.joinInfo);
      }
    });
    // shares(this.$route.params.id).then(res => {
    //   if (res.result == 1) {
    //     this.shareList = res.data;
    //     this.loading = false;
    //     if (this.shareList != null && this.shareList.length > 0) {
    //       this.share = this.shareList[0];
    //       this.$store.dispatch("member/init", this.shareList[0].joinInfo);
    //     }
    //   }
    // });
  },
  methods: {
    ...mapActions("share", ["init"]),
    ...mapMutations("share", ["changeShare"]),
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
    changeContent(index) {
      this.indexNow = index;
      this.changeShare(index);
      // this.share = this.shareList[index];
      this.$store.dispatch("member/init", this.shareList[index].joinInfo);
    },
    showMember() {
      this.showAddMember = !this.showAddMember;
    },
    addShares() {
      this.showAddshare = false;
      this.loading = true;
      this.init(this.$route.params.id).then(res => {
        this.loading = false;
        this.$store.dispatch("member/init", this.shareList[0].joinInfo);
      });
    }
  }
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
</style>
