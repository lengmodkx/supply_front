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
            <Modal v-model="showAddshare" title="projectName" transfer fullscreen footer-hide class-name="ivu-modal-wrap">
              <add-share ref="addshare" @close="showAddshare=false" :projectId="projectId" :shareTitle="shareTitle" :shareContent="shareContent"></add-share>
            </Modal>
          </div>
          <div class="share-list">
            <loading v-if="loading"></loading>
            <ul>
              <li v-for="(share,index) in shareList" :key="share.id" :class="{ active: index==indexNow }" @click="changeContent(index)">
                <img class="ava" v-bind:src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${share.memberImg}`" :title="share.memberName">
                <div class="">
                  <p class="t">{{share.title}}</p>
                  <p class="c"> {{share.memberName}}发布于{{share.createTimeStr}}</p>
                </div>
              </li>
            </ul>
          </div>
        </iCol>
        <iCol span="18" class="right">
          <div class="share-view" v-if="share!=null">
            <div class="share-text">
              <div class="rng">
                <div class="share-title">
                  <span>·{{this.share.title}}</span>
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
                    <div class="ol">
                      <Icon type="pricetag"></Icon>
                      标签
                    </div>
                    <div>
                      <Tag closable v-for="tag in share.tagList" :color="tag.bgColor" @on-close="closeTag" :key="tag.tagId">{{tag.name}}</Tag>
                      <tag :taglist="share.tagList" :projectId="projectId"></tag>
                    </div>
                  </div>
                  <p class="p">
                    <Icon type="link"></Icon>关联内容
                  </p>
                  <p style="color:#3da8f5">
                    <Icon type="ios-plus"></Icon>添加关联
                  </p>
                </div>
              </div>
              <div class="omg" v-if="share.joinInfo">
                <p class="ot">参与者 · {{share.joinInfo.length}}</p>
                <p class="oc" v-for="user in share.joinInfo" :key="user.id">
                  <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.image}`" :title="user.userName">
                  <Icon type="ios-plus" size="28" color="#2d8cf0"></Icon>
                </p>
                <div class="hr">
                  <p v-for="log in share.logList" :key="log.id">
                    <span class="fr">{{log.createTimeStr}}</span>
                  </p>
                </div>
              </div>
            </div>
            <publish></publish>
          </div>
        </iCol>
      </Row>
    </div>
  </div>
</template>

<script>
import publish from "../../public/Publish.vue";
import addShare from "./AddShare.vue";
import Loading from "../../public/common/Loading.vue";
import tag from "./Tags.vue";
import { shares } from "../../../axios/api2.js";

export default {
  components: {
    publish,
    addShare,
    Loading,
    tag
  },
  data() {
    return {
      loading: true,
      type: 1,
      showAddshare: false,
      projectName: "",
      projectId: this.$route.params.id,
      shareTitle: "",
      shareContent: "",
      shareList: [],
      indexNow: 0,
      share: null,
      showmenu: false,
      isPrivacy: 1,
      privacyTxt: "所有成员可见",
      privacyStatus: "未开启",
      showTag: false,
      tagList: []
    };
  },
  mounted() {
    shares(this.$route.params.id).then(res => {
      if (res.result == 1) {
        console.log("xxxxxxxx", res);
        this.shareList = res.data;
        this.loading = false;
        if (this.shareList != null && this.shareList.length > 0) {
          this.share = this.shareList[0];
        }
      }
    });
  },
  methods: {
    clickEvent(parameter) {},
    changePrivacy() {
      console.log(111);
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
      this.share = this.shareList[index];
    },
    closeTag(event, name) {}
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
