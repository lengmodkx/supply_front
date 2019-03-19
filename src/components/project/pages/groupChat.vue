<template>
  <div class="group-chat">
    <div class="group-chat-main">
      <div class="group-chat-view">
        <div class="title">阿拉丁bug管理系统
          <Icon type="more" class="fr"></Icon>
        </div>
        <div class="chat-text">
          <div v-for="i in [1,2,3,4,5,6]" :key="i">
            <div class="other">
              <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" alt="">
              <div class="content">1111111111111111111111111</div>
            </div>
            <p class="time">王世汉，2017年9月5日</p>
          </div>
          <div v-for="i in [1,2,3,4,5,6]" :key="i">
            <div class="me">
              <div class="content">1111111111111111111111111</div>
            </div>
            <p class="time me-time">王世汉，2017年9月5日</p>
          </div>
        </div>
        <publish></publish>
      </div>
    </div>
  </div>
</template>

<script>
import publish from '../../public/Publish.vue'
export default {
  name: 'App',
  components: { publish },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="less">
.group-chat {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  background-color: rgb(244, 244, 244);
  padding-top: 20px;
  .time {
    font-size: 11px;
    padding: 0 15px 0 62px;
    margin-top: 5px;
    &.me-time {
      text-align: right;
    }
  }
  .other,
  .me {
    width: 100%;
    display: flex;
    padding: 0 15px;
    margin-top: 25px;
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .content {
      display: inline-block;
      padding: 8px 13px;
      color: #383838;
      font-size: 15px;
      word-break: break-word;
      background-color: #eee;
      border-radius: 10px;
    }
  }
  .me {
    display: inline-block !important;
    .content {
      float: right;
      text-align: right;
      background-color: #e5f6fb;
    }
  }
  .title {
    line-height: 64px;
    padding: 0 16px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 18px;
    .fr {
      font-size: 25px;
      margin-top: 19.5px;
      cursor: pointer;
    }
  }
  .group-chat-main {
    position: relative;
    height: 100%;
    background-color: #fff;
    margin: 0 auto;
    width: 1100px;
    border-radius: 3px 3px 0 0;
    -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  }
  .group-chat-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    .chat-text {
      overflow-x: hidden;
      overflow-y: scroll;
      padding-bottom: 25px;
    }
  }
  .group-chat-view,
  .group-chat-view .chat-text {
    position: relative;
    height: 100%;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  }
}
</style>
