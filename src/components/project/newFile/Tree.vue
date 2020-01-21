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
                        pIdKey: "pId"
                    }
                },
                view: {
                    showIcon: true,
                }
            }
        }
    },
    
    methods:{
           ...mapActions("tree", ["initFolders"]),
              ...mapActions("file", ["initFile", "searchFile", "initTag"]),
        onCreated(obj){
            console.log(obj)
        },
        onClick(evt, treeId, treeNode){
                this.folderId = treeNode.id;                  
                // let params = { fileId: this.folderId };
                // this.$router.push({
                //     path: `/project/${this.$route.params.id}/files/${this.folderId}`
                // })
                let params = { fileId: this.folderId };
                this.initFile(params).then(res => {
                     console.log(this.files)
                });

        
        }

        
    },
    created:function(){
        
    }
}
</script>
<style lang="less">
</style>