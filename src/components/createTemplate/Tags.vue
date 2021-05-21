<template>
  <div>
    <div class="list" ref="addIcon">
      <Tag type="border" closable v-if="taglist.length > 0" v-for="(item, index) in taglist" :key="index"
        :name="item.tagId" :color="item.bgColor" @on-close="handleClose">
        {{ item.tagName }}
      </Tag>
      <Button icon="ios-add" type="dashed" size="small" @click="open">添加标签</Button>
      <!-- <Icon type="md-add-circle" size="24" style="color:#2d8cf0;vertical-align:middle;cursor:pointer" @click="open"></Icon> -->
    </div>
    <Modal v-model="showTag" :footer-hide="true" :width="300" @on-cancel="cancel">
      <p slot="header" style="text-align:center">
        <Icon type="ios-arrow-back" style="position:absolute;left:0;margin-left:10px;cursor:pointer" size="22"
          color="#999" @click="returnTag" v-if="showdiv1 == false" />
        <span>{{ tagTilte }}</span>
      </p>
      <div class="content">
        <div class="tagbox" v-if="showdiv1">
          <!--无任何标签的情况 -->
          <div class="tag_input clearfix">
            <!-- <Input class="search fl" placeholder="搜索标签" @on-change="change" v-model="searchTag" /> -->
          </div>
          <div class="conBox">
            <div class="noTag" style="padding-top:8px">
              <p>标签</p>
              <!-- 有默认标签的时候 -->
              <div class="hasTag" v-if="totalTag.length > 0">
                <div v-for="(tag, index) in totalTag" :key="index" class="tag-list" @click="chooseTag(tag)">
                  <div class="tag-content">
                    <Icon type="ios-checkmark-circle" :color="tag.bgColor" :size="22" />
                    <span style="font-size:16px;margin-left:5px">{{ tag.tagName }}</span>
                  </div>
                  <div class="tag-caozuo">
                    <Button icon="ios-trash-outline" class="delete-tag" @click.stop="deleteTag(tag)"></Button>
                    <Button icon="ios-brush-outline" @click.stop="editTag(tag)" class="edit-tag"></Button>
                  </div>
                </div>
              </div>
              <Button long class="create-tag" @click="createTag">{{ btnName }}</Button>
            </div>
          </div>
        </div>
        <!-- 新建 -->
        <div class="tagbox2 clearfix" v-if="showdiv2">
          <Input v-if="isEdit" :maxlength="100" v-model="tagName" placeholder="新建标签" ref="input" />
          <Input v-else :maxlength="100" v-model="tagName" placeholder="编辑标签" ref="input" />
          <div class="createTag">
            <ul class="tagcolor clearfix">
              <li v-for="(color, i) in colorList" :key="i" @click="checkedColor = color">
                <div class="circle" :style="`background-color:${color}`">
                  <span class="markbox" v-if="color == checkedColor">
                    <Icon type="md-checkmark" class="mark" v-if="color == checkedColor" />
                  </span>
                </div>
              </li>
            </ul>
            <div class="btnBox">
              <Button class="crtBtn" type="primary" long :disabled="!tagName" @click="finish"
                :loading="loading">{{ isEdit == false ? "完成" : "创建" }}</Button>
            </div>
          </div>
        </div>
        <!-- 删除标签 页 -->
        <div class="tagbox3" v-if="showdiv3">
          <div class="confirm">您将无法撤销。这将从所有卡片中移除此标签并清除其历史记录。</div>
          <div class="btnBox">
            <Button class="crtBtn" type="error" long @click="removeTag">删除</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {
    mapState,
    mapMutations
  } from "vuex";
  import {
    searchTags,
    delTag,
    removeInfoTag,
  } from "../../axios/api";
  import {
    createTemplateTag,
    getTemplateTagList,
    updateTemplateTag,
    removeTemplateTag
  } from '@/axios/template'
  export default {
    props: ["taglist", "templateId"],
    data() {
      return {
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
    methods: {
      tags() {
        getTemplateTagList({
          templateId: this.templateId
        }).then(res => {
          if (res.result === 1) {
            this.totalTag = res.data;
          }
        });
      },
      open() {
        //打开弹框
        this.showTag = true;
        this.tags();
      },
      cancel() {
        //关闭弹框
        this.showSearch = false;
        this.searchTag = "";
        this.showdiv1 = true;
        this.showdiv2 = false;
        this.showdiv3 = false;
        this.tagTilte = "标签";
      },
      editTag(data) {
        //编辑
        this.isEdit = false;
        this.tag = data;
        this.showdiv1 = false;
        this.showdiv2 = true;
        this.tagName = data.tagName;
        this.checkedColor = data.bgColor;
        this.tagTilte = "编辑标签";
      },
      createTag() {
        this.isEdit = true;
        this.showdiv1 = false;
        this.showdiv2 = true;
        this.tagTilte = "创建标签";
        this.tagName = this.searchTag;
      },
      deleteTag(data) {
        this.showdiv1 = false;
        this.showdiv3 = true;
        this.tagTilte = "删除标签";
        this.tag = data;
      },
      returnTag() {
        this.searchTag = "";
        this.showdiv1 = true;
        this.showdiv2 = false;
        this.showdiv3 = false;
        this.tagTilte = "标签";
        this.btnName = "创建标签";
      },
      change() {
        //搜索
        if (this.searchTag == null || this.searchTag == "") {
          let params = {
            publicId: this.publicId,
            publicType: this.publicType
          };
          this.tags(params);
          this.btnName = "创建标签";
        } else {
          searchTags({
            key: this.searchTag,
            projectId: this.projectId
          }).then(res => {
            if (res.result === 1) {
              if (res.data.length == 0) {
                this.totalTag = res.data;
                if (this.searchTag.length > 8) {
                  this.btnName = '创建名为"' + this.searchTag.substring(0, 8) + '..."的标签';
                } else {
                  this.btnName = '创建名为"' + this.searchTag + '"的标签';
                }
              } else {
                this.totalTag = res.data;
              }
            }
          });
        }
      },
      handleClose(event, id) {
        //移除
        // removeInfoTag(id, this.publicId, this.publicType).then(res => {
        //   if (res.result === 1) {
        //     this.$Message.success(res.msg);
        //   }
        // });
      },
      removeTag() {
        this.searchTag = "";
        //删除标签
        this.showdiv3 = false;
        this.showdiv1 = true;

        let params = {
         tagId:this.tag.tagId
        };
        removeTemplateTag(params).then(res => {
          if (res.result === 1) {
            this.tags();
          }
        });
      },

      chooseTag(tag) {
        //绑定标签
        // bindingTag(tag.tagId, this.publicId, this.publicType).then(res => {
        //   if (res.result === 1) {
        //     this.$Message.success(res.msg);
        //   } else {
        //     this.$Message.error(res.msg);
        //   }
        // });
        this.showTag=false
        this.$emit('bidingTag',tag.tagId)
      },
      finish() {
        //创建标签
        if (this.isEdit) {
          //创建标签
          this.loading = true;
          let params = {
            templateTagName: this.tagName,
            bgColor: this.checkedColor,
            templateId: this.templateId
          };
          createTemplateTag(params).then(res => {
            this.loading = false;
            if (res.result === 1) {
              this.$Message.success("新标签绑定成功!");
            } else {
              this.$Message.error(res.msg);
            }
            this.tags();
          });
        } else {
          //修改标签
          let params = {
            templateTagName: this.tagName,
            bgColor: this.checkedColor,
            tagId:this.tag.tagId
          };
          updateTemplateTag(params).then(res => {
            if (res.result === 1) {
              this.showdiv1 = true;
              this.showdiv2 = false;
              this.tags();
            }
          });
        }
      }
    }
  };
</script>
<style scoped lang="less">
  .tagbox {
    .create-tag {
      margin-top: 10px;
      background-color: rgba(9, 30, 66, 0.04);
    }

    .tag-list {
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tag-content {
        cursor: pointer;
        width: 200px;

        .color {
          width: 10px;
          height: 10px;
          margin: 0 5px;
          border-radius: 50%;
          display: inline-block;
        }
      }

      .tag-caozuo {
        .delete-tag {
          width: 30px;
          height: 30px;
        }

        .edit-tag {
          margin-left: 5px;
          width: 30px;
          height: 30px;
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

  .list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .createTag {
    width: 260px;
  }

  .tagcolor {
    margin: 15px auto;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;

    li {
      list-style: none;
      cursor: pointer;

      .circle {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        position: relative;
        line-height: 24px;
        text-align: center;

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
    .confirm {
      height: 70px;
      font-size: 14px;
    }

    .btnBox {
      display: flex;
      padding: 0 10px;
    }
  }
</style>