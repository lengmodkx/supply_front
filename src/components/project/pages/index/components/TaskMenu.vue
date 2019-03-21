<template>
  <Poptip class="task-menuwrapper"
          placement="bottom"
          transfer
          v-model="visible"
          @on-popper-hide="popHide">
    <Icon class="sanjiao"
          type="ios-arrow-dropdown"
          style="color:gray;"
          size="20"
    ></Icon>
    <div slot="content"
         class="task-menuwrapper-content"
         v-if="initCom">
      <div class="dropdownTitle">
        <span class="back">
          <span v-if="active!=''"
                @click="active='';reset(true)">
            <svg-icon class="backicon"
                      name="back"></svg-icon>
          </span>
        </span>
        {{topTitle}}
        <span class="guanbi"
              @click="visible=false">
          <svg-icon class="closePop"
                    name="close"></svg-icon>
        </span>
      </div>
      <div class="task-menu-list"
           v-if="active==''">
        <div class="menuItem"
             @click="listItemClick('a','编辑列表')">
          <svg-icon class="svgicon"
                    name="edit"
                    ></svg-icon>编辑列表</div>
        <div class="menuItem"
             @click="listItemClick('b','添加列表')"
             style="border-bottom:1px solid #eee;">
          <svg-icon class="svgicon"
                    name="add"></svg-icon>在此后添加新列表</div>
        <div class="menuItem"
             @click="listItemClick('c','选择执行者')">
          <svg-icon class="svgicon"
                    name="person"></svg-icon>设置本列表所有任务执行者</div>
        <div class="menuItem"
             @click="listItemClick('d','选择截止时间')">
          <svg-icon class="svgicon"
                    name="time"></svg-icon>设置本列表所有任务截止时间</div>
        <div class="menuItem"
             @click="listItemClick('e','移动本列表所有任务')">
          <svg-icon class="svgicon"
                    name="moveTo"></svg-icon>移动本列表所有任务</div>
        <div class="menuItem"
             @click="listItemClick('f','复制本列表所有任务')">
          <svg-icon class="svgicon"
                    name="copy"></svg-icon>复制本列表所有任务</div>
        <div class="menuItem"
             @click="listItemClick('g','移到回收站')"
             style="border-bottom:1px solid #eee;">
          <svg-icon class="svgicon"
                    name="delete"></svg-icon>本列表所有任务移到回收站</div>
        <div class="menuItem"
             @click="listItemClick('h','删除列表')">
          <svg-icon class="svgicon"
                    name="delete"></svg-icon>删除列表</div>
      </div>

      <!-- 内容部分的盒子： -->
      <div class="task-menu-detail">
        <div class="con1"
             v-if="active=='a'">
          <div>
            <Input v-model="title"
                   :autofocus="true" />
          </div>
          <div>
            <Button type="primary"
                    style="width:100%;margin-top:14px;"
                    @click="saveTitle">保存</Button>
          </div>
        </div>
        <div class="con2"
             v-if="active=='b'">
          <div class="con2tip">新列表将被添加在当前列表之后</div>
          <div>
            <Input v-model="newTask"
                   :autofocus="true"
                   placeholder="列表名称" />
          </div>
          <div @click="createNew">
            <Button type="primary"
                    style="width:100%;margin-top:14px;">创建</Button>
          </div>
        </div>
        <div class="con3"
             v-if="active=='c'">
          <Input class="findInput"
                 v-model="findMember"
                 :autofocus="true"
                 placeholder="查找成员" />
          <ul class="memberList">
            <li v-for="item in computedMemberList" :key="item.id" @click="chooseExecutor(item.id)">
              <svg-icon name="people" style="vertical-align:middle;margin-right:6px;"></svg-icon>
              {{item.name}}
              <svg-icon name="right"
               style="float:right;vertical-align:middle;margin-right:6px;margin-top:2px;"
               v-if="curId==item.id"></svg-icon>
            </li>
           
          </ul>
          <Button type="primary"
                  long
                  :disabled="curId==-1">确定</Button>
        </div>

        <div class="con4"
             v-if="active=='d'">
            <!-- <DatePicker :open="active=='d'"
                        type="datetime"
                        placeholder="Select date"
                        :confirm="true"
                        @on-clear="clearAll">
            </DatePicker> -->
            <DateTimeInline></DateTimeInline>
        </div>
        <div class="con5"
             v-if="active=='e'">
          <div class="con5item1">
            <span>项目</span>
            <Poptip placement="bottom-end"
                    class="innerRight">
              <div class="inTitle">
                <span>当前项目
                  <Icon type="ios-arrow-down"
                        size="18"
                        style="margin-left:4px;"></Icon>
                </span>
              </div>
              <div slot="content"
                   class="content">
                <Input class="findInput"
                       v-model="findPro"
                       :autofocus="true"
                       placeholder="查找项目" />
                <div class="star">
                  <h5>星标项目</h5>
                  <div class="item">项目1
                    <svg-icon class="right"
                              name="right"></svg-icon>
                  </div>
                </div>
                <div class="nostar">
                  <h5>非星标项目</h5>
                  <div class="item">项目1
                    <svg-icon class="right"
                              name="right"></svg-icon>
                  </div>
                </div>

              </div>
            </Poptip>

          </div>
          <div class="con5item2">
            <span>分组</span>
            <Poptip placement="bottom-end"
                    class="innerRight">
              <div class="inTitle">
                <span>当前任务
                  <Icon type="ios-arrow-down"
                        size="18"
                        style="margin-left:4px;"></Icon>
                </span>
              </div>
              <div slot="content"
                   class="content2">
                <div class="item">任务1
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
                <div class="item">任务2
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
              </div>
            </Poptip>
          </div>
          <div class="con5item3">
            <span>列表</span>
            <Poptip placement="bottom-end"
                    class="innerRight">
              <div class="inTitle">
                <span>当前列表
                  <Icon type="ios-arrow-down"
                        size="18"
                        style="margin-left:4px;"></Icon>
                </span>
              </div>
              <div slot="content"
                   class="content2">
                <div class="item">大列表1
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
                <div class="item">大列表2
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
              </div>
            </Poptip>
          </div>
          <div class="con5tip">你可以在任务板中添加和修改任务分组及任务列表。</div>
          <Button type="primary"
                  long>确定</Button>
        </div>
        <div class="con6"
             v-if="active=='f'">
          <div class="con5item1">
            <span>项目</span>
            <Poptip placement="bottom-end"
                    class="innerRight">
              <div class="inTitle">
                <span>当前项目
                  <Icon type="ios-arrow-down"
                        size="18"
                        style="margin-left:4px;"></Icon>
                </span>
              </div>
              <div slot="content"
                   class="content">
                <Input class="findInput"
                       v-model="findPro"
                       :autofocus="true"
                       placeholder="查找项目" />
                <div class="star">
                  <h5>星标项目</h5>
                  <div class="item">项目1
                    <svg-icon class="right"
                              name="right"></svg-icon>
                  </div>
                </div>
                <div class="nostar">
                  <h5>非星标项目</h5>
                  <div class="item">项目1
                    <svg-icon class="right"
                              name="right"></svg-icon>
                  </div>
                </div>

              </div>
            </Poptip>

          </div>
          <div class="con5item2">
            <span>分组</span>
            <Poptip placement="bottom-end"
                    class="innerRight">
              <div class="inTitle">
                <span>当前任务
                  <Icon type="ios-arrow-down"
                        size="18"
                        style="margin-left:4px;"></Icon>
                </span>
              </div>
              <div slot="content"
                   class="content2">
                <div class="item">任务1
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
                <div class="item">任务2
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
              </div>
            </Poptip>
          </div>
          <div class="con5item3">
            <span>列表</span>
            <Poptip placement="bottom-end"
                    class="innerRight">
              <div class="inTitle">
                <span>当前列表
                  <Icon type="ios-arrow-down"
                        size="18"
                        style="margin-left:4px;"></Icon>
                </span>
              </div>
              <div slot="content"
                   class="content2">
                <div class="item">大列表1
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
                <div class="item">大列表2
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
              </div>
            </Poptip>
          </div>
          <CheckboxGroup v-model="notice"
                         style="margin-top:5px;">
            <Checkbox class="checkbox"
                      label="原任务接收新任务的更新提醒"></Checkbox>
            <Checkbox class="checkbox"
                      label="新任务接收原任务的更新提醒"></Checkbox>
          </CheckboxGroup>
          <div class="con5tip">你可以在任务板中添加和修改任务分组及任务列表。</div>
          <Button type="primary"
                  long>确定</Button>

        </div>
        <div class="con7"
             v-if="active=='g'">
          <div class="ask">您确定要把列表下的所有任务移到回收站吗？</div>
          <Button type="error"
                  long>移到回收站</Button>

        </div>
        <div class="con8"
             v-if="active=='h'">
          <!-- 如果列表内容不为空，则提示要先清空所有的列表 -->
          <div class="nodelete"
               v-if="data.arr && data.arr.length>0">
            <div>请先清空此列表上的任务，然后再删除这个列表.</div>
          </div>
          <!-- 如果列表为空，则可以删除该任务 -->
          <div class="candelete"
               v-else>
            <h5>您确定要永远删除这个列表吗？</h5>
            <Button type="error"
                    long>删除</Button>
          </div>
        </div>
      </div>

    </div>

  </Poptip>

</template>
<script>
export default {
  props: ['data'],
  data () {
    return {
      initCom: true,
      visible: false,
      active: '',
      newTask: '',
      curTopTitle: '列表菜单',
      title: this.data.title,
      findMember: '',
      findPro: '',
      notice: [],
      curId:-1,
      memberList:[
        {
          id:0,
          name:"待认领"
        },
        {
          id:1,
          name:"张三"
        },
         {
          id:2,
          name:"王二"
        },
        {
          id:3,
          name:"赵五"
        }
      ]
    }
  },
  computed: {
    topTitle () {
      return this.active ? this.curTopTitle : '列表菜单'
    },
     computedMemberList () {
      return this.memberList.filter(v => this.$containStr(this.findMember, v.id>0?v.name:''))
    }
  },
  mounted () {

  },
  methods: {
    chooseExecutor (id) {
        this.curId = id
    },
    saveTitle (){
      this.visible = false;
      //发请求修改标题
    },
    listItemClick (index, title) {
      this.active = index
      this.curTopTitle = title
    },
    clearAll () {

    },
    createNew () {
      this.active = '';
    },
    reset (flag) {
      Object.assign(this.$data, this.$options.data())
      this.visible = flag
      this.title = this.data.title
    },
    popHide () {
      setTimeout(_ => {
        this.reset()
      }, 300)
    }
  }
}
</script>
<style lang="less">
@import './poptipMenu';
</style>

