<template>
  <Poptip v-model="visible"
          popper-class="datepickerBox"
          transfer>
    <slot>选择时间</slot>
    <div slot="content">
      <DateTimeInline :visible="visible"
                      :datetime="datetime"
                      :type="type"
                      :max="max"
                      :min="min"
                      @close="close"
                      @confirm="confirm"
                      @clear="clear"></DateTimeInline>
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
    type: {
      type: String,
      default: 'end'
    },
    max: {},
    min: {}
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    close () {
      this.$nextTick(_ => {
        this.visible = false
      })
    },
    confirm (date) {
      this.$emit('confirm', date)
      this.close()
    },
    clear () {
      this.$emit('clear')
      this.close()
    },
  }
}
</script>

<style lang="less">
</style>
