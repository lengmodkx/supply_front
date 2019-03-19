<template>
  <svg class="svg-icon" :class="`svg-${this.name}`" @click="$emit('click',$event)"
       aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'icon-svg',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#svg-${this.name}`
    }
  }
}
</script>

<style>
.svg-icon {
  width: 2em;
  height: 2em;
  /* vertical-align: -0.15em; */
  fill: currentColor;
  overflow: hidden;
}
</style>
