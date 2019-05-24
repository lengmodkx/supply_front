<template>
    <div>
        <p class="cansee-header">可见性设置</p>
        <div class="padd">
            <Select v-model="visibility" style="margin-bottom: 15px">
                <Option  value="所有项目成员可见" >所有项目成员可见</Option>
                <Option  value="部分项目成员可见" >部分项目成员可见</Option>
            </Select>
        </div>
        <div class="can-see-con">
            <div class="public" v-if="visibility==='所有项目成员可见'">
                <img src="@/icons/img/all-can-see.png" alt="">
                <h3>公开状态</h3>
                <p>当前状态下项目内所有成员可见</p>
            </div>
            <div class="intimate" v-if="visibility==='部分项目成员可见'">
                <div class="intimate-head">
                    <span>当前可见成员：</span>
                    <Poptip v-model="popVisible" :transfer="true" popper-class="pop">
                        <p class="pop-title"><Icon type="md-add-circle" />添加可见成员</p>
                        <div slot="content" >
                            <div class="pop-content">
                                <div class="padd">
                                    <Input search enter-button placeholder="搜索" />
                                </div>
                                <p class="pop-content-title">可见成员</p>
                                <ul class="people-ul">
                                    <li>
                                        <div>
                                            <img src="" alt="">
                                            <p>aaa</p>
                                        </div>
                                        <Icon type="md-checkmark" />
                                    </li>
                                </ul>
                                <p class="pop-content-title">当前项目成员</p>
                                <ul class="people-ul">
                                    <li>
                                        <div>
                                            <img src="" alt="">
                                            <p>aaa</p>
                                        </div>
                                        <Icon type="md-checkmark" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Poptip>
                </div>
                <ul class="intimate-con">
                    <div class="create-people">
                        <div>
                            <img src="" alt="">
                            <p>lijian</p>
                        </div>
                        <span>拥有者</span>
                    </div>
                    <li>
                        <div>
                            <img src="" alt="">
                            <p>lijian</p>
                        </div>
                        <Icon type="ios-trash-outline" />
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "fileCanSee",
        data () {
            return {
                visibility: '所有项目成员可见',
                popVisible: false,
            }
        }
    }
</script>

<style scoped lang="less">
    .pop{
        z-index: 99999999;
    }
.cansee-header{
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 15px;
    border-bottom: 1px solid #d5d5d5;
    margin-bottom: 20px;
}
.padd{
    width: 100%;
    padding: 0 16px;
}
.can-see-con{
    width: 100%;
    height: 350px;
}
.public{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #a6a6a6;
    img{
        margin-bottom: 20px;
        width: 110px;
    }
    h3{
        margin-bottom: 12px;
        font-size: 18px;
    }
}
.intimate{
    width: 100%;
    height: 100%;
    .intimate-head{
        width: 100%;
        height: 40px;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .pop-title{
            display: flex;
            color: #3da8f5;
            cursor: pointer;
            i{
                font-size: 16px;
                margin-right: 8px;
            }
        }
    }
    .intimate-con{
        width: 100%;
        height: 310px;
        overflow-x: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 6px;
            height: 8px;
            background-color: #e5e5e5;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #cecece;
        }
        .create-people{
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            div{
                display: flex;
                align-items: center;
                img{
                    width: 32px;
                    height: 32px;
                    margin-right: 12px;
                }
            }
            span{
                font-size: 14px;
                color: gray;
            }
        }
        li{
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            &:hover{
                background-color: #f5f5f5;
                i{
                    display: block;
                }
            }
            div{
                display: flex;
                align-items: center;
                img{
                    width: 32px;
                    height: 32px;
                    margin-right: 12px;
                }
            }
            i{
                font-size: 22px;
                cursor: pointer;
                color: gray;
                display: none;
                &:hover{
                    color: #3da8f5;
                }
            }
        }
    }
}
.pop-content{
    height: 368px;
    width: 252px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 15px 0;
    &::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #cecece;
    }
    .pop-content-title{
        margin-top: 15px;
        font-size: 14px;
        color: gray;
        padding: 0 16px;
    }
    .people-ul{
        width: 100%;
        li{
            width: 100%;
            height: 44px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 0 16px;
            &:hover{
                background-color: #f5f5f5;
            }
            div{
                display: flex;
                align-items: center;
                img{
                    width: 32px;
                    height: 32px;
                    margin-right: 12px;
                }
            }
            i{
                font-size: 20px;
                color: #a6a6a6;
            }
        }
    }
}
</style>