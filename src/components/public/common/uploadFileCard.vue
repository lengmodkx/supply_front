<template>
    <div class="upload-card" v-if="showCard&&showcard" :class="{ minimize: sizeType == 'min' }">
        <div class="card">
            <div class="card-header">
                <p class="card-title"><span>{{title}}</span></p>
                <a class="maximize-creator icon" @click="zoomCard('max')" v-if="sizeType == 'min'">
                    <Icon type="md-expand" size="18" /></a>
                <a class="minimize-creator icon" @click="zoomCard('min')" v-else>
                    <Icon type="md-contract" size="18" /></a>
                <a class="close-creator icon" @click="closeUpload">
                    <Icon type="md-close" size="18" /></a>
            </div>
            <ul class="work-set thin-scroll">
                <li class="uploader-item work creating card" v-for="item in uploadList">
                    <div class="uploader-wrapper flex-horiz df">
                        <div class="uploader-content flex-fill">
                            <div class="file-item">
                                <header class="file-item-icon flex-static">
                                    <img src="../../../assets/images/wjj.png" alt="" />
                                    <!-- <suffix v-else class="fileThumbnail-box" :file="row"></suffix> -->
                                </header>
                                <div style="width: 100%; display:flex;justify-content: center;flex-direction: column;">
                                  <section class="file-item-content flex-fill flex-vcenter with-collection-name">
                                    <p class="elastic-title">
                                        <span>{{ item.name }}</span>
                                    </p>
                                    <div class="file-info flex-static">
                                        <!-- <span class="collection">{{ projectName }}</span> -->
                                        <span class="file-size">{{ "("+ renderSize(item.size)+ ")"}}</span>
                                    </div>
                                  </section>
                                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info :stroke-width="5"></Progress>
                                </div>
                            </div>
                        </div>
                        <div class="uploader-handlers flex-static flex-vcenter">
                            <a class="icon icon-tick">
                                <Icon type="md-checkmark" v-if="item.status === 'finished'" />
                            </a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import suffix from '@/components/project/newFile/suffixCom.vue'

import { mapState } from "vuex";

export default {
    components: {
        suffix
    },
    props:["uploadList"],
    data() {
        return {
            sizeType: 'max',
            fileSuccess: true,
            title: '等待上传..',
            showcard:true
        };
    },
    watch:{
        uploadList:{
          handler(val, oldVal){
            console.log(val);
            var newVal = val.filter(item=>item.status!='finished');

            if(newVal){
                this.title = "正在上传"+ newVal.length +"/"+this.uploadList.length
            }

            var finished = val.filter(item=>item.status=='finished');
            if(finished.length == this.uploadList.length){
                this.title = "上传完成"
                this.sizeType = 'min';
            }
          },
         deep:true //true 深度监听
        }
    },
    
    computed: {
        ...mapState("project", ["projectName"]),
        showCard:{
            get(){
                this.showcard = true;
                this.sizeType = 'max';
                return this.uploadList.length > 0;    
            },
            set(v){
                this.showcard = false;
            }
        }
    },
    methods: {
        zoomCard(type) {
            this.sizeType = type
        },
        closeUpload(){
            this.showCard = false;
            this.$emit("close")
        }
    }
};
</script>

<style lang="less" scoped>
    .upload-card {
        font-size: 14px;
        color: #262626;
        line-height: 20px;
        box-sizing: border-box;
        position: fixed;
        width: 480px;
        bottom: 16px;
        right: 40px;
        z-index: 9999;
        box-shadow: 0 7px 21px rgba(0, 0, 0, 0.1);
        transition: bottom 218ms ease;
        display: block;
        
        .card {
            font-size: 14px;
            color: #262626;
            line-height: 20px;
            box-sizing: border-box;
            border: 0;
            background-color: #fff;
            border-radius: 2px;
            box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.0470588);
            position: relative;
        }
    }

    .minimize {
        bottom: -240px;
    }

    .card-header {
        color: #262626;
        box-sizing: border-box;
        font-size: 20px;
        line-height: 30px;
        position: relative;
        margin-left: 0px;
        padding: 10px 20px;
        border-bottom: 1px solid #e1e1e1;

        .card-title {
            color: #262626;
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            line-height: 30px;
            max-width: 100%;
            padding-right: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
        }

        .icon {
            color: #8c8c8c;
            transition: color 218ms ease;
        }

        .maximize-creator,
        .minimize-creator {
            position: absolute;
            top: 10px;
            right: 55px;
            font-size: 14px;

            :hover {
                color: #1b9aee;
            }
        }

        .close-creator {
            font-size: 14px;
            right: 20px;
            position: absolute;
            top: 10px;

            :hover {
                color: #1b9aee;
            }
        }
    }

    .work-set {
        position: relative;
        padding: 12px 12px 0px;
        background-color: #f7f7f7;
        height: 240px;
        overflow-y: auto;

        .work {
            position: relative;
        }

        .creating {
            background: #eee;
            width: 100%;
            float: left;
            box-shadow: none;
            margin-bottom: 8px;
            font-size: 14px;
            overflow: hidden;
        }

        .creating:nth-child(odd) {
            margin-right: 16px;
        }

        .uploader-item {
            .uploader-wrapper {
                flex: 1;
                justify-content: space-between;
                padding: 8px;

                .uploader-content {
                    position: relative;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    .file-item {
                        display: flex;
                        .file-item-icon {
                            height: 32px;
                            margin-right: 8px;

                            img {
                                width: 32px;
                                height: 32px;
                            }
                        }

                        .file-item-content {
                            display: flex;
                            min-width: 0;
                            justify-content: space-between;

                            .with-collection-name {
                                padding: 4px 0;
                                line-height: 16px;
                            }

                            .elastic-title {
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                min-width: 0;
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                                width: 100px;
                            }

                            .file-info {
                                display: flex;
                                align-items: center;
                                max-width: 240px;
                                margin-left: 16px;
                                color: #595959;
                                font-size: 12px;

                                .collection {
                                    flex: auto;
                                    text-align: right;
                                    font-size: 12px;
                                    color: #8c8c8c;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    cursor: pointer;
                                }

                                .file-size {
                                    color: #8c8c8c;
                                    margin-left: 3px;
                                }
                            }
                        }


                    }
                }
            }

            .uploader-handlers {
                display: flex;
                justify-content: flex-end;
                width: 64px;

                .icon-tick {
                    color: #1b9aee;
                    cursor: auto;
                }
            }
        }
    }

    .thin-scroll::-webkit-scrollbar {
        width: 7px;
    }

    .thin-scroll::-webkit-scrollbar-thumb {
        background-color: #8c8c8c;
        border-left: 2px solid transparent;
    }

    .thin-scroll::-webkit-scrollbar-track {
        background-color: #e5e5e5;
        border-left: 2px solid transparent;
    }

    .flex-horiz {
        flex-direction: row;
    }

    .flex-vcenter {
        align-items: center;
    }

    .flex-fill {

        flex: 1 1 auto;
    }

    .flex-static {
        flex-shrink: 0;
    }

    .df {
        display: flex;
    }
</style>