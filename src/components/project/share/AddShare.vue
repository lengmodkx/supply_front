<template>
  <div class="add-share" :class="active" >
    <div class="context">
      <div class="input">
        <Input v-model="title" placeholder="输入文档标题" />
      </div>
      <div class="html">
        <editor ref="editor" :contents="content"></editor>
      </div>
    </div>
    <div class="footer">
      <div class="fl" v-if="isPrivacy===1" @click="isPrivacy=2">
        <p class="skt">
          <i class="ivu-icon ivu-icon-unlocked"></i> 隐私模式</p>
        <p class="ig">所有成员可见</p>
      </div>
      <div class="fl" v-if="isPrivacy===2" @click="isPrivacy=1">
        <p class="skt">
          <i class="ivu-icon ivu-icon-locked"></i> 隐私模式</p>
        <p class="ig">仅参与者可见</p>
      </div>
      <button type="button" class="fr ivu-btn ivu-btn-info ivu-btn-large" @click="publishShare" :loading="loading">
        <span v-if="!loading">立即发布</span>
        <span v-else>Loading...</span>
      </button>
    </div>
  </div>
</template>

<script>
import editor from "../../resource/Simditor.vue";
import { shareAdd, editShare } from "../../../axios/api.js";
export default {
  props: ["projectId", "shareTitle", "shareContent", 'shareId'],
  data() {
    return {
      value: "",
      loading: false,
      isPrivacy: 1,
      active: "",
      title: this.shareTitle,
      content: this.shareContent
    };
  },
  components: {
    editor
  },

  mounted() {
    this.$refs.editor.contents = this.content;
    console.log(this.$refs.editor)
    // editor.on('valuechanged', () => {
    //   this.content = editor.getValue()
    // })
  },
  methods: {
    publishShare() {
      this.content = this.$refs.editor.content;
      if (this.title == null || this.title == "") {
        this.$Notice.warning({
          title: "请输入分享标题"
        });
        return false;
      }

      if (this.content == null || this.content == "") {
        this.$Notice.warning({
          title: "请输入分享内容"
        });
        return false;
      }

      this.loading = true;
      let params = {
        projectId: this.projectId,
        title: this.title,
        content: this.content,
        isPrivacy: this.isPrivacy
      };
      // 编辑分享
      if (this.shareId) {
        editShare(this.shareId,params).then(res => {
          this.$emit("close");
        })
      }else {
        // 新建分享
        shareAdd(params).then(res => {
          console.log(res);
          if (res.result === 1) {
            this.title = "";
            this.content = "";
            this.loading = false;
            this.$emit("close");
          }
        });
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.simditor {
  border: 0;
  .simditor-body {
    height: 539px;
  }
}
.add-share {
  overflow: hidden;
  width: 100%;
  background-color: #fff;
  &.active {
    opacity: 1;
    top: 0;
  }
  .context {
    width: 1100px;
    margin: 0 auto;
    .input input {
      width: 100%;
      font-size: 18px;
      border: none;
      height: 40px;
      line-height: 26px;
      margin-top: 20px;
    }
    .html {
      padding-top: 20px;
      height: 600px;
      overflow-y: auto;
    }
  }
  .footer {
     z-index: 9999999;
    position: fixed;
    bottom: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
    padding: 16px;
    border-top: 1px solid rgb(226, 226, 226);
    background-color: #fff;
    .fl {
      color: gray;
      &:hover {
        .skt {
          color: #2d8cf0;
        }
      }
    }
  }
  .title {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    padding: 0 16px;
    border-bottom: 1px solid rgb(226, 226, 226);
    .fr {
      margin-top: 16px;
      cursor: pointer;
    }
  }
}
</style>
