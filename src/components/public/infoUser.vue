<template>
    <div class="info-user">
        <div class="info-nav">
            成员 > {{user.userName}}
        </div>
        <div class=" title-section">
            <div class="info-tilel">
                <div class="left">
                    <Avatar :src="user.memberImg" class="avatar"/>
                    <div>
                        <h4>{{user.userName}}</h4>
                        <span>{{user.job}}</span>
                    </div>
                </div>
                <div class="right">
                    <div class="envelope">
                        <img src="./../../assets/images/user-e.png" width="22"/>
                        {{user.memberEmail}}
                    </div>
                    <div>
                        <img src="./../../assets/images/user-t.png" width="14"/>
                        &nbsp;{{user.phone}}

                    </div>
                </div>
            </div>
            <div class="title-nav">
                <!-- <div class="add-talk">
                    <Icon type="ios-add-circle-outline"  />
                    发起群聊
                </div> -->
                <Tabs active-key="key1" @on-click="clickTabs">                  
                    
                    <Tab-pane label="详细资料" name="详细资料"  key="key1">

                        <div class="title">
                            <span>
                                详细资料
                            </span>
                            <button @click="showInformation = true">
                                <img src="./../../assets/images/user-edit.png" width="14"/>
                                编辑
                            </button>
                        </div>
                        <div class="information">
                            <ul>
                                <li>
                                <span>
                                  姓名:
                                </span>
                                    <span>
                                  {{user.userName || '-'}}
                                </span>
                                </li>
                                <li>
                                  <span>
                                    入职时间:
                                  </span>
                                    <span>
                                      {{ $moment(user.entryTime).format("YYYY-MM-DD HH:mm")||  '-'}}
                                    
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
                            <ul>
                                <li>
                                    <span>员工类型:</span>
                                    {{user.memberLabel || '-'}}

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
                            <ul>
                                <li><span>电话:</span>
                                    <span>
                                   {{user.phone || '-'}}
                                   </span>
                                </li>
                                <li>
                                    <span>生日：</span>
                                    <span>
                                      {{ user.birthday || '-'}}
                                   </span>
                                </li>
                                <li>
                                    <span>部门：</span>
                                    <span>
                                  {{user.deptName || '-'}}
                                   </span>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <span>上级:</span>
                                    <span>
                                   {{user.parentName || '-'}}
                                   </span>
                                </li>
                                <li>

                                </li>
                                <li>

                                </li>
                            </ul>
                        </div>

                    </Tab-pane>
                    <Tab-pane label="最近动态" name="最近动态" key="key2">
                          <div class="title">
                            <span>
                                最近动态
                            </span>
                            <button  >
                                <Select class="selectBox" v-model="timeModel" @on-change="getDynamicList" >
                                    <Option v-for="item in timeList" :value="item.yearOfMonth" :key="item.timeStamp">{{ item.yearOfMonth }}</Option>
                                </Select>
                            </button>
                          </div>                                 
                          <div v-if="dynamicList.length">
                              <ul  class="dynamic" >
                                <li v-for='item in dynamicList' :key='item.taskId'>
                                  <div class="dynamicI"></div>
                                  <div class="dynamic-Contant">
                                        <h4>{{item.taskName}}</h4>
                                        <ul class="dynamic-task">
                                                <li>
                                                  <i></i>
                                                  <span>{{item.projectName}}</span>
                                                </li>
                                                <li>
                                                  <span v-if="item.endTime"  > <Icon type="ios-clock-outline" /> {{ $moment(item.endTime).format("YYYY-MM-DD HH:mm") }}</span>
                                                </li>
                                                
                                              
                                        </ul>
                                
                                  </div>
                                  <Avatar v-if="item.executorImg "  :src="item.executorImg " class="avatar" />
                                </li>
                               
                              </ul>
                               <!-- <div class="dynamic-time" >
                                    <Avatar class="avatar" /> 时间
                              </div>  -->
                          </div>
                           <div class="box-no" v-else>
                              <img src="./../../assets/images/user-1.png" width="100" />
                          </div>
                    </Tab-pane>
                    <Tab-pane label="任务安排"  name="任务安排"  key="key3">
                        <div class="title">
                          <span>
                                任务安排&nbsp;&nbsp; 
                                <Select class="selectBox" v-model="classify" @on-change="getTaskList"  style="width:130px;">
                                    <Option v-for="item in classifyList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                                </Select>
                          </span>
                            
                            <button  @click="getTask" >
                             <Icon type="ios-people-outline" /> &nbsp;
                             <span >
                                      批量交接任务
                             </span>
                             
                            </button>
                        </div>
                         <div v-if="taskList.length">
                              <ul  class="task" >
                                <li v-for='item in taskList' :key='item.taskId'>
                                  <div class="dynamicI"></div>
                                  <div class="dynamic-Contant">
                                        <h4>{{item.taskName}}</h4> &nbsp;&nbsp;&nbsp;
                                        
                                        <span>  <Icon type="ios-copy-outline" /> {{item.projectName}}</span>
                                  </div>
                                  <span v-if="item.endTime" >{{ $moment(item.endTime).format("YYYY-MM-DD HH:mm") }}</span>
                                </li>
                               
                              </ul>
                               <!-- <div class="dynamic-time" >
                                    <Avatar class="avatar" /> 时间
                              </div>  -->
                          </div>  
                          <div class="box-no" v-else>
                              <img src="./../../assets/images/user-2.png" width="100" />
                          </div>
                       
                    </Tab-pane>
                    <Tab-pane label="日程安排" name="日程安排"  key="key4">
                        <div class="title">
                          <span>
                              日程安排
                          </span>
                            
                        </div>
                        <div v-if="schedulesList.length" >
                              <div  v-for='item in schedulesList' :key='item.createTime'>
                                <div class="schedulesTime">
                                      {{ $moment(item.endTime).format("YYYY-MM-DD HH:mm") }}
                                </div>
                                <ul  class="schedules" v-if='item.scheduleSimpleInfoVOS' >
                                  <li  v-for='i in item.scheduleSimpleInfoVOS' :key='i.scheduleId'>
                                          <div class="time">
                                              {{i.startTime}} 
                                               <span v-if="i.endTime">  -- </span>
                                              {{i.endTime}}
                                           </div>
                                          <h4 v-if='i.scheduleName'>{{i.scheduleName}}&nbsp;&nbsp;&nbsp;</h4> 
                                          <span><Icon type="ios-copy-outline" /> {{i.projectName}}</span>
                                  </li>
                                
                                </ul>
                            </div>  
                        </div>
                        <div class="box-no" v-else>
                            <img src="./../../assets/images/user-3.png" width="100"/>
                        </div>
                    </Tab-pane>
                    <Tab-pane label="项目经历" name="项目经历"  key="key5">
                        <div class="title">
                          <span>
                                  项目经历
                          </span>
                          <button @click="showexperienceList">
                              <img src="./../../assets/images/user-edit.png" width="14"/>
                              编辑
                          </button>
                            
                        </div>
                        <div v-if="isExperienceList">
                              <ul  class="experience" >
                                <li v-for='item in isExperienceList' :key='item.projectId'>
                                  <div class="dynamicI">
                                    <img src="./../../assets/images/download.jpg" width="100" />
                                  </div>
                                  <div class="dynamic-Contant">
                                        <h4>{{item.projectName}}</h4>
                                        <ul class="dynamic-task">
                                                <li>
                                                  <i></i>
                                                  <span>{{item.projectDes}} </span>
                                                </li>
                                                
                                              
                                        </ul>
                                
                                  </div>
                                  
                                </li>
                               
                              </ul>
                            
                          </div>
                        <div class="box-no" v-else>
                            <img src="./../../assets/images/user-4.png" width="100"/>
                        </div>
                    </Tab-pane>
                </Tabs>
            </div>
        </div>

        <Modal v-model="showInformation" title="企业成员信息" :width="600" :footer-hide="true">
            <Form :model="message" ref="message">
                <FormItem>
                    <Row>
                        <i-col span="12">
                            <FormItem label="姓名" style="padding-right:10px;">
                                <Input v-model="message.userName" placeholder="请输入姓名"></Input>
                            </FormItem>
                        </i-col>
                        <i-col span="12">
                            <FormItem label="电子邮件">
                                <Input v-model="message.memberEmail" placeholder="请输入邮箱"></Input>
                            </FormItem>
                        </i-col>
                    </Row>
                </FormItem>

                <FormItem>
                    <Row>
                        <i-col span="12">
                            <FormItem label="生日">
                                <DatePicker type="date" placeholder="选择日期" v-model="message.birthday"  format="yyyy-MM-dd" @on-change="message.birthday=$event"></DatePicker>
                                   <!-- <el-date-picker class="input-class"  type="date"  v-model="message.birthday" placeholder="选择时间" value-format="yyyy-MM-dd"   style="width: 96%;"></el-date-picker>-->
                            </FormItem>
                        </i-col>
                        <i-col span="12">
                            <FormItem label="入职时间">
                                <DatePicker type="date" placeholder="选择日期" v-model="message.entryTime"  format="yyyy-MM-dd" @on-change="message.entryTime=$event"></DatePicker>
                               <!-- <el-date-picker  class="input-class"  type="date"  v-model="message.entryTime" placeholder="选择时间" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>-->
                            </FormItem>
                        </i-col>
                    </Row>
                </FormItem>

                <FormItem>
                    <Row>
                        <i-col span="12">
                            <FormItem label="员工类型" style="padding-right:10px;">
                                <Input v-model="message.memberLabel" placeholder="请输入姓名"></Input>
                            </FormItem>
                        </i-col>
                        <!-- <i-col span="2" style="padding-top:35px;padding-left:10px;  cursor: pointer;">

                               <Icon type="ios-add-circle-outline" @click="showInformationAdd=true;addTitle='添加员工类型'" />
                       </i-col> -->
                        <i-col span="12">
                            <FormItem label="职位">
                                <Input v-model="message.job" placeholder="请输入姓名"></Input>
                            </FormItem>
                        </i-col>
                        <!-- <i-col span="2" style="padding-top:35px;padding-left:10px;  cursor: pointer;">
                                  <Icon type="ios-add-circle-outline" @click="showInformationAdd=true;addTitle='添加职位'" />
                        </i-col> -->
                    </Row>
                </FormItem>
                <FormItem label="部门">

                <Select v-model="message.deptId" placeholder="请选择">
                    <Option v-for="item in message.deptNameList" :value="item.partmentId" :key="item.partmentId">{{item.partmentName }}</Option>
                </Select>

                </FormItem>
                <FormItem label="联系电话">
                    <Input v-model="message.phone" placeholder="请输入联系电话"></Input>
                </FormItem>

                <FormItem label="工作地点">
                    <Input v-model="message.address" placeholder="请输入工作地点"></Input>
                </FormItem>
                <FormItem>
                    <Button style="width:570px;" type="primary" @click="changeUserInfo()">保存</Button>
                </FormItem>
            </Form>

        </Modal>

        <Modal v-model="showInformationAdd" :title="addTitle" :width="300" :footer-hide="true">
            <Input v-model="message.userName" placeholder="请输入姓名"></Input>
            <Button style="width:270px;margin-top:10px" type="primary" @click="handleSubmit()">保存</Button>

        </Modal>
        <!-- 添加项目经历-->
          <Modal v-model="showExperience" title="添加项目经历" :width="600" :footer-hide="true">
                    <ul  class="addExperience" >
                      <li v-for='item in experienceList' :key='item.projectId'>
                        <div class="dynamicI">
                          <img src="./../../assets/images/download.jpg" width="100" />
                        </div>
                        <div class="dynamic-Contant">
                              <h4>{{item.projectName}}</h4>
                              <ul class="dynamic-task">
                                <li>
                                  <i></i>
                                  <span>{{item.projectDes}} </span>
                                </li>
                              </ul>                 
                        </div>
                        <div>
                          <Button   v-if='item.isAdd' @click="putDelExperience(item.memberId,item.projectId)" >取消</Button>
                            <Button v-else type="primary" @click="putAddExperience(item.memberId,item.projectId)" >添加</Button> 
                            
                        </div>
                        
                      </li>
                      
                    </ul>
        </Modal>
        <!--  -->

        <Modal v-model="showTask" title="选择交接任务" :width="800" :footer-hide="true">

                    <div class="recycle-move">
                            <ul class="recycle-left" >
                              <li  v-for='item in projectList'  @click="initTask(item.projectId)" :key='item.projectId'><Icon type="md-checkbox-outline" />{{item.projectName}}</li>
                            </ul>
                            <div class="recycle-right" >
                              <div  class="has-con"  v-if='projectInfoList'>
                               
                                <div class="recycle-list" :class="{active:ItemtaskBG==index}" v-for='(item,index) in projectInfoList'   :key='item.taskId' @click="Itemtask(item.taskId,index)" >
                                  <div class="name"><span>{{item.taskName}}</span></div>
                                  <p class="time" v-if="item.endTime">{{ $moment(item.endTime).format("YYYY-MM-DD HH:mm") }}</p>
                                </div>
                              </div>
                              <div v-else>
                                    目前还没有任务
                              </div>
                              
                            </div>
                   </div>
                   <div class="recycle-move-right">
                          <Button  type="primary" @click="getset()">指派给</Button>
                   </div>
                   
        </Modal>


         <Modal v-model="showset" title="指派给" :width="300" :footer-hide="true">

              <div class="set-box">
                <ul>
                  <li v-for="(item,index) in setList"  :class="{active:setexecutorBG==index}"   :key='item.taskId' @click="itemexecutor(item.executor,index)"> 
                     <Avatar :src="item.executorImg" class="avatar"/>
                    <span>
                      {{item.executorName}}
                    </span>
                    </li>
                </ul>
                <div class="setButton" >
                       <Button  type="primary" @click="setSureExecutor"> 确定 </Button>
                </div>
                

              </div>

                   
        </Modal>
        
    </div>
</template>
<script>
    import {mapState, mapActions} from "vuex";
    import {
        getUsers,
        getOrgIdUsers,
        getAssignUsers,
        addUser,
        addProjectUser,
        removeUser,
        changeUser,
        getOrg
    } from "../../axios/api2.js";
    import {updateUserRole,dynamictime,dynamiclist,taskList,schedulesList,IsexperienceList,experienceList,addExperience,delExperience,userProjectTasks,userTasksInit,setList,sureExecutor} from "../../axios/api.js";

    export default {
        name: "",
        props: ['user'],
        components: {},
        data() {
            return {
                memberId:'',
                orgId:localStorage.companyId,
                projectId :this.$route.params.id,
                showInformation: false,//修改信息
                showInformationAdd: false,
                addTitle: '',
                message: {
                    stayComDate:'',
                    userId: localStorage.userId,
                    userName: '',
                    memberEmail: '',
                    birthday: '',
                    entryTime: '',
                    memberLabel: '',
                    job: '',
                    phone: '',
                    address: '',
                    email: '',
                    deptId: '',
                    deptName:'',
                    deptNameList: [],


                },
                 // 最新动态
                timeModel:'',
                timeList:[],
                dynamicList:[],
                
                // 任务安排
                showTask:false,
                showset:false,//指派给
                taskList:[],
                classify:'全部',
                classifyList:[
                      {name:"未完成的任务"},
                      {name:"今天"},
                      {name:"最近一周"},
                      {name:"最近一个月"},
                      {name:"全部"},
                ],
                projectList:[],
                projectInfoList:[],
                setList:[],
                setexecutor:'',//指派人
                setexecutorBG:null,//指派人
                setItemtask:'',//当前指派任务
                ItemtaskBG:null,
                setitemproject:'',

                // 日程
                schedulesList:[
                  
                ],
                // 项目
                isExperienceList:[],//列表
                experienceList:[],
                showExperience:false,
                };
        },

        computed: {},
        mounted() {
            getOrg(localStorage.companyId).then(res => {
                this.message.deptNameList = res.data
                console.log(res.data)
                console.log(this.message.deptNameList)
            });
        },
        filters: {
            dataFormat(msg) {
                if (msg) {
                    return new Date(msg).Format("yyyy-MM-dd")
                } else {
                    return "-"
                }
            }
        },
        methods: {
            // tab切换
            clickTabs(value) {
              console.log(value);
              if (value === "最近动态") {
                this.getDynamicList();
              } else if (value === "任务安排") {
                 this.getTaskList();
              } else if (value === "日程安排") {
                 this.getschedulesList();
              }else if (value === "项目经历") {
                 this.getexperienceList();
              }
            },
            // 项目列表
            getexperienceList(){
                  IsexperienceList(this.user.memberId,this.orgId).then(res => {
                      this.isExperienceList=res.data
                      console.log(this.experienceList)
                  });
            },
            // 编辑项目列表
            showexperienceList(){
                  this.showExperience = true
                  experienceList(this.user.memberId,this.orgId).then(res => {
                      this.experienceList=res.data
                      console.log(this.experienceList)
                  });
            },
            // 删除项目经历
             putDelExperience(memberId,projectId){
                delExperience(memberId,projectId).then(res => {
                      this.showExperience = false;
                      this.getexperienceList();
                       this.$Message.success("删除项目经历");
                    
                });
            },
            // 添加项目经历
            putAddExperience(memberId,projectId){
                addExperience(memberId,projectId,this.orgId).then(res => {
                      this.showExperience = false;
                      this.getexperienceList();
                      this.$Message.success("添加项目经历");
                });
            },
            //  日程列表
            getschedulesList(){
              schedulesList(this.projectId,this.user.memberId,).then(res => {
                   this.schedulesList=res.data;
                   console.log(this.schedulesList)
                });

            },
            // 任务安排
            getTaskList(){
                 taskList(this.user.memberId,this.projectId,this.classify).then(res => {
                   this.taskList=res.data
                });
                
            },
            // 当前指派对像
            Itemtask(taskId,index){
                    this.ItemtaskBG = index
                   this.setItemtask=taskId
            },
            itemexecutor(executor,index){
                    this.setexecutorBG=index
                    this.setexecutor=executor
            },
             // 确定指派送
            setSureExecutor(){
               
               if(!this.setItemtask){
                   this.$Message.error("请选择任务");
                   return
               }
                sureExecutor(this.setItemtask,this.setexecutor).then(res => {
                          this.showset=false;
                          this.initTask(this.setitemproject);                        
                          if(res.result==1){
                              this.$Message.success("指派成功");
                          }
                });
            },
            //获取项目
            getTask(){
                this.showTask=true;
                userProjectTasks(this.orgId,this.user.memberId).then(res => {
                      this.projectList=res.data
                      this.initTask(this.projectList[0].projectId)
                      
                });

            },
            //获取当前任务
            initTask(projectId){

                 this.setitemproject=projectId
                 userTasksInit(this.user.memberId,this.setitemproject).then(res => {
                     this.projectInfoList=res.data
                    console.log(this.projectInfoList)
                });


            },
            // 获取指派人员
            getset(){              
                    this.showset=true;
                    setList(this.projectId).then(res => {
                      this.setList=res.data
                });

            },
           
            //最新动态获取日期
            getDynamictime(){
              dynamictime().then(res => {
                  if(res.data){
                     this.timeModel=res.data[0].yearOfMonth
                     this.timeList=res.data;
                  
                  }
                });
            },
            //最新动态列表
            getDynamicList(){
              console.log(this.user.memberId),
              console.log(this.orgId)
              if(this.timeModel){
                var findVal = this.timeList.find(item => {
                    return item.yearOfMonth === this.timeModel;
                })
              }
              dynamiclist(this.user.memberId,this.orgId,findVal.timeStamp).then(res => {
                    if(res.data){
                        this.dynamicList=res.data;
                    }else{
                      this.dynamicList=[];
                    }
                });
            },
            // 详细资料-修改
            changeUserInfo() {
                this.message.memberId = this.user.memberId;
                this.message.orgId = this.user.organizationId;
                
                if(this.message.deptId){
                         var deptName = this.message.deptNameList.find(item => {
                            return item.partmentId === this.message.deptId;
                        })
                        this.message.deptName = deptName.partmentName;
                }
                changeUser(this.message).then(res => {
                     if (res.data  != null){
                         
                         console.log(res.data)
                        this.$emit("close",res.data); 
                       
                        //  this.siLing1 =false;
                        //  this.siLing2 = true;
                        //  this.message=res.data
                    }
                    this.showInformation = false;
                });
            }
        },
        created: function () {
            
            this.getDynamictime();
        }

    };
</script>
<style scoped lang="less">
        .input-class{
                .el-input__inner{
                    height: 33px;
                }
        }
        /deep/.ivu-date-picker{
            width: 275px;
          }
        .recycle-move {
            /deep/ .ivu-modal-body {
               padding: 0 !important;
            }
                width: 100%;
                height: 100%;
                display: flex;
            .recycle-left {
                  width: 300px;
                  height: 300px;
                  border-right: 1px solid #e5e5e5;
                    .checked {
                          background-color: #f7f7f7;
                          color: #3da8f5;
                    }
              li {
                  width: 100%;
                  height: 44px;
                  display: flex;
                  overflow: hidden;
                  align-items: center;
                  padding: 0 16px;
                  cursor: pointer;
                  color: gray;
                  font-size: 14px;
                  &:hover {
                  background-color: #f7f7f7;
                  color: #3da8f5;
              }
              i {
              font-size: 20px;
              margin-right: 8px;
              }
            }
            }
            .recycle-right {
                width: 620px;
                height: 300px;
                overflow-x: hidden;
                overflow-y: auto;
                .has-con{
                  cursor: pointer;
                }
                .active{
                    background-color: #f7f7f7;
                }
                &::-webkit-scrollbar {
                    width: 6px;
                    height: 8px;
                    background-color: #e5e5e5;
                }
                &::-webkit-scrollbar-thumb {
                  background-color: #cecece;
                }
            }
        }
        .recycle-move-right{
          margin-top: 10px;
            display: flex;
             justify-content: flex-end;
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
            position: relative;
            .add-talk{
              cursor: pointer;
              position: absolute;
              top: 28px;
              right: 20px;
              color: #3da8f5;
              i{
                margin-top:-5px;
              }
            }
            .title{
              display: flex;
              justify-content: space-between;
              background: #f5f5f5;
              line-height: 30px;
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
            // 详细资料
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

            .box-no{
                  width:100px;
                  height:100px;
                  margin:150px auto;
            }
            // 最近动态
            .dynamic-time{
              padding-top: 10px;
              .avatar{
                width: 10px;
                height: 10px;
                background: #3da8f5;
              }
            }
            .dynamic{
              border: 1px solid #e5e5e5;
              border-radius: 5px;
              margin-top:10px;
              li{
                cursor: pointer;
                height: 70px;
                border-bottom: 1px solid #e5e5e5;
                display: flex;
                padding:10px;
                .dynamicI{
                  height: 20px;
                  width: 20px;
                  border: 2px solid #a6a6a6;
                  border-radius: 3px;
                  margin-right: 10px;
                }
                .dynamic-Contant{
                  display: flex;
                  flex: 1;
                  flex-flow: column;
                  
                  .dynamic-task{
                    display: flex;
                    flex-flow: row;
                    li{
                      margin:5px 10px 0px 0px ;
                      padding:0;
                      border: none;
                      color: #a6a6a6;
                    }

                  }
                }
                .avatar{
                  width: 24px;
                  height: 24px;
                }

              };
              li:last-child{
                border:none
              }
              

            };
            .task{
              margin-top:8px;
              li{
                cursor: pointer;
                height: 50px;
                display: flex;
                padding:10px;
                .dynamicI{
                  height: 20px;
                  width: 20px;
                  border: 2px solid #a6a6a6;
                  border-radius: 3px;
                  margin-right: 10px;
                }
                .dynamic-Contant{
                  display: flex;
                  flex: 1;
                  flex-flow: row;
                  .dynamic-task{
                    display: flex;
                    flex-flow: row;
                    li{
                      margin:5px 10px 0px 0px ;
                      padding:0;
                      border: none;
                      color: #a6a6a6;
                    }

                  }
                }
                .avatar{
                  width: 24px;
                  height: 24px;
                }

              };
              li:last-child{
                border:none
              }
            };
            .schedulesTime{
              height: 50px;
              line-height: 50px;
              text-indent: 10px;
              border-bottom: 1px solid #e5e5e5;
              font-weight: bold;
            };
          
            .schedules{
              margin-top:8px;
              li{
                cursor: pointer;
                height: 50px;
                
                padding:10px;
                display: flex;
                .time{
                  width: 190px;
                }
                
                

              };
              li:last-child{
                border:none
              }
            };

            .experience{
              border: 1px solid #e5e5e5;
              border-radius: 5px;
              margin-top:10px;
              li{
                cursor: pointer;
                height: 70px;
                border-bottom: 1px solid #e5e5e5;
                display: flex;
                padding:10px;
                .dynamicI{
                  height: 40px;
                  width: 45px;
                  margin-right: 10px;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                }
                .dynamic-Contant{
                  display: flex;
                  flex: 1;
                  flex-flow: column;
                  
                  .dynamic-task{
                    display: flex;
                    flex-flow: row;
                    li{
                      margin:5px 10px 0px 0px ;
                      padding:0;
                      border: none;
                      color: #a6a6a6;
                    }

                  }
                }
                .avatar{
                  width: 24px;
                  height: 24px;
                }

              };
              li:last-child{
                border:none
              }
              

            };

            


            


      }      
    }
     .addExperience{
              li{
                cursor: pointer;
                height: 60px;
               
                display: flex;
                padding:10px;
                .dynamicI{
                  height: 40px;
                  width: 45px;
                  margin-right: 10px;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                }
                .dynamic-Contant{
                  display: flex;
                  flex: 1;
                  flex-flow: column;
                  
                  .dynamic-task{
                    display: flex;
                    flex-flow: row;
                    li{
                      margin:5px 10px 0px 0px ;
                      padding:0;
                      border: none;
                      color: #a6a6a6;
                    }

                  }
                }
                .avatar{
                  width: 24px;
                  height: 24px;
                }

              };
              li:last-child{
                border:none
              }
              

      };
      .set-box{
        li{
          cursor: pointer;
          margin-bottom:10px;
        }
        .active{
                    background-color: #f7f7f7;
                }
        .setButton{
            margin-top: 10px;
            button{
              width: 100%;
            }
      }
      }
      


      

</style>
