<template>
    <div class="upload-card" v-if="showCard" :class="{ minimize: sizeType == 'min' }">
        <div class="card">
            <div class="card-header">
                <p class="card-title"><span>{{title}}</span></p>
                <a class="maximize-creator icon" @click="zoomCard('max')" v-if="sizeType == 'min'">
                    <Icon type="md-expand" size="18" /></a>
                <a class="minimize-creator icon" @click="zoomCard('min')" v-else>
                    <Icon type="md-contract" size="18" /></a>
                <a class="close-creator icon" @click="showCard=false">
                    <Icon type="md-close" size="18" /></a>
            </div>
            <ul class="work-set thin-scroll">
                <li class="uploader-item work creating card" v-for="item in 5">
                    <div class="uploader-wrapper flex-horiz df">
                        <div class="uploader-content flex-fill">
                            <div class="file-item">
                                <header class="file-item-icon flex-static">
                                    <img src="../../../assets/images/wjj.png" alt="" />
                                    <!-- <suffix v-else class="fileThumbnail-box" :file="row"></suffix> -->
                                </header>
                                <section class="file-item-content flex-fill flex-vcenter with-collection-name">
                                    <p class="elastic-title">
                                        <span>iview-admin-master.zip</span>
                                    </p>
                                    <div class="file-info flex-static">
                                        <span class="collection">Teambition 新手引导</span>
                                        <span class="file-size">(3.6MB)</span>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div class="uploader-handlers flex-static flex-vcenter">
                            <a class="icon icon-tick">
                                <Icon type="md-checkmark" v-if="fileSuccess" />
                                <Icon type="md-close" v-else />
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

    export default {
        components: {
            suffix
        },
        data() {
            return {
                sizeType: 'max',
                showCard: true,
                fileSuccess: true,
                title: '上传完成'
            };
        },
        methods: {
            zoomCard(type) {
                this.sizeType = type
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
        z-index: 2333;
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
                                white-space: pre;
                                min-width: 0;
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