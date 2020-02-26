<template>
    <div class="div2 clearfix">
        <div class="d2Header">
          <span v-if="isEdit" class="back fl" @click="$emit('returnTag')">
            <Icon type="ios-arrow-back" size="24" style="margin-top:5px;"></Icon>
          </span>
            {{isEdit?'编辑标签':'新建标签'}}
            <span class="close-tag fr" @click="$emit('closeTag')">
            <Icon type="md-close" size="24"></Icon>
          </span>
        </div>
        <Input style="padding:8px 0;" :maxlength='10'  v-model="tagName" placeholder="标签名称" ref="input" />
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
                <!--<Button long v-if="isEdit" @click="$emit('deleteTag')">删除</Button>-->
                <Button class="crtBtn" type="primary" long :disabled="!tagName" @click="finish" :loading="loading">{{isEdit?'完成':'创建'}}</Button>
            </div>
        </div>
    </div>
</template>

<script>
    import {addnewTag, modifyTag, receclyTag} from '@/axios/api'
    import {mapMutations} from 'vuex'
    export default {
        props: ['isEdit', 'tag', 'tagNames'],
        name: "createTag",
        data () {
            return {
                tagName: '',
                colorList: [
                    "#3da8f5",
                    "#75c940",
                    "#2fbdb3",
                    "#797ec9",
                    "#ffaf38",
                    "#ff4f3e"
                ],
                checkedColor: this.tag?this.tag.bgColor:"#3da8f5",
                loading: false,
                projectId: this.$route.params.id
            }
        },
        methods: {
            ...mapMutations('tag', ['addNewTag','changeTag']),
            finish() {
                if (this.isEdit) {
                    this.loading = true;
                    //修改标签
                    let params = {
                        projectId: this.projectId,
                        tagName: this.tagName,
                        bgColor: this.checkedColor
                    };
                    console.log(this.tagName)
                    modifyTag(this.tag.tagId, params).then(res => {
                        console.log(res)
                        if (res.result === 1) {
                            this.loading = false;
                            this.changeTag(res.data)
                            this.$emit('closeTag')
                            this.$Message.success('修改成功');
                        }
                    });
                } else {
                    //创建标签
                    this.loading = true;
                    let params = {
                        projectId: this.projectId,
                        publicType:"任务",
                        tagName: this.tagName,
                        bgColor: this.checkedColor
                    };
                    addnewTag(params).then(res => {
                        if (res.result==1){
                            this.loading = false;
                            this.addNewTag(res.data)
                            this.$emit('closeTag')
                            this.$Message.success('创建成功');
                        } else{
                            this.$Message.error(res.msg)
                       } 
                    })

                }
            }
        },
        watch: {
            tagNames (newName, oldName) {
                if (newName){
                   this. tagName=newName
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .content {
        width: 270px;
        position: absolute;
        border: 1px solid #eeeeee;
        background-color: #fff;
        border-radius: 5px;
        z-index: 999;
    }
    .div2 {
        width: 210px;
        .btnBox {
            display: flex;
            button {
                &:nth-of-type(2) {
                    margin-left: 10px;
                }
            }
        }
        .d2Header {
            border-bottom: 1px solid #eee;
            height: 45px;
            text-align: center;
            line-height: 45px;
            font-size: 14px;
            font-weight: bold;
            position: relative;
            .back {
                position: absolute;
                top: 0;
                left: 0;
                cursor: pointer;
                i {
                    font-size: 28px;
                    margin-top: 4px;
                    line-height: 22px;
                    color: #a6a6a6;
                }
            }
            .close-tag {
                position: absolute;
                top: 0;
                right: 0;
                cursor: pointer;
                i {
                    font-size: 28px;
                    margin-top: 2px;
                    line-height: 22px;
                    color: #a6a6a6;
                }
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
        margin: 15px auto 20px;
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

</style>