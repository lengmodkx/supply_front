<template>
  <Poptip v-model="visible" popper-class="datepickerBox" transfer>
    <slot>选择时间</slot>
    <div slot="content">
      <DateTimeInline :datetime="datetime" :visible="visible"
      :type="type" :max="max" :min="min" @close="close" @confirm="confirm" @clear="clear"></DateTimeInline>
    </div>
  </Poptip>
</template>

<script>
export default {
  props: {
    datetime: {
      type: Number,
    },
    type: {
      type: String,
      default: "end",
    },
    max: {},
    min: {}
  },
  data() {
    return {
      visible: false,
    };
  },
  watch:{
      visible(v){
        console.log(v)
      }
  },
  methods: {
    close() {
      this.$nextTick((_) => {
        this.visible = false;
      });
    },
    confirm(date) {
      this.$emit("confirm", date);
      this.close();
    },
    clear() {
      this.$emit("clear");
      this.close();
    },
  },
};
</script>

<style lang="less"></style>
