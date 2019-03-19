<template>
  <div class="loading-spinner">
    <div class="loading-bounce1"
         :style="style"></div>
    <div class="loading-bounce2"
         :style="style"></div>
    <div class="loading-bounce3"
         :style="style"></div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: [String, Number],
      default: 20
    },
    color: {
      type: String,
      default: '#a6a6a6'
    }
  },
  computed: {
    style () {
      return `width:${this.size}px;height:${this.size}px;background-color:${this.color};`
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  text-align: center;
  font-size: 0;
}

.loading-spinner > div {
  width: 20px;
  height: 20px;
  background-color: #a6a6a6;
  border-radius: 100%;
  display: inline-block;
  animation: bouncedelay 1.4s infinite ease-in-out;
  animation-fill-mode: both;
}

.loading-spinner .loading-bounce1 {
  animation-delay: -0.32s;
}

.loading-spinner .loading-bounce2 {
  animation-delay: -0.16s;
}

@keyframes bouncedelay {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
