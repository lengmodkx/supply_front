<template>
  <Poptip class="task-menuwrapper"
          placement="bottom"
          transfer
          v-model="visible"
          @on-popper-hide="popHide">
    <Icon type="ios-arrow-down" size="20" />
    <!-- <Icon type="ios-arrow-down"
          size="20"></Icon> -->
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
             @click="listItemClick('b','复制到')">
          <svg-icon class="svgicon"
                    name="copy"></svg-icon>复制任务</div>
        <div class="menuItem tasklink" @click="copylink" :data-clipboard-text="link">
          <svg-icon class="svgicon"
                    name="link"></svg-icon>复制任务链接</div>
        <div class="menuItem"
             @click="listItemClick('a','移动到')">
          <svg-icon class="svgicon"
                    name="moveTo"></svg-icon>移动任务</div>
        <div class="menuItem">
          <svg-icon class="svgicon"
                    name="collect"></svg-icon>收藏任务</div>

        <div class="menuItem"
             @click="listItemClick('c','移到回收站')">
          <svg-icon class="svgicon"
                    name="delete"></svg-icon>移到回收站</div>

        <div class="privacy">
          <div class="p_left fl clearfix"
               @click="unlock=!unlock;">
            <div v-if="unlock" style="overflow:hidden;">
              <Icon type="unlocked"
                    class="fl"></Icon>
              <div class="p_title fl">
                <h5>隐私模式</h5>
                <p>所有成员可见</p>
              </div>
            </div>

            <div v-if="!unlock" style="overflow:hidden;">
              <Icon type="locked"
                    class="fl"></Icon>
              <div class="p_title fl">
                <h5>隐私模式</h5>
                <p>仅参与者可见</p>
              </div>
            </div>
          </div>
          <div class="p_right fr">
              <span>{{unlock==true?"已关闭":"已开启"}}</span>
          </div>
        </div>
      </div>

      <!-- 内容部分的盒子： -->
      <div class="task-menu-detail">
        <div class="con5"
             v-if="active=='a'">
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
          <div class="con5tip">跨项目移动时，部分参与者信息不会保留</div>
          <Button type="primary"
                  long
                  style="margin-top:8px;">确定</Button>
        </div>
        <div class="con6"
             v-if="active=='b'">
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
          <div class="con5tip">标题、子任务、备注将被复制</div>
          <Button type="primary"
                  long>确定</Button>

        </div>
        <div class="con7"
             v-if="active=='c'">
          <div class="ask">您确定要把列表下的所有任务移到回收站吗？</div>
          <Button type="error"
                  long>移到回收站</Button>

        </div>
        
      </div>

    </div>

  </Poptip>

</template>
<script>
import Clipboard from 'clipboard'

export default {
  props: ['data'],
  data () {
    return {
      link:'https://www.baidu.com',
      initCom: true,
      visible: false,
       unlock: true,
      active: '',
      newTask: '',
      curTopTitle: '任务菜单',
      title: this.data.title,
      findMember: '',
      findPro: '',
      notice: []
    }
  },
  computed: {
    topTitle () {
      return this.active ? this.curTopTitle : '任务菜单'
    }
  },
  mounted () {

  },
  methods: {
     copylink () {
         var clipboard = new Clipboard('.tasklink')
        clipboard.on('success', e => {
          alert('复制成功')
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          console.log('该浏览器不支持自动复制')
          clipboard.destroy()
        })
      },
    saveTitle () {
      this.visible = false;
      //发请求修改标题
    },
    listItemClick (index, title) {
      this.active = index
      this.curTopTitle = title
    },
    clearAll () {

    },
    changeTitle () {
      this.active = '';
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

