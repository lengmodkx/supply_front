<template>
  <div class="task-detail"
       style="height:100%;">
    <div class="headerTool">
      <div class="toolLeft">
        <span class="proname">项目名称</span>
      </div>
      <div class="toolRight">
        <Tooltip content="点个赞"
                 placement="bottom-start">
          <span class="zan"
                :class="{zan_blue:zan}"
                @click="dianZan">
            <Icon type="md-thumbs-up"
                  size="20"></Icon>
            <span class="zanNum"
                  v-if="zan">1</span>
          </span>
        </Tooltip>

        <span class="down">
          <SingleRiChengMenu :data=schedule :name="publicType"></SingleRiChengMenu>
        </span>
      </div>
    </div>
    <div class="Conbox">
      <div class="task_info clearfix">
      
        <div class="content">
             <input id="editCon"
               type="text"
               @blur="upRCname"
               v-model="schedule.scheduleName"/>
        </div>
         
      </div>
      <div class="task_attr clearfix">

        <div class="timer fl">
          <div class="starttime fl">
            <p class="timeTitle">开始时间</p>
            <div>
               <DateTimePicker type="start" :max="schedule.endTime" @confirm="confirm1">
                <div class="init" v-if="!schedule.startTime">设置开始时间</div>
                <div class="setTime" v-if="schedule.startTime">
                  {{$moment(schedule.startTime).calendar(null,{sameDay: '[今天]', nextDay: '[明天]', nextWeek: 'ddd', lastDay: '[昨天]', lastWeek: '[上]ddd', sameElse: 'M月D日'})}}
                </div>
             </DateTimePicker>
            </div>
          </div>
         
         <div class="endtime fl">
           <p class="timeTitle">结束时间</p>
           <div>
               <DateTimePicker type="end" :min="schedule.startTime" @confirm="confirm2">
                <div class="init" v-if="!schedule.endTime">设置截止时间</div>
                <div class="setTime" v-if="schedule.endTime">
                  {{$moment(schedule.endTime).calendar(null,{sameDay: '[今天]', nextDay: '[明天]', nextWeek: 'ddd', lastDay: '[昨天]', lastWeek: '[上]ddd', sameElse: 'M月D日'})}}
                </div>
              </DateTimePicker>
           </div>
         </div>
        <div class="wholeDay fl">
          <p class="timeTitle">全天</p>
          <div class="checkWholeday">
             <Checkbox v-model="wholeday"
                  class="checkbox"
                  size="large"
                  @on-change="allDay"
             ></Checkbox>
          </div>
        </div>
      </div>

      <div class="repeatBox clearfix">
        <div class="repeat fl">
          <SetRepeat :repeat="schedule.repeat" @changeRepeat="changeRepeat"></SetRepeat>
        </div>
         <div class="alarm fl">
             <SetRCWarn @changeRemind="changeRemind" :remind="schedule.remind"></SetRCWarn>
             
        </div>
      </div>
       
       
      </div>
      <!-- 地点 -->
      <div class="remark clearfix">
        <span class="name">
          <Icon type="ios-pin-outline"></Icon>地点</span>
        <div class="address fl">
           <div v-if="editAddress">
              <Input v-model.trim="schedule.address" placeholder="" autofocus/>
               <Alert show-icon v-show="!schedule.address" show-icon style="margin-top: 5px">请添加地点</Alert>
              <div class="btn-box">
                  <Button type="primary" @click="saveAddress" style="margin-top:10px;">确定</Button>
                  <Button  @click="editAddress=false;" style="margin:10px 5px 0 20px;">取消</Button>
              </div>
            </div>

          <Tooltip v-else content="点击即可编辑" placement="top" style="width:100%;">
            <div class="noLocation" @click="editAddress=true;address=addressValue;">{{schedule.address?schedule.address:'待添加'}}</div>
        </Tooltip>
        </div>
       
      </div>

      <div class="remark" style="display: flex">
        <span class="name" style="flex: none;">
          <Icon type="ios-copy-outline" />备注</span>
        <div class="editor"
             @click="showEditor=true"
             v-if="!showEditor"
             v-html="schedule.remarks?schedule.remarks:'待添加'">
        </div>
          <div v-if="showEditor" class="editor-wrap">
              <editor ref="editor" :content="schedule.remarks" class="editBox"></editor>
              <button type="button" class="fr ivu-btn ivu-btn-info ivu-btn-large" @click="addBeizhu" :loading="loading">
                  <span v-if="!loading">立即发布</span>
                  <span v-else>Loading...</span>
              </button>
          </div>

      </div>
     
      <div class="tags clearfix">
        <span class="name">
          <Icon type="ios-pricetags-outline"></Icon>标签</span>
        <!-- 取到data.tag了再添加孙子辈组件 -->
        <Tags class="fl" :taglist="schedule.tagList" :projectId="schedule.projectId" :publicType="publicType" :publicId="schedule.scheduleId"
              v-if="schedule.tagList"></Tags>
      </div>
     

  <!-- 添加关联 -->
  <div class="relevance">
    <p class="name" style="float: none;"><Icon type="ios-link-outline"></Icon>关联内容</p>
    <div class="addLink" @click="relationModal=true;"><Icon type="ios-add-circle-outline" />添加关联</div>
    <Modal v-model="relationModal" class="relationModal" id="relationModal" :footer-hide="true">
        <AddRelation></AddRelation>
    </Modal>

  </div>
 
  <!-- 设置参与者 -->
  <div class="participator">
     <h5>
        参与者 · {{schedule.joinInfo.length?schedule.joinInfo.length:0}}
        <Tooltip content="参与者将会收到评论和任务更新通知"
                 placement="right"
                 transfer>
          <Icon type="ios-help"></Icon>
        </Tooltip>
      </h5>
    <div class="involve-list clearfix">
        <div class="member-avatar fl"
             v-for="(item,index) in schedule.joinInfo"
             :key="index">
          <Tooltip :content="item.userName"
                   placement="top"
                   transfer>
            <div class="ava">
              <!-- 删除需要加在关闭按钮上 -->
              <img v-if="item.image"
                   :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.image"
                   alt="">
              <svg-icon v-else
                        style="width:24px;height:24px;display:block;"
                        name="allMember"></svg-icon>
             <span class="close" @click="deleteInvolve(item.userId)">×</span>
            </div>
          </Tooltip>

        </div>
        <div class="addButton fl">
          <InvolveMember ref="involveMember"
                         :checkedList="schedule.memberIds?schedule.memberIds:[]"
                         :projectId="schedule.projectId"
                         @save="saveInvolveMember"></InvolveMember>
        </div>
      </div>
      <log :logs="schedule.logs"></log>
  </div>

</div>
    <footer>
        <publick :publicId="schedule.scheduleId" :projectId="schedule.projectId" :publicType="schedule"></publick>
    </footer>
  </div>
</template>
<script>
import SetRepeat from '@/components/project/pages/index/components/SetRepeat'
import SetRCWarn from '@/components/project/pages/index/components/SetRiChengWarn'
import AddRelation from '@/components/public/common/AddRelation'
import Tags from '@/components/project/share/Tags'
import Emoji from '@/components/public/common/emoji/Emoji'
import SingleRiChengMenu from './SingleRiChengMenu'
import SetExecutor from '@/components/project/pages/index/components/SetExecutor'
import editor from '@/components/resource/Simditor'
import log from '@/components/public/log'
import publick from '@/components/public/Publish'
import {mapState,mapMutations,mapActions} from 'vuex'
import {sendMsg} from '@/axios/api'
import {upRichengName, beginDate, endDate,changeRepeat,changeRemind,changeAddress,changeRemarks,playPeople} from '@/axios/scheduleApi'

export default {
  components: {
    SetRepeat,
      log,
    SetRCWarn,
    Tags,
    Emoji,
    SingleRiChengMenu,
    editor,
    SetExecutor,
    AddRelation,
      publick
  },
  data () {
    return {
      wholeday:false,
      zan: false,
      loading:false,
      address:'',
      involveList: [],
      addressValue:'石景山',
      editAddress:false,
      editorValue: '123',
      showEditor: false,
      publicType: '日程',
      relationModal:false,
      beizhuContent:'',
      talkvalue: '',
      isEdit:true,
      newCon:'',
      ept:'',
      involveDataList: [{
        id: 3,
        name: "罗茜",
        avatar: 'https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200',

      }]

    }
  },
    computed: {
        ...mapState('schedule',['schedule']),
    },

  methods: {
      ...mapMutations('schedule',['updateScheduleName','startDate', 'endDate','allDay','repeat','vxaddress','vxremarks','changePeople']),
      // ...mapActions('schedule',['startDate', 'endDate']),
      // 设置日程名字
    upRCname () {
        upRichengName(this.schedule.scheduleId, this.schedule.scheduleName).then(res =>{
             if (res.result ==1){
                 this.updateScheduleName(this.schedule)
             }
         })
    },
      // 点击全选
    allDay () {
          if (this.wholeday) {
              console.log(this.schedule.startTime)
              endDate(this.schedule.scheduleId,this.schedule.startTime).then(res => {
                  if (res.result==1){
                      this.endDate(this.schedule.startTime)
                  }
              })
          }
    },
      // 改变重复规则
    changeRepeat(data){
        changeRepeat(this.schedule.scheduleId, data).then(res => {
           if (res.result==1){
               this.repeat(data)
           }
        })
    },
      // 改变提醒规则
    changeRemind (data) {
        changeRemind(this.schedule.scheduleId, data).then(res => {
            console.log(res,data)
            if (res.result==1){
                console.log(6668)
            }
        })
    },
      // 改变地点
    saveAddress () {
      if( this.schedule.address){
          changeAddress(this.schedule.scheduleId,this.schedule.address).then(res => {
              if (res.result==1){
                  this.editAddress= false;
                  this.vxaddress(this.schedule.address)
              }
          })
      }
    },
      // 开始时间
    confirm1 (date) {
        beginDate(this.schedule.scheduleId, new Date(date).getTime()).then(res => {
            if (res.result==1){
                this.startDate(new Date(date).getTime())
            }
        })
    },
      // 结束时间
     confirm2 (date) {
         endDate(this.schedule.scheduleId, new Date(date).getTime()).then(res => {
             if (res.result==1){
                 this.endDate(new Date(date).getTime())
             }
         })
    },
      // 改备注
    addBeizhu () {
        this.beizhuContent = this.$refs.editor.content;
        this.loading = true;
        changeRemarks(this.schedule.scheduleId,this.beizhuContent).then(res => {
            if (res.result){
                this.vxremarks(this.beizhuContent)
                this.loading = false
                this.showEditor=false
            }
        })
    },
      // 改变日程参与者
    saveInvolveMember (detailList,list) {
          playPeople(this.schedule.scheduleId, detailList).then(res => {
              if (res.result){
                  this.changePeople(list)
              }
          })
    },

    deleteStart (){
      this.schedule.startTime = ''
    },
     deleteEnd (){
      this.schedule.endTime = ''
    },
    dianZan () {
      this.zan = !this.zan
      if (this.zan) {
        //发请求点赞
      } else {
        //发请求取消点赞
      }
    },
    deleteExecutor () {

    },
      // 删除日程参与者
     deleteInvolve (id) {
      if(id==3) return//需获取当前登录用户id判断
         console.log(this.schedule.joinInfo)
         let newList=this.schedule.joinInfo
         newList.forEach((item,index) => {
            if (item.userId==id) {
                newList.splice(index,1)
            }
         })
         let idStr = newList.map(item => {
             return item.userId
         })

         playPeople(this.schedule.scheduleId,idStr.join(",")).then(res => {
             if (res.result){
                 console.log(newList,idStr)
                 this.changePeople(newList)
             }
         })

       // let index = this.schedule.involveList.indexOf(id)
      // this.schedule.involveList.splice(index, 1)
      // this.involveDataList.splice(index, 1)
    },
    editorSave (val) {
      this.editorValue = val
      this.showEditor = false

    },
    showwaitAdd () {
      this.showEditor = true
    },
   
  },
  mounted () {
      console.log(this.schedule)
    // document.getElementById("editCon").parentNode.style.width = '100%';
  }
}
</script>
<style scoped lang="less">
@import './EditRicheng.less';
    .btn-box{
        display: flex;
        flex-direction: row-reverse;
    }
</style>

