<template>
  <div>
    <div v-if="task == null" style="width: 100%;height: 100%;display:flex;justify-content: center;align-items: center">
      <Loading></Loading>
    </div>
    <div v-if="task != null">
      <div class="task-header">
        <div class="df task-header-left">
          <div class="details-scenario-config">
            <span class="task-header-flag">任务</span>
          </div>
          <div class="task-header-back">
            <span class="backEdit" @click="back" v-show="backButton"> <Icon type="ios-arrow-back"/>返回上一级</span>
          </div>
        </div>

        <div class="task-header-handle">
          <!-- <Dropdown trigger="click" placement="bottom-end">
            <Tooltip content="视频讨论" placement="top" transfer>
              <Icon type="ios-videocam-outline" size="26" style="margin-right:10px" />
            </Tooltip>

            <DropdownMenu slot="list">
              <DropdownItem>立即发起</DropdownItem>
              <DropdownItem>预约</DropdownItem>
              <DropdownItem>加入ID</DropdownItem>
            </DropdownMenu>
          </Dropdown> -->
          <!-- <Icon type="ios-more" size="31" style="margin-right:10px" /> -->
          <span class="down">
            <SingleTaskMenu :data="task" @close="closeThisModal"></SingleTaskMenu>
          </span>
          <Icon type="ios-close" size="31" @click.native="closeModal" />
        </div>
      </div>
      <div class="task-content">
        <div class="task-content-left">
          <Tooltip content="点击即可编辑" placement="top">
            <div class="task-title">
              <input class="task-title-input" v-model="task.taskName" @blur="updateTaskName()" type="text" />
            </div>
          </Tooltip>
          <div class="task-basic-attrs-view">
            <div class="multi-rows-on-mini object-field-list__uJ45">
              <div class="component-mount task-status">
                <div class="object-field__1cNl">
                  <div class="object-field__left">
                    <svg-icon name="task-status" class="task-img"></svg-icon>
                    <span class="object-field__name">状态</span>
                  </div>
                  <div class="object-field__right">
                    <Dropdown trigger="click" @on-click="updateTaskStatus(task.taskId, task.taskStatus)">
                      <div class="task-is-finish">
                        <svg-icon name="task-not-finish" class="task-not-finish" v-if="task.taskStatus == false"></svg-icon>
                        <svg-icon name="task-not-finish-hover" class="task-not-finish-hover" v-if="task.taskStatus == false"></svg-icon>
                        <svg-icon name="task-finish" class="task-finish" v-if="task.taskStatus == true"></svg-icon>
                        <svg-icon name="task-finish-hover" class="task-finish-hover" v-if="task.taskStatus == true"></svg-icon>
                        <span v-if="task.taskStatus == false">未完成</span>
                        <span v-else class="task-status-title">已完成</span>
                      </div>
                      <DropdownMenu slot="list">
                        <DropdownItem name="未完成">
                          <div class="task-status-title_01">
                            <span>未完成</span>
                            <Icon type="ios-checkmark" size="20" v-if="task.taskStatus == false" />
                          </div>
                        </DropdownItem>
                        <DropdownItem name="已完成">
                          <div class="task-status-title_01">
                            <span style="color:#038a24">已完成</span>
                            <Icon type="ios-checkmark" size="20" v-if="task.taskStatus == true" />
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <div class="component-mount task-executor">
                <div class="object-field__1cNl">
                  <div class="object-field__left">
                    <svg-icon name="task-executor" class="task-img"></svg-icon>
                    <span class="object-field__name">执行者</span>
                  </div>
                  <div class="object-field__right">
                    <div class="remove-shortcut__2G3s">
                      <span class="remove"></span>
                      <div class="content__3gKP circle">
                        <div class="executor__2pBD">
                          <div class="executor-handler not-assigned">
                            <SetExecutor @choose="chooseZxz" :id="task.projectId" :taskId="task.taskId" ref="executor" :task="task" v-model="task.executor"> </SetExecutor>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="component-mount task-date-range">
                <div class="object-field__1cNl">
                  <div class="object-field__left">
                    <Icon type="ios-calendar-outline" size="18"></Icon>
                    <span class="object-field__name">时间</span>
                  </div>
                  <div class="object-field__right">
                    <div class="task-date-wrapper">
                      <DateTimePicker type="start" @on-change="startDate" :options="options1" @clear="clearTime('开始')" :datetime="task.startTime" :max="task.endTime" @confirm="confirm1">
                        <div class="init" v-if="!task.startTime">
                          设置开始时间
                        </div>
                        <div class="setTime" v-if="task.startTime">
                          {{
                            $moment(task.startTime).calendar(null, {
                              sameDay: "[今天]LT",
                              nextDay: "[明天]LT",
                              lastDay: "[昨天]LT",
                              lastWeek: (now) => {
                                const startDate = $moment()
                                  .week($moment().week())
                                  .startOf("week")
                                  .valueOf();
                                return task.endTime <= startDate ? "[上]dddLT" : "dddLT";
                              },
                              nextWeek: (now) => {
                                const endDate = $moment()
                                  .week($moment().week())
                                  .endOf("week")
                                  .valueOf();
                                return task.endTime >= endDate ? "[下]dddLT" : "dddLT";
                              },
                              sameElse: "Y年M月D日LT",
                            })
                          }}
                          <span @click.stop="clearTime('开始')">&times;</span>
                        </div>
                      </DateTimePicker>
                      <span class="dividingLine">-</span>
                      <DateTimePicker @on-change="endDate" :options="options2" @clear="clearTime('截止')" type="end" :datetime="task.endTime" :min="task.startTime" @confirm="confirm2">
                        <div class="init" v-if="!task.endTime">
                          设置截止时间
                        </div>
                        <div class="setTime" v-if="task.endTime">
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
                                return task.endTime <= startDate ? "[上]dddLT" : "dddLT";
                              },
                              nextWeek: (now) => {
                                const endDate = $moment()
                                  .week($moment().week())
                                  .endOf("week")
                                  .valueOf();
                                return task.endTime >= endDate ? "[下]dddLT" : "dddLT";
                              },
                              sameElse: "Y年M月D日LT",
                            })
                          }}
                          <!-- {{data.endDate}} -->
                          <span @click.stop="clearTime('截止')">&times;</span>
                        </div>
                      </DateTimePicker>
                      <div class="icon-content">
                        <SetRepeat :repeat="task.repeat" v-on:updateRepeat="updateRepeat"></SetRepeat>
                        <!-- <Icon type="md-alarm" size="20" color="#8c8c8c" /> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="scenario-infos-view detail-infos-wrapper">
            <section class="detail-infos-note-view flex-horiz no-border-wrapper">
              <div class="note-aside detail-infos-aside">
                <Icon type="ios-document-outline" />
                <span class="note-title">备注</span>
              </div>
              <div class="note-section detail-infos-content flex-space">
                <div class="note-adder-set">
                  <div class="add-note-handler" @click="showEditor = true" v-if="!showEditor" v-html="task.remarks ? task.remarks : '待添加'"></div>
                  <div class="editor-wrap" v-if="showEditor">
                    <Simditor :contents="task.remarks" ref="editor" class="fl editBox"></Simditor>
                    <div style="margin-top: 5px">
                      <Button @click="showEditor = false" style="margin-right: 15px;cursor: pointer">取消</Button>
                      <Button style="cursor: pointer" type="info" @click="addBeizhu">保存</Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section class="detail-infos-priority-view no-border-wrapper">
              <div class="priority-container flex flex-vcenter">
                <div class="priority-aside detail-infos-aside">
                  <Icon type="ios-microphone-outline" />
                  <span class="priority-title">优先级</span>
                </div>
                <div class="priority-wrap detail-infos-content">
                  <UrgentDropdown v-on:priority="changePriority" v-bind:checked-name="task.priority"></UrgentDropdown>
                </div>
              </div>
            </section>
            <section class="detail-infos-worktime-view no-border-wrapper">
              <div class="task-worktime-container flex">
                <div class="worktime-aside detail-infos-aside">
                  <Icon type="ios-clock-outline" />
                  <span class="worktime-title">工时</span>
                </div>
                <div class="task-worktime-wrap detail-infos-content flex-fill">
                  <workHour :task="task"></workHour>
                </div>
              </div>
            </section>
            <section class="detail-infos-worktime-view no-border-wrapper">
              <div class="task-worktime-container flex">
                <div class="worktime-aside detail-infos-aside">
                  <Icon type="ios-pulse" />
                  <span class="worktime-title">进度</span>
                </div>
                <div class="task-worktime-wrap progress-infos-content flex-fill">
                  <Input-number class="scheduleTop" :max="100" :min="0" v-model="task.progress" @on-change="scheduleChange"></Input-number>
                  <div class="scheduleBottom" v-show="showSchedule">
                    <Button style="padding:6px 20px;" @click="scheduleCancel">取消</Button>
                    <Button type="primary" style="padding:6px 20px;" @click="scheduleSave">保存</Button>
                  </div>
                </div>
              </div>
            </section>
            <section class="detail-infos-priority-view no-border-wrapper">
              <div class="priority-container flex flex-vcenter">
                <div class="priority-aside detail-infos-aside">
                  <Icon type="ios-pricetags-outline" />
                  <span class="priority-title">标签</span>
                </div>
                <div class="priority-wrap detail-infos-content">
                  <Tags class="fl" :taglist="task.tagList" :publicId="task.taskId" :publicType="publicType" :projectId="task.projectId" v-if="task.tagList" ref="tags"></Tags>
                </div>
              </div>
            </section>
          </div>
          <div class="detail-infos-subtask-view detail-infos-wrapper">
            <div class="subtask-card">
              <div class="detail-subitem-common-header subtask-header">
                <Icon type="ios-options-outline" />
                <span class="flex">子任务</span>
              </div>
              <div class="subtask-card-main">
                <ul v-if="task.taskList" class="subtasks-list ui-sortable">
                  <li class="sontask_list" v-for="(i, index) in task.taskList" :key="index">
                    <!-- 点击之前 -->
                    <div class="clearfix subtask-wrap" v-show="isEdit">
                      <div class="addicon fl" @click.stop.prevent="updateTaskStatus(i.taskId, i.taskStatus, true, index)">
                        <!-- @on-change="updateTaskStatus(i.taskId, i.taskStatus, true)" -->
                        <Checkbox v-model="i.taskStatus"></Checkbox>
                      </div>
                      <div class="sonInput fl" @click.stop="showaa(i.taskId)">
                        <Tooltip content="点击即可编辑" placement="top">
                          <div class="sonCon" ref="sonCon" style>
                            {{ i.taskName }}
                          </div>
                        </Tooltip>
                      </div>
                      <DateTimePicker class="sonDate fl" type="start" :max="i.endTime" @confirm="confirmSonDate" @clear="clearSonDate">
                        <div>
                          <Icon class="icon" type="calendar" v-if="!i.sontaskDate" size="20"></Icon>
                          <span v-else class="timeBox">
                            {{
                              $moment(i.sontaskDate).calendar(null, {
                                sameDay: "[今天]LT",
                                nextDay: "[明天]LT",
                                lastDay: "[昨天]LT",
                                lastWeek: (now) => {
                                  const startDate = $moment()
                                    .week($moment().week())
                                    .startOf("week")
                                    .valueOf();
                                  return i.sontaskDate <= startDate ? "[上]dddLT" : "dddLT";
                                },
                                nextWeek: (now) => {
                                  const endDate = $moment()
                                    .week($moment().week())
                                    .endOf("week")
                                    .valueOf();
                                  return i.sontaskDate >= endDate ? "[下]dddLT" : "dddLT";
                                },
                                sameElse: "Y年M月D日LT",
                              })
                            }}
                          </span>
                        </div>
                      </DateTimePicker>
                      <SetExecutor @choose="ZrwChooseZxz" :id="task.projectId" :taskId="i.taskId" :task="i" ref="executor" v-model="i.executor"></SetExecutor>
                      <div class="enterDetail fl">
                        <Icon type="ios-arrow-right"></Icon>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="addChildTask" @click="showSontask = false" v-if="showSontask"><Icon type="md-add" />添加子任务</div>
                <!-- 添加子任务 -->
                <div class="sonBox clearfix" v-if="!showSontask">
                  <div class="newSon clearfix">
                    <div class="sonInput fl">
                      <Input v-model="son" placeholder="输入子任务内容..." autofocus @keyup.enter.native="submitSontask" />
                    </div>
                  </div>
                  <div class="btnss">
                    <Button
                      type="text"
                      @click="
                        showSontask = true;
                        son = '';
                      "
                      >取消</Button
                    >
                    <Button type="primary" @click="submitSontask" style="padding:6px 20px;">保存</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-infos-subtask-view detail-infos-wrapper">
            <div class="subtask-card">
              <div class="detail-subitem-common-header subtask-header">
                <Icon type="ios-link-outline" />
                <span class="flex">关联内容</span>
              </div>
            </div>
          </div>
          <div class="has-relevance">
            <div class="has-relevance-content">
              <ul v-if="task.bindTasks.length != 0">
                <div class="what-title">关联的任务</div>
                <li class="gl-task-list" v-for="(b, i) in task.bindTasks" :key="i">
                  <div class="gl-task-list-con" @click.stop="showaa(b.taskId)">
                    <Icon type="md-checkbox-outline" size="22" />
                    <img v-if="b.userImage" :src="b.userImage" alt="执行者" />
                    <Icon type="md-contact" v-else size="26" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.taskName }}</span>
                        <span>{{ b.projectName }}</span>
                      </div>
                      <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                    </div>
                  </div>
                  <Poptip @click.stop>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <!-- <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div> -->
                      <div class="glpop-list" @click.stop="cancle(b.taskId)">
                        <Icon type="md-link" size="20" />
                        <span>取消关联</span>
                      </div>
                    </div>
                  </Poptip>
                </li>
              </ul>
              <ul v-if="task.bindFiles.length != 0">
                <div class="what-title">关联的文件</div>
                <li class="gl-task-list" v-for="(b, i) in task.bindFiles" :key="i">
                  <div class="gl-task-list-con" @click="getFileDetail(b.fileId)">
                    <!--<Icon type="md-checkbox-outline" size="22" />-->
                    <Icon type="ios-document-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.fileName }}</span>
                        <span>{{ b.projectName }}</span>
                      </div>
                      <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <!-- <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div> -->
                      <div class="glpop-list" @click.stop="cancle(b.fileId)">
                        <Icon type="md-link" size="20" />
                        <span>取消关联</span>
                      </div>
                    </div>
                  </Poptip>
                </li>
              </ul>
              <ul v-if="task.bindSchedules.length != 0">
                <div class="what-title">关联的日程</div>
                <li class="gl-task-list" v-for="(b, i) in task.bindSchedules" :key="i">
                  <div class="gl-task-list-con" @click="editSchedule(b.scheduleId)">
                    <!--<Icon type="md-checkbox-outline" size="22" />-->
                    <Icon type="ios-calendar-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.scheduleName }}</span>
                        <span>{{ b.projectName }}</span>
                      </div>
                      <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <!-- <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div> -->
                      <div class="glpop-list" @click.stop="cancle(b.scheduleId)">
                        <Icon type="md-link" size="20" />
                        <span>取消关联</span>
                      </div>
                    </div>
                  </Poptip>
                </li>
              </ul>
              <ul v-if="task.bindShares.length != 0">
                <div class="what-title">关联的分享</div>
                <li class="gl-task-list" v-for="(b, i) in task.bindShares" :key="i">
                  <div class="gl-task-list-con" @click="goShareDetail(b.shareId)">
                    <Icon type="ios-open-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.shareName }}</span>
                        <span>{{ b.projectName }}</span>
                      </div>
                      <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <!-- <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div> -->
                      <div class="glpop-list" @click.stop="cancle(b.shareId)">
                        <Icon type="md-link" size="20" />
                        <span>取消关联</span>
                      </div>
                    </div>
                  </Poptip>
                </li>
              </ul>
              <div class="subtask-card-main">
                <div class="addLink" @click="relationModal = true"><Icon type="md-add" />添加关联</div>
                <Modal v-model="relationModal" footer-hide class="relationModal" id="relationModal" width="850">
                  <AddRelation :publicId="task.taskId" :fromType="publicType" @close="relationModal = false"></AddRelation>
                </Modal>
              </div>
            </div>
          </div>
          <div class="detail-infos-subtask-view detail-infos-wrapper">
            <div class="subtask-card">
              <div class="detail-subitem-common-header subtask-header">
                <Icon type="ios-folder-outline" />
                <span class="flex">添加附件</span>
              </div>
              <div class="subtask-card-main">
                <div class="addfile" v-if="task.fileList">
                  <div class="file-lsit" v-for="(f, i) in task.fileList" :key="i">
                    <div class="file-img">
                      <img v-if="images_suffix.indexOf(f.ext) > -1" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + f.fileUrl" alt />
                      <img v-else src="@/icons/img/moren.png" alt="文件" />
                      <div class="zhezhao">
                        <Icon type="md-cloud-download" @click="downLoad(f.fileId)" />
                        <Icon type="md-search" @click="getFileDetail(f.fileId)" />
                        <Icon type="ios-trash" @click="deleteFiles(f.fileId)" />
                      </div>
                    </div>
                    <Tooltip :content="f.fileName" max-width="250">
                      <p class="file-name">{{ f.fileName }}</p>
                    </Tooltip>
                    <p class="file-time">
                      {{ $moment(f.createTime).format("YYYY-MM-DD HH:mm") }}
                    </p>
                  </div>
                  <div style="width: 117px;height:117px;line-height: 117px;border: 1px solid #e5e5e5;display: flex;align-items: center;justify-content: center" @click="showCommon = true">
                    <Icon type="md-add" size="40" style="margin-right: 0px"></Icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="task-content-right">
          <div class="task-right-inner">
            <!-- 设置参与者 -->
            <div class="participator">
              <div class="subscribers">
                <div class="subscribers-header">
                  参与者 ·
                  {{ task.joinInfo != null ? task.joinInfo.length : 0 }}
                  <Tooltip content="参与者将会收到评论和任务更新通知" placement="right" transfer>
                    <Icon type="ios-help"></Icon>
                  </Tooltip>
                </div>
                <div class="involve-list clearfix">
                  <div class="member-avatar fl" v-for="(item, index) in task.joinInfo" :key="index">
                    <Tooltip :content="item.userName" placement="top" transfer>
                      <div class="ava">
                        <!-- 删除需要加在关闭按钮上 -->
                        <img v-if="item.image" :src="item.image" alt />
                        <svg-icon v-else style="width:24px;height:24px;display:block;" name="allMember"></svg-icon>
                        <span class="close" @click="deleteInvolve(item.userId)">×</span>
                      </div>
                    </Tooltip>
                  </div>
                  <div class="addButton fl">
                    <InvolveMember ref="involveMember" :checkedList="joinInfoIds" :projectId="task.projectId" @save="saveInvolveMember"></InvolveMember>
                  </div>
                </div>
              </div>

              <log :logs="task.logs" :publicId="task.taskId" :unReadMsg="task.unReadMsg"></log>
            </div>
          </div>
          <div class="footer">
            <publick @scroll="scrollToBottom" :publicId="task.taskId" :projectId="task.projectId" :publicType="publicType"></publick>
          </div>
        </div>
      </div>
      <Modal v-model="showCommon" title="上传普通文件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
        <common-file @close="showCommon = false" :projectId="task.projectId" :publicId="task.taskId"></common-file>
      </Modal>
      <Modal v-model="showFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
        <fileDetail v-if="showFileDetail" :file="file"></fileDetail>
      </Modal>
      <!-- 编辑日程模态框 -->
      <Modal v-model="showRCModal" class="myModal myRcModal">
        <rc-modal></rc-modal>
      </Modal>
    </div>
  </div>
</template>
<script>
import SetRepeat from "./SetRepeat";
import TaskWarn from "./TaskWarn";
import rcModal from "@/components/project/schedule/EditRicheng";
import AddRelation from "@/components/public/common/AddRelation";
import Tags from "@/components/public/Tags";
import workHour from "@/components/public/workHour";
import insertText from "@/utils/insertText";
import Emoji from "@/components/public/common/emoji/Emoji";
import SingleTaskMenu from "./SingleTaskMenu.vue";
import SetExecutor from "./SetExecutor";
import Simditor from "@/components/resource/Simditor";
import myModel from "./EditList";
import log from "@/components/public/log";
import publick from "@/components/public/Publish";
import fileDetail from "./fileDetail";
import { mapState, mapActions } from "vuex";
import commonFile from "./commonfile.vue";
import Loading from "@/components/public/common/Loading.vue";
import {
  updateTaskName,
  updatePriority,
  cancelcompleteTask,
  completeTask,
  updateRepeat,
  updateTaskJoin,
  fabulous,
  cancelFabulous,
  updateTaskRemarks,
  taskExecutor,
  cancle,
  progress,
} from "@/axios/api";
import { setSysClip } from "@/axios/api2.js";
import { downloadFile, getFileDetails,deleteFile } from "@/axios/fileApi";
export default {
  components: {
    fileDetail,
    SetRepeat,
    TaskWarn,
    Tags,
    workHour,
    Emoji,
    Simditor,
    SingleTaskMenu,
    SetExecutor,
    AddRelation,
    myModel,
    publick,
    log,
    commonFile: (resolve) => require(["./commonfile.vue"], resolve),
    Loading,
    rcModal
  },
  data() {
    return {
      selectValue: "未完成",
      showSchedule: false,
      options1: {},
      options2: {},
      glPop: false,
      zan: false,
      showRemind: false,
      showRCModal: false,
      childTaskData: null,
      complete: false,
      hoverExecutor: false,
      editorValue: "123",
      showFileDetail: false,
      fileId: "",
      showEditor: false,
      maxFileSize: 1024 * 1024 * 100,
      isShowFileList: true,
      type: "task",
      modal1: false,
      relationModal: false,
      talkvalue: "",
      son: "",
      showSontask: true,
      sonComplete: false,
      isEdit: true,
      newCon: "",
      ept: "",
      publicType: "任务",
      involveDataList: [],
      showCommon: false,
      beizhuContent: "",
      backButton: false, //是否显示返回按钮
      file: {},
      projectId: this.$route.params.id
    };
  },
  mounted() {
    this.editTask(this.taskId);
  },
  computed: {
    ...mapState("task", ["task", "joinInfoIds", "images_suffix", "taskId"]),
    vuexTask() {
      return this.$store.state.task.joinInfo;
    },
  },
  methods: {
    ...mapActions("task", ["editTask", "updateStartTime", "updateEndTime", "addChildrenTask"]),
    //进度
    scheduleChange(data) {
      this.showSchedule = true;
    },
    scheduleCancel() {
      this.editTask(this.taskId);
      this.showSchedule = false;
    },
    scheduleSave() {
      const data = {
        taskId: this.task.taskId,
        progress: this.task.progress,
      };
      progress(data).then((res) => {
        this.showSchedule = false;
        this.$Message.success("保存进度成功");
      });
    },
    // 设置开始时间小于结束时间
    closeThisModal() {
      this.$emit("close");
    },
    startDate(date) {
      this.startTime = date;
      this.options2 = {
        disabledDate(date1) {
          return date1.valueOf() < new Date(date).getTime();
        },
      };
    },
    endDate(date) {
      this.endTime = date;
      this.options1 = {
        disabledDate(date1) {
          return date1.valueOf() > new Date(date).getTime() - 86400000;
        },
      };
    },
    scrollToBottom() {
      // this.$refs.scrollbox.scrollTop = this.$refs.heightbox.clientHeight;
    },
    //返回
    back() {
      this.backButton = false;
      this.editTask(this.task.parentId);
      this.$Message.loading("正在加载中...", 0);
    },
    //修改任务名称
    updateTaskName() {
      updateTaskName(this.task.taskId, this.task.taskName).then((data) => {});
    },
    //文件下载
    downLoad(fileId) {
      var url = "";
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_URL;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_URL;
      } else {
        url = "/api";
      }
      window.location.href = url + "/files/" + fileId + "/download";
    },
    getFileDetail(fileId) {
      getFileDetails(fileId).then((res) => {
        if (res.result == 1) {
          this.showFileDetail = true;
          this.file = res.data;
        }
      });
    },
    deleteFiles(fileId){
        deleteFile(fileId).then(res => {
        if (res.result == 1) {
           this.$Message.success("删除成功");
          this.editTask(this.taskId);
        }
      });
    },
    //弹出日程详情框
    editSchedule(id) {
      this.$store.dispatch("schedule/getScheduleById", id);
      this.showRCModal = true;
    },
    // 添加备注
    addBeizhu() {
      if (this.$refs.editor.content == null || this.$refs.editor.content == "") {
        this.$Message.error("请输入内容");
        return;
      }
      this.beizhuContent = this.$refs.editor.content;
      updateTaskRemarks(this.task.taskId, this.beizhuContent).then((res) => {
        if (res.result === 1) {
          this.showEditor = false;
        }
      });
    },
    // 删除执行者
    deleteExecutor() {
      taskExecutor(this.task.taskId, "").then((res) => {});
    },
    // 子任务执行者
    ZrwChooseZxz(data, taskid) {
      taskExecutor(taskid, data).then((res) => {
        // console.log(res);
      });
    },
    // 选择执行者
    chooseZxz(data, taskid) {
      taskExecutor(taskid, data).then((res) => {
        // console.log(res);
      });
    },
    //取消关联
    cancle(id) {
      cancle(id, this.projectId, this.publicType, this.task.taskId).then((res) => {
        if (res.result === 1) {
          this.$Message.success("已取消");
        }
      });
    },
    //复制关联
    clone(id) {
      let url = "http://" + process.env.NODE_ENV == "development" ? "/tasks/" + id : process.env.VUE_APP_URL + "/tasks/" + id;
      setSysClip(url).then((res) => {
        if (res.result === 1) {
          this.$Message.success(res.msg);
        }
      });
    },
    showaa(taskId) {
      this.backButton = true;
      const msg = this.$Message.loading("正在加载中...", 0);
      setTimeout(msg, 10000);
      this.$store.dispatch("task/editTask", taskId).then(() => {
        clearTimeout(msg);
      });
    },
    changePriority(priority) {
      updatePriority(this.task.taskId, priority).then((item) => {});
    },
    //更改任务的重复性
    updateRepeat(repeat) {
      updateRepeat(this.task.taskId, repeat);
    },
    //更改任务的状态
    updateTaskStatus(taskId, taskStatus, isChild, index) {
      var label = 0;
      if (isChild) {
        label = 1;
      }
      if (!taskStatus) {
        completeTask(this.projectId, taskId, label).then((res) => {
          if (res.result !== 1) {
            this.$Message.error(res.msg);
          }
        });
      } else {
        cancelcompleteTask(this.projectId, taskId, label).then((res) => {
          if (res.result !== 1) {
            this.$Message.error(res.msg);
          }
        });
      }
    },
    // 添加子任务
    submitSontask() {
      if (this.son == "") {
        this.$Message.error("请输入子任务内容");
        return;
      }
      this.addChildrenTask({ taskId: this.task.taskId, taskName: this.son,projectId:this.projectId });
      this.showSontask = false;
      this.son = "";
      this.$Message.success("保存成功");
    },
    confirmSonDate(date) {
      this.task.sontaskDate = date;
    },
    clearSonDate() {
      this.task.sontaskDate = "";
    },
    confirm1(date) {
      this.updateStartTime({
        taskId: `${this.task.taskId}`,
        date: new Date(date).getTime(),
      });
      // this.task.startTime = date
      // this.$forceUpdate()
    },
    // 清空时间
    clearTime(type) {
      if (type === "截止") {
        this.updateEndTime({
          taskId: `${this.task.taskId}`,
          date: "0",
        });
      } else if (type === "开始") {
        this.updateStartTime({
          taskId: `${this.task.taskId}`,
          date: "0",
        });
      }
    },
    confirm2(date) {
      this.updateEndTime({
        taskId: `${this.task.taskId}`,
        date: new Date(date).getTime(),
      });
    },
    deleteStart() {
      this.task.startDate = "";
    },
    deleteEnd() {
      this.task.endDate = "";
    },
    dianZan() {
      if (!this.task.isFabulous) {
        //发请求点赞
        fabulous(this.task.taskId).then((res) => {
          if (res.result === 1) {
            this.task.isFabulous = true;
            this.task.fabulousCount++;
          }
        });
      } else {
        //发请求取消点赞
        cancelFabulous(this.task.taskId).then((res) => {
          if (res.result === 1) {
            this.task.isFabulous = false;
            this.task.fabulousCount--;
          }
        });
      }
    },
    deleteInvolve(id) {
      // if (id == 3) return; //需获取当前登录用户id判断
      let index = this.joinInfoIds.indexOf(id);
      this.joinInfoIds.splice(index, 1);
      updateTaskJoin(this.task.taskId, this.joinInfoIds.join(",")).then((res) => {});
    },
    // editorSave(val) {
    //   this.editorValue = val;
    //   this.showEditor = false;
    // },
    showwaitAdd() {
      this.showEditor = true;
    },
    chooseEmoji(name) {
      insertText(this.$refs.textarea.$el.children[1], name);
    },
    editson() {
      this.isEdit = false;
    },
    saveSon() {
      this.isEdit = true;
      //然后发请求
    },
    confirmWarnList(warn, user) {
      this.$nextTick((_) => {
        this.modal1 = false;
      });
    },
    // 添加参与者
    saveInvolveMember(detailList) {
      updateTaskJoin(this.task.taskId, detailList).then((res) => {
        if (res.result === 1) {
          // this.task.joinInfo.unshift(res.data)
        }
      });
    },
    random_string(len) {
      len = len || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    get_suffix(filename) {
      var pos = filename.lastIndexOf(".");
      var suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    // 去分享详情
    goShareDetail(shareId) {
      // alert(shareId);
      this.$router.push(`/project/${this.$route.params.id}/share_detail/${shareId}`);
    },
    closeModal() {
      this.$emit("close");
    },
    //修改任务状态
    taskStatusChange() {},
  },
};
</script>
<style lang="less" scoped>
@import "./taskdetail";
.task-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e8eaec;
  height: 60px;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  .details-scenario-config {
    background: #f2fbff;
    border-radius: 4px;
    padding: 4px 8px 4px 4px;
    cursor: not-allowed;
    width: 64px;
    height: 28px;
    text-align: center;
    
    .task-header-flag {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #1b9aee;
      font-weight: 500;
    }
  }
  .task-header-back {
      display: flex;
      align-items: center;
      margin-left: 10px;
      &:hover {
        color: #1b9aee;
      }
      .backEdit {
        cursor: pointer;
      }
    }
  .task-header-handle {
    i {
      color: "#999";
      &:hover {
        background-color: #ecf6fe;
        color: #1b9aee;
        border-radius: 4px;
      }
    }
  }
}
.task-content {
  display: flex;
  .task-content-left {
    height: calc(100vh - 130px);
    flex: 6;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 20px;
    padding-top: 20px;
    .task-title {
      width: 655px;
      .task-title-input {
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 8px;
        color: #262626;
        position: relative;
        word-break: break-word;
        font-size: 20px;
        border: 0 none;
        outline-style: none;
        &:not(.readonly):not(.disabled):focus {
          background-color: #f7f7f7;
          width: 655px;
        }
        &:not(.readonly):not(.disabled):hover {
          background-color: #f7f7f7;
          width: 655px;
        }
      }
    }
  }
}
</style>
