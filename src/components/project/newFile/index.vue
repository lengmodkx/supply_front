<template>
  <div class="object-file-content">
    <div class="file-left">
      <tree :data="fileTree" ref="tree"  @recovery="recovery"></tree>
    </div>
    <div class="file-right">
      <file-header ref="fileheader" @recovery="recovery"></file-header>
      <file-tools ref="filetools" @createFolder="createFolder" @removeFolder="removeFolder"  @recovery="recovery"> </file-tools>
      <view-list  ref="viewlist" @updateNodeName="updateNodeName" @removeClone="removeClone"></view-list>
    </div>
  </div>
</template>
<script>
import tree from "@/components/project/newFile/Tree.vue"; //树
import list from "@/components/project/newFile/list.vue"; //列表内容
import viewList from "@/components/project/newFile/viewlist.vue"; //缩略图内容
import fileHeader from "@/components/project/newFile/header.vue"; //头
import fileTools from "@/components/project/newFile/tools.vue"; //工具

import { mapState, mapActions } from "vuex";

export default {
  components: { tree, list, fileHeader, fileTools, viewList },
  data() {
    return {
      fileId: this.$route.params.fileId,
      projectId: this.$route.params.id,
      loading: true
    };
  },
  computed: {
    ...mapState("tree", ["fileTree", "showView"])
  },
  mounted() {
    // 树
    this.initTree(this.fileId);
  },
  methods: {
    ...mapActions("tree", ["initTree"]),
    recovery(){
      this.$refs.viewlist.recoverySelected();
    },
    removeClone(caozuo){
        this.$refs.filetools.removeClone(caozuo)
    },
    createFolder(fileId) {
      this.$refs.tree.asyncRefresh(fileId);
    },
    removeFolder(fileIds) {
      this.$refs.tree.removeNode(fileIds);
    },
    updateNodeName(fileId,fileName){
      this.$refs.tree.updateNodeName(fileId,fileName);
    }
  },
  created: function() {
    this.$store.commit("file/changeCreateFileId", this.fileId);
  }
};
</script>
<style lang="less">
/deep/.ivu-select-single .ivu-select-selection {
  height: 24px;
  line-height: 24px;
}
/deep/.ivu-select-selection {
  line-height: 24px;
  border-radius: 1px;
  border: 1px solid #dddddd;
}
/deep/.ivu-input {
  height: 28px !important;
}
/deep/.ivu-input-icon {
  height: 28px;
  line-height: 28px;
}
button:focus {
  outline: none;
}
button {
  cursor: pointer;
}
li {
  list-style-type: none;
}

.no-files {
  width: 100%;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: gray;
  i {
    font-size: 40px;
  }
  p {
    font-size: 14px;
    margin-top: 10px;
  }
}
.ztree li {
  line-height: 28px;
}
.tree-box {
    margin-top: 20px;
  }
.object-file-content {
  display: flex;
  justify-content: flex-start;
  .file-left {
    width: 227px;
    height: 100vh;
    padding: 10px;
    border-right: 1px solid #efefef;
    overflow-y: auto;
  }
  .file-right {
    width: 100%;
    height: 100vh;
  }
}
</style>
