<template>
  <div class="tab3Con">
    <div class="radioGroup">
              <RadioGroup v-model="priority" vertical>
                <Radio label="1">
                    <span>项目自定义排序</span>
                </Radio>
                <Radio label="2">
                    <span>按照优先级最高</span>
                </Radio>
                <Radio label="3">
                    <span>按开始时间最早</span>
                </Radio>
                <Radio label="4">
                    <span>按开始时间最晚</span>
                </Radio>
                <Radio label="5">
                    <span>按截止时间最近</span>
                </Radio>
                <Radio label="6">
                    <span>按创建时间最早</span>
                </Radio>
                <Radio label="7">
                    <span>按创建时间最晚</span>
                </Radio>
              </RadioGroup>
          </div>
          <div class="saveSetting" @click="savesort">
              <svg-icon name="save" class="save-icon"></svg-icon>
              <span>保存为项目默认排序</span>
          </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
  export default{
    data () {
      return{
         priority: "1"
      }
    },
    methods:{
      ...mapActions('task', ['updateSort']),
      savesort () {
        //把优先级的状态存在vuex，然后在父组件里面watch,一变化就发请求
        this.updateSort(this.priority)
      }
    }
  }
</script>
<style scoped lang="less">
.tab3Con{
  .saveSetting {
          color: #389eff;
          line-height: 26px;
          font-size: 15px;
          padding: 10px 16px;
          cursor: pointer;
        }
        .radioGroup {
          padding: 0 16px 10px 16px;
          border-bottom: 1px solid #eee;
          .ivu-radio-wrapper {
            font-size: 15px;
          }
          .ivu-radio-group-vertical .ivu-radio-wrapper {
            height: 36px;
            &:hover {
              color: #389eff;
            }
          }
        }
        .save-icon {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          fill: #3da8f5;
        }
}

</style>

