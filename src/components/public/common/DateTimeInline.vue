<template>
  <DatePicker type="date"
              :open="visible"
              :value="date"
              confirm
              class="datatimeinline"
              @on-open-change="pickerOpenchange"
              @on-change="dateChange"
              style="width:216px">
    <Row class="picker-input">
      <iCol span="14">
        <input v-model="date" />
      </iCol>
      <iCol span="10">
        <TimePicker format="HH:mm"
                    :value="time"
                    class="mytimepicker"
                    @on-change="timeChange"
                    ref='timePicker'>
        </TimePicker>
      </iCol>
    </Row>
    <Row class="footer">
      <iCol span="11">
        <Button type="ghost"
                long
                @click="clear">清除</Button>
      </iCol>
      <iCol span="2"></iCol>
      <iCol span="11">
        <Button type="primary"
                long
                @click="confirm"
                :disabled="disabled">确定</Button>
      </iCol>
    </Row>
  </DatePicker>
</template>

<script>
export default {
  name: 'mydatepicker',
  props: {
    datetime: {
      type: String
    },
    type: {
      type: String,
      default: 'end'
    },
    max: {},
    min: {},
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      date: null,
      time: null,
      realDateTime: ''
    }
  },
  computed: {
    disabled () {
      if (this.type == 'start') {
        return this.max ? this.realDateTime > this.max : false
      } else {
        return this.min ? this.realDateTime < this.min : false
      }
    }
  },
  watch: {
    date () {
      this.pickerDate = this.date
    }
  },
  methods: {
    pickerOpenchange (a) {
      if (!this.visible) return
      if (!a) {
        this.$emit("close")
      }
    },
    dateChange (date) {
      this.date = date
      this.realDateTime = this.date + ' ' + this.time
    },
    timeChange (time) {
      this.time = time
      this.realDateTime = this.date + ' ' + this.time
      this.$refs.timePicker.visible = false
    },
    init () {
      if (this.datetime) {
        var date = this.datetime.split(' ')
        this.date = date[0]
        this.time = date[1]

      } else {
        this.date = this.$moment(new Date()).format('YYYY-MM-DD')
        this.time = this.type == 'end' ? '18:00' : '09:00'
      }
      this.realDateTime = this.date + ' ' + this.time
    },
    clear () {
      this.date = this.$moment(new Date()).format('YYYY-MM-DD')
      this.time = this.type == 'end' ? '18:00' : '09:00'
      this.realDateTime = this.date + ' ' + this.time
      this.$emit('clear')
    },
    confirm () {
      this.$emit('confirm', this.realDateTime)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
.datatimeinline {
  display: block;
  height: 324px;
  font-size: 14px;
  .footer {
    position: absolute;
    width: 100%;
    top: 285px;
    left: 0;
    display: flex;
  }
  .ivu-select-dropdown {
    box-shadow: 0 0 0 0;
    width: auto !important;
    height: auto !important;
  }
  .picker-input {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    height: 30px;
    padding: 5px 0;
    margin-top: 6px;
    > div.ivu-col {
      height: 18px;
      &:first-child {
        border-right: 1px solid #e5e5e5;
      }
    }
    input {
      padding: 0 12px;
      border: none;
      outline: none !important;
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .mytimepicker {
    height: 18px;
    line-height: 18px;
    display: block;
    .ivu-picker-panel-body {
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    }
  }
  .ivu-date-picker-rel {
    z-index: 999;
  }
  .ivu-picker-confirm {
    display: none !important;
  }
  .ivu-input-wrapper {
    .ivu-icon {
      display: none;
    }
    .ivu-input {
      height: 18px;
      line-height: 18px;
      border: none;
      box-shadow: none;
      padding: 4px 7px;
      font-size: 14px;
      color: initial;
      > div {
        height: 18px;
        line-height: 18px;
      }
    }
  }
  .ivu-time-picker-cells {
    min-width: 80px;
    .ivu-time-picker-cells-list {
      width: 44px;
      &::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #cecece;
      }
      ul li {
        padding-left: 14px;
      }
    }
  }
}
</style>
