<template>
  <Poptip v-model="visible" popper-class="involvelistBox" @on-popper-show="popShow" @on-popper-hide="popHide" transfer>
    <slot :close="close">
      <div class="rlz fl" v-if="task.executor != null && task.executor != '0' && task.executor != ''">
        <img :src="task.executorImg" alt="" />
        <span>{{ task.executorName }}</span>
        <Icon @click.stop="deleteExecutor" type="md-close-circle" />
      </div>
      <div v-else style="cursor: pointer;"><Icon type="ios-contact" size="24" /><span style="margin-right: 15px;margin-left: 5px">待认领</span></div>
    </slot>

    <div slot="content" style="height:320px;position: relative;">
      <div class="loading" v-if="loading"><Icon type="ios-loading" /></div>
      <div class="selectable">
        <ul>
          <li class="select-option-group">
            <!-- <div class="searchBox"> -->
              <Input v-model.trim="keyword" placeholder="搜索" @on-change="FUser(keyword)" :clearable='true' />
            <!-- </div> -->
          </li>
          <li class="select-option-group">
            <div class="option-group-label">执行者</div>
            <ul>
              <li class="member-menu-item clearfix" @click="visible = false" v-if="task.executor == 0 || task.executor == undefined">
                <div class="img fl">
                  <Icon style="margin-top: 5px" type="ios-contact" size="24" />
                </div>
                <div class="membername fl">待认领</div>
                <div class="tick fr">
                  <Icon style="margin-top: 5px" class="right" type="md-checkmark" size="20" />
                </div>
              </li>
              <li class="member-menu-item clearfix" @click="visible = false" v-else>
                <div class="img fl">
                  <img :src="task.executorImg" alt="执行者" />
                </div>
                <div class="membername fl">{{ task.executorName }}</div>
                <div class="tick fr">
                  <Icon style="margin-top: 5px" class="right" type="md-checkmark" size="20" />
                </div>
              </li>
            </ul>
          </li>

          <li class="select-option-group">
            <div class="option-group-label">推荐</div>
            <ul>
              <li class="member-menu-item clearfix" @click="itemClick(i.memberId)" v-for="(i, index) in memberList" :key="index" v-if="i.memberId !== task.executor">
                <div class="img fl"><img :src="i.memberImg" alt="" /></div>
                <div class="membername fl">{{ i.memberName }}</div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </Poptip>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { projectMembers,projectMembersSerach } from "@/axios/api";

export default {
  props: ["id", "taskId", "task"],
  data() {
    return {
      visible: false,
      searchvalue: "",
      // current: null,
      memberList: [],
      loading: true,
      keyword: "",
    };
  },
  // model: {
  //   event: "choose",
  //   prop: "executor"
  // },
  // computed: {
  //   ...mapState("task", ["task"]),
  // },
  methods: {
    ...mapActions("task", ["initMemberList"]),
    itemClick(id) {
      //this.current = this.memberList.find(v => v.userId == id)
      let data = {
        taskid: this.taskId,
        zxzid: id,
      };
      this.$emit("choose", id, this.taskId);
      this.$nextTick((_) => {
        this.visible = false;
      });
    },
    deleteExecutor() {
      this.$parent.deleteExecutor(this.taskId);
    },
    popHide() {
      this.searchvalue = "";
    },
    popShow() {
      projectMembers(this.id).then((res) => {
        this.memberList = res.data;
        this.loading = false;
      });
    },
    close() {
      this.itemClick(-1);
    },
    //筛选用户
    FUser(keyword) {
      if (keyword != "") {
          projectMembersSerach(this.id,keyword).then(res=>{
              this.memberList=res.data
          })

      } else {
           this.popShow();
          
      }
    },
  },
  mounted() {
  },
};
</script>
<style scoped lang="less">
.rlz {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-right: 8px;
  line-height: 24px;
  align-items: center;
  margin-top: 7px;
  padding: 4px;
  border-radius: 20px;
  span {
    margin: 0 8px;
  }
  &:hover {
    background: #f7f7f7;
    i {
      display: block;
    }
  }
  img {
    width: 24px;
    height: 24px;
    margin-right: 3px;
    border-radius: 50%;
  }
  i {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 16px;
    color: #bfbfbf;
    display: none;
  }
}
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
    font-size: 22px;
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
.selectable {
  width: 200px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #cecece;
    margin-right: -16px;
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
.searchItem {
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
}
/deep/.ivu-input-icon {
  height: 32px !important;
  line-height: 32px !important;
}
</style>
