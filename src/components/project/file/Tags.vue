<template>
    <div>
        <!-- <div class="tagtitle" v-if="taglist.length==0">
          <Icon type="md-add-circle" size="24" style="color:#2d8cf0;vertical-align:middle;" @click.native="popShow($event)" />
        </div>-->
        <div class="listBox">
            <div class="list" ref="addIcon">
                <Tag
                        v-for="(item,index) in taglist"
                        :key="index"
                        :name="item.tagId"
                        :style="`background-color:${item.bgColor};`"
                        closable
                        @on-close="handleClose"
                >{{ item.tagName}}</Tag>
            </div>

            <Icon
                    type="md-add-circle"
                    size="24"
                    style="color:#2d8cf0;vertical-align:middle;"
                    @click.native="popShow"

                    ref="addIconButton"
            ></Icon>

        </div>


        <div class="content" v-if="Popvisible" :style="{left:offsetLeft}">
            <div class="div1" v-if="showdiv1">
                <!--无任何标签的情况 -->
                <div class="tag_input clearfix">
                    <Input class="search fl" v-model="searchTag" placeholder="搜索标签" autofocus/>
                    <div class="add-icon fl">
                        <Tooltip content="新建标签" placement="top">
                            <Icon
                                    type="md-add-circle"
                                    size="24"
                                    style="color:#2d8cf0;vertical-align:middle;"
                                    @click="addTag"
                            ></Icon>
                        </Tooltip>
                    </div>
                </div>
                <div class="conBox">
                    <div class="noTag" v-if="totalTag.length==0" style="text-align:center;padding-top:8px">
                        <img :src="require('@/assets/images/tag.png')" width="50px">
                        <p style="color:#a6a6a6;">暂无标签</p>
                    </div>
                    <!-- 有默认标签的时候 -->
                    <div class="hasTag" v-if="totalTag.length>0">
                        <div
                                v-for="(tag,index) in totalTag"
                                :key="index"
                                class="clearfix tag-list"
                                @click="chooseTag(tag)"
                        >
                            <i class="color" :style="`background-color:${tag.bgColor}`"></i>
                            <span>{{tag.tagName}}</span>
                            <div class="fr">
                                <svg-icon name="edit" @click.stop="editTag(tag)" class="edit"></svg-icon>
                                <svg-icon name="right" v-if="totalTag.flag" class="right"></svg-icon>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="createTag" v-if="tagAdd">
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
                    </div>-->
                </div>
            </div>
            <!-- 新建 -->
            <div class="div2 clearfix" v-if="showdiv2">
                <div class="d2Header">
          <span class="back fl" @click="showdiv2=false;showdiv1=true;">
            <Icon type="ios-arrow-back" size="24" style="margin-top:5px;"></Icon>
          </span>
                    <span class="headerTitel">{{isEdit?'编辑标签':'新建标签'}}</span>
                    <span
                            class="close fr"
                            @click="Popvisible=false;showdiv1=true;showdiv2=false"
                    >
            <Icon type="md-close" size="24"></Icon>
          </span>
                </div>
                <Input style="padding:8px 8px;"  :maxlength='10' v-model="tagName" placeholder="标签名称" ref="input"/>
                <div class="createTag">
                    <ul class="tagcolor clearfix">
                        <li v-for="(color,i) in colorList" :key="i" @click="checkedColor=color">
                            <div class="circle" :style="`background-color:${color}`">
                <span class="markbox" v-if="color==checkedColor">
                  <Icon type="md-checkmark" class="mark" v-if="color==checkedColor"/>
                </span>
                            </div>
                        </li>
                    </ul>
                    <div class="btnBox">
                        <Button long v-if="isEdit" @click="showdiv2=false;showdiv3=true">删除</Button>
                        <Button
                                class="crtBtn"
                                type="primary"
                                long
                                :disabled="!tagName"
                                @click="finish"
                                :loading="loading"
                        >{{isEdit?'完成':'创建'}}</Button>
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
    </div>
</template>
<script>
    import { mapState, mapMutations } from "vuex";
    import {
        allTags,
        addnewTag,
        modifyTag,
        searchTags,
        delTag,
        removeInfoTag,
        bindingTag,
        addTagBindFile
    } from "../../../axios/api.js";
    export default {
        props: ["taglist", "publicId", "publicType", "projectId"],
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
                loading: false,
                offsetLeft: 0,
                offsetTop: 0,
                tag: null //编辑标签时使用
            };
        },
        watch: {
            searchTag() {
                this.search();
            },
            offsetLeft(newl, oldl) {
                console.log(oldl, newl);
            }
        },
        methods: {
            closeTag(){
                this.Popvisible = false
            },
            search() {
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
                removeInfoTag(id, this.publicId, this.publicType).then(res => {
                    
                    if (res.result === 1) {
                        this.$Message.success(res.msg);
                    }
                });
            },
            editTag(data) {
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

            deleteTag() {
                //删除标签
                this.showdiv3 = false;
                this.showdiv1 = true;
                delTag(this.tag.tagId).then(res => {
                    if (res.result === 1) {
                        let i = this.taglist.indexOf(this.tag);
                        if (i >= 0) {
                            this.taglist.splice(i, 1);
                            this.$nextTick(() => {
                                console.log(">>>>>>>", this.$refs.addIcon.offsetWidth);
                                this.offsetLeft = this.$refs.addIcon.offsetWidth - 30 + "px";
                                console.log(this.offsetLeft);
                            });
                        }
                    }
                });
            },
            reset(flag) {
                //Object.assign(this.$data, this.$options.data());
                this.Popvisible = flag;
            },
            popShow() {
                this.Popvisible = !this.Popvisible;
                if (this.Popvisible) {
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

                console.log(this.$refs.addIcon.offsetWidth)
                if(this.$refs.addIcon.offsetWidth + 45>670){
                    this.offsetLeft=520+"px"
                }else{
                    this.offsetLeft = this.$refs.addIcon.offsetWidth + 70 + "px";
                }

            },
            popHide() {
                setTimeout(_ => {
                    this.reset();
                }, 300);
            },
            chooseTag(tag) {
                bindingTag(tag.tagId, this.publicId, this.publicType).then(res => {
                    if(res.result === 1){
                        this.$Message.success(res.msg)
                    }
                });
            },
            finish() {
                if (this.isEdit) {
                    //修改标签
                    let params = {
                        projectId: this.projectId,
                        tagName: this.tag.tagName,
                        bgColor: this.tag.checkedColor
                    };
                    modifyTag(this.tag.tagId, params).then(res => {
                        if (res.result === 1) {
                            this.showdiv1 = true;
                            this.showdiv2 = false;
                        }
                    });
                } else {
                    //创建标签
                    this.loading = true;
                    let params = {
                        /* projectId: this.projectId,
                         tagName: this.tagName,
                         bgColor: this.checkedColor*/
                        projectId: this.projectId,
                        publicId:this.publicId,
                        publicType:"文件",
                        tagName: this.tagName,
                        bgColor: this.checkedColor
                    };
                    addTagBindFile(params).then(res => {
                        this.loading = false;
                        console.log(res);
                        if(res.result === 1){
                            this.$Message.success("新标签绑定成功!")
                        } else{
                            this.$Message.error("绑定标签失败")
                        }
                    });
                }
            }
        }
    };
</script>
<style scoped lang="less">
    .listBox{
        display: flex;
        flex-wrap: nowrap

    }
    .div1 {
        .tag_input {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eeeeee;
            padding: 8px 8px;
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
                width: 205px;
            }
            .fr {
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
    .list {
        max-width: 630px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
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

            line-height: 34px;
            font-size: 14px;
            font-weight: bold;

            .headerTitel{
                padding-left: 70px;
            }

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
                top:0px !important;
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
    .content {
        width: 270px;
        position: absolute;
        border: 1px solid #eeeeee;
        background-color: #fff;
        border-radius: 5px;
        z-index: 999;
    }
</style>