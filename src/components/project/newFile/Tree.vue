<template>
    <tree :nodes="data" @onCreated="onCreated"  :setting="setting"  @onClick="onClick"   ref='ztreeDom'/>
    
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
            setting: {
                check: {
                    enable: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        pIdKey: "pId",
                    }
                },
                view: {
                    showIcon: true,
                }
            }
        }
    },
     computed: {
      ...mapState("tree", ["fileTree",'showView']),
     
   },
  
    
    methods:{
           ...mapActions("tree", ["initFolders",]),
              ...mapActions("file", ["initFile", "searchFile", "initTag"]),
        onCreated(obj){
           
        },
        onClick(evt, treeId, treeNode){
            console.log(treeNode)

             this.$store.commit("file/crumbsTree",treeNode);//改变菜单栏
            this.folderId = treeNode.id;                  
            let params = { fileId: this.folderId };
            this.initFile(params).then(res => {
                     
            });
        }
    },
   
}
</script>
<style lang="less">
</style>