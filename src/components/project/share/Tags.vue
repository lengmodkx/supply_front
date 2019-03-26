<template>
  <Poptip placement="bottom" popper-class="addTag" padding="0px 0px" width="250" v-model="Popvisible" @on-popper-show="popShow" @on-popper-hide="popHide" transfer>
    <div class="tagtitle" v-if="taglist.length==0">
      <Icon type="md-add-circle" size="24" style="color:#2d8cf0;vertical-align:middle;" />
    </div>
    <div class="list" v-if="taglist.length>0">
      <Tag v-for="(item,index) in showList(taglist)" :key="index" :name="item.id" :style="`background-color:${item.color};`" closable @on-close="handleClose">{{ item.name}}</Tag>
      <Icon type="md-add-circle" size="24" style="color:#2d8cf0;vertical-align:middle;" @click="Popvisible=true"></Icon>
    </div>
    <div slot="content">
      <div class="div1" v-if="showdiv1">
        <!--无任何标签的情况 -->
        <div class="tag_input clearfix">
          <Input class="search fl" v-model="searchTag" placeholder="搜索标签" autofocus />
          <div class="add-icon fl">
            <Tooltip content="新建标签" placement="top">
              <Icon type="md-add-circle" size="24" style="color:#2d8cf0;vertical-align:middle;" @click="addTag"></Icon>
            </Tooltip>
          </div>
        </div>
        <div class="conBox">
          <div class="noTag" v-if="totalTag.length==0">
            <span><img :src="require('@/assets/images/tag.png')"></span>
            <span style="color:#a6a6a6;">暂无标签</span>
          </div>
          <!-- 有默认标签的时候 -->
          <div class="hasTag" v-if="totalTag.length>0">
            <div v-for="item in computedTotalTag" :key="item.name" class="clearfix" @click="chooseTag(item.id)">
              <i class="color" :style="`background-color:${item.color}`"></i>
              <span>{{item.name}}</span>
              <div class="fr">
                <svg-icon name="edit" @click.stop="editTag(item)"></svg-icon>
                <svg-icon name="right" v-if="taglist.indexOf(item.id)>=0"></svg-icon>
              </div>
            </div>
          </div>
          <div class="createTag" v-if="tagAdd">
            <ul class="tagcolor clearfix">
              <li v-for="(color,i) in colorList" :key="i" @click="checkedColor=color">
                <div class="circle" :style="`background-color:${color}`">
                  <span class="markbox" v-if="color==checkedColor">
                    <Icon type="md-checkmark" class="mark"></Icon>
                  </span>
                </div>
              </li>
            </ul>
            <Button type="primary" long @click="createNew">创建</Button>
          </div>

        </div>

      </div>
      <!-- 新建 -->
      <div class="div2 clearfix" v-if="showdiv2">
        <div class="d2Header">
          <span class="back fl" @click="showdiv2=false;showdiv1=true;">
            <Icon type="ios-arrow-back" size="24" style="margin-top:5px;"></Icon>
          </span>
          {{isEdit?'编辑标签':'新建标签'}}
          <span class="close fr" @click="Popvisible=false">
            <Icon type="android-close" size="24"></Icon>
          </span>
        </div>
        <Input style="padding:8px 8px;" v-model="tagName" placeholder="标签名称" ref="input" />
        <div class="createTag">
          <ul class="tagcolor clearfix">
            <li v-for="(color,i) in colorList" :key="i" @click="checkedColor=color">
              <div class="circle" :style="`background-color:${color}`">
                <span class="markbox" v-if="color==checkedColor">
                  <Icon type="md-checkmark" class="mark" v-if="color==checkedColor" />
                </span>
              </div>
            </li>
          </ul>
          <div class="btnBox">
            <Button long v-if="isEdit" @click="showdiv2=false;showdiv3=true">删除</Button>
            <Button class="crtBtn" type="primary" long :disabled="!tagName" @click="finish()" :loading="loading">{{isEdit?'完成':'创建'}}</Button>
          </div>
        </div>
      </div>
      <!-- 删除标签 页 -->
      <div class="div3" v-if="showdiv3">
        <div class="d2Header">
          <span class="back fl" @click="showdiv3=false;showdiv1=true;">
            <Icon type="ios-arrow-back" size="24" style="margin-top:5px;"></Icon>
          </span>
          删除标签
          <span class="close fr" @click="Popvisible=false">
            <Icon type="android-close" size="24"></Icon>
          </span>
        </div>

        <div class="confirm">确认删除标签？</div>
        <div class="btnBox">
          <Button class="crtBtn" type="error" long @click="deleteTag">删除</Button>
        </div>

      </div>
    </div>

  </Poptip>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { addnewTag } from "../../../axios/api.js";
export default {
  props: ["taglist", "projectId"],
  data() {
    return {
      searchTag: "",
      showdiv1: true,
      showdiv2: false,
      showdiv3: false,
      tagName: "",
      Popvisible: false,
      totalTag: [],
      isEdit: false,
      colorList: [
        "#3da8f5",
        "#75c940",
        "#2fbdb3",
        "#797ec9",
        "#ffaf38",
        "#ff4f3e"
      ],
      checkedColor: "#3da8f5",
      tagAdd: false,
      loading: false
    };
  },
  computed: {
    //tags为总标签列表
    ...mapState("task", ["tags"]),
    computedTotalTag() {
      //totalTag为复制的tags的数组
      // return this.totalTag.filter(v => v.name.indexOf(this.searchTag) >= 0)
      return this.totalTag.filter(v =>
        this.$containStr(this.searchTag, v.name)
      );
      // return this.totalTag.filter(v => {
      //   var tag = this.curTag?v.taglist.indexOf(this.curTag.id) >= 0:true
      //   var createTime = this.curCreateTime?v.createTime.indexOf(this.curTag.id) >= 0:true

      //   return tag && createTime
      // })
    },
    showList(cur) {
      return function(cur) {
        //根据这条任务的tag数组里的id，将id对应的每个标签的内容从总标签列表tags中过滤出来
        return cur.map(id => {
          return this.tags.find(v => {
            return v.id == id;
          });
        });
      };
    }
  },
  mounted() {},
  methods: {
    handleClose(event, id) {
      //taglist为每条数据里面的tag列表
      const index = this.taglist.indexOf(id);
      this.taglist.splice(index, 1);
      // this.popShow()
      //  Object.assign(this.$data, this.$options.data())
      //  console.log(this.showList(this.taglist))
    },
    editTag(data) {
      this.isEdit = true;
      this.tagName = data.name;
      this.checkedColor = data.color;
      this.showdiv1 = false;
      this.showdiv2 = true;
    },
    addTag() {
      this.isEdit = false;
      if (this.searchTag == "") {
        //输入框里的值为空时，跳到新建页
        this.showdiv1 = false;
        this.showdiv2 = true;
      } else {
        //输入框里的值不为空时，点击这个加号就发请求(创建)并跳到第一页
        //如果输入的内容再tag列表中有，那么提示用户不能创建相同名字的标签
        this.searchTag = "";
        this.showdiv1 = true;
      }
    },
    createNew() {
      //这里发请求
      this.searchTag = "";
    },
    deleteTag() {
      //删除标签
      this.showdiv3 = false;
      this.showdiv1 = true;
    },
    reset(flag) {
      Object.assign(this.$data, this.$options.data());
      this.Popvisible = flag;
    },
    popShow() {
      this.totalTag = JSON.parse(JSON.stringify(this.tags));
    },
    popHide() {
      setTimeout(_ => {
        this.reset();
      }, 300);
    },
    chooseTag(id) {
      let i = this.taglist.indexOf(id);
      if (i >= 0) {
        this.taglist.splice(i, 1);
      } else {
        this.taglist.push(id);
      }
    },
    finish() {
      if (this.isEdit) {
        //删除标签
      } else {
        //创建标签
        this.loading = true;
        let params = {
          projectId: this.projectId,
          tagName: this.tagName,
          bgColor: this.checkedColor
        };
        addnewTag(params).then(res => {
          this.loading = false;
          console.log(res.data);
        });
      }
    }
  }
};
</script>
<style scoped lang="less">
.tag_input {
  border-bottom: 1px solid #eee;
}
.addTag {
  float: left;
  cursor: pointer;
  font-size: 14px;
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
      line-height: 24px;
      .markbox {
        .mark {
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
}
.div2 {
  height: 180px;
  .btnBox {
    display: flex;
    padding: 0px 8px 0px 8px;
    button {
      &:nth-of-type(2) {
        margin-left: 10px;
      }
    }
  }
  .d2Header {
    border-bottom: 1px solid #eee;
    height: 34px;
    text-align: center;
    line-height: 34px;
    font-size: 14px;
    font-weight: bold;
    .back {
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

