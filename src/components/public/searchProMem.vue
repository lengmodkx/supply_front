<template>
  <Poptip v-model="visible2" placement="left-start">
    <!-- <Input placeholder="待选择" class="searcher-unit-body" :clearable="closeBtn" v-model="checkMemberName"  /> -->
    <div class="searcher-unit-body">{{ checkMemberName ? checkMemberName : placeholder }}<Icon type="ios-close-circle" @click.stop="emptyCom" class="close-btn" size="16" color="#808695" /></div>
    <div slot="content">
      <div class="dep-pop">
        <Input prefix="ios-search" placeholder="搜索成员" class="mt10" @on-change="searchOrgProple(searchvalue)" v-model="searchvalue" />
        <ul class="people-ul">
          <RadioGroup v-model="social">
            <li v-for="(item, index) in memberList" :key="index">
              <Radio :label="item.memberId" class="df people-check ac">
                <div class="df">
                  <img :src="item.memberImg" alt />
                  <p>{{ item.memberName }}</p>
                </div>
              </Radio>
            </li>
          </RadioGroup>
        </ul>
        <div class="btn-content">
          <div class="btns" @click="sureBtn">确定</div>
        </div>
      </div>
    </div>
  </Poptip>
</template>

<script>
import { projectMembers, projectMembersSerach } from "../../axios/api.js";

export default {
  data() {
    return {
      closeBtn: true,
      visible2: false,
      memberList: [],
      social: "",
      searchvalue: "",
      checkMemberName: "", //选中的成员名
      placeholder: "待选择",
    };
  },
  props: ["projectId", "type"],
  mounted() {
    this.addMembers();

    console.log(this.type);
  },
  methods: {
    addMembers() {
      projectMembers(this.projectId).then((res) => {
        this.memberList = res.data;
      });
    },
    searchOrgProple(keyword) {
      if (keyword != "") {
        projectMembersSerach(this.projectId, keyword).then((res) => {
          this.memberList = res.data;
        });
      } else {
        this.addMembers();
      }
    },
    empty() {
      this.visible2 = false;
      this.searchvalue = "";
      this.social = "";
    },
    emptyCom() {
      this.checkMemberName = "待选择";
      if (this.type == "zzz") {
        this.$emit("ZzzUserId", "");
      } else if (this.type == "cjz") {
        this.$emit("CjzUserId", "");
      } else {
        this.$emit("CyzUserId", "");
      }
      this.empty();
    },
    sureBtn() {
      this.memberList.forEach((i) => {
        if (i.memberId == this.social) {
          this.checkMemberName = i.memberName;
          this.empty();
          if (this.type == "zzz") {
            this.$emit("ZzzUserId", i.memberId);
          } else if (this.type == "cjz") {
            this.$emit("CjzUserId", i.memberId);
          } else {
            this.$emit("CyzUserId", i.memberId);
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.searcher-unit-body {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 7px;
}
</style>
