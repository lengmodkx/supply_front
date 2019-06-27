<template>
  <div>
    <div class="list" ref="addIcon">
      <Tag v-if="taglist.length>0" v-for="(item,index) in taglist" :key="index" :name="item.tagId" 
         :style="`background-color:${item.bgColor};`" closable  @on-close="handleClose">
         {{ item.tagName}}
      </Tag>
      <Icon type="md-add-circle" size="24" style="color:#2d8cf0;vertical-align:middle;cursor:pointer" @click="open"></Icon>
    </div>
    <Modal  v-model="showTag"   title="标签" :footer-hide="true"  :mask-closable="false" :width="380" @on-cancel="cancel">
      <div class="content"  style="width:350px;margin:15px auto" >
          <div class="tagbox" v-if="showdiv1">
            <!--无任何标签的情况 -->
            <div class="tag_input clearfix">
               <Input class="search fl"  enter-button placeholder="搜索标签"  @on-enter="search" v-model="searchTag" />
              <div class="add-icon fl">
                <Tooltip content="新建标签" placement="top">
                  <Icon type="md-add-circle" size="24" style="color:#2d8cf0;vertical-align:middle;cursor:pointer" @click="addTag"></Icon>
                </Tooltip>
              </div>
            </div>
            <div class="conBox">
              <div class="noTag" v-if="totalTag.length==0" style="text-align:center;padding-top:8px">
                <img :src="require('@/assets/images/tag.png')" width="50px" />
                <p style="color:#a6a6a6;">暂无标签</p>
              </div>
              <!-- 有默认标签的时候 -->
              <div class="hasTag" v-if="totalTag.length>0">
                <div v-for="(tag,index) in totalTag" :key="index" class="clearfix tag-list" @click="chooseTag(tag)">
                  <i class="color" :style="`background-color:${tag.bgColor}`"></i>
                  <span>{{tag.tagName}}</span>
                  <div class="fr">
                   
                     <svg-icon name="right" v-if="tag.flag" class="right" style=" float:right;margin-left:10px ;"></svg-icon>
                     <svg-icon name="edit" @click.stop="editTag(tag)" class="edit" style="float:right; "></svg-icon>
                  </div>
                </div>
              </div>
             
            </div>
          </div>
          <!-- 新建 -->
          <div class="tagbox2 clearfix" v-if="showdiv2">
            <div class="d2Header">
              <span class="back fl" @click="showdiv2=false;showdiv1=true;">
                <Icon type="ios-arrow-back" size="24" style="margin-top:5px;"></Icon>
              </span>
              {{isEdit?'编辑标签':'新建标签'}}
                <span class="close-tag fr"></span>
            </div>
            <Input style="padding:8px 8px;" v-if='isEdit' :maxlength='10'  v-model="tag.tagName" placeholder="编辑标签" ref="input" />
             <Input style="padding:8px 8px;" v-else :maxlength='10'  v-model="tagName" placeholder="新建标签" ref="input" /> 
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
                <Button class="crtBtn" type="primary" long :disabled="!tagName" @click="finish" :loading="loading">{{isEdit?'完成':'创建'}}</Button>
              </div>
            </div>
          </div>
          <!-- 删除标签 页 -->
          <div class="tagbox3" v-if="showdiv3">
            <div class="d2Header">
              <span class="back fl" @click="showdiv3=false;showdiv1=true;">
                <Icon type="ios-arrow-back" size="24" style="margin-top:5px;"></Icon>
              </span>
              删除标签
              <span class="close-tag fr" @click="Popvisible=false">
                <Icon type="android-close" size="24"></Icon>
              </span>
            </div>
            <div class="confirm">确认删除标签？</div>
            <div class="btnBox">
              <Button class="crtBtn" type="error" long @click="deleteTag">删除</Button>
            </div>
          </div>
       </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import {
  allTags,
  addnewTag,
  addTagAndBind,
  modifyTag,
  searchTags,
  delTag,
  removeInfoTag,
  bindingTag
} from "@/axios/api";
export default {
  props: ["taglist", "publicId", "publicType", "projectId",'fileTask'],
  data() {
    return {
      showSearch:false,
      showTag:false,
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
      loading: false,
      offsetLeft: 0,
      offsetTop: 0,
      tag: null //编辑标签时使用
    };
  },
  watch: {
    offsetLeft(newl, oldl){
      console.log(oldl,newl)
      },
    taglist:{
       handler:function(newValue,oldValue){
            console.log("taglist"+newValue)
       },
       deep:true
    }
    
  },
  methods: {
    open(){
      //打开弹框
        this.showTag=true;
        let params = {
              publicId: this.publicId,
              publicType: this.publicType
            };
        allTags(this.projectId, params).then(res => {
          if (res.result === 1) {
            this.totalTag = res.data;
          }
        });
    },
    cancel(){
      //关闭弹框
        this.showSearch=false;
        this.searchTag='';
    },
     editTag(data) {
      //编辑
      this.isEdit = true;
      this.tag = data;
      this.showdiv1 = false;
      this.showdiv2 = true;
      this.tagName = data.tagName;
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
    search() {
      //搜索
      if (this.searchTag) {
        searchTags({ key: this.searchTag }).then(res => {
          if (res.result === 1) {
            this.totalTag = res.data;
          }
        });
      } else {
        let params = {
          publicId: this.publicId,
          publicType: this.publicType
        };
        allTags(this.projectId, params).then(res => {
          if (res.result === 1) {
            this.totalTag = res.data;
          }
        });
      }
    },
    handleClose(event, id) {
      //移除
      removeInfoTag(id,this.publicId,this.publicType).then(res => {
        if(res.result === 1){
          this.$Message.success(res.msg)
        }
      })
    },
    deleteTag() {
      this.searchTag=''
      //删除标签
      this.showdiv3 = false;
      this.showdiv1 = true;
      let data = {
        publicId: this.publicId,
        publicType: this.publicType
      };
      delTag(this.tag.tagId).then(res => {
        if (res.result === 1) {
          let i = this.taglist.indexOf(this.tag);
          if (i >= 0) {
            this.taglist.splice(i, 1);
            this.$nextTick(() => {
              console.log(">>>>>>>", this.$refs.addIcon.offsetWidth);
              this.offsetLeft = this.$refs.addIcon.offsetWidth - 30 + "px";
              console.log(this.offsetLeft)
            });
          }
        }
      }).then(res=>{
              allTags(this.projectId, data).then(res => {
                if (res.result === 1) {
                  this.totalTag = res.data;

                }
              });
        })
    },
    
    chooseTag(tag) {
      //绑定标签
      bindingTag(tag.tagId,this.publicId,this.publicType).then(res => {
        if(res.result === 1){
          this.$Message.success(res.msg)
        }else{
          this.$Message.error(res.msg)
        }
      })
    },
    finish() {
      //修改标签 //创建标签
      if (this.isEdit) {
        //修改标签
        let params = {
          projectId: this.projectId,
          tagName: this.tag.tagName,
          bgColor: this.tag.checkedColor
        };
        let data = {
          publicId: this.publicId,
          publicType: this.publicType
        };
        modifyTag(this.tag.tagId, params).then(res => {
          if (res.result === 1) {
            this.showdiv1 = true;
            this.showdiv2 = false;
          }
        }).then(res=>{
              allTags(this.projectId, data).then(res => {
                if (res.result === 1) {
                  this.totalTag = res.data;

                }
              });
        })
      } else {
        //创建标签
        this.loading = true;
        let params = {
          projectId: this.projectId,
          publicId:this.publicId,
          publicType:this.publicType,
          tagName: this.tagName,
          bgColor: this.checkedColor
        };
        let data = {
          publicId: this.publicId,
          publicType: this.publicType
        };
        addTagAndBind(params).then(res => {
          this.loading = false;
          if(res.result === 1){
            this.$Message.success("新标签绑定成功!")
          } else{
            this.$Message.error(res.msg)
          }
        }).then(res=>{
        
              allTags(this.projectId, data).then(res => {
                if (res.result === 1) {
                  this.totalTag = res.data;

                }
              });
        })
      }
    },
    popHide() {
      setTimeout(_ => {
        this.reset();
      }, 300);
    },
    reset(flag) {
      alert(flag)
      //Object.assign(this.$data, this.$options.data());
      this.Popvisible = flag;
    },
     closeTag(){
      this.Popvisible = false
    },
    // popShow() {
    //   this.Popvisible = !this.Popvisible;
    //   if (this.Popvisible) {
    //     let params = {
    //       publicId: this.publicId,
    //       publicType: this.publicType
    //     };
    //     allTags(this.projectId, params).then(res => {
    //       if (res.result === 1) {
    //         this.totalTag = res.data;
    //       }
    //     });
    //   }
    //   if(this.fileTask=='fileTask'){
    //      this.offsetLeft=80+"px"
    //   }else{
    //        if(this.$refs.addIcon.offsetWidth + 45>300){
    //         this.offsetLeft=270+"px"
    //         }else{
    //           this.offsetLeft = this.$refs.addIcon.offsetWidth + 45 + "px";
    //         }
    //   }
    //   console.log(this.offsetLeft)
    // },

  },
  created(){
    console.log(this.taglist)
  }
};
</script>
<style scoped lang="less">
.hasTag{
  min-height: 200px;
  max-height: 260px;
  overflow-y: scroll;
  margin-bottom: 15px;
}
.tagbox {
  .tag_input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    padding: 0px 0 15px 0px;
    .add-icon {
      margin-left: 5px;
    }
  }
  .tag-list {
    display: flex;
    width: 100%;
    height: 45px;
    align-items: center;
    &:hover {
      background-color: #f8f8f8;
      .fr .edit {
        display: block;
      }
    }
    .color {
      width: 5px;
      height: 5px;
      margin: 0 5px;
      border-radius: 50%;
      flex: none;
    }
    span {
      width: 230px;
      overflow:hidden;
    }
    .fr {
        width: 70px;
      svg {
        width: 15px;
        cursor: pointer;
        color: gray;
      }
      .edit {
        display: none;
       
        &:hover {
          color: #3da8f5;
        }
      }
    }
  }

  .inputWord {
    text-align: center;
    button {
      width: 180px;
      margin: 5px auto;
    }
  }
}
.list{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
.tagbox2 {
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
    .close-tag {
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
.tagbox3 {
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
.content {
  
  width: 350px;
  // position: absolute;
  // border: 1px solid #eeeeee;
  // background-color: #fff;
  // border-radius: 5px;
  // z-index: 999;
}
</style>

