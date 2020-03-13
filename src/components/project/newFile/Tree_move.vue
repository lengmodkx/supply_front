<template>
  <tree :nodes="data" @onCreated="onCreated" :setting="setting" @onClick="onClick" ref="ztreeDom" />
</template>
<script>
    import { mapState, mapActions, mapMutations } from "vuex";
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
                        selectedMulti: false
                    },
                    check: {
                        enable: true,
                        chkboxType: {"Y": "", "N": ""}
                    },
                    callback: {
                        onCheck: this.zTreeOnCheck,//勾选事件回调函数
                        beforeClick:this.beforeClick
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
                        type: "get",
                        url: process.env.VUE_APP_TREE_URL,
                        autoParam: ["id"],
                        dataType: "text",
                        headers: { "x-auth-token": localStorage.token },
                        //异步返回结果集处理(必须返回json数据)
                        dataFilter: function(treeId, parentNode, res) {
                            console.log(res);
                            if (res.result == 1) {
                                return res.data;
                            }
                        }
                    }
                }
            };
        },
        methods: {
            getFolderId(){
                var nodes =  this.ztreeObj.getCheckedNodes(true);
                console.log(nodes)
                return nodes[0].id;
            },
            onCreated(ztreeObj) {
                this.ztreeObj = ztreeObj;
                var nodes = ztreeObj.getNodes();
                if (nodes.length > 0) {
                    ztreeObj.selectNode(nodes[0]);
                }
            },
            onClick(evt, treeId, treeNode) {

            },
            beforeClick() {
                //禁止节点被选中
                var e =  e ||window.event;
                e.stopPropagation();
                return false;
            },
            zTreeOnCheck(event, treeId, treeNode){
                if(treeNode.checked){    //注意，这里的树节点的checked状态表示勾选之后的状态
                    this.ztreeObj.checkAllNodes(false);//取消所有节点的选中状态
                    this.ztreeObj.checkNode(treeNode,true,false,false);
                }
            }
        }
    };
</script>
<style lang="less"></style>
