<template>
  <div>
    <div class="list" ref="addIcon">
      <span  @click="open" v-if='task.planWorkHours||task.totalWorkHours'>计划工时{{task.planWorkHours}}小时，实际已用工时{{task.totalWorkHours}}小时</span>
      <Button v-else icon="ios-add" type="dashed" size="small" @click="open">待添加</Button>
    </div>
    <Modal v-model="showTag" :footer-hide="true" :width="300" @on-cancel="cancel">
      <p slot="header" class="workheader">
        <span>
          计划工时
        </span>
        <span>
          <Input  @on-change="change" v-model="planHour" />
        </span>
        <Button  type="primary"   @click="setPlanHour">确定</Button>
      </p>
      <div class="content">
        <div class="work-box">
          
          <div class="top">
              <span>
                实际工时
              </span>
              <span>
                {{task.totalWorkHours}}
              </span>
          </div>
          <div class="middle">
                  <i-input v-model="hour">
                    <span slot="prepend">今天</span>
                    <span @click="setHour" slot="append">确定</span>
               </i-input>
 
          </div>

           <div class="bottom">
                 <ul>
                   <li v-for="(item, index) in hourList" :key="index" >
                        <div class="name">
                          
                            <Icon type="ios-contacts"  @click="delTimeList(item.id)"/>
                            <div>
                                <span>{{item.createName}}</span><br/>
                                <!-- <span>{{item.hours}}</span> -->
                            </div>                         
                        </div>
                        <span class="time">
                        {{item.hours}}
                        </span>
                   </li>
                    
                   
                 </ul>
 
          </div>

          

        </div>

      </div>
     
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { allTags, addnewTag, addTagAndBind, modifyTag, searchTags, delTag, removeInfoTag, bindingTag,workHour ,additionHour,getTaskWorkingHours,removeTaskWorkingHours} from "../../axios/api";
export default {
  props: ["task",],
  data() {
    return {
      hourList:[{name:'1',id:'1'},{name:'2',id:'2'}],
      hour:'',//实际工时
      planHour: "",//计划工时
      showSearch: false,
      showTag: false,
      searchTag: "",
      showdiv1: true,
      showdiv2: false,
      showdiv3: false,
      tagName: "",
      Popvisible: false,
      totalTag: [],
      isEdit: true,
      colorList: ["#3da8f5", "#75c940", "#2fbdb3", "#797ec9", "#ffaf38", "#ff4f3e"],
      checkedColor: "#3da8f5",
      tagAdd: false,
      loading: false,
      offsetLeft: 0,
      offsetTop: 0,
      tag: null, //编辑标签时使用
      tagTilte: "标签",
      btnName: "创建标签"
    };
  },
  mounted() {
    
            
        },
  methods: {
    
    open() {
      //打开弹框
      this.showTag = true;
     
      this.getTimeLise()
    },
    cancel() {
      //关闭弹框
      this.showSearch = false;
      this.hour = "";
      this.planHour = "";
     
    },
    change(){

    },
    //修改计划工时
    setPlanHour(){
      console.log(this.planHour)
      const data={
              taskId:this.task.taskId,
              workingHours:this.planHour
        }
        workHour(data).then(res => {});
    },
    //修改实际工时
    setHour(){
      console.log(this.hour)
            const data={
              taskId:this.task.taskId,
              hours:this.hour
        }
        additionHour(data).then(res => {
          this.getTimeLise()
        });

    },
    //获取工时列表
    getTimeLise(){
      const data={
              taskId:this.task.taskId
             
        }

      getTaskWorkingHours(data).then(res => {

          this.hourList=res.data
      });
    },
    delTimeList(id){

       const data={
              id:id
             
        }

      removeTaskWorkingHours(data).then(res => {
           this.getTimeLise()
      });
    }
    
    
  
  },

};
</script>
<style scoped lang="less">

.workheader{
  height: 35px;
  line-height: 30px;
  display: flex;
  span:nth-child(2){
    margin:0px 10px;
  }
  button{
    margin-right: 30px;
  }
}
.work-box{
  
  .top{
    padding:0 10px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .middle{
    padding:0 10px;
  }
  .bottom{
    ul {
      margin-top:10px;
     
        li{
          .name{
            display: flex;
            i{
              padding-top:13px;
              padding-right: 5px;
            }
          }
          .time{
            padding-right: 10px;
          }
            padding: 5px 0px;
            display: flex;
            justify-content: space-between;
            height: 50px;
          }
        li:hover{
          background: #f7f7f7;
         }
      }
      
  }
}

</style>
