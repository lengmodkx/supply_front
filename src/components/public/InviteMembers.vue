<template>
  <div style="text-align:center;height:400px">
    <div>
      <Input search enter-button placeholder="请输入手机号或姓名查找" @on-search="searchUser" v-model="searchWord"
        @on-keyup="searchInput" />
    </div>
    <loading v-if="loading"></loading>
    <div class="people-wrap">
      <!-- <ul v-if="allOrgPeople && !isSearch">
        <li v-for="(people, index) in allOrgPeople" :key="index" class="invit-user">
          <div class="member-info">
            <img :src="`${people.userEntity.image}`" />
            <span>{{ people.userEntity.userName }} </span>
          </div>
          <span v-if="people.partmentId !== '0'" v-bind:disabled="dis"> 已加入 </span>
          <Button v-else type="primary" @click="adduser(people.memberId)">添加</Button>
        </li>
      </ul> -->
      <!--搜索显示的-->
      <ul>
        <li v-for="(people, index) in searchPeople" :key="index" class="invit-user">
          <div class="member-info">
            <img :src="people.image" />
            <div class="peopleContent">
              <div class="userName">{{ people.userName }} </div>
              <div class="userPhone">{{ people.phone }}</div>
            </div>
          </div>
          <span v-if="people.userEntity.existId === 1" v-bind:disabled="dis">已加入</span>
          <div v-if="people.userEntity.existId === 0"  @click="adduser(people.userEntity.userId, people)" class="btn">
            <Icon type="md-add" color="#0077ff" />邀请</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { initOrgMember, searchOrgMembers } from "@/axios/companyApi";
  import { proInviteMen } from "@/axios/api";
  export default {
    props: ["partmentId", 'projectId'],
    name: "addPeople",
    data() {
      return {
        loading: false,
        searchWord: "",
        searchPeople: [],
        isSearch: false,
        dis: false,
        active: -1,
        allOrgPeople: [],
      };
    },
    methods: {
      adduser(id, obj) {
        proInviteMen(localStorage.companyId, this.projectId, id).then(res => {
          if (res.result == 1) {
            this.$Message.success("添加成功");
            // this.$emit("addPeople", res.data);  //暂不需要回调
            //将按钮变为已加入
            obj.userEntity.existId = 1
          } else {
            this.$Message.info(res.msg);
          }
        });
      },
      // 搜索 成员
      searchUser(value) {
        this.loading = true;
        searchOrgMembers(value, localStorage.companyId,this.projectId).then(res => {
          if (res.result == 1) {
            console.log(res.data)
            this.searchPeople = res.data;
          } else {
            this.$Message.error("搜索失败");
          }
          this.isSearch = true;
          this.loading = false;
        });
      },
      searchInput() {
        if (this.searchWord == "") {
          this.isSearch = false;
          this.searchPeople = [];
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .titleContent {
    display: flex;
    justify-content: space-between;
    color: #333333;
    margin-bottom: 9px;

    .accountInv {
      font-size: 16px;
    }

    .linkInv {
      color: #0077FF;
      cursor: pointer;
    }
  }

  .people-wrap {
    width: 100%;
    height: 360px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 10px;

    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
      background-color: #e5e5e5;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #cecece;
    }
  }

  .invit-user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;

    .member-info {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      .peopleContent {
        margin-left: 17px;
        .userName {
          font-size: 14px;
          text-align:left;
          color: #333333;
          margin-bottom:7px;
        }
        .userPhone {
          color: #666666;
          font-size: 12px;
        }
      }

    }
    span {
      color: #D71518;
      font-size: 12px;
    }
    .btn {
      color: #0077FF;
      font-size: 12px;
      cursor: pointer;
      i {
        margin-right:5px;
      }
    }
  }
</style>