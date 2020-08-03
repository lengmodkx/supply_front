<template>
  <tree :nodes="data" @onCreated="onCreated" :setting="setting" @onCheck="onCheck" ref="ztreeDom" />
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { getDepartmentTree } from "@/axios/companyApi";
import tree from "vue-giant-tree";

export default {
  components: {
    tree
  },
  props: ["data"],
  data() {
    return {
      ztreeObj: null,
      setting: {
        view: {
          showIcon: false,
          showTitle: false,
          selectedMulti: false
        },
        check: {
          enable: true,
          chkboxType: { Y: "", N: "" },
          chkStyle: "radio", //单选框
          radioType: "all" //对所有节点设置单选
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: 0
          }
        },
        async: {
          //异步设置
          enable: true,
          type: "post",
          url: "http://192.168.31.66:8091/api/partments/tree",
          //   url: process.env.VUE_APP_TREE_URL3,
          autoParam: ["id=departmentId"],
          dataType: "JSON",
          headers: { "x-auth-token": localStorage.token },
          //异步返回结果集处理(必须返回json数据)
          dataFilter: function(treeId, parentNode, res) {
            // console.log(res);
            return res.data;
          }
        }
      }
    };
  },

  computed: {
    ...mapState("tree", ["fileTree", "showView"])
  },
  mounted() {},
  methods: {
    ...mapActions("tree", ["initFolders"]),
    ...mapActions("file", ["searchFile", "initTag"]),
    onCreated(ztreeObj) {
      this.ztreeObj = ztreeObj;
      var nodes = ztreeObj.getNodes();
    },
    onCheck(evt, treeId, treeNode) {
      this.$emit("changePartment", treeNode.id, treeNode.name, treeNode.pId);
    },
    asyncRefresh(id) {
      var node = this.ztreeObj.getNodeByParam("id", id);
      node.isParent = true;
      this.ztreeObj.reAsyncChildNodes(node, "refresh", true);
    }
  }
};
</script>
<style  lang="less">
.ztree li .radio_true_full:after{
  top: 2px !important;
  left: 2px !important;
}
</style>
