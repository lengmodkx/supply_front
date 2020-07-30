<template>
  <div class="container">
    <div class="closeBtn" @click="closeBtn">
      <Icon type="md-close" size="20" />
    </div>
    <div class="backBtn" @click="back">
      <Icon type="ios-arrow-back" size="20" />返回
    </div>
    <section class="create-org">
      <div class="create-org-form">
        <div class="account-id-form-title">
          <div class="account-id-form-title-logo">阿拉丁云平台</div>
          <div class="account-id-form-title-content">输入团队或企业名称</div>
        </div>
        <CreateOrg ></CreateOrg>
      </div>
    </section>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import CreateOrg from "../components/public/common/CreateOrg";

export default {
  data: function() {
    return {};
  },
  components: {
    CreateOrg,
  },
  computed: {},
  created() {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    closeBtn(){
        this.$router.push("/org/" + localStorage.companyId);
    },
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
  .backBtn {
    position: fixed;
    left: 0;
    width: 72px;
    padding: 0 16px 0 8px;
    z-index: 1;
    color: #595959;
    background: #e5e5e5;
    margin: 40px;
    border-radius: 32px;
    border: none;
    line-height: 30px;
  }
  .create-org {
    height: 100vh;
    .create-org-form {
      padding-top: 140px;
      width: 360px;
      margin: 0 auto;
      color: #333333;
      .account-id-form-title {
        margin-bottom: 24px;
        .account-id-form-title-logo {
          margin-bottom: 20px;
          font-size: 16px;
        }
        .account-id-form-title-content {
          font-size: 24px;
          line-height: 32px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>

