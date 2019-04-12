<template>
    <!-- 日程 -->
    <div >
        <div class="inner richeng">
            <div class="rc-head">
                <span class="now">未来的日程</span>
                <span>过去的日程</span>
            </div>
            <div class="rc-con">
                <div v-if="1" class="weilai-rc">
                    <ul>
                        <div class="waht-day">
                            <span>5月1号</span><span> · 1</span>
                        </div>
                        <li class="weilai-rc-list">
                            <div class="rc-time">12:00--18:00</div>
                            <div class="rc-xm">
                                <p>日程名称</p>
                                <span>项目名称</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-else class="guoqu-rc">
                    <Collapse v-model="guoquRC">
                        <Panel name="1">
                            2018年4月
                            <ul slot="content">
                                <li class="weilai-rc-list">
                                    <div class="rc-time">12:00--18:00</div>
                                    <div class="rc-xm">
                                        <p>日程名称</p>
                                        <span>项目名称</span>
                                    </div>
                                </li>
                                <li class="weilai-rc-list">
                                    <div class="rc-time">12:00--18:00</div>
                                    <div class="rc-xm">
                                        <p>日程名称</p>
                                        <span>项目名称</span>
                                    </div>
                                </li>
                            </ul>
                        </Panel>
                        <Panel name="2">
                            2018年10月
                            <ul slot="content">522</ul>
                        </Panel>
                        <Panel name="3">
                            2018年11月
                            <ul slot="content">33</ul>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        </div>
        <!-- 编辑日程模态框 -->
        <Modal v-model="showRCModal"
               class="myModal myRcModal">
            <rc-modal :data="richengModalData"></rc-modal>
        </Modal>
    </div>
</template>

<script>
import rcModal from "@/components/public/common/EditRicheng"
export default {
  data () {
    return{
        guoquRC:'',
        showRCModal: false,
        richengModalData:''
    }
  },
  components: {
      rcModal
  }
}
</script>

<style scoped lang="less">
@import "../Mine";
</style>