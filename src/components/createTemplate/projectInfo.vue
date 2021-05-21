<template>
    <div>

        <div class="df">
            <div class="left-content">
                <section class="template-task-flow flex-vert">
                    <div class="overview-title">任务列表</div>
                    <ul class="overview-content df">
                        <li class="template-task-flow-item"> <span class="item-name">待处理</span> </li>
                        <li class="template-task-flow-item"> <span class="item-name">进行中</span> </li>
                        <li class="template-task-flow-item"> <span class="item-name">已完成</span> </li>
                    </ul>
                </section>
                <section class="template-app-plugin flex-vert">
                    <div class="overview-title">应用</div>
                    <ul class="overview-content df">
                        <li class="template-app-plugin-item">
                            <Icon type="md-clipboard" size="20" />
                            <span class="item-name">任务</span>
                        </li>
                        <li class="template-app-plugin-item">
                            <Icon type="md-folder-open" size="20" />
                            <span class="item-name">文件</span> </li>
                        <li class="template-app-plugin-item">
                            <Icon type="md-copy" size="20" />
                            <span class="item-name">文档</span> </li>
                        <li class="template-app-plugin-item">
                            <Icon type="md-calendar" size="20" />
                            <span class="item-name">任务开始时间</span> </li>
                    </ul>
                </section>
            </div>
            <div class="right-content">
                <div class="creator-content-container flex-fill flex-vert">
                    <p class="intro"> 正在从模板<span class="template-name">测试</span>创建新项目 </p>
                    <div class="item-section">
                        <div class="form-group">
                            <Input v-model="projectName" placeholder="项目名称（必填）" class="project-name form-control" />
                        </div>
                    </div>
                    <div class="btnIcon">
                        <Button type="primary" @click="applyTemplate">完成新建</Button>
                    </div>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
    import {
        applyTemplate
    } from '@/axios/template'
    export default {
        name: '',
        props: ['templateId'],
        data() {
            return {
                projectName: ''

            }
        },
        methods: {
            applyTemplate() {
                if (this.projectName == '') {
                    this.$Message.warning('请填写项目名称')
                } else {
                    applyTemplate({
                        templateId: this.templateId,
                        projectName:this.projectName
                    }).then((res) => {
                        if (res.result == 1) {
                            this.$Message.success('创建成功')
                            this.$emit('success')
                        }
                    });
                }

            }
        }
    }
</script>

<style lang="less" scoped>
    .df {
        display: flex;
    }

    .flex-vert {
        flex-direction: column;
    }

    .flex-fill {
        flex: 1 1 auto;
    }

    .left-content {
        flex: 1;
        justify-content: center;
        border-right: 1px solid #f0f0f0;

        section {
            padding: 0 25px;
            overflow: hidden;
        }

        .overview-title {
            margin-top: 14px;
            color: #8c8c8c;
            margin-bottom: 20px;
            text-align: center;
        }

        .overview-content {
            flex-flow: wrap;
            justify-content: center;
        }

        .template-task-flow {
            justify-content: flex-end;



            .overview-content {



                .template-task-flow-item:not(.taskflow) {
                    margin-right: 16px;
                }

                .template-task-flow-item {
                    height: 30px;
                    max-width: 115px;
                    position: relative;
                    margin-bottom: 20px;
                    border-radius: 2px;
                    box-shadow: 0 0 3px rgba(0, 0, 0, .2);

                    .item-name {
                        display: block;
                        padding: 0 8px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: 30px;
                    }
                }

                .template-task-flow-item:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #1b9aee;
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                }
            }
        }

        .template-app-plugin {
            margin-top: 20px;

            .template-app-plugin-item:not(:last-child) {
                margin-right: 15px;
            }

            .template-app-plugin-item {
                height: 32px;
                padding: 0 8px;
                display: -webkit-inline-flex;
                display: -ms-inline-flexbox;
                display: inline-flex;
                -webkit-align-items: center;
                -ms-flex-align: center;
                align-items: center;
                margin-bottom: 15px;
                border-radius: 3px;
                border: 1px solid #f0f0f0;
                box-shadow: 0 1px 1px rgba(240, 240, 240, .35);

                i {
                    color: #1b9aee;
                }

                .item-name {
                    line-height: 30px;
                    padding-left: 5px;
                }
            }
        }
    }

    .right-content {
        flex: 1;

        .creator-content-container {
            margin: 0 50px;
            justify-content: center;
            overflow: hidden;

            .intro {
                color: #595959;
                padding: 25px 0;

                .template-name {
                    color: #262626;
                    padding: 0 3px;
                }
            }
        }
    }

    .btnIcon {
        margin-top: 50px;
        display: flex;
        justify-content: flex-end;
    }
</style>