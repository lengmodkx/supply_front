<template>

    <div class="info-user">
      <div class="info-nav"> 
           成员 > {{user.memberName}}
      </div>
      <div class=" title-section">
            <div class="info-tilel">
                  <div class="left"> 
                      <Avatar :src="user.memberImg" class="avatar" />
                      <div>
                          <h4>{{user.memberName}}</h4>
                          <span>{{user.job}}</span>
                      </div>
                  </div>
                  <div class="right">
                    <div class="envelope">
                      <img src="./../../assets/images/user-e.png" width="22" />
                       {{user.memberEmail}}</div>
                    <div> 
                      <img src="./../../assets/images/user-t.png" width="14" />{{user.memberPhone}}
                      </div>
                  </div>
            </div>
            <div class="title-nav">

               <Tabs active-key="key1">
                  <Tab-pane label="详细资料" key="key1">
                    
                    <div class="title">
                      <span>
                          详细资料
                      </span>
                      <button  @click="showInformation=true">
                         <img src="./../../assets/images/user-edit.png" width="14" />
                         编辑
                         
                      </button>
                      
                    </div>
                    <div class="information">
                          <ul >
                              <li>
                                <span>
                                  姓名:
                                </span> 
                                <span>
                                  {{user.memberName || '-'}}
                                </span>
                              </li>
                              <li>
                                <span>
                                  司龄:
                                  </span> 
                                   <span>
                                    {{user.stayCompanyAge || '-'}}
                                   </span>
                              </li>
                              <li>
                                <span>
                                  职位:
                                </span> 
                                <span>
                                    {{user.job || '-'}}
                                </span>
                              </li>
                          </ul>
                          <ul >
                              <li>
                                <span>员工类型:</span> 
                                 <span v-if='user.memberLabel==0'>
                                   
                                  普通成员 
                                   </span>
                                   <span v-else-if='user.memberLabel==1'>
                                   拥有者
                                  
                                   </span>
                                   <span v-else> 
                                     -
                                   </span>
                              </li>
                              <li>
                                 <span>办公地点：</span>
                                  <span>
                                     {{user.address || '-'}}
                                   </span>
                              </li>
                              <li>
                                 <span>电子邮件：</span>
                                  <span>
                                  {{user.memberEmail || '-'}}
                                   </span>
                              </li>
                          </ul>
                          <ul >
                              <li> <span>电话:</span> 
                               <span>
                                   {{user.memberPhone || '-'}}
                                   </span>
                              </li>
                              <li>
                                   <span>生日：</span> 
                                    <span>
                                      {{user.birthday || '-'}}
                                   </span>
                              </li>
                              <li>
                                   <span>部门：</span>  
                                   <span>
                                  {{user.partmentName || '-'}}
                                   </span>
                              </li>
                          </ul>
                          <ul >
                              <li> 
                                <span>上级:</span>  
                              <span>
                                   {{user.parentMentName || '-'}}
                                   </span>
                              </li>
                              <li>
                                   
                              </li>
                              <li>
                                  
                              </li>
                          </ul>
                    </div>
                    
                  </Tab-pane>
                  <Tab-pane label="最近动态" key="key2">
                    <div class="title">
                      最近动态
                    </div>
                  </Tab-pane>
                  <Tab-pane label="任务安排" key="key3">
                    <div class="title">
                      任务安排
                    </div>
                  </Tab-pane>
                  <Tab-pane label="任务安排" key="key4">
                    <div class="title">
                      日程安排
                    </div>
                  </Tab-pane>
                  <Tab-pane label="项目经历" key="key5">
                    <div class="title">
                     项目经历
                    </div>
                  </Tab-pane>
              </Tabs>

            </div>
      </div>
    
      <Modal v-model="showInformation" title="企业成员信息" :width="600" :footer-hide="true" >             
              <Form  :model="message" ref="message"  >	
                       <FormItem >
                         <Row>
                              <i-col span="12">
                                  <FormItem label="姓名" style="padding-right:10px;">
                                          <Input v-model="message.memberName" placeholder="请输入姓名"></Input>
                                  </FormItem>
                              </i-col>
                              <i-col span="12">
                                  <FormItem label="电子邮件">
                                      <Input v-model="message.memberEmail" placeholder="请输入邮箱"/></Input>
                                  </FormItem>
                              </i-col>
                         </Row>
                       </FormItem>

                       <FormItem >
                         <Row>
                              <i-col span="12">
                                  <FormItem  label="生日">
                                      <DatePicker type="date" placeholder="选择日期" v-model="message.birthday"></DatePicker>
                                   </FormItem>
                              </i-col>
                              <i-col span="12">
                                  <FormItem label="入职时间">
                                      <DatePicker type="date" placeholder="选择日期" v-model="message.time"></DatePicker>
                                  </FormItem>
                              </i-col>
                         </Row>
                       </FormItem>

                       <FormItem >
                         <Row>
                              <i-col span="10">
                                  <FormItem label="员工类型" style="padding-right:10px;">
                                          <i-select :model.sync="message.memberLabel" placeholder="请选择">
                                                          <i-option value="beijing">北京市</i-option>
                                                          <i-option value="shanghai">上海市</i-option>
                                                          <i-option value="shenzhen">深圳市</i-option>
                                          </i-select>
                                  </FormItem>
                              </i-col>
                               <i-col span="2" style="padding-top:35px;padding-left:10px;  cursor: pointer;">
                                  
                                      <Icon type="ios-add-circle-outline" @click="showInformationAdd=true;addTitle='添加员工类型'" />
                                 
                              </i-col>
                              <i-col span="10">
                                  <FormItem label="职位">
                                          <i-select :model.sync="message.job" placeholder="请选择">
                                                          <i-option value="beijing">北京市</i-option>
                                                          <i-option value="shanghai">上海市</i-option>
                                                          <i-option value="shenzhen">深圳市</i-option>
                                          </i-select>
                                     
                                  </FormItem>
                              </i-col>
                              <i-col span="2" style="padding-top:35px;padding-left:10px;  cursor: pointer;">
                                  
                                        <Icon type="ios-add-circle-outline" @click="showInformationAdd=true;addTitle='添加职位'" />
                                 
                              </i-col>

                              
                         </Row>
                       </FormItem>
                        <FormItem label="部门">

                           <i-select :model.sync="message.job" placeholder="请选择">
                                    <i-option value="beijing">北京市</i-option>
                                    <i-option value="shanghai">上海市</i-option>
                                    <i-option value="shenzhen">深圳市</i-option>
                           </i-select>
                        </FormItem>
                        <FormItem label="联系电话">
                        <Input v-model="message.memberPhone" placeholder="请输入联系电话"></Input>
                        </FormItem>

                         <FormItem label="工作地点">
                        <Input v-model="message.address" placeholder="请输入工作地点"></Input>
                        </FormItem>
                    
                        
                        <FormItem>
                               <Button  style="width:570px;" type="primary" @click="handleSubmit()">保存</Button>
                        </FormItem>
                    </Form>
              
      </Modal>

      <Modal v-model="showInformationAdd"  :title="addTitle" :width="300" :footer-hide="true" >             
              <Input v-model="message.userName" placeholder="请输入姓名"></Input>
              <Button  style="width:270px;margin-top:10px" type="primary" @click="handleSubmit()">保存</Button>
              
      </Modal>

      

    </div>
    
 
</template>
<script>
import { mapState, mapActions } from "vuex";
import { getUsers, getOrgIdUsers, getAssignUsers, addUser, addProjectUser, removeUser } from "../../axios/api2.js";
import { updateUserRole } from "../../axios/api.js";

export default {
  name: "",
  props:['user'],
  components: {
    
  },
  data() {
    return {
      showInformation:false,
      showInformationAdd:false,
      addTitle:'',
       message:{
                userId:localStorage.userId,
                memberName:'',
                memberEmail:'',
                birthday:'',
                time:'',
                memberLabel:'',
                job:'',
                accountName:'',
                memberPhone:'',
                address:'',
                email:'',
                
            },
      
    };
  },

  computed: {
   
  },
  mounted() {
    
  },
  methods: {
     handleSubmit () {}
  }
  
};
</script>
<style scoped lang="less">
/deep/.ivu-date-picker{
  width: 275px;
}

.info-user{
  width: 780px;
  margin:0px auto;
  .info-nav{
    margin: 20px 0;
  }
  .title-section{
        background: #ffffff;
      
        border: 1px solid #e5e5e5;
        border-radius: 3px;
       .info-tilel{
           display: flex;
           justify-content: space-between;
           padding:20px;
           justify-items: center;
           i{
             padding-right:10px;
           }
           .left{
               display: flex;
                .avatar{
                  width: 48px;
                  height: 48px;
                  margin-right:10px;
                }
           }
           
        }
  }
  .title-nav{
        padding: 20px;
        .title{
          display: flex;
          justify-content: space-between;
          background: #f5f5f5;
          padding:10px 10px;
          margin:0px;
            span:first-child{
              font-size: 16px;
              font-weight: bold;
            }
            button{
              border: none;
              cursor: pointer;
              background: none;
            }
          
        }
        .information{

          ul{
               border-bottom: 1px solid #e5e5e5;
               display: flex; 
               justify-content: space-around;
               padding:20px 10px;
               li{
                    flex: 1;
                    display: flex;
                    flex-flow: column wrap;
                    span{
                       
                        padding-top:5px;
                    }
                    span:first-child{
                          color: #a6a6a6;
                    }
               }
          }
          
            ul:last-child{
              border-bottom:none;
            }
        }

   }
  
  
}

</style>
