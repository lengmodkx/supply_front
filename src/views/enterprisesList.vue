<template>
  <div class="container">
    <div class="closeBtn" @click="back">
      <Icon type="md-close" size="20" />
    </div>
    <div class="home">
      <div class="content">
        <div class="home-title">进入企业</div>
        <div class="home-description">我们将在企业中为您提供 阿拉丁云平台 服务</div>
        <hr />
        <ul class="org-group">
          <li
            class="org-item"
            v-for="(item, index) in companyList"
            :key="index"
            @click="goBackstage(item)"
          >
            <span class="org-item-img">
              <img :src="item.organizationImage" alt />
            </span>
            <div class="org-item-content">
              <span class="org-item-content-name">
                <span class="org-item-content-text">{{item.organizationName}}</span>
              </span>
            </div>
            <span class="org-item-extra">
              <Icon type="ios-arrow-forward" size="20" color="#8c8c8c" />
            </span>
          </li>
          <li>
            <a class="org-item org-item-create" href="/creatEnter">
              <span class="org-item-img">
                <Icon type="md-add" size="20" color="#8c8c8c" />
              </span>
              <div class="org-item-content">
                <span class="org-item-content-name">创建新的企业</span>
                <span class="org-item-content-description">可用于企业、组织或团队</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data: function() {
    return {};
  },
  computed: {
    ...mapState("company", ["companyList"])
  },
  created() {
    this.initCompany();
  },
  methods: {
    ...mapActions("user", ["initSrc", "defaultImage"]),
    ...mapActions("company", ["initCompany"]),
    goBackstage(item) {
      localStorage.companyId = item.organizationId;
      changeOrganization(item.organizationId).then(res => {
        if (res.result == 1) {
          this.$router.push("/prolist/" + item.organizationId);
        }
      });
    },
    back() {
      this.$router.push("/systemSettings");
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  .closeBtn {
    position: fixed;
    right: 0;
    width: 32px;
    height: 32px;
    padding-left: 6px;
    padding-top: 6px;
    z-index: 1;
    color: #595959;
    background: #e5e5e5;
    margin: 40px;
    border-radius: 32px;
    border: none;
  }
  .home {
    // width: 100vw;
    padding: 100px 0 120px;
    // height: 100vh;
    overflow: auto;
    position: relative;
    .content {
      width: 492px;
      margin: 0 auto;
      background: #fff;
      position: relative;
      color: #333333;
      .home-title {
        margin-bottom: 8px;
        line-height: 50px;
        font-size: 36px;
        color: #262626;
        font-weight: 400;
      }
      .home-description {
        line-height: 24px;
        height: 24px;
        font-size: 18px;
        margin-bottom: 20px;
      }
      hr {
        margin: 24px 0;
        background: #d5d5d5;
        border: solid #d5d5d5;
        border-width: 1px 0 0;
      }
      .org-group {
        .org-item {
          display: flex;
          align-items: center;
          height: 56px;
          padding: 10px 0;
          cursor: pointer;
          .org-item-img {
            width: 36px;
            height: 36px;
            flex: 0 0 auto;
            margin-right: 16px;
            border-radius: 4px;
            position: relative;
            background: #f0f0f0;
            img {
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
          }
          .org-item-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            flex: 1 1 auto;
            font-size: 14px;
            overflow: hidden;
            .org-item-content-name {
              width: 100%;
              display: inline-flex;
              align-items: center;
              .org-item-content-text {
                flex: 0 1 auto;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
          .org-item-extra {
            margin-left: 8px;
          }
          &:hover {
            .org-item-content-name {
              color: #1b9aee;
            }
          }
        }

        .org-item-create {
          .org-item-img {
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .org-item-content-name {
            line-height: 20px;
            color: #8c8c8c;
          }
          .org-item-content-description {
            margin-top: 4px;
            color: #bfbfbf;
            font-size: 12px;
            line-height: 12px;
          }
        }
      }
    }
  }
}
</style>

