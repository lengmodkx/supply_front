<template>
  <div class="file-header">
    <div class="left">
      <button class="move" @click="back"></button>
      <!--后退 -->
      <button class="back" @click="forward"></button>
    </div>
    <div class="middle">
      <span @click="home"><img src="../../../assets/images/03.png" alt="" /></span>
      <ul class="crumbs">
        <li v-for="(item, index) in crumbs" :key="index" @click="changeCrumbs(item, index)">
          <!-- <img v-if='item.icon' :src="item.icon" alt="" > -->
          {{ item.fileName }}
          <a> </a>
        </li>
      </ul>
    </div>
    <div class="right">
      <Input search enter-button v-model="searched" @on-search="search" />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      movehover: false,
      searched: "",
      projectId: this.$route.params.id,
      fileId: this.$route.params.fileId
    };
  },
  computed: {
    ...mapState("tree", ["fileTree", "userTree", "tooltree", "typetree", "showView"]),
    ...mapState("file", ["crumbs", "crumbsCache", "crumbsIndex", "createFileId"])
  },
  methods: {
    ...mapActions("file", ["initFile", "initFolders", "searchFile", "initTag", "initCrumbs"]),
    //前进
    forward() {
      this.$emit("recovery");
      this.movehover = !this.movehover;
      console.log(this.crumbsIndex)
      if (this.crumbsIndex >= this.crumbsCache.length) {
        console.log("前进终止");
        return;
      }
      this.$store.commit("file/crumbsForward");
      //刷新页面
      let params = { fileId: this.createFileId };
      this.initFile(params);
    },
    // 后退
    back() {
      this.$emit("recovery");
      if (this.crumbsIndex == 1) {
        console.log("后退终止");
        return;
      }
      this.$store.commit("file/crumbsBack");
      //刷新页面
      let params = { fileId: this.createFileId };
      this.initFile(params);
    },
    //回到首页
    home() {
      this.$emit("recovery");
      this.$store.commit("file/crumbsHome");
      //请求数据
      let params = { fileId: this.fileId };
      this.initFile(params);
    },
    //单击导航
    changeCrumbs(item, index) {
      this.$emit("recovery");
      var data = {
        self: item,
        index: index
      };
      this.$store.commit("file/crumbsClick", data);
      const params = { fileId: item.fileId };
      this.initFile(params);
    },
    // 搜索文件
    search(value) {
      this.$emit("recovery");
      if (value !== "") {
        var data = { fileName: value, projectId: this.projectId };
        this.searchFile(data).then(res => {
          this.loading = false;
        });
      } else {
        let params = { fileId: this.fileId };
        this.initFile(params).then(res => {});
      }
    }
  }
};
</script>
<style lang="less">
.file-header {
  width: 100vm;
  height: 52px;
  padding: 10px;
  background-image: linear-gradient(#fff, #f3f3f3);
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  .left {
    width: 65px;
    button {
      width: 32px;
      height: 32px;
      border: 1px solid #dddddd;
    }
    button:hover {
      box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
    }
    .move {
      background: #fff url("~@/assets/images/01.png") no-repeat center;
      background-size: 10px;
    }
    .back {
      background: #fff url("~@/assets/images/02.png") no-repeat center;
      background-size: 10px;
      border-left: none;
    }
    .button-disable {
      box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
    }
  }
  .middle {
    flex: 1;
    margin: 0px 100px 0px 30px;
    border: 1px solid #ddd;
    display: flex;
    line-height: 32px;
    span {
      display: block;
      background: #fafafa;
      width: 35px;
      height: 28px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #dddddd;
      cursor: pointer;
    }
    span:hover {
      background: #e4f8ff;
    }
    span:first-child {
      border-left: none;
      border-right: 1px solid #dddddd;
    }
    .crumbs {
      flex: 1;
      display: flex;
      overflow: hidden;
      li {
        display: flex;
        align-items: center;
        background: #f2f2f2;
        cursor: pointer;
        padding-left: 10px;
        img {
          padding: 10px 10px 10px 0;
        }
      }
      a {
        display: block;
        width: 14px;
        height: 28px;
        background: url("~@/assets/images/06.png") no-repeat center;
      }
      li:last-child a {
        background: url("~@/assets/images/07.png") no-repeat center;
      }
    }
  }
  .right {
    float: right;
    width: 200px;
    margin-right: 10px;
  }
}
</style>
