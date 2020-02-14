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
                    url: "http://test.art1001.com/api/files/treenode",
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
            this.ztreeObj = ztreeObj;
            var nodes = ztreeObj.getNodes();
            if (nodes.length>0) {
                ztreeObj.selectNode(nodes[0]);
                this.$store.commit("file/crumbsHome", nodes[0]);//初始化菜单
            }
        },
        onClick(evt, treeId, treeNode){
            this.$store.commit("file/changeCreateFileId", treeNode.id);  
            // if(treeNode.level==0){
            //     this.$store.commit("file/crumbsTree",treeNode);//根节点只做切换----菜单栏
            // }else{
            //     this.$store.commit("file/crumbsTreeAdd",treeNode);
            // }
            
            this.folderId = treeNode.id;                  
            let params = { fileId: this.folderId };
            this.initFile(params);

            
            var allNode = []; 
            allNode.push(treeNode);//获取当前选中节点  
            var node = treeNode.getParentNode();  
            this.getParentNodes(node,allNode); 
            //console.log(allNode.reverse()) 
            this.$store.commit("file/crumbsTree", allNode.reverse());//初始化菜单
        },
        asyncRefresh(){
            var nodes = this.ztreeObj.getSelectedNodes();
            console.log(nodes)
            if (nodes.length>0) {
                this.ztreeObj.reAsyncChildNodes(nodes[0], "refresh",true);
            }
        },
        getParentNodes(node,allNode){
            if(node!=null){
                allNode.push(node);  
                var curNode = node.getParentNode();  
                this.getParentNodes(curNode,allNode);  
            } 
               
        }
    },
}
</script>
<style lang="less">
</style>