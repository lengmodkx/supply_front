<template>
  <div v-if="sFile!=null">
    <div class="padd">
      <Select v-model="visibility" style="margin-bottom: 15px" @on-change="onchange">
        <Option value="0">所有项目成员可见</Option>
        <Option value="1">部分项目成员可见</Option>
      </Select>
    </div>
    <div class="can-see-con">
      <div class="public" v-if="visibility === '0'">
        <img src="@/icons/img/all-can-see.png" alt="" />
        <h3>公开状态</h3>
        <p>当前状态下项目内所有成员可见</p>
      </div>
      <div class="intimate" v-if="visibility === '1'">
        <div class="intimate-head">
          <span>当前可见成员：</span>
          <Poptip v-model="popVisible" :transfer="true" popper-class="pop">
            <p class="pop-title"><Icon type="md-add-circle" />添加可见成员</p>
            <InvolveMember :projectId="projectId" @addUser="addUser"  :joins="joins" slot="content"></InvolveMember>
          </Poptip>
        </div>
        <ul class="intimate-con">
          <li v-if="joins.length>0" v-for="(user,index) in joins" :key="index">
            <div>
              <Avatar :src="user.image" />
              <p style="margin-left:15px">{{user.userName}}</p>
            </div>
            <Icon type="ios-trash-outline" v-if="user.userId!=userId" @click.native.stop="remove(user)"/>
            <span v-if="user.userId==userId">拥有者</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {projectMembers} from '../../../axios/api.js'
import { filePrivacy,updateFolderPrivacy,delFolderUser } from '../../../axios/fileApi.js'
import InvolveMember from '../newFile/InvolveMember.vue'
import { mapState, mapActions } from "vuex";
export default {
  name: "fileCanSee",
  components:{
      InvolveMember
  },
  data() {
    return {
      visibility: "",
      popVisible: false,
      projectId:this.$route.params.id,
      userId:localStorage.userId,
      image:localStorage.userImg,
      userName:localStorage.userName,
      joins:[]
    };
  },
  computed:{
    ...mapState("file", ["sFile"]),
  },
  mounted(){
      this.joins= [];
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",this.joins)
      this.visibility = this.sFile.filePrivacy+"";
     // this.joins = this.sFile.joinInfo; 
      Object.assign(this.joins,this.sFile.joinInfo);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",this.joins)
      this.joins.push(this.sFile.user);
  },
  methods:{
    onchange(value){
        filePrivacy(this.sFile.fileId, value,this.projectId,this.sFile.parentId).then(res => {
            if(res.result==0){
                this.$Message.success(res.msg)
            }
        });
    },
    remove(user){
        
        delFolderUser(this.sFile.fileId,user.userId,this.projectId,this.sFile.parentId).then(res=>{
          if(res.result==1){
                    this.joins = this.joins.filter(v=>v.userId!=user.userId)
                    this.$Message.success("删除当时可见成员成功")
          }else{
                  this.$Message.error("删除当时可见成员失败")
          }
         
        })

    },
    addUser(ids,peopleData){
      this.popVisible = false;
        console.log(ids);
        this.joins = peopleData;
        var userIds = ids.filter(v=>v!=this.userId);
        console.log(userIds)
        updateFolderPrivacy(this.sFile.fileId,userIds.join(','),this.projectId,this.sFile.parentId);
    }
  }
};
</script>

<style scoped lang="less">
.cansee-header {
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 15px;
  border-bottom: 1px solid #d5d5d5;
  margin-bottom: 20px;
}
.padd {
  width: 100%;
  padding: 0 16px;
}
.can-see-con {
  width: 100%;
  height: 350px;
}
.public {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a6a6a6;
  img {
    margin-bottom: 20px;
    width: 110px;
  }
  h3 {
    margin-bottom: 12px;
    font-size: 18px;
  }
}
.intimate {
  width: 100%;
  height: 100%;
  .intimate-head {
    width: 100%;
    height: 40px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pop-title {
      display: flex;
      color: #3da8f5;
      cursor: pointer;
      i {
        font-size: 16px;
        margin-right: 8px;
      }
    }
  }
  .intimate-con {
    width: 100%;
    height: 310px;
    
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
      background-color: #e5e5e5;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cecece;
    }
    .create-people {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      div {
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }
      }
      span {
        font-size: 14px;
        color: gray;
      }
    }
    li {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      &:hover {
        background-color: #f5f5f5;
        i {
          display: block;
        }
      }
      div {
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }
      }
      i {
        font-size: 22px;
        cursor: pointer;
        color: gray;
        display: none;
        &:hover {
          color: #3da8f5;
        }
      }
    }
  }
}
.pop-content {
  height: 368px;
  width: 252px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 15px 0;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #e5e5e5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cecece;
  }
  .pop-content-title {
    margin-top: 15px;
    font-size: 14px;
    color: gray;
    padding: 0 16px;
  }
  .people-ul {
    width: 100%;
    li {
      width: 100%;
      height: 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 0 16px;
      &:hover {
        background-color: #f5f5f5;
      }
      div {
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }
      }
      i {
        font-size: 20px;
        color: #a6a6a6;
      }
    }
  }
}
</style>
