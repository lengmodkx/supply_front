<template>
  <div style="text-align:center;height:400px">
    <div>
      <Input search enter-button placeholder="请输入姓名或手机号查找" @on-search="searchUser" v-model="searchWord" @on-keyup="searchInput" />
    </div>
    <loading v-if="loading"></loading>
    <div class="people-wrap">
      <ul v-if="invitUsers && !isSearch">
        <li v-for="(people, index) in invitUsers" :key="index" class="invit-user">
          <div class="member-info">
            <img :src="`${people.userEntity.image}`" />
            <span>{{ people.userEntity.userName }} </span>
          </div>
          <span v-if="people.partmentId !== '0'" v-bind:disabled="dis"> 已加入 </span>
          <Button v-else type="primary" @click="adduser(people.memberId)">添加</Button>
        </li>
      </ul>
      <!--搜索显示的-->
      <ul v-else>
        <li v-for="(people, index) in searchPeople" :key="index" class="invit-user">
          <div class="member-info">
            <img :src="people.image" />
            <span>{{ people.userName }} </span>
          </div>
          <span v-if="people.existId === 1" v-bind:disabled="dis">已加入</span>
          <Button v-if="people.existId === 0" type="primary" @click="adduser(people.userId)">添加</Button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { searchMembers, addPeople, addBranchPeople } from "@/axios/companyApi";
export default {
  props: ["invitUsers", "type", "partmentId"],
  name: "addPeople",
  data() {
    return {
      loading: false,
      searchWord: "",
      searchPeople: [],
      isSearch: false,
      dis: true
    };
  },
  mounted() {
    console.log(">>>>>>>>>>>", this.invitUsers);
  },
  methods: {
    adduser(id) {
      // 添加企业成员
      if (this.type === "成员") {
        let data = {
          orgId: localStorage.companyId,
          memberId: id
        };
        addPeople(data).then(res => {
          if (res.result==1) {
            this.$Message.success("添加成功");
            this.$emit("addPeople", res.data);
          } else {
            this.$Message.info(res.msg);
          }
        });
      } else if (this.type === "部门") {
        let data = {
          memberId: id,
          orgId:localStorage.companyId
        };
        addBranchPeople(this.partmentId, data).then(res => {
          if (res.result == 1) {
            this.$Message.success("添加成功");
            this.$emit("addPeople1", res.data);
          }
        });
      }
    },
    // 搜索 成员
    searchUser(value) {
      this.loading = true;

      searchMembers(value, localStorage.companyId).then(res => {
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
      width: 32px;
      height: 32px;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
    }
  }
}
</style>
