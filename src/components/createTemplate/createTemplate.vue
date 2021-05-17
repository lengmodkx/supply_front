<template>
  <div>
    <Modal v-model="modal11" fullscreen footer-hide>
      <div slot="header" class="modal-header header60 header-box-shadow" v-if="!ordinary">
        <h3>创建企业模板</h3>
      </div>
      <div slot="header" class="modal-header" v-else>
        <div class="top-nav df jsb ac">
          <div class="template-properties df">
            <div class="template-property template-name">
              <span class="key">模板名称：</span>
              <span class="value">空白项目</span>
            </div>
            <div class="template-property template-description">
              <span class="key">描述：</span>
              <span class="value">未添加 </span>
            </div>
            <div class="template-property template-cover">
              <span class="key">封面：</span>
              <span class="value">已添加</span>
            </div>
            <a class="edit-template" @click="modal2 = true">
              <Icon type="md-create" />
              <span>编辑</span>
            </a>
          </div>
          <Button type="primary" class="saveBtn">保存模板</Button>
        </div>
        <div class="nav-header df ac">
          <div class="app-tab" @click="clickNavItem(index)" :class="{'active':checkCommentIndex==index}"
            v-for="(item,index) in navList">
            <span class="hinted">{{item}}</span>
          </div>
        </div>
      </div>
      <div class="modal-content" v-if="!ordinary">
        <h2 class="template-tit">创建企业模板</h2>
        <div class="template-tip">你可以通过以下方式创建企业共享的项目模板</div>
        <div class="class-content df jsb">
          <div class="class-item" @click="commonTemplate">
            <div class="img-content">
              <img src="https://g.alicdn.com/teambition/web/teambition/images/template-simple.2d7759aa.png" />
            </div>
            <div class="text-content">
              <h4 class="template-name">普通模板</h4>
              <div>从空白普通项目开始创建模板</div>
            </div>
          </div>
          <div class="class-item">
            <div class="img-content">
              <img src="https://g.alicdn.com/teambition/web/teambition/images/template-taskflow.d60d2f5a.png" />
            </div>
            <div class="text-content">
              <h4 class="template-name">工作流模板</h4>
              <div>从空白工作流项目开始创建模板</div>
            </div>
          </div>
          <div class="class-item">
            <div class="img-content">
              <img src="https://g.alicdn.com/teambition/web/teambition/images/template-copy.f2b3d768.png" />
            </div>
            <div class="text-content">
              <h4 class="template-name">复制现有项目</h4>
              <div>包含项目内任务、分组、列表、文件等</div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-content2 task" v-else>

        <draggable class="column-main dragscroll" v-model="allTask" :options="{
                    handle: '.handle',
                    dragClass: 'boxDragClass',
                    fallbackClass: 'boxFallbackClass',
                    forceFallback: true,
                    delay: 1,
                    preventDragY: true,
                }" @end="dragBox">
          <div class="column" :key="k" v-for="(i, k) in allTask">
            <div style="max-height: calc(100vh - 145px); position: relative" :data-index="k">
              <div class="add-Box" v-if="addBtns">
                <Button type="info" long icon="md-add" @click.stop="
                            addCurTask(i.parentId, i.relationId, i.taskList, k)
                        "></Button>
              </div>
              <div class="title handle">
                <span>{{ i.relationName }} ·
                  {{ i.taskList ? i.taskList.length : "0" }}</span>
                <TaskMenu class="fr" :data="i"></TaskMenu><!-- 点击三角形出来的任务列表菜单组件 -->
              </div>
              <div class="scrum-stage-tasks" :ref="`scrollbox${i.relationId}`" :style="
                        i.taskList.length * 60 + 42 > wHeight
                            ? 'overflow-y: scroll'
                            : ''
                        ">
                <draggable :list="i.taskList" :options="{
                            group: 'uncheckedTask',
                            forceFallback: true,
                            delay: 10,
                            touchStartThreshold: 10,
                            dragClass: 'dragClass',
                            fallbackClass: 'fallbackClass',
                        }" class="ul" @end="dragList">
                  <div class="li" v-for="(a, b) in i.taskList" v-if="!a.taskStatus" :key="b" :data-id="a.taskId"
                    @click.stop="initTask(a.taskId)">
                    <div class="task-mod" :class="renderTaskStatu(a.priority)">
                      <div class="teskCheck" @click.stop="
                                changeStatus(!a.taskStatus, k, b, a.taskId)
                                "></div>
                      <div class="check">
                        <div @click.stop class="checkbox-wrap">
                          <Checkbox size="small" v-model="a.taskStatus"></Checkbox>
                        </div>
                        <div class="cont">{{ a.taskName }}</div>
                        <Tooltip :content="a.executorName" placement="top" transfer>
                          <img :src="a.executorImg" class="ava" v-if="a.executorImg" alt="" />
                        </Tooltip>
                      </div>
                      <!-- 小图标 -->
                      <div class="task-info-wrapper">
                        <div class="task-infos">
                          <span class="label time-label" v-if="a.endTime">
                            {{
                                    $moment(a.endTime).calendar(null, {
                                        sameDay: "[今天]LT",
                                        nextDay: "[明天]LT",
                                        lastDay: "[昨天]LT",
                                        lastWeek: (now) => {
                                        const startDate = $moment()
                                            .week($moment().week())
                                            .startOf("week")
                                            .valueOf();
                                        return a.endTime <= startDate
                                            ? "[上]dddLT"
                                            : "dddLT";
                                        },
                                        nextWeek: (now) => {
                                        const endDate = $moment()
                                            .week($moment().week())
                                            .endOf("week")
                                            .valueOf();
                                        return a.endTime >= endDate
                                            ? "[下]dddLT"
                                            : "dddLT";
                                        },
                                        sameElse: "Y年M月D日LT",
                                    })
                                    }}
                          </span>
                          <span class="label repeat-label" v-if="a.repeat !== '不重复'">{{ a.repeat }}</span>
                          <!--<span class="label">-->
                          <!--<Icon class="icon" type="ios-alarm-outline" size="16">11111</Icon>-->
                          <!--</span>-->
                          <span class="label" v-if="a.remarks" style="margin-top: -5px">
                            <Icon type="ios-create-outline" size="18" />
                          </span>
                          <span class="label" style="margin-bottom: 3px" v-if="a.childCount > 0">
                            <Icon type="ios-list" size="22" />
                            <span class="sonTask"
                              style="line-height: 10px; padding-left: 5px">{{ a.completeCount }}/{{ a.childCount }}</span>
                          </span>
                          <span class="label" v-if="a.bindCount > 0" style="margin-bottom: 3px">
                            <Icon type="ios-link" size="14" />
                          </span>
                          <span class="label" v-if="a.fileCount > 0" style="margin-bottom: 2px">
                            <Icon type="md-paper" size="16" />
                          </span>
                          <div class="tag-box" v-if="a.tagList" style="margin-bottom: 5px">
                            <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId">
                              <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="show-sub-task" @click.stop="showSubTask(a.taskId, a)" v-if="a.childCount > 0">
                          <Icon type="ios-arrow-down" size="18" v-if="!a.visible" />
                          <Icon type="ios-arrow-up" size="18" v-else />
                        </div>
                      </div>
                    </div>

                    <div class="liinner" v-for="(task, b) in a.taskList" v-if="a.visible" :key="task.taskId"
                      :data-id="task.taskId" @click.stop="initTask(task.taskId)">
                      <div class="task-mod" :class="renderTaskStatu(task.priority)">
                        <div class="teskCheck" @click.stop="changeSubStatus(task)"></div>
                        <div class="check">
                          <div @click.stop class="checkbox-wrap">
                            <Checkbox size="small" v-model="task.taskStatus"></Checkbox>
                          </div>
                          <div class="cont">{{ task.taskName }}</div>
                          <Tooltip :content="task.executorName" placement="top" transfer>
                            <img :src="task.executorImg" class="ava" v-if="task.executorImg" alt="" />
                          </Tooltip>
                        </div>
                        <!-- 小图标 -->
                        <div class="task-info-wrapper">
                          <div class="task-infos">
                            <span class="label time-label" v-if="task.endTime">
                              {{
                                        $moment(task.endTime).calendar(null, {
                                        sameDay: "[今天]LT",
                                        nextDay: "[明天]LT",
                                        lastDay: "[昨天]LT",
                                        lastWeek: (now) => {
                                            const startDate = $moment()
                                            .week($moment().week())
                                            .startOf("week")
                                            .valueOf();
                                            return task.endTime <= startDate
                                            ? "[上]dddLT"
                                            : "dddLT";
                                        },
                                        nextWeek: (now) => {
                                            const endDate = $moment()
                                            .week($moment().week())
                                            .endOf("week")
                                            .valueOf();
                                            return task.endTime >= endDate
                                            ? "[下]dddLT"
                                            : "dddLT";
                                        },
                                        sameElse: "Y年M月D日LT",
                                        })
                                    }}
                            </span>
                            <span class="label repeat-label" v-if="task.repeat !== '不重复'">{{ task.repeat }}</span>
                            <!--<span class="label">-->
                            <!--<Icon class="icon" type="ios-alarm-outline" size="16">11111</Icon>-->
                            <!--</span>-->
                            <span class="label" v-if="task.remarks" style="margin-top: -5px">
                              <Icon type="ios-create-outline" size="18" />
                            </span>
                            <span class="label" style="margin-bottom: 3px" v-if="task.childCount > 0">
                              <Icon type="ios-list" size="22" />
                              <span class="sonTask" style="line-height: 10px; padding-left: 5px">{{ task.completeCount }}/{{
                                        task.childCount
                                        }}</span>
                            </span>
                            <span class="label" v-if="task.bindCount > 0" style="margin-bottom: 3px">
                              <Icon type="ios-link" size="14" />
                            </span>
                            <span class="label" v-if="task.fileCount > 0" style="margin-bottom: 2px">
                              <Icon type="md-paper" size="16" />
                            </span>
                            <div class="tag-box" v-if="task.tagList" style="margin-bottom: 5px">
                              <div class="tag-list" v-for="tag in task.tagList" :key="tag.tagId">
                                <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </draggable>

                <!--已完成任务区域 分成上下两段循环，让已经勾选的不能拖拽上去，只能拖到下面的位置并一直在下面 -->
                <draggable :list="i.taskList" :options="{ group: 'checkedTask', delay: 10 }" class="ul" @end="dragList">
                  <div class="li done" v-if="a.taskStatus" v-for="(a, b) in i.taskList" :key="b" :data-id="a.taskId"
                    @click.stop="initTask(a.taskId)">
                    <div class="task-mod" :class="renderTaskStatu(a.priority)">
                      <div class="teskCheck" @click.stop="
                                changeStatus(!a.taskStatus, k, b, a.taskId)
                                "></div>
                      <div class="check">
                        <div class="checkbox-wrap" @click.stop>
                          <Checkbox size="small" v-model="a.taskStatus"></Checkbox>
                        </div>
                        <div class="cont">{{ a.taskName }}</div>
                        <Tooltip :content="a.executorName" placement="top" transfer>
                          <img :src="a.executorImg" class="ava" v-if="a.executorImg != null" alt="" />
                        </Tooltip>
                      </div>
                      <!-- 小图标 -->
                      <div class="task-info-wrapper">
                        <div class="task-infos">
                          <span class="label time-label" v-if="a.endTime">
                            {{
                                    $moment(a.endTime).calendar(null, {
                                        sameDay: "[今天]LT",
                                        nextDay: "[明天]LT",
                                        lastDay: "[昨天]LT",
                                        lastWeek: (now) => {
                                        const startDate = $moment()
                                            .week($moment().week())
                                            .startOf("week")
                                            .valueOf();
                                        return a.endTime <= startDate
                                            ? "[上]dddLT"
                                            : "dddLT";
                                        },
                                        nextWeek: (now) => {
                                        const endDate = $moment()
                                            .week($moment().week())
                                            .endOf("week")
                                            .valueOf();
                                        return a.endTime >= endDate
                                            ? "[下]dddLT"
                                            : "dddLT";
                                        },
                                        sameElse: "Y年M月D日LT",
                                    })
                                    }}截止</span>
                          <span class="label repeat-label" v-if="a.repeat !== '不重复'">{{ a.repeat }}</span>
                          <!--<span class="label">-->
                          <!--<Icon class="icon" type="ios-alarm-outline" size="16"></Icon>-->
                          <!--</span>-->
                          <span class="label" v-if="a.remarks" style="margin-top: -5px">
                            <Icon type="ios-create-outline" size="18" />
                          </span>
                          <span class="label" style="margin-bottom: 3px" v-if="a.childCount > 0">
                            <Icon type="ios-list" size="22" />
                            <span class="sonTask"
                              style="line-height: 10px; padding-left: 5px">{{ a.completeCount }}/{{ a.childCount }}</span>
                          </span>
                          <span class="label" v-if="a.bindCount > 0" style="margin-bottom: 3px">
                            <Icon type="ios-link" size="14" />
                          </span>
                          <span class="label" v-if="a.fileCount > 0" style="margin-bottom: 2px">
                            <Icon type="md-paper" size="16" />
                          </span>
                          <div class="tag-box" v-if="a.tagList">
                            <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId">
                              <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="show-sub-task" @click.stop="showSubTask(a.taskId, a)" v-if="a.childCount > 0">
                          <Icon type="ios-arrow-down" size="18" v-if="!a.visible" />
                          <Icon type="ios-arrow-up" size="18" v-else />
                        </div>
                      </div>
                    </div>
                    <div class="liinner" v-for="(task, b) in a.taskList" v-if="a.visible" :key="task.taskId"
                      :data-id="task.taskId" @click.stop="initTask(task.taskId)">
                      <div class="task-mod" :class="renderTaskStatu(task.priority)">
                        <div class="teskCheck" @click.stop="changeSubStatus(task)"></div>
                        <div class="check">
                          <div @click.stop class="checkbox-wrap">
                            <Checkbox size="small" v-model="task.taskStatus"></Checkbox>
                          </div>
                          <div class="cont">{{ task.taskName }}</div>
                          <Tooltip :content="task.executorName" placement="top" transfer>
                            <img :src="task.executorImg" class="ava" v-if="task.executorImg" alt="" />
                          </Tooltip>
                        </div>
                        <!-- 小图标 -->
                        <div class="task-info-wrapper">
                          <div class="task-infos">
                            <span class="label time-label" v-if="task.endTime">
                              {{
                                        $moment(task.endTime).calendar(null, {
                                        sameDay: "[今天]LT",
                                        nextDay: "[明天]LT",
                                        lastDay: "[昨天]LT",
                                        lastWeek: (now) => {
                                            const startDate = $moment()
                                            .week($moment().week())
                                            .startOf("week")
                                            .valueOf();
                                            return task.endTime <= startDate
                                            ? "[上]dddLT"
                                            : "dddLT";
                                        },
                                        nextWeek: (now) => {
                                            const endDate = $moment()
                                            .week($moment().week())
                                            .endOf("week")
                                            .valueOf();
                                            return task.endTime >= endDate
                                            ? "[下]dddLT"
                                            : "dddLT";
                                        },
                                        sameElse: "Y年M月D日LT",
                                        })
                                    }}
                            </span>
                            <span class="label repeat-label" v-if="task.repeat !== '不重复'">{{ task.repeat }}</span>
                            <!--<span class="label">-->
                            <!--<Icon class="icon" type="ios-alarm-outline" size="16">11111</Icon>-->
                            <!--</span>-->
                            <span class="label" v-if="task.remarks" style="margin-top: -5px">
                              <Icon type="ios-create-outline" size="18" />
                            </span>
                            <span class="label" style="margin-bottom: 3px" v-if="task.childCount > 0">
                              <Icon type="ios-list" size="22" />
                              <span class="sonTask" style="line-height: 10px; padding-left: 5px">{{ task.completeCount }}/{{
                                        task.childCount
                                        }}</span>
                            </span>
                            <span class="label" v-if="task.bindCount > 0" style="margin-bottom: 3px">
                              <Icon type="ios-link" size="14" />
                            </span>
                            <span class="label" v-if="task.fileCount > 0" style="margin-bottom: 2px">
                              <Icon type="md-paper" size="16" />
                            </span>
                            <div class="tag-box" v-if="task.tagList" style="margin-bottom: 5px">
                              <div class="tag-list" v-for="tag in task.tagList" :key="tag.tagId">
                                <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </draggable>
                <div class="add" style="height: 45px" v-if="addBtns"></div>
              </div>
            </div>
          </div>
          <!-- 新建任务列表 -->
          <draggable class="column addList" :options="{ sort: false }" v-if="addBtns">
            <div class="title" v-if="showAdd" @click="showAdd = false">
              <span>
                <Icon type="md-add"></Icon>新建任务列表...
              </span>
              <span></span>
            </div>
            <div class="newTask" v-if="!showAdd">
              <Input v-model="newProTitle" placeholder="新建任务列表..." style="width: 268px" />
              <div style="margin-top: 12px; text-align: right">
                <Button @click="
                            showAdd = true;
                            newProTitle = '';
                        ">取消</Button>
                <Button style="margin-left: 10px" :loading="isCreateTask" type="primary" @click="saveNewPro"
                  :disabled="newProTitle == ''">保存</Button>
              </div>
            </div>
          </draggable>
        </draggable>
      </div>
    </Modal>
    <Modal v-model="modal2" width="570" title="模板基本信息" class-name="modal-second">
      <div slot="header" style="text-align: center; font-size: 16px; color: #262626" class="header60">
        <span>模板基本信息</span>
      </div>
      <div>
        <div class="div1-box">
          <div class="div1-title">模板封面</div>
          <div class="df">
            <div class="cover">
              <img src="https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/project/bj.png" alt v-if="pic_show" />
              <img :src="imageUrl" alt v-if="pic_hide" accept="image/*" />
            </div>
            <div class="upload">
              <div>
                <Upload :show-upload-list="false" :max-size="2048" :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload" :action="host" :data="uploadData" :on-success="handleSuccess">
                  <Button type="primary" ghost>上传新封面</Button>
                </Upload>
              </div>
            </div>
          </div>
          <div class="project-setting-section-horizontal">
            <div class="project-setting-section edit-name">
              <div class="section-grid" data-fields="name">
                <label for="name"> 项目名称 </label>
                <Input v-model="projectName" placeholder="空白项目" maxlength="30" minlength="1" autofocus="autofocus"
                  class="template-name" />
              </div>
            </div>
            <div class="project-setting-section">
              <!-- <div class="section-grid" data-fields="name"> <label for="name"> 模板权限设置 </label>
                                <div id="project-template-permission-setting">
                                   
                                </div>
                            </div> -->
            </div>
          </div>
          <div class="project-setting-section edit-description">
            <div class="section-grid" data-fields="description">
              <label for="description"> 项目简介 </label>
              <Input v-model="introduction" type="textarea" :rows="3" placeholder="介绍一下这个项目"
                class="template-description" name="description" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary">保存更改</Button>
      </div>
    </Modal>
    <Modal v-model="shwoCreate"  :width="440" :mask-closable="false" footer-hide>
      <div slot="header" style="font-size: 16px; color: #262626" class="header60">
        <span>创建任务</span>
      </div>
      <creat-list v-if="shwoCreate" :taskMenuId="taskMenuId" :taskGroupId="taskGroupId" @close="shwoCreate = false">
      </creat-list>
    </Modal>
  </div>
</template>

<script>
  import {
    oss
  } from "@/axios/ossweb";
  import draggable from "vuedraggable";
  import TaskMenu from "./TaskMenu.vue";
  import creatList from "./creatList.vue"
  export default {
    components: {
      draggable,
      TaskMenu,
      creatList
    },
    data() {
      return {
        navList: ['任务', '文件'],
        projectName: "空白项目",
        introduction: "",
        modal11: true,
        modal2: false,
        uploadData: {},
        host: "",
        dirName: "",
        pic_show: true,
        pic_hide: false,
        imageUrl: "",
        project: [],
        ordinary: false,
        allTask: [{
            relationName: "待处理",
            taskList: []
          },
          {
            relationName: "进行中",
            taskList: []
          },
          {
            relationName: "已完成",
            taskList: []
          },
        ],
        currentEditId: "",
        taskMenuId: null,
        shwoCreate: false,
        addBtns: true,
        showAdd: true,
        newProTitle: "",
        isCreateTask: false,
        wHeight: window.outerHeight - 261,
        checkCommentIndex: 0,
        taskGroupId: null,

      };
    },
    mounted() {},
    methods: {
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "超过文件大小限制",
          desc: "文件  " + file.name + " 过大, 超过2M.",
        });
      },
      handleBeforeUpload(file) {
        let dir = "";
        dir = this.dirName + this.$moment().format("YYYY-MM-DD") + "/";
        return oss(dir, file.name).then((res) => {
          // this.host = res.host;
          // this.uploadData = res;
          // this.name = res.host + '/' + res.key
          // this.project.projectCover = res.key;
        });
      },
      handleSuccess() {
        this.pic_show = false;
        this.pic_hide = true;
        this.imageUrl = this.name;
      },
      commonTemplate() {
        this.ordinary = true;
      },
      addCurTask(groupId, id, taskList, index) {
        this.currentEditId = id;
        this.taskMenuId = id;
        this.shwoCreate = true;
      },
      dragBox(evt) {},
      dragList() {},
      saveNewPro() {
        this.isCreateTask = true;
        //这里发请求，字段有：项目id,任务分组的id,新建任务的title
        // addnewTask(this.projectId, this.taskGroupId, this.newProTitle).then((res) => {
        //     if (res.result == 1) {
        //         this.newProTitle = "";
        //         this.showAdd = true;
        //         this.init(this.projectId);
        //         this.isCreateTask = false;
        //     }
        // });
      },
      clickNavItem(index) {
        this.checkCommentIndex = index
      }
    },
  };
</script>

<style lang="less" scoped>
  @import "../project/pages/index/index.less";

  a {
    color: #595959;
    cursor: pointer;
  }

  .df {
    display: flex;
  }

  .jsb {
    justify-content: space-between;
  }

  .ac {
    align-items: center;
  }

  /deep/.ivu-modal-header {
    height: 60px;
    padding: 0;
    background: #ffffff;
  }

  /deep/.ivu-modal-close {
    top: 15px;
  }

  .modal-header {
    height: 100%;

    h3 {
      font-size: 14px;
      font-weight: 700;
      color: #383838;
    }

    .template-property {
      margin-right: 28px;
    }
  }

  .header60 {
    line-height: 60px;
    padding-left: 16px;
  }

  .header-box-shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }

  .top-nav {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    line-height: 60px;
    padding-left: 16px;

    .saveBtn {
      margin-right: 50px;
    }
  }

  .nav-header {
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #e5e5e5;
    padding-left: 16px;
    position: relative;
    z-index: 51;

    .app-tab {
      margin: 0 16px;
      height: 100%;
      cursor: pointer;

      .hinted {
        color: #8c8c8c;
      }

      &:hover {
        border-bottom: 2px solid #1b9aee;

        .hinted {
          color: #262626;
        }
      }
    }

    .active {
      border-bottom: 2px solid #1b9aee;

      .hinted {
        color: #262626;
      }
    }
  }

  /deep/.ivu-modal-fullscreen .ivu-modal-body {
    top: 112px;
  }

  .modal-content {
    width: 881px;
    margin: 0 auto;

    .template-tit {
      font-size: 28px;
      font-weight: 500;
      margin: 0 0 4px;
      line-height: 40px;
      color: #262626;
    }

    .template-tip {
      font-size: 18px;
      color: grey;
      line-height: 25px;
      margin-bottom: 48px;
    }

    .class-content {
      .class-item {
        width: 283px;
        height: 223px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        transition: box-shadow 0.3s;
        padding: 18px 20px;
        cursor: pointer;

        .img-content {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 126px;
          margin-bottom: 12px;

          img {
            width: 83px;
          }
        }

        .text-content {
          color: grey;

          .template-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 0 4px;
            font-size: 16px;
            color: #383838;
            line-height: 22px;
            font-weight: 500;
          }
        }

        &:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }

  .div1-box {
    color: #262626;

    .div1-title {
      margin-bottom: 12px;
    }

    .inputContent {
      width: 49%;

      .ivu-date-picker {
        width: 100%;
      }
    }

    .saveid-btn {
      margin-left: 8px;
    }
  }

  .cover {
    border-radius: 4px;
    width: 200px;
    height: 100px;

    img {
      display: block;
      border-radius: 4px;
      width: 200px;
      height: 100px;
    }
  }

  .upload {
    position: relative;
    margin-left: 49px;

    input {
      display: block;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .upLoadButton {
      width: 150px;
      height: 40px;
      padding: 6px 0;
      font-size: 14px;
      text-align: center;
      color: #ffffff;
      background: #2db7f5;
    }

    .tips {
      font-size: 12px;
      color: #999999;
      margin-top: 3px;
    }
  }

  .project-setting-section-horizontal {
    line-height: 20px;
    color: #262626;
    font-size: 14px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .project-setting-section {
      flex: 1;
      margin-top: 24px;
      flex-direction: column;

      .section-grid {
        flex: 1 1 auto;
        position: relative;

        label {
          display: inline-block;
          max-width: 100%;
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }

  .project-setting-section {
    display: flex;
    margin-top: 24px;
    flex-direction: column;

    .section-grid {
      flex: 1 1 auto;
      position: relative;

      label {
        display: inline-block;
        max-width: 100%;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }

  .task {
    margin-top: 0;
  }

  .modal-content2 {
    //   padding-top: 50px;
  }

  .add-Box {
    position: absolute;
    bottom: 0px;
    left: 2.5%;
    width: 93%;
    min-height: 32px;
    padding-bottom: 10px;
    z-index: 999;
    background: #ececec;
  }

  .add-task-box {
    width: 272px;
    height: 125px;
    background-color: white;
    margin: 8px;
    padding: 8px;

    textarea {
      width: 100%;
      min-height: 60px;
      border: 1px solid #d2d2d2;
      padding: 10px;
      border-radius: 3px;
    }

    .add-task-btn {
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      margin-top: 10px;
    }
  }

  .group-progress {
    width: 278px;
    height: 8px;
    border-radius: 8px;
    display: flex;
    margin-left: 10px;
    background-color: #e5e5e5;

    /deep/ .ivu-tooltip-rel {
      display: block;
    }

    span {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      background-color: gray;
      padding: 5px 10px;
      color: white;
      display: none;
      width: 80px;

      &::after {
        content: "";
        border-top: solid 7px gray;
        border-left: solid 7px #00800000;
        border-right: solid 7px #00800000;
        border-bottom: solid 0px #00800000;
        position: absolute;
        left: 40%;
        top: 100%;
      }
    }

    .p1 {
      background-color: #75c940;
      height: 8px;
      position: relative;

      &:hover {
        span {
          display: block;
        }
      }
    }

    .p2 {
      background-color: #3da8f5;
      height: 8px;
      position: relative;

      &:hover {
        span {
          display: block;
        }
      }
    }

    .p3 {
      background-color: #ff4f3e;
      height: 8px;
      position: relative;

      &:hover {
        span {
          display: block;
        }
      }
    }
  }

  .group-name {
    margin-left: 10px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;

    .group-icon {
      margin-right: 15px;

      i {
        padding-left: 10px;
      }
    }
  }

  .groupActive {
    background-color: #f5f5f5;
  }

  .group-li {
    height: 45px;
    padding-top: 5px;
    cursor: pointer;
  }

  .group-name-input {
    margin-bottom: 10px;
  }

  .show-sub-task {
    position: absolute;
    bottom: 5px;
    right: 5px;
    cursor: pointer;
  }
</style>