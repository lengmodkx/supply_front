<template>
  <Poptip v-model="visible"
          popper-class="datepickerBox"
          transfer>
    <slot>{{showDateTime||placeholder}}</slot>
    <div slot="content"
         class="asdfg">
      <!-- <DatePicker type="date"></DatePicker> -->
      <DatePicker type="date"
                  :open="visible"
                  :value="date"
                  confirm
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
                        @on-change="timeChange"
                        ref='timePicker'>
            </TimePicker>
          </iCol>
        </Row>
        <Row class="footer">
          <iCol span="11">
            <Button type="ghost"
                    long
                    @click="reset">清除</Button>
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
    </div>
  </Poptip>
</template>

<script>
export default {
  name: 'mydatepicker',
  props: {
    datetime: {
      type: String
    },
    placeholder: {
      type: String,
      default: '选择时间'
    },
    type: {
      type: String,
      default: 'end'
    },
    max: {},
    min: {}
  },
  data () {
    return {
      visible: false,
      date: null,
      time: null,
      realDateTime: '',
      showDateTime: ''

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
        this.close()
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
    reset () {

      this.date = this.$moment(new Date()).format('YYYY-MM-DD')
      this.time = this.type == 'end' ? '18:00' : '09:00'
      this.realDateTime = this.date + ' ' + this.time

      this.$emit('clear')
    },
    confirm () {
      this.showDateTime = this.realDateTime
      this.$emit('confirm', this.realDateTime)
      this.close()
    },
    close () {
      this.$nextTick(_ => {
        this.visible = false
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
.datepickerBox {
  cursor: pointer;
  .ivu-poptip-inner {
    height: 350px;
    .ivu-poptip-body {
      height: 100%;
      .ivu-poptip-body-content {
        height: 100%;
      }
    }
    .footer {
      position: absolute;
      width: 100%;
      top: 295px;
      left: 0;
      display: flex;
    }
  }
  .ivu-select-dropdown {
    box-shadow: 0 0 0 0;
    width: auto !important;
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
  .ivu-date-picker {
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
        border: none;
        box-shadow: none;
        padding: 4px 7px;
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
}
</style>
