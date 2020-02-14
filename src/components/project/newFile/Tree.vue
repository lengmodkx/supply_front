<template>
    <tree :nodes="data" @onCreated="onCreated"  :setting="setting"  @onClick="onClick" ref='ztreeDom'/>
    
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import tree from "vue-giant-tree";
export default {
    components:{
        tree
    },
    props: ["data"],
    data(){
        return {
            ztreeObj: null,
            setting:{
               view:{
                   showIcon: true,
                   selectedMulti: false
               },
               check: {
                    enable: false
                },
                data:{
                    simpleData:{
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: 0
                    }
                },
                async:{//异步设置
                    enable: true,
                    type:"get",
                    url: "http://www.test.art1001.com/api/files/treenode",
                    autoParam: ["id"],
                    dataType: "text",
                    headers:{'x-auth-token':localStorage.token},
                    //异步返回结果集处理(必须返回json数据)
                    dataFilter: function(treeId, parentNode, res){
                        console.log(res)
                        return res.data;
                    }
                }
            },
        }
    },
    computed: {
      ...mapState("tree", ["fileTree",'showView']),
   },
    methods:{
        ...mapActions("tree", ["initFolders"]),
        ...mapActions("file", ["initFile", "searchFile", "initTag"]),
        onCreated(ztreeObj){
            this.ztreeObj = ztreeObj
        },
        onClick(evt, treeId, treeNode){
            console.log(treeNode)
            this.$store.commit("file/changeCreateFileId", treeNode.id);   
            this.$store.commit("file/crumbsTree",treeNode);//改变菜单栏
            this.folderId = treeNode.id;                  
            let params = { fileId: this.folderId };
            this.initFile(params).then(res => {
                     
            });
        },
        asyncRefresh(){
            var nodes = this.ztreeObj.getSelectedNodes();
            console.log(nodes)
            if (nodes.length>0) {
                this.ztreeObj.reAsyncChildNodes(nodes[0], "refresh",true);
            }
        }
    },
}
</script>
<style lang="less">
</style>