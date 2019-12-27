<template>
  <div class="circled">
    <Input search enter-button placeholder="请输入关键进行查询" />
    <div class="select-people">
      <p style="color:gray;font-szie:14px">参与者</p>
      <ul>
        <!-- <div>:class="{forbid:members.length===1}"</div> -->
        <li class="people-lsit" v-for="(item, index) in members" :key="index" @click="choose(index)">
          <div class="people-info">
            <img :src="item.defaultImage" alt="">
            <p>{{item.userName}}</p>
          </div>
          <Icon class="gou" size="16" type="md-checkmark" v-if="item.isActive" />
        </li>
      </ul>
      <p style="color:gray;font-szie:14px">项目成员</p>
      <ul>
        <li class="people-lsit" v-for="(item, index) in data" :key="index" @click="choose2(index)">
          <div class="people-info">
            <img :src="item.defaultImage" alt="">
            <p>{{item.userName}}</p>
          </div>
          <Icon class="gou" size="16" type="md-checkmark" v-if="item.isActive" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { members } from "../../axios/api.js";
import { mapState } from "vuex";
export default {
  name: "",
  props: ["projectId"],
  data() {
    return {
      data: [],
      show: false,
      userinfo: this.$store.state.userInfo
    };
  },
  mounted() {
    members(this.projectId).then(res => {
      if (res.result === 1) {
        this.data = res.data;
      }
    });
  },
  computed: {
    ...mapState("member", ["members"])
  },
  methods: {
    choose(index) {
      if (this.members[index].isActive) {
        this.members[index].isActive = false;
      } else {
        this.members[index].isActive = true;
      }
      this.$store.dispatch("member/change", this.members);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.circled {
  height: 362px;
  border-radius: 5px;
}
.select-people {
  height: 330px;
  width: 100%;
  padding-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
.people-lsit {
  width: 100%;
  height: 40px;
  padding: 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background-color: #f5f5f5;
  }
  .people-info {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 15px;
    }
    p {
      width: 100px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
    }
  }
  .gou {
    color: #d1d1d1;
  }
}
.forbid {
  cursor: not-allowed;
}
</style>
