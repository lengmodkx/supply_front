<template>
<div class="layout-right">
  <div class="mine">
    <div class="content">
      <Content class="mainContent">
        <nearThing v-if="mineTag=='nearThing'" :name="name?name:1"></nearThing>
        <task v-if="mineTag=='task'" :name="name"></task>
        <schedule v-if="mineTag=='schedule'" :name="name"></schedule>
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
        hover: "nearThing",
        mineTag: "nearThing",
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
        this.name = tagName.split(",")[1];
        this.mineTag = tagName.split(",")[0];
        console.log(this.name,this.mineTag)

        this.hover = tagName.split(",")[0];
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