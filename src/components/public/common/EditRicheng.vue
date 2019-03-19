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
            <Icon type="thumbsup"
                  size="20"></Icon>
            <span class="zanNum"
                  v-if="zan">1</span>
          </span>
        </Tooltip>

        <span class="down">
          <SingleRiChengMenu :data=data></SingleRiChengMenu>
        </span>
      </div>
    </div>
    <div class="Conbox">
      <div class="task_info clearfix">
      
        <div class="content">
             <div id="editCon"
               contenteditable="true"
               style="width:100%;">
            爱啦啦啦阿拉啦
          </div>
        </div>
         
      </div>
      <div class="task_attr clearfix">

        <div class="timer fl">
          <div class="starttime fl">
            <p class="timeTitle">开始时间</p>
            <div>
               <DateTimePicker type="start" :max="data.endDate" @confirm="confirm1">
                <div class="init" v-if="!data.startDate">设置开始时间</div>
                <div class="setTime" v-if="data.startDate">
                  {{$moment(data.startDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
                </div>
             </DateTimePicker>
            </div>
          </div>
         
         <div class="endtime fl">
           <p class="timeTitle">结束时间</p>
           <div>
               <DateTimePicker type="end" :min="data.startDate" @confirm="confirm2">
                <div class="init" v-if="!data.endDate">设置截止时间</div>
                <div class="setTime" v-if="data.endDate">
                  {{$moment(data.endDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
                </div>
              </DateTimePicker>
           </div>
         </div>
        <div class="wholeDay fl">
          <p class="timeTitle">全天</p>
          <div class="checkWholeday">
             <Checkbox v-model="wholeday"
                  class="checkbox"
                  size="large"></Checkbox>
          </div>
        </div>
      </div>

      <div class="repeatBox clearfix">
        <div class="repeat fl">
          <SetRepeat></SetRepeat>
        </div>
         <div class="alarm fl">
             <SetRCWarn></SetRCWarn>
             
        </div>
      </div>
       
       
        <!-- <p>{{$moment('2018-09-04 12:19:20').format("YYYY-MM-DD HH:mm:ss")}}</p> -->
        <!-- <p>{{$moment('2018-09-04 12:19:20').calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: '[下]dddLT', lastDay: '[昨天]', lastWeek: '[上]dddLT', sameElse: 'L'})}}</p> -->
        <!-- <p>{{$moment('2018-11-04 12:19:20').calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: '[下]ddd', lastDay: '[昨天]', lastWeek: '[上]ddd', sameElse: 'M月D日'})}}</p> -->
      </div>
      <!-- 地点 -->
      <div class="remark clearfix">
        <span class="name">
          <Icon type="ios-location-outline"></Icon>地点</span>
        <div class="address fl">
           <div v-if="editAddress">
              <Input v-model.trim="address" placeholder="" autofocus/>
              <Button  @click="editAddress=false;" style="margin:10px 5px 0 350px;">取消</Button>
              <Button type="primary" @click="saveAddress" style="margin-top:10px;">确定</Button>
            </div>

          <Tooltip v-else content="点击即可编辑" placement="top" style="width:100%;">
            <div class="noLocation" @click="editAddress=true;address=addressValue;">{{addressValue!=''?addressValue:'待添加'}}</div>
        </Tooltip>
        </div>
       
      </div>

      <div class="remark">
        <span class="name">
          <Icon type="document"></Icon>备注</span>
        <div class="editor"
             @click="showEditor=true"
             v-if="!showEditor"
             v-html="editorValue!=''?editorValue:'待添加'">
        </div>
        <Simditor v-if="showEditor"
                  :value="editorValue"
                  @save="editorSave"
                  @cancel="showEditor = false"
                  class="fl editBox"></Simditor>
      </div>
     
      <div class="tags clearfix">
        <span class="name">
          <Icon type="ios-pricetags-outline"></Icon>标签</span>
        <!-- 取到data.tag了再添加孙子辈组件 -->
        <Tags :taglist="data.tag"
              v-if="data.tag"></Tags>
      </div>
     

  <!-- 添加关联 -->
  <div class="relevance">
    <p class="name" style="float: none;"><Icon type="link"></Icon>关联内容</p>
    <div class="addLink" @click="relationModal=true;"><Icon type="plus-circled"></Icon>添加关联</div>
    <Modal v-model="relationModal" class="relationModal" id="relationModal">
        <AddRelation></AddRelation>
    </Modal>

  </div>
 
  <!-- 设置参与者 -->
  <div class="participator">
     <h5>
        参与者 · {{involveDataList.length}}
        <Tooltip content="参与者将会收到评论和任务更新通知"
                 placement="right"
                 transfer>
          <Icon type="ios-help"></Icon>
        </Tooltip>
      </h5>
    <div class="involve-list clearfix">
        <div class="member-avatar fl"
             v-for="(item,index) in involveDataList"
             :key="index">
          <Tooltip :content="item.name"
                   placement="top"
                   transfer>
            <div class="ava">
              <!-- 删除需要加在关闭按钮上 -->
              <img v-if="item.avatar"
                   :src="item.avatar"
                   alt="">
              <svg-icon v-else
                        style="width:24px;height:24px;display:block;"
                        name="allMember"></svg-icon>
             <span class="close" @click="deleteInvolve(item.id)">×</span>
            </div>
          </Tooltip>

        </div>
        <div class="addButton fl">
          <InvolveMember ref="involveMember"
                         :checkedList="data.involveList"
                         v-if="data.involveList"
                         @save="saveInvolveMember"></InvolveMember>
        </div>
      </div>

  </div>
</div>
    <footer>
      <div class="talk">
        <div class="talkinner">
          <div class="talkUp"
               contenteditable="true">
            <Input id="input"
                   v-model.trim="talkvalue"
                   ref="textarea"
                   placeholder="按Enter快速发布" />
          </div>
          <div class="talkDown clearfix">
            <!-- 表情包组件 -->
            <Emoji @choose="chooseEmoji"
                   ref="emoji"></Emoji>

            <div class="send fr">
              <Button type="primary">发布</Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import SetRepeat from '@/components/project/pages/index/components/SetRepeat'
import SetRCWarn from '@/components/project/pages/index/components/SetRiChengWarn'
import AddRelation from '@/components/public/common/AddRelation'
import Tags from '@/components/public/common/Tags'
import insertText from '@/utils/insertText'
import Emoji from '@/components/public/common/emoji/Emoji'
import SingleRiChengMenu from './SingleRiChengMenu'
import SetExecutor from '@/components/project/pages/index/components/SetExecutor'
export default {
  props: ['data'],
  components: {
    SetRepeat,
    SetRCWarn,
    Tags,
    Emoji,
    SingleRiChengMenu,
    SetExecutor,
    AddRelation
  },
  data () {
    return {
      wholeday:false,
      zan: false,
      address:'',
      addressValue:'石景山',
      editAddress:false,
      editorValue: '123',
      showEditor: false,
      relationModal:false,
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
  methods: {
    saveAddress () {
      if( this.address){
      this.addressValue = this.address;

      }
      this.editAddress= false;
    },
    confirm1 (date) {
      this.data.startDate = date
    },
     confirm2 (date) {
      this.data.endDate = date
    },
    deleteStart (){
      this.data.startDate = ''
    },
     deleteEnd (){
      this.data.endDate = ''
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
     saveInvolveMember (ids, list) {
      this.data.involveList = ids
      this.involveDataList = list
    },
     deleteInvolve (id) {
      if(id==3) return//需获取当前登录用户id判断
      let index = this.data.involveList.indexOf(id)
      this.data.involveList.splice(index, 1)
      this.involveDataList.splice(index, 1)
    },
    editorSave (val) {
      this.editorValue = val
      this.showEditor = false

    },
    showwaitAdd () {
      this.showEditor = true
    },
    chooseEmoji (name) {
      insertText(this.$refs.textarea.$el.children[1], name)
    }
   
  },
  mounted () {
    document.getElementById("editCon").parentNode.style.width = '100%';
  }
}
</script>
<style scoped lang="less">
@import './EditRicheng.less';
</style>

