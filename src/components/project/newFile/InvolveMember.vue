<template>
    <div class="addButton fl">
        <div style="height:320px;position: relative">
          <Input v-model="searchvalue" placeholder="搜索" style="width:220px;margin-top:10px;height:36px;" />
          <div class="selectable">
            <ul>
              <li class="select-option-group" v-if="!searchvalue">
                <div class="option-group-label">参与者</div>
                <ul>
                  <li
                    class="member-menu-item clearfix"
                    v-for="(item, index) in memberList"
                    :key="index"
                    :class="curUserId == item.userId ? 'disable' : ''"
                    v-if="ids.indexOf(item.userId) >= 0"
                    @click="checkUser(index)"
                  >
                    <div class="img fl">
                      <img :src="item.image" v-if="item.image" />
                      <svg-icon v-else style="margin-top:3px;" name="allMember"></svg-icon>
                    </div>
                    <div class="membername fl">{{ item.userName }}</div>
                    <div class="tick fr">
                      <Icon type="md-checkmark" class="right" v-show="item.checked" />
                    </div>
                  </li>
                </ul>
              </li>

              <li class="select-option-group">
                <div class="option-group-label">推荐</div>
                <ul>
                  <li class="member-menu-item clearfix" v-for="(item, index) in memberList" :key="index" v-if="ids.indexOf(item.userId) < 0" @click="checkUser(index)">
                    <div class="img fl">
                      <img v-if="item.image" :src="item.image" alt="" />
                      <svg-icon v-else style="margin-top:3px;" name="allMember"></svg-icon>
                    </div>
                    <div class="membername fl">{{ item.userName }}</div>
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
    </div>
  
</template>
<script>
import { mapState, mapActions } from "vuex";
import { getmemberList, members } from "../../../axios/api.js";
export default {
  props: ["projectId", "joins"],
  data() {
    return {
      searchvalue: "",
      memberList: [],
      joinMembers: [],
      curUserId: localStorage.userId,
      ids: [localStorage.userId]
    };
  },
  
  mounted() {
    console.log('xxxxxxxxxxxxx')
    members(this.projectId).then(res => {
      this.memberList = res.data;
      this.popShow();
    });
  },
  methods: {
    getIds() {
      return this.ids;
    },
    deleteInvolve(userId) {
      this.memberList.forEach(v => {
        if (v.userId == userId) {
          v.checked = false;
        }
      });
      this.joinMembers = this.joinMembers.filter(v => v.userId != userId);
      this.ids.pop(userId);
      console.log(this.ids);
    },
    checkUser(index) {
      if (this.memberList[index].userId == this.curUserId) return; //当前用户不可点击
      this.memberList[index].checked = !this.memberList[index].checked;
    },
    save() {
      this.ids = [];
      this.searchvalue = "";
      let peopleData = this.memberList.filter(v => {
        return v.checked == true;
      });
      peopleData.forEach(v => {
        if (v.userId == localStorage.userId) v.isCreate = true;
        if (v.checked) this.ids.push(v.userId);
      });
      this.$emit("addUser", this.ids, peopleData);
      this.visible = false;
    },
    popShow() {
      console.log("yyyyyyyy", this.joins);
      this.memberList.forEach(v => {
          this.$set(v, "checked", false);
      });
      if (this.joins != undefined && this.joins != null && this.joins.length > 0) {
        this.ids = [];
        this.joins.forEach(v => {
          this.ids.push(v.userId);
          this.memberList.forEach(v1 => {
            if (v1.userId == v.userId) this.$set(v1, "checked", true);
          });
        });
      } 
    }
  }
};
</script>
<style scoped lang="less">
.addButton{
  padding: 10px;
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
    .disable {
      cursor: not-allowed;
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
.join-member {
  margin-top: 20px;
  .member-avatar {
    .ava1 {
      margin-right: 5px;
      cursor: pointer;
      border: 2px solid transparent;
      img {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }
    .ava {
      margin-right: 5px;
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 50%;
      &:hover {
        border: 2px solid #a6a6a6;
        .close {
          display: block;
        }
      }
      img {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
      .close {
        position: absolute;
        font-size: 14px;
        top: -3px;
        right: 1px;
        width: 12px;
        height: 12px;
        line-height: 12px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        background-color: #a6a6a6;
        display: none;
        &:hover {
          background-color: #3da8f5;
        }
      }
    }
  }
}
</style>
