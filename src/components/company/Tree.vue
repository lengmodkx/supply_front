<template>
  <tree :nodes="data" @onCreated="onCreated" :setting="setting" @onClick="onClick" ref="ztreeDom" />
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {getDepartmentTree } from "@/axios/companyApi";
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
          selectedMulti: false,
        },
        check: {
          enable: false
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
              url: process.env.VUE_APP_URL+'/partments/tree',
              autoParam: ["id=departmentId"],
              dataType: "JSON",
              headers: { "x-auth-token": localStorage.token },
              //异步返回结果集处理(必须返回json数据)
              dataFilter: function(treeId, parentNode, res) {
                  console.log(res);
                  return res.data;
              }
          },

      }
    };
  },

  computed: {
    ...mapState("tree", ["fileTree", "showView"])
  },
  methods: {
    ...mapActions("tree", ["initFolders"]),
    ...mapActions("file", ["searchFile", "initTag"]),
    onCreated(ztreeObj) {
      this.ztreeObj = ztreeObj;
      var nodes = ztreeObj.getNodes();
    },
    onClick(evt, treeId, treeNode) {
        console.log(treeId, treeNode);
        this.$emit('changePartment',treeNode.id,treeNode.name,treeNode.pId);
    },
    asyncRefresh(id) {
      var node = this.ztreeObj.getNodeByParam("id", id);
      node.isParent = true;
      this.ztreeObj.reAsyncChildNodes(node, "refresh", true);
    },
    removeNode(id) {
      var sNode = this.ztreeObj.getNodeByParam("id", id);
      var nodeN = sNode.getNextNode();
      var nodeP = sNode.getPreNode();
      var nodeF = sNode.getParentNode();
      if(nodeN!=null){
          this.ztreeObj.selectNode(nodeN);
          this.$emit('changePartment',nodeN.id,nodeN.name);
      }else if(nodeP!=null){
          this.ztreeObj.selectNode(nodeP);
          this.$emit('changePartment',nodeP.id,nodeP.name);
      }else if(nodeF!=null){
          this.ztreeObj.selectNode(nodeF);
          this.$emit('changePartment',nodeF.id,nodeF.name);
      }else{
         this.$emit('reSetPartment');
      }
      this.ztreeObj.removeNode(sNode, false);
    },
    updateNodeName(id,name){
     var node = this.ztreeObj.getNodeByParam("id", id);
      node.name = name;
      this.ztreeObj.updateNode(node);
    },
  }
};
</script>
<style scoped lang="less">
</style>
