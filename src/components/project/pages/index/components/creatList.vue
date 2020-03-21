<template>
  <div class="creat-list">
     <!-- <textarea placeholder="输入标题以新建任务" v-model="textarea"></textarea> -->
     <Input v-model="textarea" maxlength="100" show-word-limit type="textarea" placeholder="输入标题以新建任务" ref="textarea" />
      <!-- 设置认领者 -->
       <!-- <div class="img-box">
               
                <img class="avatar" :src="defaultImage" alt=""  />
          
                <span>{{userName}}</span>
       </div>
      <div>
        设置截至时间
      </div> -->
      <div class="creat-bottom">
        <!-- <div>... 更多</div> -->
        <div></div>
        <div>
            <Button    :disabled="textarea == ''"     @click="createTask(1)">完成并创建下一个</Button>
            <Button    :disabled="textarea == ''"   type="primary"  @click="createTask(2)">完成</Button>
        </div>
      </div>
    
  </div>
</template>
<script>
import {  addTask, taskExecutor,projectMembers} from "@/axios/api";
import SetExecutor from "./SetExecutor";
import { mapState, mapActions, mapMutations } from "vuex";
export default {

   components: {
    SetExecutor,
  },
   props: ['projectId','taskMenuId','taskGroupId'],
  data() {
    return {
      textarea: "",
      userId:localStorage.userId,
      userName:localStorage.userName,
      executor:localStorage.userId,
      memberList: [],
      changeMember:false
    };
  },
  computed: {
   
    ...mapState("user", ["userInfo","defaultImage"]),
    
 
  },
  mounted() {
    console.log(this.$refs.textarea)
    this.$refs.textarea.focus();
  },
  watch: {
   
  },

  methods: {
   // 创建任务
    createTask(type) {
      console.log(type)
      if (this.textarea == "") {
        this.$Message.error("输入标题以新建任务");
        return;
      }
      this.isCreateTask = true; //打开loading
      let data = {
        taskName: this.textarea,
        projectId: this.projectId,
        taskMenuId: this.taskMenuId,
        taskGroupId: this.taskGroupId,
       
        
      };
        //  memberId:this.userId,
        // executor:this.executor,
      addTask(data).then(res => {
        if (res.result === 1) {
          this.textarea = "";
          this.isCreateTask = false;
          if(type=='2'){
            this.$emit("close");
          }
        }
      });
    },

    // 选择执行者
     itemClick(item) {
      console.log(item)
      this.executor=item.memberId
      this.userName=item.memberName
      this.img=item.memberImg
      this.changeMember=true
    },

    //获取执行者
     popShow(){
      projectMembers(this.projectId).then(res => {
        console.log(res)
        this.memberList=res.data
        this.loading=false
      })
    },

    popHide() {
      this.searchvalue = "";
    },
  
    
  },
  created:function(){
    
    console.log(this.userInfo)
    
  }
};
</script>
<style scoped lang="less">

 .creat-list{
   line-height: 26px;
   textarea {
    width: 100%;
    min-height: 60px;
    padding: 0px;
    border: none;
    border-radius: 3px;
   }
   .img-box{
     display: flex;
     align-items: center;
     img{
       width: 24px;
       height: 24px;
       border-radius: 50%;
       margin-right: 10px;
     }
     padding:10px 0px;
   }
   .creatMember {
            background: #ff0000;
            display: flex;
            align-items: center;
   }

    .list-head{
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 10px;
            float: left;
  }

   .creat-bottom{
     padding-top:20px ;
     display: flex;
     justify-content: space-between;
     button{
       margin-left: 10px;
     }
    // .creat-button{
    //   padding:2px 10px;
    //   border:1px solid #bfbfbf;
    //   color: #bfbfbf;
    //    border-radius: 5px;
    // }
   }
   
   
 }
</style>
