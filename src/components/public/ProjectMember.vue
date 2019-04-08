<template>
  <div class="projectMember">
    <div class="head">
      项目成员
      <span class="close" @click="$emit('hideBox')">
        <Icon type="md-close"></Icon>
      </span>
    </div>
    <!-- 列表 -->
    <Input class="search" v-model="keyword" placeholder="搜索成员，或输入邮箱直接邀请"/>
    <div class="invite" @click="modal=true">
      <Icon type="md-add-circle"></Icon>邀请新成员
    </div>
    <ul class="programMember">
      <li class="member-item clearfix" v-for="(user,index) in users" :key="index">
        <div class="avatar">
          <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.defaultImage}`" alt>
        </div>
        <div class="memberInfo">
          <p class="uname">{{user.userName}}</p>
          <p class="email">{{user.email}}</p>
        </div>
      </li>
    </ul>
    <Modal v-model="modal" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>邀请新成员</span>
      </p>
      <div style="text-align:center;height:450px">
        <div>
          <Input search enter-button placeholder="请输入手机号/邮箱查找"/>
        </div>
        <p>Will you delete it?</p>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "",
  data() {
    return {
      keyword: "",
      modal: false
    };
  },
  computed: {
    ...mapState("member", ["users"])
  },
  mounted() {
    this.initUser(this.$route.params.id);
  },
  methods: {
    ...mapActions("member", ["initUser"])
  }
};
</script>
<style scoped lang="less">
.projectMember {
  position: fixed;
  top: 98px;
  right: -352px;
  z-index: 888;
  width: 350px;
  height: calc(100% - 98px);
  background-color: #f7f7f7;
  transition: 0;
  box-shadow: -3px 0 3px rgba(0, 0, 0, 0.1);
  &.animate {
    transition: 0.1s;
  }
  .head {
    line-height: 50px;
    text-align: center;
    font-size: 15px;
    position: relative;
    font-weight: bold;
    width: 320px;
    margin: 0 15px;
    border-bottom: 1px solid #e5e5e5;
    .close {
      cursor: pointer;
      color: lightgray;
      font-size: 20px;
      width: 20px;
      height: 40px;
      position: absolute;
      top: 0;
      right: 0;
      &:hover {
        color: #3da8f5;
      }
    }
  }
}
.search {
  width: 320px;
  margin: 10px auto;
  display: block;
  /deep/.ivu-input {
    height: 40px !important;
    font-size: 14px;
    &:focus {
      border-color: #a6a6a6;
      box-shadow: 0 0 0 0;
    }
    &:hover {
      border-color: #a6a6a6;
    }
  }
}
.invite {
  color: #3da8f5;
  padding: 4px 15px;
  cursor: pointer;
  &:hover {
    background-color: #efefef;
  }
  i {
    font-size: 40px;
    vertical-align: middle;
    margin-right: 8px;
  }
}

.programMember {
  .member-item {
    display: flex;
    cursor: pointer;
    padding: 4px 18px;
    &:hover {
      background-color: #efefef;
    }
    .avatar {
      width: 46px;
      img {
        display: block;
        width: 34px;
        height: 34px;
        border-radius: 50%;
      }
    }
    .memberInfo {
      flex: 1;
      .uname {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        color: #555;
      }
      .email {
        color: #a6a6a6;
        max-width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.active {
  right: 0px;
}
</style>
