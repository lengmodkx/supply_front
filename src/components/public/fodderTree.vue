<template>
  <tree :nodes="data" @onCreated="onCreated" :setting="setting" @onClick="onClick" ref="ztreeDom" />
</template>
<script>
import tree from "vue-giant-tree";
export default {
  components: {
    tree,
  },
  props: ["data"],
  data() {
    return {
      ztreeObj: null,
      setting: {
        view: {
          showIcon: true,
          selectedMulti: false,
        },
        check: {
          enable: false,
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: 0,
          },
        },
        async: {
          //异步设置
          enable: true,
          type: "get",
          url: process.env.VUE_APP_TREE_URL,
          autoParam: ["id"],
          dataType: "text",
          headers: { "x-auth-token": localStorage.token },
          //异步返回结果集处理(必须返回json数据)
          dataFilter: function(treeId, parentNode, res) {
            if (res.result == 1) {
              return res.data;
            }
          },
        },
      },
    };
  },
  methods: {
    onCreated(ztreeObj) {
      this.ztreeObj = ztreeObj;
      var nodes = ztreeObj.getNodes();
      if (nodes.length > 0) {
        ztreeObj.selectNode(nodes[0]);
        this.$store.commit("materialfile/initCrumbs", nodes[0]); //初始化菜单
      }
    },
    onClick(evt, treeId, treeNode) {
      this.$emit("init", treeNode.id);
      
      
      var allNode = [];
      allNode.push(treeNode); //获取当前选中节点
      var node = treeNode.getParentNode();
      this.getParentNodes(node, allNode);
      this.$store.commit("materialfile/crumbsTree", allNode.reverse()); //初始化菜单
    },
    getParentNodes(node, allNode) {
      if (node != null) {
        allNode.push(node);
        var curNode = node.getParentNode();
        this.getParentNodes(curNode, allNode);
      }
    },
  },
};
</script>
<style lang="less"></style>
