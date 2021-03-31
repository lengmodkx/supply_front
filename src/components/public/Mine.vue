<template>
<div class="layout-right">
  <div class="mine">
    <div class="content">
      <Content class="mainContent">
        <nearThing v-if="mineTag=='nearThing'"></nearThing>
        <task v-if="mineTag=='task'"></task>
        <schedule v-if="mineTag=='schedule'"></schedule>
        <file v-if="mineTag=='file'" :name="name"></file>
        <collect v-if="mineTag=='collect'" :name="name" :content="content"></collect>
      </Content>
    </div>
  </div>
</div>

</template>
<script>
  import nearThing from "./mine/nearThing";
  import task from "./mine/mineTask";
  import schedule from "./mine/mineSchedule";
  import file from "./mine/mineFile";
  import collect from "./mine/mineCollect";

  import {
    mapMutations,
    mapState
  } from "vuex";
  export default {
    components: {
      nearThing, //近期的事
      task, //任务
      schedule, //日程
      file, //文件
      collect //收藏
    },
    data() {
      return {
        mineTag: "",
        name: "",
        content: "" // 收藏需要传的值
      };
    },
    mounted() {
      this.openTag(this.$route.query.checkTagName)
    },
    methods: {
      ...mapMutations("user", ["changeMineRouter", "changeProjectRouter"]),
      ...mapState("user", ["projectRouter"]),
      //切换TAG
      openTag(tagName) {
        this.mineTag = tagName;
        console.log(this.mineTag)
        if (this.mineTag == "collect") {
          this.content = tagName.split(",")[2];
        }
      },
    },
    beforeRouteLeave(to, from, next) {
      localStorage.mineRouter = from.fullPath;
      next(vm => {});
    }

  }
</script>
<style scoped lang="less">
  @import "./Mine";
</style>