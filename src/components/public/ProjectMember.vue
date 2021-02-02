<template>
  <div class="projectMember">
    <div class="head">
      项目成员
      <span class="close" @click="closebox">
        <Icon type="md-close"></Icon>
      </span>
    </div>
    <!-- 列表 -->
    <div class="searchBox">
      <Input v-model.trim="keyword" search enter-button placeholder="搜索成员" @on-search="FUser(keyword)" />
    </div>
    <div class="invite" @click="modal = true"><Icon type="md-add-circle"></Icon>邀请成员</div>

    <div class="userBox">
      <ul>
        <li v-for="(user, index) in users" :key="index" >
          <div class="member-item">
            <Avatar :src="user.memberImg" class="avatar" />
            <div class="memberInfo" @click="inofoUser(user.memberId)">
              <span class="uname">{{ user.memberName }} &nbsp;&nbsp;&nbsp;职位：{{ user.job ? user.job : "无" }}</span>
              <span>联系方式：{{ user.memberPhone }}</span>
            </div>
            <Poptip placement="left" width="250" @on-popper-show="visibleChange(user)" v-model="user.visible" v-if="roleKey == 'administrator'">
              <a href="javascript:void(0)" v-if="user.memberLabel == 0">
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <div slot="title" class="title">
                <Icon
                  type="ios-arrow-back"
                  size="18"
                  @click.native="
                    visible = false;
                    title = '成员菜单';
                  "
                  v-show="visible"
                />
                <span>{{ title }}</span>
              </div>
              <div slot="content" class="content" v-show="!visible">
                <ul>
                  <li v-for="(role, index) in roles" :key="role.roleId" @click="changeRole(role.roleId)">
                    <span>{{ role.roleName }}</span>
                    <Icon type="md-checkmark" v-if="role.currentCheck" />
                  </li>
                </ul>
                <div
                  style="color:red;height:40px;line-height:40px;"
                  @click="
                    visible = true;
                    title = '移除成员';
                  "
                >
                  删除成员
                </div>
              </div>
              <div slot="content" v-show="visible">
                <div style="margin-top:10px;margin-bottom:10px">
                  <span>确认移除项目成员吗？</span>
                </div>
                <Button type="error" long @click="remove(user.memberId)">确定</Button>
              </div>
            </Poptip>
          </div>
        </li>
      </ul>
    </div>

    <Modal v-model="modal" @on-cancel="cancel" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>邀请新成员</span>
      </p>
      <!-- <span>
        请先将用户加入企业，再邀请进项目
      </span> -->
      <div style="text-align:center;height:400px;padding-top:10px">
        <div>
          <Input search enter-button placeholder="请输入手机号" @on-search="searchUser" v-model="keyword2" />
        </div>
        <loading v-if="loading"></loading>
        <div style="height:330px;padding-top:10px;overflow:auto;margin-top:10px;">
          <ul>
            <li v-for="(user, index) in invitUsers" :key="index" class="invit-user">
              <div class="invit-user-name">
                <img :src="`${user.image}`" />
                <p>{{ user.userName }}</p>
              </div>
              <span v-if="user.existId === 1" v-bind:disabled="dis">已加入</span>
              <Button v-if="user.existId === 0" type="primary" @click="adduser(user.userId)">添加</Button>
            </li>
          </ul>
        </div>
      </div>
    </Modal>

     <Modal v-model="showAddshare" title="成员信息" transfer fullscreen footer-hide  class="padd0"  class-name="ivu-modal-wrap">
         <info-user ref="addshare" :user='itemUser' @close="chageItem"  ></info-user>
     </Modal>


  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { getUsers, getOrgIdUsers, getAssignUsers, addUser, addProjectUser, removeUser } from "../../axios/api2.js";
import { updateUserRole,projectOneMembers } from "../../axios/api.js";
import loading from "./common/Loading.vue";
import infoUser from "../public/infoUser.vue";
export default {
  name: "",
  components: {
    loading,
    infoUser
  },
  data() {
    return {
      showAddshare: false,
      itemUser:{},
      keyword: "",
      keyword2: "",
      modal: false,
      invitUsers: [],
      loading: false,
      value: "-1",
      visible: false,
      title: "成员菜单",
      user: "",
      visible1: false,
      roleKey: localStorage.getItem(localStorage.userId),
      dis: true
    };
  },

  computed: {
    ...mapState("member", ["users", "roles"])
  },
  mounted() {
     this.initUser(this.$route.params.id);
  },
  methods: {
    ...mapActions("member", ["initUser", "filterUser", "getRoles"]),
    //关闭弹框
    cancel() {
      this.keyword2 = "";
      this.invitUsers = [];
    },
    searchUser() {
      if (!this.keyword2) {
        this.$Notice.warning({
          title: "请输入关键字"
        });
        return false;
      }
      this.loading = true;
      let projectId = this.$route.params.id;
      getOrgIdUsers(this.keyword2, localStorage.companyId,projectId).then(res => {
        this.loading = false;
        if (res.result === 1) {
          this.invitUsers = res.data;
        }
      });

      // getUsers(this.keyword2).then(res => {
      //   this.loading = false;
      //   if (res.result === 1) {
      //     this.invitUsers = res.data;
      //   }
      // });
    },
    //筛选用户
    FUser(keyword) {
      
      if (keyword != "") {
           var data={
             id:this.$route.params.id,
             key:keyword
           }
          this.filterUser(data);

      } else {
           this.initUser(this.$route.params.id);
          
      }
    },
    adduser(userId) {
      // let groupId = this.$route.params.groupId

      // //添加分组成员

      // addProjectUser(groupId,userId).then(res => {
      //   if (res.result === 1) {
      //     this.initUser(this.$route.params.id);
      //     this.$Message.info('添加成功');
      //   } else {
      //     this.$Notice.warning({
      //       title: res.msg
      //     });
      //   }
      // });

      //添加项目成员
      let params = {
        projectId: this.$route.params.id,
        memberId: userId,
        orgId: localStorage.companyId
      };

      addUser(params).then(res => {
        if (res.result === 1) {
           
          this.initUser(this.$route.params.id);
        } else {
          this.$Notice.warning({
            title: res.msg
          });
        }
      });
    },
    //移除项目成员
    remove(userId) {
      this.visible = false;
      removeUser(this.$route.params.id, userId).then(res => {
        console.log(userId);
        if (res.result === 1) {
          
          this.initUser(this.$route.params.id);
        } else {
          this.$Notice.warning({
            title: "移除失败"
          });
        }
      });
    },
    //进入项目
    inofoUser(userId){
       this.showAddshare=true;
        projectOneMembers(localStorage.companyId,userId).then(res=>{
            
            this.itemUser=res.data;
            this.itemUser.birthday = res.data.birthday
            this.itemUser.entryTime = res.data.entryTime
        })
    },
    //修改用户信息
    chageItem(data){
      
      this.itemUser=data;
    },
    closebox() {
      this.modal1 = false;
      this.$emit("hideBox");
    },
    changeRole(roleId) {
      let data = { roleId: roleId, userId: this.user.memberId, projectId: this.$route.params.id };
      updateUserRole(data).then(res => {
        if (res.result == 1) {
           
           this.initUser(this.$route.params.id);
          this.$Message.success("设置成功");
          this.user.visible = false;
        } else {
          this.$Message.success("设置失败");
        }
      });
    },
    visibleChange(user) {
      this.user = user;
      let data = { userId: user.memberId, orgId: localStorage.companyId, projectId: this.$route.params.id };
      this.getRoles(data);
    }
  }
};
</script>
<style scoped lang="less">

.padd0 {
  /deep/ .ivu-modal-body {
    padding: 0;
    background: #f5f5f5;
  }
}

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

  .searchBox {
    width: 320px;
    margin: 10px auto;
  }

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

.member-item {
  display: flex;
  // cursor: pointer;
  justify-content: center;
  align-items: center;
  height: 100%;
  .memberInfo {
    flex: 1;
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    span {
      color: #a6a6a6;
      height: 20px;
      line-height: 20px;
    }
    .uname {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
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
  .title {
    text-align: center;
    i {
      position: absolute;
      left: 5px;
    }
  }
  .content {
    ul li {
      height: 40px;
      line-height: 40px;
      position: relative;
      cursor: pointer;
      i {
        position: absolute;
        right: 0px;
        top: 10px;
      }
    }
    ul li:hover {
      background: #e5e5e5;
    }
  }
}

.active {
  right: 0px;
}
.userBox {
  width: 320px;
  padding-top: 5px;
  margin: 0px auto;
  overflow-y: auto;
  height: 68%;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #e5e5e5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cecece;
  }
  ul li {
    height: 50px;
    border-bottom: 1px solid #e5e5e5;
  }
}

.invit-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  .invit-user-name {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 32px;
      height: 32px;
    }
    p {
      font-size: 14px;
      margin-left: 10px;
    }
  }
}
.user-set {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  cursor: pointer;
}
</style>
