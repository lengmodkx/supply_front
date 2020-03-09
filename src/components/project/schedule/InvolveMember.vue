<template>
  <div>
    <div class="join-member">
      <div style="font-size:14px;color:#262626">参与者 · {{ joinMembers.length }}</div>
      <div class="member-avatar fl" v-for="(item, index) in joinMembers" :key="index">
        <Tooltip :content="`${item.userName},创建者`" placement="top" transfer v-if="item.isCreate">
          <div class="ava1">
            <img v-if="item.image" :src="item.image" />
          </div>
        </Tooltip>
        <Tooltip :content="item.userName" placement="top" transfer v-else>
          <div class="ava">
            <!-- 删除需要加在关闭按钮上 -->
            <img :src="item.image" alt="" />
            <span class="close" @click="deleteInvolve(item.userId)">×</span>
          </div>
        </Tooltip>
      </div>
    </div>
    <div class="addButton fl">
      <Poptip v-model="visible" class="involvelistBox" transfer>
        <span class="button">
          <Icon type="md-add-circle" class="fl" size="28" style="color: #1B8BEE;cursor: pointer;margin-top: 0" />
        </span>

        <div slot="content" style="height:320px;position: relative">
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
      </Poptip>
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
      visible: false,
      aaa: false,
      searchvalue: "",
      memberList: [],
      joinMembers: [],
      curUserId: localStorage.userId,
      ids: [localStorage.userId]
    };
  },
  mounted() {
    console.log(this.joins);
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
      console.log(peopleData);
      peopleData.forEach(v => {
        if (v.userId == localStorage.userId) v.isCreate = true;
        if (v.checked) this.ids.push(v.userId);
      });
      console.log(this.ids);
      this.joinMembers = peopleData;

      console.log(this.joinMembers);
      this.visible = false;
    },
    popShow() {
      this.memberList.forEach(v => {
        this.$set(v, "checked", false);
      });
      if (this.joins != undefined && this.joins != null && this.joins.length > 0) {
        this.ids = [];
        this.joins.forEach(v => {
          this.ids.push(v.userId);
          if (v.userId == localStorage.userId) {
            v.isCreate = true;
          }
          v.checked = true;
          this.joinMembers.push(v);
          this.memberList.forEach(v1 => {
            if (v1.userId == v.userId) this.$set(v1, "checked", true);
          });
        });
      } else {
        this.memberList.forEach(v => {
          console.log(v.userId);
          console.log(localStorage.userId);
          if (v.userId == localStorage.userId) {
            v.isCreate = true;
            v.checked = true;
            this.joinMembers.push(v);
          }
        });
      }
      console.log(this.joinMembers);
    }
  }
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
