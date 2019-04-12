<template>
    <!-- 任务 -->
    <div>
        <div class="inner task">
            <div class="task-head">
                <div class="task-head-left">
                    <span class="now">我执行的</span>
                    <span>我创建的</span>
                    <span>我参与的</span>
                </div>
                <div class="task-head-right">
                    <Select v-model="taskComplete" placeholder="已完成">
                        <Option value="已完成" selected>已完成</Option>
                        <Option value="未完成">未完成</Option>
                    </Select>
                    <Select v-model="taskComplete" placeholder="按优先级排序">
                        <Option value="按优先级排序" selected>按优先级排序</Option>
                        <Option value="按截止时间排序">按截止时间排序</Option>
                        <Option value="按创建时间排序">按创建时间排序</Option>
                        <Option value="按项目名称排序">按项目名称排序</Option>
                    </Select>
                </div>
            </div>
            <ul class="task-con">
                <li class="task-list">
                    <div class="line"></div>
                    <div class="check-box"></div>
                    <img src="" alt="">
                    <div class="rw-xm">
                        <div v-if="1" class="rw">
                            <span>任务名称</span>
                            <span class="xm">项目名称</span>
                        </div>
                        <div v-else class="zrw">
                            <span>21312</span>
                            <p>属于任务：啊啊啊</p>
                        </div>
                    </div>
                    <div class="task-time">
                        <Time :time="new Date().getTime()-1000*60" />
                        <span>—</span>
                        <Time :time="new Date().getTime()-1000*60" />
                    </div>
                </li>
            </ul>
        </div>
        <!-- 编辑任务模态框 -->
        <Modal v-model="showModal" class="myModal">
            <my-modal ref="myModal" :data="activeModalData"></my-modal>
        </Modal>
    </div>
</template>

<script>
 import myModal from "@/components/project/pages/index/components/EditList"
export default {
  name: "nearThing",
  data () {
    return {
        taskComplete:'',
        showModal: false,
        activeModalData:''
    }
  },
  components:{
      myModal
  },

}
</script>

<style scoped lang="less">
@import "../Mine";
</style>