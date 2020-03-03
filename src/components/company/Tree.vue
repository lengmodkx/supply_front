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
          showIcon: true,
          selectedMulti: false,
        },
        check: {
          enable: false
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
          }
        },
        edit:{
          enable:true,
          editNameSelectAll:true,
          removeTitle: "删除部门",
          drag:{
              isCopy:false
          }
        },
        async: {
              //异步设置
              enable: true,
              type: "post",
              url: 'http://localhost:8080/partments/tree',
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
    ...mapActions("file", ["initFile", "searchFile", "initTag"]),
    onCreated(ztreeObj) {
      this.ztreeObj = ztreeObj;
      var nodes = ztreeObj.getNodes();
      if (nodes.length > 0) {
        ztreeObj.selectNode(nodes[0]);
        this.$store.commit("file/crumbsHome", nodes[0]); //初始化菜单
      }
    },
    onClick(evt, treeId, treeNode) {
        console.log(treeId, treeNode);
        getDepartmentTree("",treeId).then(res => {
            this.treeData = res.data
        })


    },
    asyncRefresh() {
      var nodes = this.ztreeObj.getSelectedNodes();
      console.log(nodes);
      if (nodes.length > 0) {
        this.ztreeObj.reAsyncChildNodes(nodes[0], "refresh", true);
      }
    },
    getParentNodes(node, allNode) {
      if (node != null) {
        allNode.push(node);
        var curNode = node.getParentNode();
        this.getParentNodes(curNode, allNode);
      }
    }
  }
};
</script>
<style scoped >
</style>
