<template>
<div class="move-box">
         <div slot="header" class="header">
          <span style="font-size:18px;">移动文件{{fileName}}至</span>
        </div>
        <div class="move-and-mobile-file">
          <div class="column-projects flex-static thin-scroll">
            <div class="project-title">项目</div>
            <ul>
              <li v-for="(project, index) in projects" :key="index" :class="{ selected:project.projectId==projectId,unselected:project.projectId!=projectId }" @click="changeProject(project.projectId)">
                <span>{{project.projectName}}</span>
              </li>
            </ul>
          </div>
          <div class="picker-column thin-scroll flex-fill flex-vert">
          
            <v-jstree :data="asyncData" show-checkbox :multiple=false whole-row ref="jstree" children-field-name="child"></v-jstree>
          </div>

        </div>
        <div slot="footer" class="move-footer">
          <span>{{footerTxt}}</span>
          <div class="move-footer-btn">
            <Button type="default" size="large" >取消</Button>
            <Button type="primary" size="large" >确定</Button>
          </div>
        </div>
</div>
</template>
<script>
import VJstree from "vue-jstree";
export default {
   components: {
    VJstree,
  },
  data () {
    return {
            projects:[],
            asyncData:[],
            loading1: false,
            footerTxt: "跨项目移动时，部分信息不会被保留。",
             fileName:''
    }   
  },
  methods: {
        // 改变选择的项目
        changeProject(projectId) {
            this.loading1 = true;
            this.items = [];
            this.projectId = projectId;
            folderChild(this.projectId).then(res => {
                this.asyncData = res.data;
                this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
                this.loading1 = false;
            });
            },
        },
        cancelRemoveClone() {
            this.folderId = "";
            this.showMove = false;
        },
         // 移动、复制文件的确定按钮
        removeCloneFile() {
            if (this.caozuo === "移动") {
            removeFile(this.folderId, this.thisFileId, this.projectId).then(
                res => {
                if (res.result) {
                    this.$Message.success("移动成功");
                    this.showMove = false;
                }
                }
            );
            } else if (this.caozuo === "复制") {
            cloneFile(this.folderId, this.thisFileId).then(res => {
                this.$Message.success("复制成功");
                this.showMove = false;
            });
            }
        
        },
}
</script>
<style lang="less">
.move-box{
        .header{
            padding-bottom:10px;
        }
        .move-and-mobile-file {
            border-top :1px solid #e5e5e5;
            border-bottom :1px solid #e5e5e5;
            display: flex;
            }
            .flex-static {
            flex-shrink: 0;
            }
            .column-projects {
            width: 200px;
            overflow-x: hidden;
            overflow-y: auto;
            height: 438px;
            border-right: 1px solid #e5e5e5;
            .project-title {
                font-size: 14px;
                color: gray;
                font-weight: 700;
                height: 40px;
                line-height: 40px;
                padding-left: 14px;
            }
            .project-list {
                height: 30px;
                font-size: 13px;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
                line-height: 30px;
                padding-left: 14px;
            }
            }

            .picker-column {
            display: flex;
            flex-direction: column;
            min-width: 0%;
            background-color: #fff;
            }

            .flex-fill {
            flex: 1 1 auto;
            }
            .ivu-modal-footer{
                border-top: 1px solid #e8eaec;
                padding: 12px 18px 12px 18px;
                text-align: right;
            }
            .move-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top:10px;
                .move-footer-btn button{
                    margin-left: 10px;
                }
            }
}


</style>