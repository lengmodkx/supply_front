<template>
  <Poptip placement="bottom"
          popper-class="addTag"
          v-model="Popvisible"
          @on-popper-show="popShow"
          @on-popper-hide="popHide"
          transfer>
    <div class="tagtitle"
         v-if="taglist.length==0">添加标签</div>
    <div class="list"
         v-if="taglist.length>0">
      <Tag v-for="(item,index) in showList(taglist)"
           :key="index"
           :name="item.tagId"
           :style="`background-color:${item.bgColor};`"
           closable
           @on-close="handleClose">{{ item.tagName}}</Tag>
      <Icon type="ios-plus-outline"
            size="20"
            style="color:#2d8cf0;vertical-align:middle;"
            @click="Popvisible=true"></Icon>
    </div>
    <div  >
      <div class="div1"
           v-if="showdiv1">
        <!--无任何标签的情况 -->
        <div class="tag_input clearfix">
          <Input class="search fl"
                 v-model="searchTag"
                 placeholder="搜索标签"
                 autofocus />
          <div class="add-icon fl">
            <Tooltip content="新建标签"
                     placement="top">
              <Icon type="ios-plus-outline"
                    size="20"
                    @click="addTag"></Icon>
            </Tooltip>
          </div>
        </div>
        <div class="conBox">
          <div class="noTag"
               v-if="computedTotalTag.length==0 && !searchTag">
            <span><img :src="require('@/assets/images/tag.png')"></span>
            <span style="color:#a6a6a6;">暂无标签</span>
          </div>
          <!-- 有默认标签的时候 -->
          <div class="hasTag"
               v-if="totalTag.length>0">
            <div v-for="item in computedTotalTag"
                 :key="item.tagName"
                 class="clearfix"
                 @click="chooseTag(item.tagId)">
              <i class="color"
                 :style="`background-color:${item.bgColor}`"></i>
              <span>{{item.tagName}}</span>
              <div class="fr">
                <svg-icon name="edit"
                          @click.stop="editTag(item)"></svg-icon>
                <svg-icon name="right"
                          v-if="taglist.indexOf(item.tagId)>=0"></svg-icon>
              </div>
            </div>
          </div>
          <div class="createTag"
               v-if="computedTotalTag.length==0 && (totalTag.length!=0 || searchTag)">
            <ul class="tagcolor clearfix">
              <li v-for="(color,i) in colorList"
                  :key="i"
                  @click="checkedColor=color">
                <div class="circle"
                     :style="`background-color:${color}`">
                  <span class="markbox"
                        v-if="color==checkedColor">
                    <Icon type="checkmark"
                          class="mark"></Icon>
                  </span>
                </div>
              </li>
            </ul>
            <Button type="primary"
                    v-if="computedTotalTag.length==0 && searchTag"
                    long
                    :loading="loading"
                    @click="createNew(true)">创建</Button>
          </div>

        </div>

      </div>
      <!-- 新建 -->
      <div class="div2 clearfix"
           v-if="showdiv2">
        <div class="d2Header">
          <span class="back fl"
                @click="showdiv2=false;showdiv1=true;">
            <Icon type="ios-arrow-back"
                  size="24"
                  style="margin-top:5px;"></Icon>
          </span>
          {{isEdit?'编辑标签':'新建标签'}}
          <span class="close fr"
                @click="$nextTick(()=>{Popvisible=false})">
            <Icon type="android-close"
                  size="24"></Icon>
          </span>
        </div>
        <br>
        <Input style="padding:0 14px;"
               v-model="tagName"
               placeholder="标签名称" />
        <div class="createTag">
          <ul class="tagcolor clearfix">
            <li v-for="(color,i) in colorList"
                :key="i"
                @click="checkedColor=color">
              <div class="circle"
                   :style="`background-color:${color}`">
                <span class="markbox"
                      v-if="color==checkedColor">
                  <Icon type="checkmark"
                        class="mark"></Icon>
                </span>
              </div>
            </li>
          </ul>
          <div class="btnBox">
            <Button type="ghost"
                    long
                    v-if="isEdit"
                    @click="showdiv2=false;showdiv3=true">删除</Button>
            <Button class="crtBtn"
                    type="primary"
                    long
                    :loading="loading"
                    @click="isEdit?updateTag(projectId,editTagId,tagName,checkedColor):createNew()"
                    :disabled="!tagName">{{isEdit?'完成':'创建'}}</Button>
          </div>
        </div>
      </div>
      <!-- 删除标签页 -->
      <div class="div3"
           v-if="showdiv3">
        <div class="d2Header">
          <span class="back fl"
                @click="showdiv3=false;showdiv1=true;">
            <Icon type="ios-arrow-back"
                  size="24"
                  style="margin-top:5px;"></Icon>
          </span>
          删除标签
          <span class="close fr"
                @click="Popvisible=false">
            <Icon type="android-close"
                  size="24"></Icon>
          </span>
        </div>

        <div class="confirm">确认删除标签？</div>
        <div class="btnBox">
          <Button class="crtBtn"
                  type="error"
                  long
                  :loading="loading"
                  @click="deleteTag(editTagId)">删除</Button>
        </div>

      </div>
    </div>

  </Poptip>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { addnewTag, delTag, modifyTag } from '@/axios/api'
export default {
  props: ['taglist', 'projectId'],
  data () {
    return {
      searchTag: '',
      showdiv1: true,
      showdiv2: false,
      showdiv3: false,
      tagName: '',
      Popvisible: false,
      totalTag: [],
      isEdit: false,
      editTagId: null,
      editTagName: null,
      editBgColor: null,
      colorList: ['#3da8f5', '#75c940', '#2fbdb3', '#797ec9', '#ffaf38', '#ff4f3e'],
      checkedColor: '#3da8f5'
    }
  },
  computed: {//tags为总标签列表
    ...mapState('app', ['loading']),
    ...mapState('task', ['tags']),
    computedTotalTag () {//totalTag为复制的tags的数组

      return this.totalTag.filter(v => this.$containStr(this.searchTag, v.tagName))
    },
    showList (cur) {
      return function (cur) {
        //根据这条任务的tag数组里的id，将id对应的每个标签的内容从总标签列表tags中过滤出来
        return cur.map(id => {
          return this.tags.find(v => {
            return v.tagId == id
          })
        })
      }
    }
  },
  mounted () {
    this.initTags(() => {
      //将tags赋值给totalTag   totalTag为tags的复制版
      this.totalTag = JSON.parse(JSON.stringify(this.tags))
      // console.log( this.totalTag)

    })
  },
  methods: {
    ...mapActions('task', ['initTags']),
    handleClose (event, id) {
      //taglist为每条数据里面的tag列表
      const index = this.taglist.indexOf(id);
      this.taglist.splice(index, 1);
      //  Object.assign(this.$data, this.$options.data())
    },
    editTag (data) {
      this.isEdit = true
      this.tagName = data.tagName
      this.checkedColor = data.bgColor
      this.editTagId = data.tagId
      this.editTagName = data.tagName
      this.editBgColor = data.bgColor
      this.showdiv1 = false;
      this.showdiv2 = true;
    },
    addTag () {
      this.isEdit = false
      if (this.searchTag == '') {
        //输入框里的值为空时，跳到新建页
        this.showdiv1 = false;
        this.showdiv2 = true;

      } else if (this.searchTag && this.computedTotalTag.length == 0) {
        //输入框里的值不为空时，点击这个加号就发请求(创建)并跳到第一页
        //如果输入的内容再tag列表中有，那么提示用户不能创建相同名字的标签
        // this.searchTag = '';
        // this.showdiv1 = true;

        this.createNew(true)
      }
    },
    createNew (fromSearch) {
      //这里发请求  创建新标签
      if (fromSearch) this.tagName = this.searchTag
      let tagData = {
        projectId: this.projectId,
        tagName: this.tagName,
        bgColor: this.checkedColor
      }
      addnewTag(tagData).then(res => {
        if (res.result == 1) {
          this.reset(true)
          this.initTags(() => {
            //将tags赋值给totalTag   totalTag为tags的复制版
            this.totalTag = JSON.parse(JSON.stringify(this.tags))
          })
        } else{
            this.$Message.error(res.msg)
         } 
      })
    },
    deleteTag (tagid) {
      //删除标签
      // tagid是当前编辑的标签的id
      delTag(tagid).then(res => {
        if (res.result == 1) {
          this.initTags(() => {
            this.totalTag = JSON.parse(JSON.stringify(this.tags))
            this.showdiv3 = false
            this.showdiv1 = true
          })
        } else {
          this.showdiv3 = false
          this.showdiv1 = true
        }
      })
    },
    updateTag (projectId, tagid, tagname, tagcolor) {
      //修改标签
      modifyTag(projectId, tagid, tagname, tagcolor).then(res => {
        this.reset(true)
        if (res.result == 1) {
          this.initTags(() => {
            this.totalTag = JSON.parse(JSON.stringify(this.tags))
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    reset (flag) {
      Object.assign(this.$data, this.$options.data())
      this.Popvisible = flag
    },
    popShow () {
      this.totalTag = JSON.parse(JSON.stringify(this.tags))
    },
    popHide () {
      setTimeout(_ => {

        this.reset()
      }, 300)
    },
    chooseTag (id) {
      let i = this.taglist.indexOf(id)
      if (i >= 0) {
        this.taglist.splice(i, 1)
      } else {
        this.taglist.push(id)
      }
      this.$emit('choosedTaglist',this.taglist)
    }
  }
}
</script>
<style scoped lang="less">
.content{
  width: 350px !important;
  margin:15px auto !important;
  .div1{
    background: #2d8cf0
  }
}
.tag_input {
  border-bottom: 1px solid #eee;
}
.addTag {
  float: left;
  cursor: pointer;
  font-size: 14px;
  /deep/.ivu-poptip-popper {
    width: 248px !important;
  }
  /deep/.ivu-poptip-body {
    padding: 8px 0;
  }

  .tagtitle {
    cursor: pointer;
    &:hover {
      color: #2d8cf0;
    }
  }
  .search {
    width: 205px;
    /deep/.ivu-input {
      border: none !important;
      font-size: 14px;
      &:hover {
        outline: 0 none;
      }
      &:focus {
        box-shadow: none;
        outline: 0 none;
      }
    }
  }
  .add-icon {
    margin-top: 7px;
    margin-left: 8px;
    color: #2d8cf0;
  }
  .conBox {
    .noTag {
      height: 140px;
      overflow: hidden;
      padding-top: 30px;
      span {
        img {
          width: 64px;
        }
        display: block;
        text-align: center;
      }
    }
    .hasTag {
      > div {
        line-height: 40px;
        padding: 0 16px;
        font-size: 14px;
        i.color {
          display: inline-block;
          background: #000;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 3px;
        }
        .svg-icon {
          width: 22px;
          vertical-align: middle;
        }
        .svg-edit {
          width: 15px;
          vertical-align: middle;
          margin-right: 5px;
          display: none;
        }

        &:hover {
          background-color: #eee;
          .svg-edit {
            display: inline-block;
            &:hover {
              color: #3da8f5;
            }
          }
        }
      }
    }
  }
}
.div1 {
  .inputWord {
    text-align: center;
    button {
      width: 180px;
      margin: 5px auto;
    }
  }
}

.createTag {
  text-align: center;
}
.tagcolor {
  margin: 20px auto;
  padding-left: 15px;
  li {
    &:last-child {
      margin-right: 0;
    }
    &:first-child {
      margin-left: 5px;
    }
    float: left;
    margin-right: 12px;
    .circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      position: relative;
      .markbox {
        position: absolute;
        left: 7px;
        top: 3px;
        .mark {
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
}
.div2 {
  .btnBox {
    display: flex;
    padding: 0 10px;
    button {
      &:nth-of-type(2) {
        margin-left: 10px;
      }
    }
  }
  .d2Header {
    border-bottom: 1px solid #eee;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    .back {
      height: 100%;
      i {
        font-size: 28px;
        margin-top: 4px;
        margin-left: 8px;
        line-height: 22px;
        color: #a6a6a6;
      }
    }
    .close {
      i {
        font-size: 28px;
        margin-top: 2px;
        margin-right: 10px;
        line-height: 22px;
        color: #a6a6a6;
      }
    }
  }
}
.div3 {
  .d2Header {
    border-bottom: 1px solid #eee;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    .back {
      height: 100%;
    }
    .back i {
      font-size: 28px;
      margin-top: 4px;
      margin-left: 8px;
      line-height: 22px;
      color: #a6a6a6;
    }
    .close i {
      font-size: 28px;
      margin-top: 2px;
      margin-right: 10px;
      line-height: 22px;
      color: #a6a6a6;
    }
  }
  .confirm {
    padding: 10px;
    height: 70px;
    font-size: 14px;
  }
  .btnBox {
    display: flex;
    padding: 0 10px;
  }
}
</style>

