<template>
  <div class="log-wrap" id="log-wrap">
    <div style="height: 50px;line-height: 50px;width: 100%;font-size: 16px">所有动态</div>
    <div class="more-msg" v-if="unReadMsg">
      <span v-if="!restData.length" @click="loadMore">查看剩余{{ unReadMsg }}条消息...</span>
      <span v-else @click="shouqi" style="color: #3da8f5">收起</span>
    </div>
    <div class="log-content">
      <div class="log-list" v-for="(item, index) in logs" :key="index">
        <img :src="item.memberImg" alt />
        <div class="things">
          <span>{{ item.memberName }}</span>
          <span v-html="item.content" style="word-wrap: break-word;word-break: break-all;"></span>
        </div>
        <p class="time">{{ item.createTime | timeFilter3 }}</p>
      </div>
    </div>

    <div v-show="restData.length">
      <div class="log-list" v-for="(item, index) in restData" :key="index">
        <img :src="item.memberImg" alt />
        <div class="things">
          <span>{{ item.memberName }}</span>
          <span v-html="item.content"></span>
        </div>
        <p class="time">{{ item.createTime | timeFilter3 }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { restMsg } from "@/axios/api";
export default {
  props: ["logs", "unReadMsg", "publicId"],
  components: {},
  data() {
    return {
      jiazai: false,
      restData: [],
    };
  },
  mounted() {},
  methods: {
    loadMore() {
      restMsg(this.publicId, this.unReadMsg).then((res) => {
        if (res.result) {
          this.restData = res.data;
        }
      });
    },
    shouqi() {
      this.restData = [];
    },
  },
  watch: {
    logs(val) {
      this.$nextTick(() => {
        var div = document.getElementById("log-wrap");
        div.scrollTop = div.scrollHeight + 1;
      });
    },
  },
};
</script>
<style scoped lang="less">
.log-wrap {
  width: 100%;
  padding: 16px 20px;
  // flex: 1;
  height: calc(100vh - 338px);
  overflow: auto;
}
.log-list {
  width: 100%;
  display: flex;
  margin-bottom: 24px;
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex: none;
    margin-right: 16px;
  }
  .things {
    width: 100%;
    line-height: 20px;
    font-size: 12px;
    color: #a6a6a6;
    display: flex;
    flex-direction: column;
    align-items: left;
    /deep/ img {
      width: 20px;
    }
  }
  .time {
    line-height: 20px;
    font-size: 12px;
    color: #a6a6a6;
    flex: none;
    margin-left: 5px;
  }
}
.more-msg {
  margin: 5px 0;
  width: 100%;
  cursor: pointer;
  text-align: center;
  color: #3da8f5;
}
.log-content {
}
</style>
