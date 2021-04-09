<template>
  <Poptip v-model="visible" class="involvelistBox" @on-popper-show="popShow" transfer>
    <span class="button">
      <Icon type="md-add-circle" @click="addMembers" class="fl" size="28" style="color: #1B8BEE;cursor: pointer;margin-top: 0" />
    </span>

    <div slot="content" style="height:320px;position: relative">
      <div class="loading" v-if="!memberList.length">
        <Icon type="ios-loading" size="28" />
      </div>
      <Input v-model="searchvalue" placeholder="搜索" @on-change="FUser(searchvalue)" style="width:220px;margin-top:10px;height:36px;" />
      <div class="selectable">
        <ul>
          <li class="select-option-group" v-if="!searchvalue">
            <div class="option-group-label">参与者</div>
            <ul>
              <li
                class="member-menu-item clearfix"
                v-for="(item, index) in memberList"
                :key="item.memberId"
                v-if="checkedList.indexOf(item.memberId) >= 0"
                @click="checkUser(index)"
              >
                <div class="img fl">
                  <img :src="item.memberImg" v-if="item.memberImg" />
                  <svg-icon v-else style="margin-top:3px;" name="allMember"></svg-icon>
                </div>
                <div class="membername fl">{{ item.memberName }}</div>
                <div class="tick fr">
                  <Icon type="md-checkmark" class="right" v-show="item.checked" />
                </div>
              </li>
            </ul>
          </li>

          <li class="select-option-group">
            <div class="option-group-label">推荐</div>
            <ul>
              <li class="member-menu-item clearfix" v-for="(item, index) in memberList" :key="item.memberId" v-if="checkedList.indexOf(item.memberId) < 0" @click="checkUser(index)">
                <div class="img fl">
                  <img v-if="item.memberImg" :src="item.memberImg" alt="" />
                  <svg-icon v-else style="margin-top:3px;" name="allMember"></svg-icon>
                </div>
                <div class="membername fl">{{ item.memberName }}</div>
                <div class="tick fr">
                  <Icon type="md-checkmark" class="right" v-show="item.checked" />
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="confirmBtn">
        <Button type="primary" long @click="save">确定</Button>
      </div>
    </div>
  </Poptip>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { projectMembersSerach, projectMembers } from "@/axios/api";
export default {
  props: ["checkedList", "projectId"],
  data() {
    return {
      visible: false,
      aaa: false,
      searchvalue: "",
      memberList: [],
    };
  },
  computed: {
    ...mapState("user", ["user"]),
    curUserId() {
      //从vuex取当前登录用户id
      return localStorage.userId;
    },
    computedMemberList() {
      return 1;
    },
    // return this.memberList.filter(v => this.$containStr(this.searchvalue, v.userName))
  },
  methods: {
    ...mapActions("task", ["initMemberList"]),
    // 获取项目成员
    addMembers() {
      // members(this.projectId).then((res) => {
      //   this.memberList = res.data;
      //   this.popShow();
      // });
      projectMembers(this.projectId).then((res) => {
        this.memberList = res.data;
        this.popShow();
      });
    },

    checkUser(index) {
      //if (this.memberList[index].userId == this.curUserId) return//当前用户不可点击
      this.memberList[index].checked = !this.memberList[index].checked;
    },
    save() {
      let arr=[]
      var that = this;
      console.log(this.memberList) 
      this.memberList.map(item=>{
        that.checkedList.map((i) => {
          if(item==i &&item.checked==true ){
            arr.push(i)
          }
        });
      })
      let list = this.memberList.filter((v) => {
        return v.checked == true;
      });
      let list1 = list.map((item) => {
        return item.memberId;
      });

      list1.map((item) => {
        arr.map((i) => {
          if(item!=i){
            list1.push(i)
          }
        });
      });
      let detailList = list1.join(",");
      this.visible = false;
      let peopleData = this.memberList.filter((v) => {
        if (v.checked) {
          return v;
        }
      });
      this.$nextTick((_) => {
        this.visible = false;
        this.$emit("save", detailList, peopleData);
        this.searchvalue = "";
      });
    },
    popShow() {
      this.memberList.forEach((v) => {
        // v.checked = this.checkedList.indexOf(v.id) >= 0
        this.$set(v, "checked", this.checkedList.indexOf(v.memberId) >= 0 ? true : false);
      });
    },
    //筛选用户
    FUser(keyword) {
      if (keyword != "") {
        projectMembersSerach(this.projectId, keyword).then((res) => {
          this.memberList = res.data;
          this.popShow();
        });
      } else {
        this.addMembers();
      }
    },
  },
};
</script>
<style scoped lang="less">
.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    animation: zhuan 1s infinite;
  }
  @keyframes zhuan {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
.involvelistBox {
  .button {
    cursor: pointer;
    line-height: 24px;
    display: inline-block;
    i {
      font-size: 24px;
      color: #3da8f5;
      margin-top: 2px;
      &:hover {
        color: #2d8cf0;
      }
    }
  }
}
.selectable {
  height: calc(100% - 46px - 63px);
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #e5e5e5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cecece;
  }
  .select-option-group {
    .option-group-label {
      padding: 6px 0;
      font-size: 14px;
      color: #a6a6a6;
      cursor: auto;
    }
    .member-menu-item {
      font-size: 14px;
      padding: 6px 0;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      .img {
        box-sizing: border-box;
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: block;
        }
      }
      .membername {
        line-height: 32px;
        margin-left: 12px;
      }
      .tick {
        line-height: 32px;
      }
    }
  }
}
.confirmBtn {
  padding: 10px 0;
  border-top: 1px solid #eee;
  margin-top: 10px;
}
.right {
  margin-right: 4px;
}
</style>
