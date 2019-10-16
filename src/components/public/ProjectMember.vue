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

      
     <Input v-model.trim="keyword" search enter-button  placeholder="搜索成员" @on-search="FUser(keyword)"/>

      </div>

    <div class="invite" @click="modal=true">
      <Icon type="md-add-circle"></Icon>邀请分组成员 
    </div>
    <!-- <ul class="programMember">
      <li class="member-item clearfix" v-for="(user,index) in users" :key="index">
        <div class="avatar">
          <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.defaultImage}`" alt>
        </div>
        <div class="memberInfo">
          <p class="uname">{{user.userName}}</p>
          <p class="email">{{user.email}}</p>
        </div>
        <Icon type="ios-arrow-down" size="18" @click="showModal1(user.userId,$event)"/>
      </li>
    </ul> -->
    <div class="userBox">
        <Collapse v-model="value" accordion>
              <Panel v-for="(user,index) in users" :key="index" hide-arrow :name="''+index">
                <div class="member-item clearfix" style="padding-left:0px;">
                  <div class="avatar">
                    <img v-if='user.memberImg'  :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.memberImg}`">
                    <img v-else :src="user.defaultImage.search('http://')!=-1?user.defaultImage:`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.defaultImage}`">
                  </div>
                  <div class="memberInfo">
                    <span class="uname">{{user.memberName}} &nbsp;&nbsp;&nbsp;职位：{{user.job?user.job:'无'}}</span>
                    <span>{{user.accountName}}</span>
                  </div>
                  <Icon type="ios-arrow-down" size="18" />
                </div>
                <div slot="content">
                  <div class="user-set">
                    <p>{{user.memberLabel==1?'管理员':'成员'}}</p>
                    <Icon type="md-checkmark" size="16" />
                  </div>
                  <div style="color:red;height:30px;line-height:30px;cursor:pointer;" v-show="user.memberLabel!=1">
                    <Poptip confirm title="您确认删除项目成员吗？" @on-ok="remove(user.memberId)">
                      <p>移除成员</p>
                    </Poptip>
                  </div>
                </div>
              </Panel>
            </Collapse>
    </div>
   

    <Modal v-model="modal"   @on-cancel="cancel" width="360" footer-hide>
      <p slot="header" style="color:#000;text-align:center">
        <span>邀请新成员</span>
      </p>
      <div style="text-align:center;height:400px">
        <div>
          <Input search enter-button placeholder="请输入手机号" @on-search="searchUser" v-model="keyword2" />
        </div>
        <loading v-if="loading"></loading>
        <div style="height:330px;padding-top:10px;overflow:auto;margin-top:10px;">
          <ul>

            <!-- <li  v-if='invitUsers' class="invit-user">
              <div class="invit-user-name">
                <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${invitUsers.image}`">
                <p>{{invitUsers.accountName}}</p>
              </div>
              <Button type="primary" @click="adduser(invitUsers.userId)">添加</Button>
            </li> -->
            <li v-for="(user,index) in invitUsers" :key="index" class="invit-user">
              <div class="invit-user-name">
                <img v-if='user.image' :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.image}`">
                <img v-else :src="user.defaultImage.search('http://')!=-1?user.defaultImage:`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.defaultImage}`">
                <p>{{user.userName}}</p>
              </div>
              <Button type="primary" @click="adduser(user.userId)">添加</Button>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { getUsers, getAssignUsers,addUser,addProjectUser, removeUser } from "../../axios/api2.js";
import loading from "./common/Loading.vue";
export default {
  name: "",
  components: {
    loading
  },
  data() {
    return {
      keyword: "",
      keyword2: "",
      modal: false,
      invitUsers:[],
      loading: false,
      value: "-1"
    };
  },
 
  computed: {
    ...mapState("member", ["users"])
  },
  mounted() {
    this.initUser(this.$route.params.id);
  },
  methods: {
    ...mapActions("member", ["initUser",'filterUser']),
    //关闭弹框
    cancel () {
              this.keyword2='';
               this.invitUsers=[]
    },
    searchUser() {
      if (!this.keyword2) {
        this.$Notice.warning({
          title: "请输入关键字"
        });
        return false;
      }
      this.loading = true;
      let  projectId=this.$route.params.id;
      // getAssignUsers(projectId, this.keyword2).then(res => {
      //   this.loading = false;
      //   if (res.result === 1) {
      //     console.log(res.data)
      //     if(res.data){
      //        this.invitUsers = res.data;
      //     }else{
      //      this.$Message.warning('搜索失败');
      //     }
        
      //   }
      // });

      getUsers(this.keyword2).then(res => {
        this.loading = false;
        if (res.result === 1) {
          this.invitUsers = res.data;
        }
      });
    },
    //筛选用户
    FUser(keyword) {
      
      if(keyword!=''){
          this.filterUser(keyword)
      }else{
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
       let params={
             projectId:this.$route.params.id,
             memberId:userId
       }
      
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
      this.value = "-1";
      removeUser(userId).then(res => {
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
    closebox() {
      this.modal1 = false;
      this.$emit("hideBox");
      
    }
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

  .searchBox{
  width: 320px;
  margin:10px auto;
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
  cursor: pointer;
  justify-content: center;
  align-items: center;

  .avatar {
    width: 46px;
    img {
      display: block;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      
    }
    margin-left:-15px;
  }

  .memberInfo {
    flex: 1;
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    span{
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
}

.active {
  right: 0px;
}
.userBox{
  width: 320px;
  padding-top: 5px;
  margin: 0px auto;
 .ivu-collapse{
    
     margin-bottom: 30px;
     border: none
 }
  .ivu-collapse-item{
     background: #fff;
    margin-bottom: 10px;
  }
  .ivu-collapse>.ivu-collapse-item {
    border-top: none;
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