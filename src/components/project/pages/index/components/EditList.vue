<template>
  <div class="task-detail"
       style="height:100%;">
    <div class="headerTool">
      <div class="toolLeft">
        <span>项目名称</span>
        <span>·</span>
        <Dropdown trigger="click">
          <span class="proName">任务组名</span>
          <DropdownMenu slot="list">
            <DropdownItem>任务组1
              <svg-icon class="right"
                        name="right"></svg-icon>
            </DropdownItem>
            <DropdownItem>任务组2
              <svg-icon class="right"
                        name="right"></svg-icon>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <span>·</span>
        <Dropdown trigger="click">
          <span class="proName">任务名称</span>
          <DropdownMenu slot="list">
            <DropdownItem>任务1
              <svg-icon class="right"
                        name="right"></svg-icon>
            </DropdownItem>
            <DropdownItem>任务2
              <svg-icon class="right"
                        name="right"></svg-icon>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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
          <SingleTaskMenu :data=data></SingleTaskMenu>
        </span>
      </div>
    </div>
    <div class="Conbox">
      <div class="task_info done clearfix" :class="{done:data.taskStatus}">
        <Checkbox v-model="data.taskStatus"
                  class="checkbox"
                  size="large"></Checkbox>
        <Tooltip content="点击即可编辑"
                 placement="top"
                 class="content">
          <div id="editCon"
               contenteditable="true"
               style="width:100%;">
            {{data.taskName}}
          </div>
        </Tooltip>

      </div>
      <div class="task_attr clearfix">
        <div class="executor fl">
          <!-- 设置认领者 -->
      <SetExecutor ref="executor"
                   v-model="data.executor"
                   v-if="data.executor"
                   >
        <template slot-scope="scope">
          <div class="executor">
           <svg-icon name="people"
                      v-if="!scope.executor"></svg-icon>
            <span class="conText">
               <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${scope.executor?scope.executor.image:''}`"
                   alt="">
              {{scope.executor?scope.executor.userName:'待认领'}}
              </span>
            <Tooltip content="执行者是任务的负责人，每个任务对应唯一执行者"
                     placement="left"
                     transfer>
              <Icon type="ios-help"></Icon>
            </Tooltip>
            <span class="close" v-if="scope.executor" @click.stop="scope.close">&times;</span>
          </div>
        </template>
      </SetExecutor>
    </div>

        <div class="timer fl">
          <Icon type="ios-calendar-outline"
                size="18"
                style="margin-right:5px;"></Icon>
          <DateTimePicker type="start" :max="data.endDate" @confirm="confirm1">
            <div class="init" v-if="!data.startDate">设置开始时间</div>
            <div class="setTime" v-if="data.startDate">
              {{$moment(data.startDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
              <span @click.stop="deleteStart">&times;</span>
            </div>
          </DateTimePicker>


          <span>-</span>
           <DateTimePicker type="end" :min="data.startDate" @confirm="confirm2">
             <div class="init" v-if="!data.endDate">设置截止时间</div>
             <div class="setTime" v-if="data.endDate">
               {{$moment(data.endDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
               <!-- {{data.endDate}} -->
                <span @click.stop="deleteEnd">&times;</span>
             </div>
            </DateTimePicker>

        </div>

        <div class="repeat fl">
          <SetRepeat></SetRepeat>
        </div>

        <div class="alarm fl"
             @click="modal1=true">
          <Tooltip content="点击设置任务提醒"
                   placement="top">
            <Icon type="ios-alarm-outline"
                  size="20"></Icon>
          </Tooltip>
          <Modal id="warnModal"
                 v-model="modal1"
                 class="taskwarn"
                 >
            <TaskWarn @save="confirmWarnList"></TaskWarn>
          </Modal>

        </div>
        <!-- <p>{{$moment('2018-09-04 12:19:20').format("YYYY-MM-DD HH:mm:ss")}}</p> -->
        <!-- <p>{{$moment('2018-09-04 12:19:20').calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: '[下]dddLT', lastDay: '[昨天]', lastWeek: '[上]dddLT', sameElse: 'L'})}}</p> -->
        <!-- <p>{{$moment('2018-11-04 12:19:20').calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: '[下]ddd', lastDay: '[昨天]', lastWeek: '[上]ddd', sameElse: 'M月D日'})}}</p> -->
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
      <div class="priority clearfix">
        <span class="name">
          <Icon type="ios-circle-outline"></Icon>优先级</span>
        <div class="urgentButton">
          <UrgentDropdown></UrgentDropdown>
        </div>
      </div>
      <div class="tags clearfix">
        <span class="name">
          <Icon type="ios-pricetags-outline"></Icon>标签</span>
        <!-- 取到data.tag了再添加孙子辈组件 -->
        <Tags :taglist="data.tag"
              v-if="data.tag"></Tags>
      </div>
      <div class="childTask clearfix">
        <p class="name" style="float:none;">
          <Icon type="ios-list-outline"></Icon>子任务</p>
        <!-- 已添加的子任务列表 -->
        <ul>
          <li class="sontask_list" v-for="(i,index) in data.sonTask" :key="index">
            <!-- 点击之前 -->
            <div class="clearfix" v-show="isEdit" style="display:flex;">
                <div class="addicon fl"> <Checkbox v-model="sonComplete"></Checkbox></div>
                <div class="sonInput fl">
                  <Tooltip content="点击即可编辑" placement="top">
                      <div class="sonCon" ref="sonCon" style="" @click="editson">{{i.title}}</div>
                  </Tooltip>
                </div>
                <DateTimePicker  class="sonDate fl" type="start" :max="data.endDate" @confirm="confirmSonDate" @clear="clearSonDate">
                 <div>
                   <Icon class="icon" type="calendar" v-if="!data.sontaskDate" size="20"></Icon>
                   <span v-else class="timeBox">
                    {{$moment(data.sontaskDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
                   </span>
                  </div>
              </DateTimePicker>

               <SetExecutor ref="executor"
                          v-model="data.sontaskExecutor"
                           class="sonManager fl">
                <template slot-scope="scope">
                  <div>
                    <Tooltip  v-if="!scope.executor" content="待认领"
                        placement="top">
                       <svg-icon name="people" v-if="!scope.executor"></svg-icon>
                     </Tooltip>

                     <Tooltip  v-else :content="scope.executor.name"
                        placement="top"
                        >
                        <div class="ava">
                          <img :src="scope.executor.imgUrl" alt="">
                        </div>
                     </Tooltip>

                  </div>
                </template>
              </SetExecutor>

                <div class="enterDetail fl"><Icon type="ios-arrow-right"></Icon></div>
            </div>
            <!-- 点击之后显示的 带input，可编辑 -->
              <div v-show="!isEdit">
                <div class="clearfix">
                  <div class="addicon fl"> <Checkbox v-model="sonComplete"></Checkbox></div>
                  <div class="sonInput fl">
                      <Input v-model.trim="i.title" style="width:410px;" autofocus/>
                  </div>

                  <DateTimePicker  class="sonDate fl" type="start" :max="data.endDate" @confirm="confirmSonDate" @clear="clearSonDate">
                    <div>
                      <Icon class="icon" type="calendar" v-if="!data.sontaskDate" size="20"></Icon>
                      <span v-else class="timeBox">
                        {{$moment(data.sontaskDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
                      </span>
                      </div>
                 </DateTimePicker>

                   <SetExecutor ref="executor"
                          v-model="data.sontaskExecutor"
                           class="sonManager fl">
                      <template slot-scope="scope">
                        <div>
                          <Tooltip  v-if="!scope.executor" content="待认领"
                              placement="top">
                            <svg-icon name="people" v-if="!scope.executor"></svg-icon>
                          </Tooltip>

                          <Tooltip  v-else :content="scope.executor.name"
                              placement="top"
                              >
                              <div class="ava">
                                <img :src="scope.executor.imgUrl" alt="">
                              </div>
                          </Tooltip>

                        </div>
                      </template>
                  </SetExecutor>
                </div>
                 <div class="btns">
                  <Button type="text" @click="showSontask=true;isEdit=true;">取消</Button>
                  <Button type="primary" style="padding:6px 20px;" @click="saveSon" :disabled="!i.title">保存</Button>
                </div>
              </div>

          </li>
        </ul>
        <div class="addChildTask" @click="showSontask=false;" v-if="showSontask"><Icon type="plus-circled"></Icon>添加子任务</div>
    <!-- 添加子任务 -->
        <div class="sonBox clearfix" v-if="!showSontask">
          <div class="newSon clearfix">
              <div class="addicon fl"><Icon type="plus-circled"></Icon></div>
              <div class="sonInput fl"><Input v-model="son" placeholder="输入子任务内容..." autofocus @keyup.enter.native = "submitSontask"/></div>

               <DateTimePicker  class="sonDate fl" type="start" :max="data.endDate" @confirm="confirmSonDate" @clear="clearSonDate">
                    <div>
                      <Icon class="icon" type="calendar" v-if="!data.sontaskDate" size="20"></Icon>
                      <span v-else class="timeBox">
                        {{$moment(data.sontaskDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
                      </span>
                      </div>
              </DateTimePicker>

               <SetExecutor ref="executor"
                          v-model="data.sontaskExecutor"
                           class="sonManager fl">
                <template slot-scope="scope">
                  <div>
                    <Tooltip  v-if="!scope.executor" content="待认领"
                        placement="top">
                       <svg-icon name="people" v-if="!scope.executor"></svg-icon>
                     </Tooltip>

                     <Tooltip  v-else :content="scope.executor.name"
                        placement="top"
                        >
                        <div class="ava">
                          <img :src="scope.executor.imgUrl" alt="">
                        </div>
                     </Tooltip>

                  </div>
                </template>
              </SetExecutor>
          </div>
          <div class="btns">
              <Button type="text" @click="showSontask=true;">取消</Button>
              <Button type="primary" style="padding:6px 20px;">保存</Button>
          </div>

        </div>
      </div>
  <!-- 添加关联 -->
  <div class="relevance">
    <p class="name" style="float: none;"><Icon type="link"></Icon>关联内容</p>
    <div class="addLink" @click="relationModal=true;"><Icon type="plus-circled"></Icon>添加关联</div>
    <Modal v-model="relationModal" class="relationModal" id="relationModal">
        <AddRelation></AddRelation>
    </Modal>

  </div>
 <!-- 上传附件 -->
  <div class="accessory">
    <p class="name" style="float: none;"><Icon type="android-attach"></Icon>上传附件</p>
    <div class="addfile"><Icon type="plus-circled"></Icon>添加附件</div>
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
import SetRepeat from './SetRepeat'
import TaskWarn from './TaskWarn'
import AddRelation from '@/components/public/common/AddRelation'
import Tags from '@/components/public/common/Tags'
import insertText from '@/utils/insertText'
import Emoji from '@/components/public/common/emoji/Emoji'
import SingleTaskMenu from './SingleTaskMenu'
import SetExecutor from './SetExecutor'

export default {
  props: ['data'],
  components: {
    SetRepeat,
    TaskWarn,
    Tags,
    Emoji,
    SingleTaskMenu,
    SetExecutor,
    AddRelation
  },
  data () {
    return {
      zan: false,
      complete: false,
      hoverExecutor:false,
      editorValue: '123',
      showEditor: false,
      modal1: false,
      relationModal:false,
      talkvalue: '',
      son:'',
      showSontask:true,
      sonComplete:false,
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

    confirmSonDate (date) {
       this.data.sontaskDate = date
    },
    clearSonDate () {
      this.data.sontaskDate = ''
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
    submitSontask () {
      
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
    },
    editson (){
      this.isEdit=false;

    },
    saveSon (){
      this.isEdit=true;
        //然后发请求
    },
    confirmWarnList(warn,user){

      this.$nextTick(_ => {
        this.modal1 = false;
      })
    },
  },
  mounted () {
    document.getElementById("editCon").parentNode.style.width = '100%';
   
  }
}
</script>
<style scoped lang="less">
@import './EditList.less';
</style>

